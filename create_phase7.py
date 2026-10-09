import os
import sqlite3

files = {
    "backend/app/core/database.py": """import sqlite3
import os
import contextlib
from app.core.config import settings

@contextlib.contextmanager
def get_db_connection(db_url: str = settings.database_url):
    db_path = db_url.replace("sqlite:///", "")
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db(db_url: str = settings.database_url):
    with get_db_connection(db_url) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS audit_events (
                event_id TEXT PRIMARY KEY,
                timestamp_utc TEXT NOT NULL,
                event_type TEXT NOT NULL,
                actor_id TEXT,
                agent_id TEXT,
                request_id TEXT,
                execution_id TEXT,
                transfer_id TEXT,
                tool_name TEXT,
                action TEXT,
                policy_decision TEXT,
                execution_status TEXT,
                reason_code TEXT,
                policy_version TEXT,
                source_agent TEXT,
                destination_agent TEXT,
                data_classification TEXT,
                handler_invoked BOOLEAN,
                outcome TEXT,
                safe_metadata TEXT
            )
        ''')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_audit_type ON audit_events(event_type)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events(timestamp_utc)')
        
        conn.execute('''
            CREATE TABLE IF NOT EXISTS playground_runs (
                run_id TEXT PRIMARY KEY,
                scenario_id TEXT NOT NULL,
                started_at TEXT NOT NULL,
                test_outcome TEXT,
                policy_decision TEXT,
                execution_status TEXT,
                handler_invoked BOOLEAN,
                handler_succeeded BOOLEAN,
                reason_code TEXT,
                safe_metadata TEXT
            )
        ''')

        conn.execute('''
            CREATE TABLE IF NOT EXISTS evaluation_runs (
                run_id TEXT PRIMARY KEY,
                suite_id TEXT NOT NULL,
                suite_version TEXT,
                dataset_version TEXT,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                run_status TEXT,
                total_case_count INTEGER,
                executed_case_count INTEGER,
                pass_count INTEGER,
                fail_count INTEGER,
                inconclusive_count INTEGER,
                error_count INTEGER,
                unsupported_count INTEGER,
                policy_version TEXT,
                safe_metadata TEXT
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS evaluation_case_results (
                case_result_id TEXT PRIMARY KEY,
                run_id TEXT NOT NULL,
                scenario_id TEXT NOT NULL,
                expected_outcome TEXT,
                observed_outcome TEXT,
                test_status TEXT,
                policy_decision TEXT,
                execution_status TEXT,
                handler_invoked BOOLEAN,
                handler_succeeded BOOLEAN,
                reason_code TEXT,
                latency_ms REAL,
                error_category TEXT,
                safe_evidence_metadata TEXT,
                FOREIGN KEY(run_id) REFERENCES evaluation_runs(run_id)
            )
        ''')
        conn.commit()
""",
    "backend/app/schemas/evaluation.py": """from pydantic import BaseModel
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
""",
    "backend/app/services/evaluation_datasets.py": """from app.schemas.evaluation import EvaluationSuite
from app.services.attack_scenarios import SCENARIO_REGISTRY
from typing import List

EVALUATION_SUITES = {
    "suite_a_policy": EvaluationSuite(
        suite_id="suite_a_policy",
        name="SUITE A - POLICY ENFORCEMENT",
        description="Core policy rules verification.",
        version="1.0.0",
        scenario_ids=[
            "scenario_1_authorized_search",
            "scenario_2_unknown_tool",
            "scenario_4_invalid_args",
            "scenario_6_explicitly_prohibited",
            "scenario_5_unapproved_export",
            "scenario_3_forged_auth"
        ],
        is_supported=True
    ),
    "suite_b_data_protection": EvaluationSuite(
        suite_id="suite_b_data_protection",
        name="SUITE B - CROSS-AGENT DATA PROTECTION",
        description="Verifies information flow controls.",
        version="1.0.0",
        scenario_ids=[
            "scenario_10_benign_transfer",
            "scenario_7_restricted_transfer",
            "scenario_8_classification_spoofing",
            "scenario_9_unknown_destination"
        ],
        is_supported=True
    ),
    "suite_e_adversarial": EvaluationSuite(
        suite_id="suite_e_adversarial",
        name="SUITE E - ADVERSARIAL SCENARIOS",
        description="Prompt injection tests.",
        version="1.0.0",
        scenario_ids=[
            "scenario_11_unsupported_llm"
        ],
        is_supported=True
    )
}

def get_suites() -> List[EvaluationSuite]:
    return list(EVALUATION_SUITES.values())

def get_suite(suite_id: str) -> EvaluationSuite:
    return EVALUATION_SUITES.get(suite_id)
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 7 part 1 created.")
