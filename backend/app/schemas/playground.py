from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum

class TestOutcome(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    INCONCLUSIVE = "INCONCLUSIVE"
    ERROR = "ERROR"
    UNSUPPORTED = "UNSUPPORTED"

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
    run_id: str
    scenario_id: str
    started_at: str
    test_outcome: TestOutcome
    policy_decision: Optional[str] = None
    execution_status: Optional[str] = None
    handler_invoked: Optional[bool] = None
    handler_succeeded: Optional[bool] = None
    reason_code: Optional[str] = None
    safe_metadata: Optional[str] = None

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
