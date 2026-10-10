from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum

class TestOutcome(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    INCONCLUSIVE = "INCONCLUSIVE"
    ERROR = "ERROR"
    UNSUPPORTED = "UNSUPPORTED"

class CustomRunRequest(BaseModel):
    user_task: str
    untrusted_payload: str
    source_vector: str
    target_agent_id: str
    proposed_tool_name: str
    tool_arguments: Dict[str, Any]

class ScenarioDefinition(BaseModel):
    scenario_id: str
    name: str
    description: str
    category: str
    severity: str
    test_type: str
    expected_policy_decision: str
    expected_execution_status: str
    expected_handler_invoked: bool
    is_supported: bool = True
    payload: Dict[str, Any]

class PlaygroundRunResult(BaseModel):
    simulation_id: str
    scenario_id: str
    timestamp: str
    firewall_verdict: str
    scenario_outcome: TestOutcome
    policy_decision: Optional[str] = None
    reason_code: Optional[str] = None
    policy_confidence: Optional[float] = None
    injection_probability: Optional[float] = None
    exfiltration_risk: Optional[float] = None
    privilege_deviation: Optional[float] = None
    handler_invoked: Optional[bool] = None
    execution_status: Optional[str] = None
    triggered_defenses: Optional[List[str]] = None
    execution_safe_metadata: Optional[str] = None
    audit_event_id: Optional[str] = None
    timing_metrics: Optional[dict] = None

class PaginatedPlaygroundRuns(BaseModel):
    items: List[PlaygroundRunResult]
    page: int
    page_size: int
    total: int

class PlaygroundSummary(BaseModel):
    total_runs: int
    pass_count: int
    fail_count: int
    inconclusive_count: int
    error_count: int
    unsupported_count: int
    observed_denials: int
    unexpected_handler_invocations: int
