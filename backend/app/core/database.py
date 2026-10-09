import sqlite3
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
