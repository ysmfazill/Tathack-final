from pydantic import BaseModel
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
