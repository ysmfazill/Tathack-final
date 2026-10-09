from pydantic import BaseModel
from typing import List, Optional, Any
from app.schemas.playground import TestOutcome

class MetricResult(BaseModel):
    metric_name: str
    value: Optional[float] = None
    unit: str
    numerator: Optional[int] = None
    denominator: Optional[int] = None
    excluded_case_counts: int
    calculation_definition: str
    dataset_version: str
    suite_version: str
    evaluation_run_id: Optional[str] = None

class EvaluationCaseResult(BaseModel):
    case_result_id: str
    run_id: str
    scenario_id: str
    expected_outcome: str
    observed_outcome: str
    test_status: str
    policy_decision: Optional[str] = None
    execution_status: Optional[str] = None
    handler_invoked: Optional[bool] = None
    handler_succeeded: Optional[bool] = None
    reason_code: Optional[str] = None
    latency_ms: Optional[float] = None
    error_category: Optional[str] = None
    safe_evidence_metadata: Optional[str] = None

class EvaluationRun(BaseModel):
    run_id: str
    suite_id: str
    suite_version: str
    dataset_version: str
    started_at: str
    completed_at: Optional[str] = None
    run_status: str
    total_case_count: int
    executed_case_count: int
    pass_count: int
    fail_count: int
    inconclusive_count: int
    error_count: int
    unsupported_count: int
    policy_version: str
    safe_metadata: Optional[str] = None

class EvaluationRunDetail(EvaluationRun):
    cases: List[EvaluationCaseResult]
    metrics: List[MetricResult]

class EvaluationSuite(BaseModel):
    suite_id: str
    name: str
    description: str
    version: str
    scenario_ids: List[str]
    is_supported: bool

class PaginatedEvaluationRuns(BaseModel):
    items: List[EvaluationRun]
    page: int
    page_size: int
    total: int
