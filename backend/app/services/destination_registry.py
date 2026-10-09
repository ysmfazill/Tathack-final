from app.schemas.data_guard import ClassificationLevel
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
