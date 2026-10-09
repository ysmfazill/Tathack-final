from typing import Dict, Any
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
