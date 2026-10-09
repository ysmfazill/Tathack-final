import uuid
import json
from datetime import datetime, timezone
from app.schemas.playground import TestOutcome, PlaygroundRunResult, ScenarioDefinition, PaginatedPlaygroundRuns, PlaygroundSummary
from app.services.attack_scenarios import get_scenario
from app.schemas.execution import ExecutionRequest
from app.services.execution_gateway import execute_authorized_action
from app.core.database import get_db_connection
from typing import List, Tuple

def run_scenario(scenario_id: str) -> PlaygroundRunResult:
    scenario = get_scenario(scenario_id)
    if not scenario:
        raise ValueError("Scenario not found")
        
    run_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    
    if not scenario.is_supported:
        res = PlaygroundRunResult(
            run_id=run_id,
            scenario_id=scenario_id,
            started_at=started_at,
            test_outcome=TestOutcome.UNSUPPORTED
        )
        _persist_run(res)
        return res

    try:
        req = ExecutionRequest(
            **scenario.payload,
            idempotency_key=str(uuid.uuid4())
        )
        response = execute_authorized_action(req)
        
        outcome = TestOutcome.PASS
        if response.policy_decision.value != scenario.expected_policy_decision:
            outcome = TestOutcome.FAIL
        if response.status.value != scenario.expected_execution_status:
            outcome = TestOutcome.FAIL
        if response.handler_invoked != scenario.expected_handler_invoked:
            outcome = TestOutcome.FAIL
            
        handler_succeeded = response.handler_invoked and response.status.value == "EXECUTED_IN_SIMULATION"
            
        res = PlaygroundRunResult(
            run_id=run_id,
            scenario_id=scenario_id,
            started_at=started_at,
            test_outcome=outcome,
            policy_decision=response.policy_decision.value,
            execution_status=response.status.value,
            handler_invoked=response.handler_invoked,
            handler_succeeded=handler_succeeded,
            reason_code=response.reason_code,
            safe_metadata=json.dumps({"scenario_name": scenario.name})
        )
    except Exception as e:
        res = PlaygroundRunResult(
            run_id=run_id,
            scenario_id=scenario_id,
            started_at=started_at,
            test_outcome=TestOutcome.ERROR,
            reason_code=str(e)
        )
        
    _persist_run(res)
    return res

def _persist_run(run: PlaygroundRunResult):
    from app.core.config import settings
    try:
        with get_db_connection(settings.database_url) as conn:
            conn.execute('''
                INSERT INTO playground_runs (
                    run_id, scenario_id, started_at, test_outcome,
                    policy_decision, execution_status, handler_invoked,
                    handler_succeeded, reason_code, safe_metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                run.run_id, run.scenario_id, run.started_at, run.test_outcome.value,
                run.policy_decision, run.execution_status, run.handler_invoked,
                run.handler_succeeded, run.reason_code, run.safe_metadata
            ))
            conn.commit()
    except Exception:
        pass

def get_runs(page: int = 1, page_size: int = 20) -> Tuple[List[PlaygroundRunResult], int]:
    from app.core.config import settings
    page_size = min(max(1, page_size), 100)
    page = max(1, page)
    offset = (page - 1) * page_size
    
    with get_db_connection(settings.database_url) as conn:
        total = conn.execute("SELECT COUNT(*) FROM playground_runs").fetchone()[0]
        rows = conn.execute("SELECT * FROM playground_runs ORDER BY started_at DESC LIMIT ? OFFSET ?", (page_size, offset)).fetchall()
        
    items = []
    for r in rows:
        items.append(PlaygroundRunResult(**dict(r)))
    return items, total

def get_run(run_id: str) -> PlaygroundRunResult:
    from app.core.config import settings
    with get_db_connection(settings.database_url) as conn:
        row = conn.execute("SELECT * FROM playground_runs WHERE run_id = ?", (run_id,)).fetchone()
    if not row:
        return None
    return PlaygroundRunResult(**dict(row))

def get_playground_summary() -> PlaygroundSummary:
    from app.core.config import settings
    with get_db_connection(settings.database_url) as conn:
        total = conn.execute("SELECT COUNT(*) FROM playground_runs").fetchone()[0]
        passes = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE test_outcome = 'PASS'").fetchone()[0]
        fails = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE test_outcome = 'FAIL'").fetchone()[0]
        inc = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE test_outcome = 'INCONCLUSIVE'").fetchone()[0]
        errs = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE test_outcome = 'ERROR'").fetchone()[0]
        unsup = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE test_outcome = 'UNSUPPORTED'").fetchone()[0]
        denials = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE execution_status = 'DENIED'").fetchone()[0]
        unexpected = conn.execute("SELECT COUNT(*) FROM playground_runs WHERE handler_invoked = 1 AND test_outcome = 'FAIL'").fetchone()[0]
        
    return PlaygroundSummary(
        total_runs=total, pass_count=passes, fail_count=fails,
        inconclusive_count=inc, error_count=errs, unsupported_count=unsup,
        observed_denials=denials, unexpected_handler_invocations=unexpected
    )
