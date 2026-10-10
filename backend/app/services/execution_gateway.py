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
from app.services.input_scanner import scan_input
from app.services.output_guard import scan_output
from app.services.counterfactual import analyze_counterfactual

idempotency_store = {}
approval_store = {
    "valid_token_123": {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
}

import time

def _log_execution(request: ExecutionRequest, response: ExecutionResponse, event_type: EventType, duration_ms: float = 0.0):
    t0 = time.perf_counter_ns()
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
    t1 = time.perf_counter_ns()
    if response.timing_metrics is not None:
        if "audit_persistence_ms" not in response.timing_metrics:
            response.timing_metrics["audit_persistence_ms"] = 0.0
        response.timing_metrics["audit_persistence_ms"] += (t1 - t0) / 1_000_000.0

def execute_authorized_action(request: ExecutionRequest) -> ExecutionResponse:
    t_gateway_start = time.perf_counter_ns()
    timing_metrics = {}
    
    t_det_start = time.perf_counter_ns()
    detection = detect_behaviour(request)
    input_findings = scan_input(json.dumps(request.arguments))
    counterfactual = analyze_counterfactual(request)
    timing_metrics["behaviour_detection_ms"] = (time.perf_counter_ns() - t_det_start) / 1_000_000.0
    
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
            "signals": [s.model_dump() for s in detection.signals],
            "input_scanner_findings": [f.to_dict() for f in input_findings],
            "counterfactual": counterfactual
        }
        metadata = json.dumps(md_dict)
    except Exception:
        pass

    # Log EXECUTION_REQUESTED
    t_audit_req_start = time.perf_counter_ns()
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
    timing_metrics["audit_persistence_ms"] = (time.perf_counter_ns() - t_audit_req_start) / 1_000_000.0

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
                evaluated_at=datetime.now(timezone.utc).isoformat(),
                timing_metrics=timing_metrics
            )
            _log_execution(request, res, EventType.EXECUTION_FAILED)
            res.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
            return res
        return cached["response"]

    req_payload_hash = hashlib.sha256(json.dumps(request.arguments, sort_keys=True).encode()).hexdigest()
    
    try:
        t_pol_start = time.perf_counter_ns()
        policy_decision = evaluate_action(request)
        timing_metrics["deterministic_policy_evaluation_ms"] = (time.perf_counter_ns() - t_pol_start) / 1_000_000.0
    except Exception:
        response = ExecutionResponse(
            execution_id=str(uuid.uuid4()),
            status=ExecutionStatus.FAILED,
            tool_name=request.tool_name,
            policy_decision=Decision.DENY,
            handler_invoked=False,
            reason_code="POLICY_ENGINE_FAILURE",
            policy_version=POLICY_VERSION,
            evaluated_at=datetime.now(timezone.utc).isoformat(),
            timing_metrics=timing_metrics
        )
        _log_execution(request, response, EventType.EXECUTION_FAILED)
        response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
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
        evaluated_at=evaluated_at,
        timing_metrics=timing_metrics
    )

    if policy_decision.decision == Decision.DENY:
        response.status = ExecutionStatus.DENIED
        idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
        _log_execution(request, response, EventType.EXECUTION_DENIED)
        response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
        return response

    if policy_decision.decision == Decision.REQUIRE_APPROVAL:
        t_appr_start = time.perf_counter_ns()
        if not request.approval_token or request.approval_token not in approval_store:
            timing_metrics["approval_validation_ms"] = (time.perf_counter_ns() - t_appr_start) / 1_000_000.0
            response.status = ExecutionStatus.PENDING
            response.reason_code = "MISSING_OR_INVALID_APPROVAL"
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            _log_execution(request, response, EventType.APPROVAL_REQUIRED)
            response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
            return response
            
        approval = approval_store[request.approval_token]
        if approval["used"] or approval["tool_name"] != request.tool_name or approval["arguments_hash"] != req_payload_hash:
            timing_metrics["approval_validation_ms"] = (time.perf_counter_ns() - t_appr_start) / 1_000_000.0
            response.status = ExecutionStatus.DENIED
            response.reason_code = "INVALID_APPROVAL_CONTEXT"
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            _log_execution(request, response, EventType.EXECUTION_DENIED)
            response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
            return response
            
        approval["used"] = True
        timing_metrics["approval_validation_ms"] = (time.perf_counter_ns() - t_appr_start) / 1_000_000.0

    if request.tool_name == "transfer_demo_records":
        t_pol2 = time.perf_counter_ns()
        transfer_req = TransferRequest(
            source_agent=request.agent_id,
            destination_agent=request.arguments.get("destination_agent", ""),
            record_ids=request.arguments.get("record_ids", []),
            purpose=request.arguments.get("purpose", "")
        )
        transfer_decision = evaluate_transfer(transfer_req)
        timing_metrics["deterministic_policy_evaluation_ms"] = timing_metrics.get("deterministic_policy_evaluation_ms", 0) + ((time.perf_counter_ns() - t_pol2) / 1_000_000.0)
        if transfer_decision.decision != Decision.ALLOW:
            response.status = ExecutionStatus.DENIED
            response.reason_code = transfer_decision.reason_code
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            _log_execution(request, response, EventType.EXECUTION_DENIED)
            response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
            return response

    handler = TOOL_HANDLERS.get(request.tool_name)
    if not handler:
        response.status = ExecutionStatus.FAILED
        response.reason_code = "HANDLER_NOT_FOUND"
        idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
        _log_execution(request, response, EventType.EXECUTION_FAILED)
        response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
        return response

    _log_execution(request, response, EventType.EXECUTION_STARTED)

    try:
        t_hand = time.perf_counter_ns()
        result = handler(request.arguments)
        
        # Run Output Guard
        t_out = time.perf_counter_ns()
        output_findings = scan_output(json.dumps(result))
        timing_metrics["output_scan_ms"] = (time.perf_counter_ns() - t_out) / 1_000_000.0
        
        timing_metrics["handler_execution_ms"] = (time.perf_counter_ns() - t_hand) / 1_000_000.0
        
        if output_findings:
            # We don't block, just attach findings to the result object or log them
            result["_security_output_findings"] = [f.to_dict() for f in output_findings]
            
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
    response.timing_metrics["gateway_processing_ms"] = (time.perf_counter_ns() - t_gateway_start) / 1_000_000.0
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

