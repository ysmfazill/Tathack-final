from pydantic import BaseModel
from typing import Optional, List, Any
from enum import Enum
from datetime import datetime

class EventType(str, Enum):
    POLICY_EVALUATED = "POLICY_EVALUATED"
    EXECUTION_REQUESTED = "EXECUTION_REQUESTED"
    EXECUTION_DENIED = "EXECUTION_DENIED"
    EXECUTION_STARTED = "EXECUTION_STARTED"
    EXECUTION_SUCCEEDED = "EXECUTION_SUCCEEDED"
    EXECUTION_FAILED = "EXECUTION_FAILED"
    APPROVAL_REQUIRED = "APPROVAL_REQUIRED"
    APPROVAL_RESOLVED = "APPROVAL_RESOLVED"
    TRANSFER_EVALUATED = "TRANSFER_EVALUATED"
    TRANSFER_DENIED = "TRANSFER_DENIED"
    TRANSFER_COMPLETED = "TRANSFER_COMPLETED"
    SECURITY_CONFIGURATION_ERROR = "SECURITY_CONFIGURATION_ERROR"

class AuditEvent(BaseModel):
    event_id: str
    timestamp_utc: str
    event_type: EventType
    actor_id: Optional[str] = None
    agent_id: Optional[str] = None
    request_id: Optional[str] = None
    execution_id: Optional[str] = None
    transfer_id: Optional[str] = None
    tool_name: Optional[str] = None
    action: Optional[str] = None
    policy_decision: Optional[str] = None
    execution_status: Optional[str] = None
    reason_code: Optional[str] = None
    policy_version: Optional[str] = None
    source_agent: Optional[str] = None
    destination_agent: Optional[str] = None
    data_classification: Optional[str] = None
    handler_invoked: Optional[bool] = None
    outcome: Optional[str] = None
    safe_metadata: Optional[str] = None

class PaginatedAuditResponse(BaseModel):
    items: List[AuditEvent]
    page: int
    page_size: int
    total: int

class AuditSummary(BaseModel):
    total_events: int
    policy_denials: int
    execution_attempts: int
    successful_simulated_executions: int
    failed_executions: int
    denied_transfers: int
