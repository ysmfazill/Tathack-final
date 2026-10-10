import uuid
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
    except Exception as e:
        with open('error_log.txt', 'a') as f:
            f.write(f"Error saving audit event: {e}\n")

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

def get_storage_metrics() -> dict:
    import os
    from app.core.config import settings
    db_path = settings.database_url.replace('sqlite:///', '')
    
    metrics = {
        'storage_engine': 'SQLite 3',
        'wal_mode': False,
        'connection_status': 'UNKNOWN',
        'lock_state': 'UNKNOWN',
        'database_path': db_path,
        'file_size_kb': 0
    }
    
    try:
        from app.core.database import get_db_connection
        with get_db_connection(settings.database_url) as conn:
            conn.execute('SELECT 1').fetchone()
            metrics['connection_status'] = 'HEALTHY (Read/Write)'
            
            journal = conn.execute('PRAGMA journal_mode').fetchone()[0]
            if journal.lower() == 'wal':
                metrics['wal_mode'] = True
                metrics['storage_engine'] = 'SQLite 3 (WAL Mode)'
            else:
                metrics['storage_engine'] = f'SQLite 3 ({journal.upper()} Mode)'
                
            metrics['lock_state'] = 'UNLOCKED'
    except Exception as e:
        metrics['connection_status'] = f'ERROR: {str(e)}'
        
    try:
        if os.path.exists(db_path):
            metrics['file_size_kb'] = round(os.path.getsize(db_path) / 1024, 2)
    except Exception:
        pass
        
    return metrics

