import os
import sqlite3

files = {
    "backend/app/core/config.py": """from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "PromptGuard AI Backend"
    app_version: str = "0.1.0"
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    database_url: str = "sqlite:///./data/promptguard.db"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]

    model_config = {
        "env_file": ".env"
    }

settings = Settings()
""",
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
        conn.commit()
""",
    "backend/app/schemas/audit.py": """from pydantic import BaseModel
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
""",
    "backend/app/services/audit_service.py": """import uuid
from datetime import datetime, timezone
import json
from app.core.database import get_db_connection
from app.schemas.audit import AuditEvent, EventType
from typing import List, Tuple, Dict, Any

def redact_sensitive_data(arguments: Dict[str, Any]) -> str:
    safe = {}
    if not isinstance(arguments, dict):
        return "{}"
    for k, v in arguments.items():
        if k in ["query", "record_ids", "record_id", "destination_agent", "purpose", "action", "tool_name"]:
            safe[k] = str(v)
        else:
            safe[k] = "[REDACTED]"
    return json.dumps(safe)

def record_audit_event(event: AuditEvent, db_url: str = None):
    from app.core.config import settings
    url = db_url or settings.database_url
    
    try:
        with get_db_connection(url) as conn:
            conn.execute('''
                INSERT INTO audit_events (
                    event_id, timestamp_utc, event_type, actor_id, agent_id, request_id,
                    execution_id, transfer_id, tool_name, action, policy_decision,
                    execution_status, reason_code, policy_version, source_agent,
                    destination_agent, data_classification, handler_invoked, outcome, safe_metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                event.event_id, event.timestamp_utc, event.event_type.value, event.actor_id, event.agent_id,
                event.request_id, event.execution_id, event.transfer_id, event.tool_name, event.action,
                event.policy_decision, event.execution_status, event.reason_code, event.policy_version,
                event.source_agent, event.destination_agent, event.data_classification, event.handler_invoked,
                event.outcome, event.safe_metadata
            ))
            conn.commit()
    except Exception:
        pass

def get_audit_logs(page: int = 1, page_size: int = 20, event_type: str = None, tool_name: str = None, db_url: str = None) -> Tuple[List[AuditEvent], int]:
    from app.core.config import settings
    url = db_url or settings.database_url
    
    page_size = min(max(1, page_size), 100)
    page = max(1, page)
    offset = (page - 1) * page_size
    
    query = "SELECT * FROM audit_events WHERE 1=1"
    params = []
    
    if event_type:
        query += " AND event_type = ?"
        params.append(event_type)
    if tool_name:
        query += " AND tool_name = ?"
        params.append(tool_name)
        
    count_query = query.replace("SELECT *", "SELECT COUNT(*)")
    
    query += " ORDER BY timestamp_utc DESC LIMIT ? OFFSET ?"
    params.extend([page_size, offset])
    
    items = []
    total = 0
    with get_db_connection(url) as conn:
        total = conn.execute(count_query, params[:-2]).fetchone()[0]
        rows = conn.execute(query, params).fetchall()
        for row in rows:
            items.append(AuditEvent(**dict(row)))
            
    return items, total

def get_audit_summary(db_url: str = None) -> Dict[str, int]:
    from app.core.config import settings
    url = db_url or settings.database_url
    with get_db_connection(url) as conn:
        total = conn.execute("SELECT COUNT(*) FROM audit_events").fetchone()[0]
        policy_denials = conn.execute("SELECT COUNT(*) FROM audit_events WHERE event_type = ? AND policy_decision = ?", (EventType.POLICY_EVALUATED.value, "DENY")).fetchone()[0]
        execution_attempts = conn.execute("SELECT COUNT(*) FROM audit_events WHERE event_type = ?", (EventType.EXECUTION_REQUESTED.value,)).fetchone()[0]
        successful = conn.execute("SELECT COUNT(*) FROM audit_events WHERE event_type = ?", (EventType.EXECUTION_SUCCEEDED.value,)).fetchone()[0]
        failed = conn.execute("SELECT COUNT(*) FROM audit_events WHERE event_type = ?", (EventType.EXECUTION_FAILED.value,)).fetchone()[0]
        denied_transfers = conn.execute("SELECT COUNT(*) FROM audit_events WHERE event_type = ?", (EventType.TRANSFER_DENIED.value,)).fetchone()[0]
        
    return {
        "total_events": total,
        "policy_denials": policy_denials,
        "execution_attempts": execution_attempts,
        "successful_simulated_executions": successful,
        "failed_executions": failed,
        "denied_transfers": denied_transfers
    }
""",
    "backend/app/api/routes/audit_logs.py": """from fastapi import APIRouter, Query
from app.schemas.audit import PaginatedAuditResponse, AuditSummary
from app.services.audit_service import get_audit_logs, get_audit_summary

router = APIRouter()

@router.get("/", response_model=PaginatedAuditResponse)
async def fetch_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    event_type: str = None,
    tool_name: str = None
):
    items, total = get_audit_logs(page=page, page_size=page_size, event_type=event_type, tool_name=tool_name)
    return PaginatedAuditResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total
    )

@router.get("/summary", response_model=AuditSummary)
async def fetch_audit_summary():
    return AuditSummary(**get_audit_summary())
""",
    "backend/app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, overview, policies, execution, data_guard, audit_logs
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API foundation for PromptGuard AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(overview.router, prefix="/api", tags=["Overview"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])
app.include_router(execution.router, prefix="/api/execution", tags=["Execution"])
app.include_router(data_guard.router, prefix="/api/data-guard", tags=["Data Guard"])
app.include_router(audit_logs.router, prefix="/api/audit-logs", tags=["Audit Logs"])
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 5 files (part 1) created successfully.")
