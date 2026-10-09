from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from enum import Enum
from datetime import datetime
import uuid

class Decision(str, Enum):
    ALLOW = "ALLOW"
    DENY = "DENY"
    REQUIRE_APPROVAL = "REQUIRE_APPROVAL"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ActionProposalRequest(BaseModel):
    agent_id: str
    tool_name: str
    action: str
    arguments: Dict[str, Any] = Field(default_factory=dict)

class PolicyDecisionResponse(BaseModel):
    decision_id: str
    decision: Decision
    reason_code: str
    explanation: str
    tool_name: str
    action: str
    risk_level: RiskLevel
    matched_rules: List[str]
    policy_version: str
    evaluated_at: str

class ToolDefinition(BaseModel):
    name: str
    description: str
    is_enabled: bool
    requires_approval: bool
    risk_level: RiskLevel
    expected_arguments: Dict[str, type]

class PolicyInfoResponse(BaseModel):
    policy_version: str
    registered_tools: List[str]
    disabled_tools: List[str]
    approval_required_tools: List[str]
    summary: str
