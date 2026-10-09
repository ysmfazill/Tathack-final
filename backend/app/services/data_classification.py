from app.schemas.data_guard import ClassificationLevel, ProvenanceStatus
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
