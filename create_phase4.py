import os

files = {
    "backend/app/schemas/data_guard.py": """from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from app.schemas.policy import Decision

class ClassificationLevel(str, Enum):
    PUBLIC = "PUBLIC"
    INTERNAL = "INTERNAL"
    CONFIDENTIAL = "CONFIDENTIAL"
    RESTRICTED = "RESTRICTED"

class ProvenanceStatus(str, Enum):
    TRUSTED_REGISTRY = "TRUSTED_REGISTRY"
    UNTRUSTED_DOCUMENT = "UNTRUSTED_DOCUMENT"
    UNKNOWN = "UNKNOWN"

class TransferRequest(BaseModel):
    source_agent: str
    destination_agent: str
    record_ids: List[str]
    purpose: str
    untrusted_classification_claim: Optional[str] = None

class EvaluatedRecord(BaseModel):
    record_id: str
    effective_classification: str
    provenance: ProvenanceStatus

class TransferDecisionResponse(BaseModel):
    transfer_id: str
    decision: Decision
    reason_code: str
    source_agent: str
    destination_agent: str
    records_evaluated: List[EvaluatedRecord]
    policy_version: str
    evaluated_at: str
    transfer_performed: bool = False
""",
    "backend/app/services/data_classification.py": """from app.schemas.data_guard import ClassificationLevel, ProvenanceStatus
from pydantic import BaseModel

class TrustedRecord(BaseModel):
    id: str
    classification: ClassificationLevel
    source: str

TRUSTED_RECORDS = {
    "record_public_001": TrustedRecord(id="record_public_001", classification=ClassificationLevel.PUBLIC, source="trusted_system"),
    "record_internal_001": TrustedRecord(id="record_internal_001", classification=ClassificationLevel.INTERNAL, source="trusted_system"),
    "record_confidential_001": TrustedRecord(id="record_confidential_001", classification=ClassificationLevel.CONFIDENTIAL, source="trusted_system"),
    "record_restricted_001": TrustedRecord(id="record_restricted_001", classification=ClassificationLevel.RESTRICTED, source="trusted_system")
}

def get_trusted_classification(record_id: str) -> TrustedRecord | None:
    return TRUSTED_RECORDS.get(record_id)
""",
    "backend/app/services/destination_registry.py": """from app.schemas.data_guard import ClassificationLevel
from pydantic import BaseModel
from typing import List

class DestinationPolicy(BaseModel):
    agent_id: str
    is_enabled: bool
    allowed_classifications: List[ClassificationLevel]

DESTINATIONS = {
    "hr_agent": DestinationPolicy(agent_id="hr_agent", is_enabled=True, allowed_classifications=[ClassificationLevel.PUBLIC, ClassificationLevel.INTERNAL, ClassificationLevel.CONFIDENTIAL, ClassificationLevel.RESTRICTED]),
    "report_agent": DestinationPolicy(agent_id="report_agent", is_enabled=True, allowed_classifications=[ClassificationLevel.PUBLIC, ClassificationLevel.INTERNAL, ClassificationLevel.CONFIDENTIAL]),
    "export_agent": DestinationPolicy(agent_id="export_agent", is_enabled=True, allowed_classifications=[ClassificationLevel.PUBLIC]),
    "disabled_agent": DestinationPolicy(agent_id="disabled_agent", is_enabled=False, allowed_classifications=[ClassificationLevel.PUBLIC])
}

AGENT_DATA_ACCESS = {
    "hr_agent": ["record_public_001", "record_internal_001", "record_confidential_001", "record_restricted_001"],
    "report_agent": ["record_public_001", "record_internal_001", "record_confidential_001"],
    "export_agent": ["record_public_001"]
}

def get_destination_policy(agent_id: str) -> DestinationPolicy | None:
    return DESTINATIONS.get(agent_id)

def check_source_access(agent_id: str, record_id: str) -> bool:
    if agent_id not in AGENT_DATA_ACCESS:
        return False
    return record_id in AGENT_DATA_ACCESS[agent_id]
""",
    "backend/app/services/cross_agent_guard.py": """import uuid
from datetime import datetime, timezone
from app.schemas.data_guard import TransferRequest, TransferDecisionResponse, EvaluatedRecord, ProvenanceStatus
from app.schemas.policy import Decision
from app.services.data_classification import get_trusted_classification
from app.services.destination_registry import get_destination_policy, check_source_access

POLICY_VERSION = "1.0.0"

def evaluate_transfer(request: TransferRequest) -> TransferDecisionResponse:
    decision_id = str(uuid.uuid4())
    evaluated_at = datetime.now(timezone.utc).isoformat()
    
    evaluated_records = []

    def _make_response(decision: Decision, reason: str) -> TransferDecisionResponse:
        return TransferDecisionResponse(
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
    "backend/app/api/routes/data_guard.py": """from fastapi import APIRouter
from app.schemas.data_guard import TransferRequest, TransferDecisionResponse
from app.services.cross_agent_guard import evaluate_transfer

router = APIRouter()

@router.post("/evaluate", response_model=TransferDecisionResponse)
async def evaluate_data_transfer(request: TransferRequest):
    return evaluate_transfer(request)
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 4 schema, services, and route files created successfully.")
