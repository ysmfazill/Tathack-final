import uuid
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
