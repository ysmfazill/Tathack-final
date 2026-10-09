import pytest
import os
import uuid
from app.core.database import init_db, get_db_connection
from app.schemas.audit import AuditEvent, EventType
from app.services.audit_service import record_audit_event, get_audit_logs, get_audit_summary
from datetime import datetime, timezone
from app.schemas.execution import ExecutionRequest
from app.services.execution_gateway import execute_authorized_action

TEST_DB_URL = "sqlite:///./data/test_audit.db"

@pytest.fixture(autouse=True)
def setup_teardown_db():
    if os.path.exists("./data/test_audit.db"):
        os.remove("./data/test_audit.db")
    init_db(TEST_DB_URL)
    
    # Also override default for tests
    import app.core.config
    app.core.config.settings.database_url = TEST_DB_URL
    yield
    
    if os.path.exists("./data/test_audit.db"):
        os.remove("./data/test_audit.db")

def test_audit_persists():
    # TEST 1: A policy evaluation creates the expected persisted event
    event = AuditEvent(
        event_id="evt_123",
        timestamp_utc=datetime.now(timezone.utc).isoformat(),
        event_type=EventType.POLICY_EVALUATED,
        policy_decision="ALLOW"
    )
    record_audit_event(event)
    logs, count = get_audit_logs()
    assert count == 1
    assert logs[0].event_id == "evt_123"

def test_redaction():
    # TEST 17: Obvious secrets and sensitive argument values are not persisted.
    from app.services.audit_service import redact_sensitive_data
    args = {"query": "demo", "password": "supersecret"}
    redacted = redact_sensitive_data(args)
    assert "demo" in redacted
    assert "supersecret" not in redacted
    assert "[REDACTED]" in redacted

def test_gateway_emits_audit():
    # TEST 4: A successful simulated execution records success only after handler actually returns.
    # We execute a valid request, check if EXECUTION_SUCCEEDED is in DB.
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test"},
        idempotency_key=str(uuid.uuid4())
    )
    execute_authorized_action(req)
    logs, _ = get_audit_logs(page_size=10)
    event_types = [l.event_type for l in logs]
    assert EventType.EXECUTION_SUCCEEDED in event_types
    assert EventType.POLICY_EVALUATED in event_types
    assert EventType.EXECUTION_REQUESTED in event_types

def test_handler_failure_emits_failure():
    # TEST 5: A handler failure records a failure event and does not claim success.
    req = ExecutionRequest(
        agent_id="test",
        tool_name="error_demo_tool",
        action="execute",
        arguments={},
        idempotency_key=str(uuid.uuid4())
    )
    execute_authorized_action(req)
    logs, _ = get_audit_logs(page_size=10)
    event_types = [l.event_type for l in logs]
    assert EventType.EXECUTION_FAILED in event_types
    assert EventType.EXECUTION_SUCCEEDED not in event_types
