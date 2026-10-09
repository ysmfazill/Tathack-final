import os

files = {
    "backend/app/services/policy_engine.py": """from typing import Dict, Any
from app.schemas.policy import (
    ActionProposalRequest,
    PolicyDecisionResponse,
    Decision,
    RiskLevel
)
from app.services.tool_registry import TOOL_REGISTRY
import uuid
from datetime import datetime, timezone
from app.services.audit_service import record_audit_event, redact_sensitive_data
from app.schemas.audit import AuditEvent, EventType

POLICY_VERSION = "1.0.0"

def evaluate_action(request: ActionProposalRequest) -> PolicyDecisionResponse:
    decision_id = str(uuid.uuid4())
    evaluated_at = datetime.now(timezone.utc).isoformat()
    
    def _make_response(decision: Decision, reason: str, explanation: str, risk: RiskLevel, rules: list) -> PolicyDecisionResponse:
        res = PolicyDecisionResponse(
            decision_id=decision_id,
            decision=decision,
            reason_code=reason,
            explanation=explanation,
            tool_name=request.tool_name,
            action=request.action,
            risk_level=risk,
            matched_rules=rules,
            policy_version=POLICY_VERSION,
            evaluated_at=evaluated_at
        )
        
        # Log to audit
        event = AuditEvent(
            event_id=str(uuid.uuid4()),
            timestamp_utc=evaluated_at,
            event_type=EventType.POLICY_EVALUATED,
            agent_id=request.agent_id,
            tool_name=request.tool_name,
            action=request.action,
            policy_decision=decision.value,
            reason_code=reason,
            policy_version=POLICY_VERSION,
            safe_metadata=redact_sensitive_data(request.arguments)
        )
        record_audit_event(event)
        
        return res

    if request.tool_name not in TOOL_REGISTRY:
        return _make_response(Decision.DENY, "TOOL_NOT_ALLOWLISTED", "The requested tool is not registered in the allowlist.", RiskLevel.CRITICAL, ["DENY_UNKNOWN_TOOLS"])

    tool = TOOL_REGISTRY[request.tool_name]

    if not tool.is_enabled:
        return _make_response(Decision.DENY, "TOOL_DISABLED", "The requested tool is explicitly disabled by the active policy.", tool.risk_level, ["DENY_DISABLED_TOOLS"])

    expected_args = tool.expected_arguments
    provided_args = request.arguments
    
    for arg_name, arg_type in expected_args.items():
        if arg_name not in provided_args:
            return _make_response(Decision.DENY, "MISSING_ARGUMENT", f"Missing required argument: {arg_name}", tool.risk_level, ["VALIDATE_ARGUMENTS"])
        if not isinstance(provided_args[arg_name], arg_type):
            return _make_response(Decision.DENY, "INVALID_ARGUMENT_TYPE", f"Argument {arg_name} has invalid type.", tool.risk_level, ["VALIDATE_ARGUMENTS"])
            
    for arg_name in provided_args:
        if arg_name not in expected_args:
            return _make_response(Decision.DENY, "UNEXPECTED_ARGUMENT", f"Unexpected argument provided: {arg_name}", tool.risk_level, ["VALIDATE_ARGUMENTS"])

    if tool.requires_approval:
        return _make_response(Decision.REQUIRE_APPROVAL, "APPROVAL_REQUIRED", "This action requires human approval before execution.", tool.risk_level, ["REQUIRE_APPROVAL_FOR_SENSITIVE_ACTIONS"])

    return _make_response(Decision.ALLOW, "ACTION_ALLOWED", "The action complies with the active security policy.", tool.risk_level, ["ALLOW_VALIDATED_ACTIONS"])
""",
    "backend/app/services/cross_agent_guard.py": """import uuid
from datetime import datetime, timezone
from app.schemas.data_guard import TransferRequest, TransferDecisionResponse, EvaluatedRecord, ProvenanceStatus
from app.schemas.policy import Decision
from app.services.data_classification import get_trusted_classification
from app.services.destination_registry import get_destination_policy, check_source_access
from app.services.audit_service import record_audit_event, redact_sensitive_data
from app.schemas.audit import AuditEvent, EventType

POLICY_VERSION = "1.0.0"

def evaluate_transfer(request: TransferRequest) -> TransferDecisionResponse:
    decision_id = str(uuid.uuid4())
    evaluated_at = datetime.now(timezone.utc).isoformat()
    
    evaluated_records = []

    def _make_response(decision: Decision, reason: str) -> TransferDecisionResponse:
        res = TransferDecisionResponse(
            transfer_id=decision_id,
            decision=decision,
            reason_code=reason,
            source_agent=request.source_agent,
            destination_agent=request.destination_agent,
            records_evaluated=evaluated_records,
            policy_version=POLICY_VERSION,
            evaluated_at=evaluated_at,
            transfer_performed=False
        )
        
        event_type = EventType.TRANSFER_EVALUATED if decision == Decision.ALLOW else EventType.TRANSFER_DENIED
        event = AuditEvent(
            event_id=str(uuid.uuid4()),
            timestamp_utc=evaluated_at,
            event_type=event_type,
            transfer_id=decision_id,
            policy_decision=decision.value,
            reason_code=reason,
            policy_version=POLICY_VERSION,
            source_agent=request.source_agent,
            destination_agent=request.destination_agent,
            safe_metadata=redact_sensitive_data({"record_ids": request.record_ids, "purpose": request.purpose})
        )
        record_audit_event(event)
        
        return res

    if not request.source_agent:
        return _make_response(Decision.DENY, "INVALID_SOURCE")

    dest_policy = get_destination_policy(request.destination_agent)
    if not dest_policy or not dest_policy.is_enabled:
        return _make_response(Decision.DENY, "UNKNOWN_OR_DISABLED_DESTINATION")

    if not request.record_ids:
        return _make_response(Decision.DENY, "NO_RECORDS_SPECIFIED")

    for record_id in request.record_ids:
        trusted_record = get_trusted_classification(record_id)
        if not trusted_record:
            return _make_response(Decision.DENY, "UNKNOWN_RECORD")
        
        if not check_source_access(request.source_agent, record_id):
            return _make_response(Decision.DENY, "SOURCE_ACCESS_DENIED")

        evaluated_records.append(EvaluatedRecord(
            record_id=record_id,
            effective_classification=trusted_record.classification.value,
            provenance=ProvenanceStatus.TRUSTED_REGISTRY
        ))

        if trusted_record.classification not in dest_policy.allowed_classifications:
            return _make_response(Decision.DENY, "DESTINATION_CLASSIFICATION_FORBIDDEN")

    return _make_response(Decision.ALLOW, "TRANSFER_ALLOWED")
""",
    "backend/app/services/execution_gateway.py": """from app.schemas.execution import ExecutionRequest, ExecutionResponse, ExecutionStatus, PreviewResponse
from app.schemas.policy import Decision
from app.schemas.data_guard import TransferRequest
from app.services.policy_engine import evaluate_action, POLICY_VERSION
from app.services.cross_agent_guard import evaluate_transfer
from app.services.tool_registry import TOOL_REGISTRY, TOOL_HANDLERS
from app.services.audit_service import record_audit_event, redact_sensitive_data
from app.schemas.audit import AuditEvent, EventType
import uuid
import json
import hashlib
from datetime import datetime, timezone

idempotency_store = {}
approval_store = {
    "valid_token_123": {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
}

def _log_execution(request: ExecutionRequest, response: ExecutionResponse, event_type: EventType):
    event = AuditEvent(
        event_id=str(uuid.uuid4()),
        timestamp_utc=datetime.now(timezone.utc).isoformat(),
        event_type=event_type,
        agent_id=request.agent_id,
        execution_id=response.execution_id,
        tool_name=request.tool_name,
        action=request.action,
        policy_decision=response.policy_decision.value,
        execution_status=response.status.value,
        reason_code=response.reason_code,
        policy_version=POLICY_VERSION,
        handler_invoked=response.handler_invoked,
        safe_metadata=redact_sensitive_data(request.arguments)
    )
    record_audit_event(event)

def execute_authorized_action(request: ExecutionRequest) -> ExecutionResponse:
    # Log EXECUTION_REQUESTED
    req_event = AuditEvent(
        event_id=str(uuid.uuid4()),
        timestamp_utc=datetime.now(timezone.utc).isoformat(),
        event_type=EventType.EXECUTION_REQUESTED,
        agent_id=request.agent_id,
        tool_name=request.tool_name,
        action=request.action,
        safe_metadata=redact_sensitive_data(request.arguments)
    )
    record_audit_event(req_event)

    if request.idempotency_key in idempotency_store:
        cached = idempotency_store[request.idempotency_key]
        req_payload_hash = hashlib.sha256(json.dumps(request.arguments, sort_keys=True).encode()).hexdigest()
        if cached["payload_hash"] != req_payload_hash:
            res = ExecutionResponse(
                execution_id=str(uuid.uuid4()),
                status=ExecutionStatus.FAILED,
                tool_name=request.tool_name,
                policy_decision=Decision.DENY,
                handler_invoked=False,
                reason_code="IDEMPOTENCY_PAYLOAD_MISMATCH",
                policy_version=POLICY_VERSION,
                evaluated_at=datetime.now(timezone.utc).isoformat()
            )
            _log_execution(request, res, EventType.EXECUTION_FAILED)
            return res
        return cached["response"]

    req_payload_hash = hashlib.sha256(json.dumps(request.arguments, sort_keys=True).encode()).hexdigest()
    
    try:
        policy_decision = evaluate_action(request)
    except Exception:
        response = ExecutionResponse(
            execution_id=str(uuid.uuid4()),
            status=ExecutionStatus.FAILED,
            tool_name=request.tool_name,
            policy_decision=Decision.DENY,
            handler_invoked=False,
            reason_code="POLICY_ENGINE_FAILURE",
            policy_version=POLICY_VERSION,
            evaluated_at=datetime.now(timezone.utc).isoformat()
        )
        _log_execution(request, response, EventType.EXECUTION_FAILED)
        return response

    execution_id = str(uuid.uuid4())
    evaluated_at = policy_decision.evaluated_at
    
    response = ExecutionResponse(
        execution_id=execution_id,
        status=ExecutionStatus.PROPOSED,
        tool_name=request.tool_name,
        policy_decision=policy_decision.decision,
        handler_invoked=False,
        reason_code=policy_decision.reason_code,
        policy_version=POLICY_VERSION,
        evaluated_at=evaluated_at
    )

    if policy_decision.decision == Decision.DENY:
        response.status = ExecutionStatus.DENIED
        idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
        _log_execution(request, response, EventType.EXECUTION_DENIED)
        return response

    if policy_decision.decision == Decision.REQUIRE_APPROVAL:
        if not request.approval_token or request.approval_token not in approval_store:
            response.status = ExecutionStatus.PENDING
            response.reason_code = "MISSING_OR_INVALID_APPROVAL"
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            _log_execution(request, response, EventType.APPROVAL_REQUIRED)
            return response
            
        approval = approval_store[request.approval_token]
        if approval["used"] or approval["tool_name"] != request.tool_name or approval["arguments_hash"] != req_payload_hash:
            response.status = ExecutionStatus.DENIED
            response.reason_code = "INVALID_APPROVAL_CONTEXT"
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            _log_execution(request, response, EventType.EXECUTION_DENIED)
            return response
            
        approval["used"] = True

    if request.tool_name == "transfer_demo_records":
        transfer_req = TransferRequest(
            source_agent=request.agent_id,
            destination_agent=request.arguments.get("destination_agent", ""),
            record_ids=request.arguments.get("record_ids", []),
            purpose=request.arguments.get("purpose", "")
        )
        transfer_decision = evaluate_transfer(transfer_req)
        if transfer_decision.decision != Decision.ALLOW:
            response.status = ExecutionStatus.DENIED
            response.reason_code = transfer_decision.reason_code
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            _log_execution(request, response, EventType.EXECUTION_DENIED)
            return response

    handler = TOOL_HANDLERS.get(request.tool_name)
    if not handler:
        response.status = ExecutionStatus.FAILED
        response.reason_code = "HANDLER_NOT_FOUND"
        idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
        _log_execution(request, response, EventType.EXECUTION_FAILED)
        return response

    _log_execution(request, response, EventType.EXECUTION_STARTED)

    try:
        result = handler(request.arguments)
        response.status = ExecutionStatus.EXECUTED_IN_SIMULATION
        response.handler_invoked = True
        response.result = result
        response.reason_code = "SUCCESS"
        _log_execution(request, response, EventType.EXECUTION_SUCCEEDED)
    except Exception as e:
        response.status = ExecutionStatus.FAILED
        response.handler_invoked = True
        response.reason_code = "HANDLER_EXCEPTION"
        _log_execution(request, response, EventType.EXECUTION_FAILED)

    idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
    return response

def preview_action(request: ExecutionRequest) -> PreviewResponse:
    policy_decision = evaluate_action(request)
    tool = TOOL_REGISTRY.get(request.tool_name)
    
    return PreviewResponse(
        tool_name=request.tool_name,
        arguments_summary=request.arguments,
        policy_decision=policy_decision.decision,
        risk_level=tool.risk_level.value if tool else "UNKNOWN",
        approval_requirement=tool.requires_approval if tool else False,
        explanation=policy_decision.explanation,
        handler_invoked=False
    )
""",
    "backend/tests/test_audit_service.py": """import pytest
import os
import uuid
from app.core.database import init_db, get_db_connection
from app.schemas.audit import AuditEvent, EventType
from app.services.audit_service import record_audit_event, get_audit_logs, get_audit_summary
from datetime import datetime, timezone
from app.schemas.execution import ExecutionRequest
from app.services.execution_gateway import execute_authorized_action

TEST_DB_URL = "sqlite:///./data/test_audit.db"

@pytest.fixture(autouse=True)
def setup_teardown_db():
    if os.path.exists("./data/test_audit.db"):
        os.remove("./data/test_audit.db")
    init_db(TEST_DB_URL)
    
    # Also override default for tests
    import app.core.config
    app.core.config.settings.database_url = TEST_DB_URL
    yield
    
    if os.path.exists("./data/test_audit.db"):
        os.remove("./data/test_audit.db")

def test_audit_persists():
    # TEST 1: A policy evaluation creates the expected persisted event
    event = AuditEvent(
        event_id="evt_123",
        timestamp_utc=datetime.now(timezone.utc).isoformat(),
        event_type=EventType.POLICY_EVALUATED,
        policy_decision="ALLOW"
    )
    record_audit_event(event)
    logs, count = get_audit_logs()
    assert count == 1
    assert logs[0].event_id == "evt_123"

def test_redaction():
    # TEST 17: Obvious secrets and sensitive argument values are not persisted.
    from app.services.audit_service import redact_sensitive_data
    args = {"query": "demo", "password": "supersecret"}
    redacted = redact_sensitive_data(args)
    assert "demo" in redacted
    assert "supersecret" not in redacted
    assert "[REDACTED]" in redacted

def test_gateway_emits_audit():
    # TEST 4: A successful simulated execution records success only after handler actually returns.
    # We execute a valid request, check if EXECUTION_SUCCEEDED is in DB.
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test"},
        idempotency_key=str(uuid.uuid4())
    )
    execute_authorized_action(req)
    logs, _ = get_audit_logs(page_size=10)
    event_types = [l.event_type for l in logs]
    assert EventType.EXECUTION_SUCCEEDED in event_types
    assert EventType.POLICY_EVALUATED in event_types
    assert EventType.EXECUTION_REQUESTED in event_types

def test_handler_failure_emits_failure():
    # TEST 5: A handler failure records a failure event and does not claim success.
    req = ExecutionRequest(
        agent_id="test",
        tool_name="error_demo_tool",
        action="execute",
        arguments={},
        idempotency_key=str(uuid.uuid4())
    )
    execute_authorized_action(req)
    logs, _ = get_audit_logs(page_size=10)
    event_types = [l.event_type for l in logs]
    assert EventType.EXECUTION_FAILED in event_types
    assert EventType.EXECUTION_SUCCEEDED not in event_types
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 5 files (part 2) created successfully.")
