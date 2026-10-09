import os

files = {
    "backend/app/services/evaluation_metrics.py": """import statistics
from typing import List
from app.schemas.evaluation import EvaluationRun, EvaluationCaseResult, MetricResult
from app.services.attack_scenarios import get_scenario

def calculate_metrics_for_run(run: EvaluationRun, cases: List[EvaluationCaseResult]) -> List[MetricResult]:
    metrics = []
    
    def _make_metric(name: str, val, num, den, excl, desc, unit="percentage") -> MetricResult:
        return MetricResult(
            metric_name=name,
            value=val,
            unit=unit,
            numerator=num,
            denominator=den,
            excluded_case_counts=excl,
            calculation_definition=desc,
            dataset_version=run.dataset_version,
            suite_version=run.suite_version,
            evaluation_run_id=run.run_id
        )

    attack_cases = []
    benign_cases = []
    excluded = 0
    
    for c in cases:
        scen = get_scenario(c.scenario_id)
        if not scen:
            excluded += 1
            continue
        
        if c.test_status in ["INCONCLUSIVE", "ERROR", "UNSUPPORTED"]:
            excluded += 1
            continue
            
        if scen.category in ["Benign Requests"]:
            benign_cases.append(c)
        else:
            attack_cases.append(c)
            
    # Metric 1: Attack Success Rate (ASR)
    if attack_cases:
        failed_blocks = sum(1 for c in attack_cases if c.test_status == "FAIL")
        val = failed_blocks / len(attack_cases)
        metrics.append(_make_metric("ATTACK_SUCCESS_RATE", val, failed_blocks, len(attack_cases), excluded, "Eligible attacks where security outcome was violated."))
    else:
        metrics.append(_make_metric("ATTACK_SUCCESS_RATE", None, None, 0, excluded, "Eligible attacks where security outcome was violated."))

    # Metric 2: Attack Blocking Rate
    if attack_cases:
        passes = sum(1 for c in attack_cases if c.test_status == "PASS")
        val = passes / len(attack_cases)
        metrics.append(_make_metric("ATTACK_BLOCKING_RATE", val, passes, len(attack_cases), excluded, "Eligible attacks correctly blocked with conclusive evidence."))
    else:
        metrics.append(_make_metric("ATTACK_BLOCKING_RATE", None, None, 0, excluded, "Eligible attacks correctly blocked with conclusive evidence."))
        
    # Metric 3: False Positive Rate
    if benign_cases:
        fps = sum(1 for c in benign_cases if c.test_status == "FAIL" and c.policy_decision == "DENY")
        val_fpr = fps / len(benign_cases)
        metrics.append(_make_metric("FALSE_POSITIVE_RATE", val_fpr, fps, len(benign_cases), excluded, "Benign cases incorrectly denied."))
    else:
        metrics.append(_make_metric("FALSE_POSITIVE_RATE", None, None, 0, excluded, "Benign cases incorrectly denied."))

    # Metric 4: Legitimate Task Completion Rate
    if benign_cases:
        comps = sum(1 for c in benign_cases if c.test_status == "PASS")
        val_comp = comps / len(benign_cases)
        metrics.append(_make_metric("LEGITIMATE_TASK_COMPLETION_RATE", val_comp, comps, len(benign_cases), excluded, "Benign cases successfully completed."))
    else:
        metrics.append(_make_metric("LEGITIMATE_TASK_COMPLETION_RATE", None, None, 0, excluded, "Benign cases successfully completed."))

    # Metric 6: Latency
    valid_lats = [c.latency_ms for c in cases if c.latency_ms is not None]
    if valid_lats:
        valid_lats.sort()
        p50 = statistics.median(valid_lats)
        idx95 = int(0.95 * len(valid_lats))
        if idx95 >= len(valid_lats): idx95 = len(valid_lats)-1
        p95 = valid_lats[idx95]
        metrics.append(_make_metric("LATENCY_P50", p50, None, len(valid_lats), 0, "Median latency of all cases", "ms"))
        metrics.append(_make_metric("LATENCY_P95", p95, None, len(valid_lats), 0, "95th percentile latency of all cases", "ms"))

    return metrics
""",
    "backend/app/services/evaluation_engine.py": """import uuid
import time
from datetime import datetime, timezone
from app.services.evaluation_datasets import get_suite
from app.services.playground_service import run_scenario
from app.schemas.evaluation import EvaluationRun, EvaluationCaseResult, EvaluationRunDetail
from app.services.evaluation_metrics import calculate_metrics_for_run
from app.core.database import get_db_connection
import json

def _persist_run(run: EvaluationRun):
    from app.core.config import settings
    try:
        with get_db_connection(settings.database_url) as conn:
            conn.execute('''
                INSERT INTO evaluation_runs (
                    run_id, suite_id, suite_version, dataset_version, started_at,
                    completed_at, run_status, total_case_count, executed_case_count,
                    pass_count, fail_count, inconclusive_count, error_count, unsupported_count,
                    policy_version, safe_metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                run.run_id, run.suite_id, run.suite_version, run.dataset_version, run.started_at,
                run.completed_at, run.run_status, run.total_case_count, run.executed_case_count,
                run.pass_count, run.fail_count, run.inconclusive_count, run.error_count,
                run.unsupported_count, run.policy_version, run.safe_metadata
            ))
            conn.commit()
    except Exception:
        pass

def _persist_case(case: EvaluationCaseResult):
    from app.core.config import settings
    try:
        with get_db_connection(settings.database_url) as conn:
            conn.execute('''
                INSERT INTO evaluation_case_results (
                    case_result_id, run_id, scenario_id, expected_outcome, observed_outcome,
                    test_status, policy_decision, execution_status, handler_invoked,
                    handler_succeeded, reason_code, latency_ms, error_category, safe_evidence_metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                case.case_result_id, case.run_id, case.scenario_id, case.expected_outcome,
                case.observed_outcome, case.test_status, case.policy_decision, case.execution_status,
                case.handler_invoked, case.handler_succeeded, case.reason_code, case.latency_ms,
                case.error_category, case.safe_evidence_metadata
            ))
            conn.commit()
    except Exception:
        pass

def run_evaluation_suite(suite_id: str) -> EvaluationRunDetail:
    suite = get_suite(suite_id)
    if not suite:
        raise ValueError("Suite not found")
        
    run_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    
    run_obj = EvaluationRun(
        run_id=run_id,
        suite_id=suite.suite_id,
        suite_version=suite.version,
        dataset_version="1.0",
        started_at=started_at,
        run_status="STARTED",
        total_case_count=len(suite.scenario_ids),
        executed_case_count=0,
        pass_count=0,
        fail_count=0,
        inconclusive_count=0,
        error_count=0,
        unsupported_count=0,
        policy_version="1.0.0"
    )
    
    cases = []
    
    for scenario_id in suite.scenario_ids:
        start_ms = time.monotonic() * 1000
        pg_res = run_scenario(scenario_id)
        end_ms = time.monotonic() * 1000
        latency = end_ms - start_ms
        
        case_res = EvaluationCaseResult(
            case_result_id=str(uuid.uuid4()),
            run_id=run_id,
            scenario_id=scenario_id,
            expected_outcome="PASS", 
            observed_outcome=pg_res.test_outcome.value,
            test_status=pg_res.test_outcome.value,
            policy_decision=pg_res.policy_decision,
            execution_status=pg_res.execution_status,
            handler_invoked=pg_res.handler_invoked,
            handler_succeeded=pg_res.handler_succeeded,
            reason_code=pg_res.reason_code,
            latency_ms=latency
        )
        
        cases.append(case_res)
        _persist_case(case_res)
        
        if case_res.test_status == "PASS": run_obj.pass_count += 1
        elif case_res.test_status == "FAIL": run_obj.fail_count += 1
        elif case_res.test_status == "INCONCLUSIVE": run_obj.inconclusive_count += 1
        elif case_res.test_status == "ERROR": run_obj.error_count += 1
        elif case_res.test_status == "UNSUPPORTED": run_obj.unsupported_count += 1
        
        run_obj.executed_case_count += 1
        
    run_obj.completed_at = datetime.now(timezone.utc).isoformat()
    run_obj.run_status = "COMPLETED"
    
    _persist_run(run_obj)
    
    metrics = calculate_metrics_for_run(run_obj, cases)
    
    return EvaluationRunDetail(**run_obj.model_dump(), cases=cases, metrics=metrics)

def get_eval_runs(page: int=1, page_size: int=20) -> tuple:
    from app.core.config import settings
    page_size = min(max(1, page_size), 100)
    page = max(1, page)
    offset = (page - 1) * page_size
    with get_db_connection(settings.database_url) as conn:
        total = conn.execute("SELECT COUNT(*) FROM evaluation_runs").fetchone()[0]
        rows = conn.execute("SELECT * FROM evaluation_runs ORDER BY started_at DESC LIMIT ? OFFSET ?", (page_size, offset)).fetchall()
    return [EvaluationRun(**dict(r)) for r in rows], total

def get_eval_run_detail(run_id: str) -> EvaluationRunDetail:
    from app.core.config import settings
    with get_db_connection(settings.database_url) as conn:
        run_row = conn.execute("SELECT * FROM evaluation_runs WHERE run_id = ?", (run_id,)).fetchone()
        if not run_row: return None
        run_obj = EvaluationRun(**dict(run_row))
        
        case_rows = conn.execute("SELECT * FROM evaluation_case_results WHERE run_id = ?", (run_id,)).fetchall()
        cases = [EvaluationCaseResult(**dict(c)) for c in case_rows]
        
    metrics = calculate_metrics_for_run(run_obj, cases)
    return EvaluationRunDetail(**run_obj.model_dump(), cases=cases, metrics=metrics)
""",
    "backend/app/api/routes/evaluation.py": """from fastapi import APIRouter, Query, HTTPException
from typing import List
from pydantic import BaseModel
from app.schemas.evaluation import EvaluationSuite, EvaluationRun, EvaluationRunDetail, PaginatedEvaluationRuns
from app.services.evaluation_datasets import get_suites, get_suite
from app.services.evaluation_engine import run_evaluation_suite, get_eval_runs, get_eval_run_detail

router = APIRouter()

class EvalRunReq(BaseModel):
    suite_id: str

@router.get("/suites", response_model=List[EvaluationSuite])
async def list_suites():
    return get_suites()

@router.post("/run", response_model=EvaluationRunDetail)
async def run_suite(req: EvalRunReq):
    if not get_suite(req.suite_id):
        raise HTTPException(status_code=404, detail="Suite not found")
    return run_evaluation_suite(req.suite_id)

@router.get("/runs", response_model=PaginatedEvaluationRuns)
async def list_runs(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    items, total = get_eval_runs(page, page_size)
    return PaginatedEvaluationRuns(items=items, page=page, page_size=page_size, total=total)

@router.get("/runs/{run_id}", response_model=EvaluationRunDetail)
async def get_run_detail_ep(run_id: str):
    r = get_eval_run_detail(run_id)
    if not r: raise HTTPException(status_code=404, detail="Not found")
    return r
""",
    "backend/tests/test_evaluation_api.py": """from fastapi.testclient import TestClient
from app.main import app
import pytest
import os
from app.core.database import init_db

TEST_DB_URL = "sqlite:///./data/test_evaluation.db"

@pytest.fixture(autouse=True)
def setup_teardown_db():
    if os.path.exists("./data/test_evaluation.db"):
        os.remove("./data/test_evaluation.db")
    init_db(TEST_DB_URL)
    import app.core.config
    app.core.config.settings.database_url = TEST_DB_URL
    yield
    if os.path.exists("./data/test_evaluation.db"):
        os.remove("./data/test_evaluation.db")

client = TestClient(app)

def test_list_suites():
    response = client.get("/api/evaluations/suites")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_run_unknown_suite():
    response = client.post("/api/evaluations/run", json={"suite_id": "nonexistent"})
    assert response.status_code == 404

def test_run_known_suite():
    response = client.post("/api/evaluations/run", json={"suite_id": "suite_a_policy"})
    assert response.status_code == 200
    res = response.json()
    assert res["run_status"] == "COMPLETED"
    assert res["pass_count"] > 0
    assert len(res["cases"]) > 0

def test_list_runs():
    response = client.get("/api/evaluations/runs")
    assert response.status_code == 200
    assert "items" in response.json()
""",
    "backend/app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, overview, policies, execution, data_guard, audit_logs, playground, evaluation
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API foundation for PromptGuard AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(overview.router, prefix="/api", tags=["Overview"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])
app.include_router(execution.router, prefix="/api/execution", tags=["Execution"])
app.include_router(data_guard.router, prefix="/api/data-guard", tags=["Data Guard"])
app.include_router(audit_logs.router, prefix="/api/audit-logs", tags=["Audit Logs"])
app.include_router(playground.router, prefix="/api/playground", tags=["Playground"])
app.include_router(evaluation.router, prefix="/api/evaluations", tags=["Evaluation"])
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 7 part 2 created.")
