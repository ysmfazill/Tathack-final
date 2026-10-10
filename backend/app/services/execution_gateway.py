from app.schemas.execution import ExecutionRequest, ExecutionResponse, ExecutionStatus, PreviewResponse
from app.schemas.policy import Decision
from app.schemas.data_guard import TransferRequest
from app.services.policy_engine import evaluate_action, POLICY_VERSION
from app.services.cross_agent_guard import evaluate_transfer
from app.services.tool_registry import TOOL_REGISTRY, TOOL_HANDLERS
from app.services.audit_service import record_audit_event, redact_sensitive_data
from app.schemas.audit import AuditEvent, EventType
from app.services.behaviour_detector import detect_behaviour
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
    detection = detect_behaviour(request)
    
    metadata = redact_sensitive_data(request.arguments)
    # Append detection results to metadata if it's a valid JSON string
    try:
        if metadata:
            md_dict = json.loads(metadata)
        else:
            md_dict = {}
        md_dict["detection"] = {
            "is_anomaly": detection.is_anomaly,
            "risk_score": detection.risk_score,
            "latency_ms": detection.latency_ms,
            "signals": [s.model_dump() for s in detection.signals]
        }
        metadata = json.dumps(md_dict)
    except Exception:
        pass

    # Log EXECUTION_REQUESTED
    req_event = AuditEvent(
        event_id=str(uuid.uuid4()),
        timestamp_utc=datetime.now(timezone.utc).isoformat(),
        event_type=EventType.EXECUTION_REQUESTED,
        agent_id=request.agent_id,
        tool_name=request.tool_name,
        action=request.action,
        safe_metadata=metadata
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
