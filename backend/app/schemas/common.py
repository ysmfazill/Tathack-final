from pydantic import BaseModel
from typing import List

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

class OverviewResponse(BaseModel):
    application: str
    api_version: str
    mode: str
    backend_status: str
    implemented_capabilities: List[str]
    planned_capabilities: List[str]
