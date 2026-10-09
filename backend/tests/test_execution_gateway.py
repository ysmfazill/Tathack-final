from app.schemas.execution import ExecutionRequest, ExecutionStatus
from app.schemas.policy import Decision
from app.services.execution_gateway import execute_authorized_action, idempotency_store, approval_store
from app.services.tool_registry import handler_invocation_counts
import uuid
import json
import hashlib

def get_key():
    return str(uuid.uuid4())

def test_authorized_simulation():
    key = get_key()
    count_before = handler_invocation_counts["search_demo_records"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "hello"},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.EXECUTED_IN_SIMULATION
    assert res.handler_invoked == True
    assert handler_invocation_counts["search_demo_records"] == count_before + 1

def test_unknown_tool():
    key = get_key()
    req = ExecutionRequest(
        agent_id="test",
        tool_name="hacker_tool",
        action="execute",
        arguments={},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert res.reason_code == "TOOL_NOT_ALLOWLISTED"

def test_disabled_tool():
    key = get_key()
    count_before = handler_invocation_counts["delete_demo_record"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="delete_demo_record",
        action="execute",
        arguments={"record_id": "1"},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert res.reason_code == "TOOL_DISABLED"
    assert handler_invocation_counts["delete_demo_record"] == count_before

def test_invalid_arguments():
    key = get_key()
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert res.reason_code == "MISSING_ARGUMENT"

def test_approval_required():
    key = get_key()
    count_before = handler_invocation_counts["export_demo_report"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "abc", "destination": "external"},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.PENDING
    assert res.handler_invoked == False
    assert handler_invocation_counts["export_demo_report"] == count_before

def test_valid_approval():
    key = get_key()
    count_before = handler_invocation_counts["export_demo_report"]
    approval_store["test_token_1"] = {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
    req = ExecutionRequest(
        agent_id="test",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "abc", "destination": "external"},
        idempotency_key=key,
        approval_token="test_token_1"
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.EXECUTED_IN_SIMULATION
    assert res.handler_invoked == True
    assert handler_invocation_counts["export_demo_report"] == count_before + 1

def test_invalid_approval():
    key = get_key()
    approval_store["test_token_2"] = {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
    req = ExecutionRequest(
        agent_id="test",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "different", "destination": "external"}, # Tampered arg
        idempotency_key=key,
        approval_token="test_token_2"
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False

def test_idempotency():
    key = get_key()
    count_before = handler_invocation_counts["search_demo_records"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test_idem"},
        idempotency_key=key
    )
    res1 = execute_authorized_action(req)
    res2 = execute_authorized_action(req)
    assert res1.execution_id == res2.execution_id
    assert handler_invocation_counts["search_demo_records"] == count_before + 1

def test_idempotency_mismatch():
    key = get_key()
    req1 = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "1"},
        idempotency_key=key
    )
    req2 = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "2"},
        idempotency_key=key
    )
    execute_authorized_action(req1)
    res2 = execute_authorized_action(req2)
    assert res2.status == ExecutionStatus.FAILED
    assert res2.reason_code == "IDEMPOTENCY_PAYLOAD_MISMATCH"

def test_handler_failure():
    key = get_key()
    req = ExecutionRequest(
        agent_id="test",
        tool_name="error_demo_tool",
        action="execute",
        arguments={},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.FAILED
    assert res.handler_invoked == True
    assert res.reason_code == "HANDLER_EXCEPTION"

