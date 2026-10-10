from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from enum import Enum
from app.schemas.policy import Decision, ActionProposalRequest

class ExecutionStatus(str, Enum):
    PROPOSED = "PROPOSED"
    DENIED = "DENIED"
    NOT_EXECUTED = "NOT_EXECUTED"
    EXECUTED_IN_SIMULATION = "EXECUTED_IN_SIMULATION"
    FAILED = "FAILED"
    PENDING = "PENDING"
    UNKNOWN = "UNKNOWN"

class ExecutionRequest(ActionProposalRequest):
    idempotency_key: str
    approval_token: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ExecutionResponse(BaseModel):
    execution_id: str
    status: ExecutionStatus
    tool_name: str
    policy_decision: Decision
    handler_invoked: bool
    result: Optional[Dict[str, Any]] = None
    reason_code: Optional[str] = None
    policy_version: str
    evaluated_at: str
    timing_metrics: Optional[Dict[str, float]] = None

class PreviewResponse(BaseModel):
    tool_name: str
    arguments_summary: Dict[str, Any]
    policy_decision: Decision
    risk_level: str
    approval_requirement: bool
    explanation: str
    handler_invoked: bool = False
