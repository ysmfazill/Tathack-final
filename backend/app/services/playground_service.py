import uuid
import json
from datetime import datetime, timezone
from app.schemas.playground import TestOutcome, PlaygroundRunResult, ScenarioDefinition, PaginatedPlaygroundRuns, PlaygroundSummary, CustomRunRequest
from app.services.attack_scenarios import get_scenario
from app.schemas.execution import ExecutionRequest
from app.services.execution_gateway import execute_authorized_action
from app.core.database import get_db_connection
from typing import List, Tuple

def run_scenario(scenario_id: str) -> PlaygroundRunResult:
    scenario = get_scenario(scenario_id)
    if not scenario:
        raise ValueError("Scenario not found")
        
    sim_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    
    if not scenario.is_supported:
        res = PlaygroundRunResult(
            simulation_id=sim_id,
            scenario_id=scenario_id,
            timestamp=started_at,
            firewall_verdict="ERROR/INDETERMINATE",
            scenario_outcome=TestOutcome.UNSUPPORTED
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
            
        verdict = "ALLOW" if response.policy_decision.value == "ALLOW" else ("REVIEW" if response.policy_decision.value == "REQUIRE_APPROVAL" else "BLOCK")
        
        # Calculate mock risks based on decision for deterministic runs
        confidence = 0.99
        injection_prob = 0.85 if verdict == "BLOCK" else 0.02
        exfil_risk = 0.75 if verdict == "BLOCK" else 0.01
        priv_dev = 0.60 if verdict == "BLOCK" else 0.03
        
        # Extract audit ID from recent events (mock logic: generate one)
        audit_id = str(uuid.uuid4())

        res = PlaygroundRunResult(
            simulation_id=sim_id,
            scenario_id=scenario_id,
            timestamp=started_at,
            firewall_verdict=verdict,
            scenario_outcome=outcome,
            policy_decision=response.policy_decision.value,
            execution_status=response.status.value,
            handler_invoked=response.handler_invoked,
            reason_code=response.reason_code,
            policy_confidence=confidence,
            injection_probability=injection_prob,
            exfiltration_risk=exfil_risk,
            privilege_deviation=priv_dev,
            triggered_defenses=response.matched_rules if hasattr(response, 'matched_rules') else [],
            execution_safe_metadata=json.dumps({"scenario_name": scenario.name}),
            audit_event_id=audit_id,
            timing_metrics=response.timing_metrics
        )
    except Exception as e:
        res = PlaygroundRunResult(
            simulation_id=sim_id,
            scenario_id=scenario_id,
            timestamp=started_at,
            firewall_verdict="ERROR/INDETERMINATE",
            scenario_outcome=TestOutcome.ERROR,
            reason_code=str(e)
        )
        
    _persist_run(res)
    return res

def run_custom_scenario(req_custom: "CustomRunRequest") -> PlaygroundRunResult:
    sim_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    
    try:
        req = ExecutionRequest(
            agent_id=req_custom.target_agent_id,
            tool_name=req_custom.proposed_tool_name,
            action="custom_playground_execution",
            arguments=req_custom.tool_arguments,
            idempotency_key=str(uuid.uuid4())
        )
        response = execute_authorized_action(req)
        
        outcome = TestOutcome.PASS
        verdict = "ALLOW" if response.policy_decision.value == "ALLOW" else ("REVIEW" if response.policy_decision.value == "REQUIRE_APPROVAL" else "BLOCK")
        
        confidence = 0.99
        injection_prob = 0.85 if verdict == "BLOCK" else 0.02
        exfil_risk = 0.75 if verdict == "BLOCK" else 0.01
        priv_dev = 0.60 if verdict == "BLOCK" else 0.03
        
        audit_id = str(uuid.uuid4())

        res = PlaygroundRunResult(
            simulation_id=sim_id,
            scenario_id="custom",
            timestamp=started_at,
            firewall_verdict=verdict,
            scenario_outcome=outcome,
            policy_decision=response.policy_decision.value,
            execution_status=response.status.value,
            handler_invoked=response.handler_invoked,
            reason_code=response.reason_code,
            policy_confidence=confidence,
            injection_probability=injection_prob,
            exfiltration_risk=exfil_risk,
            privilege_deviation=priv_dev,
            triggered_defenses=response.matched_rules if hasattr(response, 'matched_rules') else [],
            execution_safe_metadata=json.dumps({"scenario_name": "Custom Run"}),
            audit_event_id=audit_id,
            timing_metrics=response.timing_metrics
        )
    except Exception as e:
        print("EXCEPTION IN RUN CUSTOM SCENARIO:", e)
        res = PlaygroundRunResult(
            simulation_id=sim_id,
            scenario_id="custom",
            timestamp=started_at,
            firewall_verdict="ERROR/INDETERMINATE",
            scenario_outcome=TestOutcome.ERROR,
            reason_code=str(e)
        )
        
    _persist_run(res)
    return res

def _persist_run(run: PlaygroundRunResult):
    from app.core.config import settings
    try:
        with get_db_connection(settings.database_url) as conn:
            # Drop old table and create new if needed, or assume a test db
            conn.execute('''
                CREATE TABLE IF NOT EXISTS playground_runs_v2 (
                    simulation_id TEXT PRIMARY KEY,
                    scenario_id TEXT,
                    timestamp TEXT,
                    firewall_verdict TEXT,
                    scenario_outcome TEXT,
                    policy_decision TEXT,
                    reason_code TEXT,
                    policy_confidence REAL,
                    injection_probability REAL,
                    exfiltration_risk REAL,
                    privilege_deviation REAL,
                    handler_invoked BOOLEAN,
                    execution_status TEXT,
                    triggered_defenses TEXT,
                    execution_safe_metadata TEXT,
                    audit_event_id TEXT,
                    timing_metrics TEXT
                )
            ''')
            try:
                conn.execute("ALTER TABLE playground_runs_v2 ADD COLUMN timing_metrics TEXT")
            except Exception:
                pass
            conn.execute('''
                INSERT INTO playground_runs_v2 (
                    simulation_id, scenario_id, timestamp, firewall_verdict, scenario_outcome,
                    policy_decision, reason_code, policy_confidence, injection_probability,
                    exfiltration_risk, privilege_deviation, handler_invoked, execution_status,
                    triggered_defenses, execution_safe_metadata, audit_event_id, timing_metrics
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                run.simulation_id, run.scenario_id, run.timestamp, run.firewall_verdict, run.scenario_outcome.value,
                run.policy_decision, run.reason_code, run.policy_confidence, run.injection_probability,
                run.exfiltration_risk, run.privilege_deviation, run.handler_invoked, run.execution_status,
                json.dumps(run.triggered_defenses) if run.triggered_defenses else None, run.execution_safe_metadata, run.audit_event_id,
                json.dumps(run.timing_metrics) if run.timing_metrics else None
            ))
            conn.commit()
    except Exception as e:
        print(f"Error persisting run: {e}")

def get_runs(page: int = 1, page_size: int = 20) -> Tuple[List[PlaygroundRunResult], int]:
    from app.core.config import settings
    page_size = min(max(1, page_size), 100)
    page = max(1, page)
    offset = (page - 1) * page_size
    
    try:
        with get_db_connection(settings.database_url) as conn:
            total = conn.execute("SELECT COUNT(*) FROM playground_runs_v2").fetchone()[0]
            rows = conn.execute("SELECT * FROM playground_runs_v2 ORDER BY timestamp DESC LIMIT ? OFFSET ?", (page_size, offset)).fetchall()
            
        items = []
        for r in rows:
            d = dict(r)
            if d.get("triggered_defenses"):
                d["triggered_defenses"] = json.loads(d["triggered_defenses"])
            if d.get("timing_metrics"):
                d["timing_metrics"] = json.loads(d["timing_metrics"])
            items.append(PlaygroundRunResult(**d))
        return items, total
    except Exception:
        return [], 0

def get_run(run_id: str) -> PlaygroundRunResult:
    from app.core.config import settings
    try:
        with get_db_connection(settings.database_url) as conn:
            row = conn.execute("SELECT * FROM playground_runs_v2 WHERE simulation_id = ?", (run_id,)).fetchone()
        if not row:
            return None
        d = dict(row)
        if d.get("triggered_defenses"):
            d["triggered_defenses"] = json.loads(d["triggered_defenses"])
        if d.get("timing_metrics"):
            d["timing_metrics"] = json.loads(d["timing_metrics"])
        return PlaygroundRunResult(**d)
    except Exception:
        return None

def get_playground_summary() -> PlaygroundSummary:
    from app.core.config import settings
    try:
        with get_db_connection(settings.database_url) as conn:
            total = conn.execute("SELECT COUNT(*) FROM playground_runs_v2").fetchone()[0]
            passes = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE scenario_outcome = 'PASS'").fetchone()[0]
            fails = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE scenario_outcome = 'FAIL'").fetchone()[0]
            inc = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE scenario_outcome = 'INCONCLUSIVE'").fetchone()[0]
            errs = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE scenario_outcome = 'ERROR'").fetchone()[0]
            unsup = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE scenario_outcome = 'UNSUPPORTED'").fetchone()[0]
            denials = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE execution_status = 'DENIED'").fetchone()[0]
            unexpected = conn.execute("SELECT COUNT(*) FROM playground_runs_v2 WHERE handler_invoked = 1 AND scenario_outcome = 'FAIL'").fetchone()[0]
            
        return PlaygroundSummary(
            total_runs=total, pass_count=passes, fail_count=fails,
            inconclusive_count=inc, error_count=errs, unsupported_count=unsup,
            observed_denials=denials, unexpected_handler_invocations=unexpected
        )
    except Exception:
        return PlaygroundSummary(
            total_runs=0, pass_count=0, fail_count=0,
            inconclusive_count=0, error_count=0, unsupported_count=0,
            observed_denials=0, unexpected_handler_invocations=0
        )
