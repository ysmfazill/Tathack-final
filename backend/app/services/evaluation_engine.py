import uuid
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
