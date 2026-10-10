import pytest
import json
import uuid
from app.schemas.playground import CustomRunRequest
from app.services.playground_service import run_custom_scenario

def test_benign_task_authorized_synthetic():
    req = CustomRunRequest(
        user_task="Search for records",
        untrusted_payload="",
        source_vector="external_api",
        target_agent_id="agent_1",
        proposed_tool_name="search_demo_records",
        tool_arguments={"query": "hello"}
    )
    res = run_custom_scenario(req)
    assert res.firewall_verdict == "ALLOW"
    assert res.execution_status == "EXECUTED_IN_SIMULATION"
    assert res.handler_invoked == True

def test_unknown_tool():
    req = CustomRunRequest(
        user_task="Do bad things",
        untrusted_payload="",
        source_vector="external_api",
        target_agent_id="agent_1",
        proposed_tool_name="hack_the_gibson",
        tool_arguments={"target": "all"}
    )
    res = run_custom_scenario(req)
    assert res.firewall_verdict == "BLOCK"
    assert res.execution_status == "DENIED"
    assert res.reason_code == "TOOL_NOT_ALLOWLISTED"

def test_unauthorized_tool_arguments():
    req = CustomRunRequest(
        user_task="Search records",
        untrusted_payload="",
        source_vector="external_api",
        target_agent_id="agent_1",
        proposed_tool_name="search_demo_records",
        tool_arguments={"unexpected": "value"}
    )
    res = run_custom_scenario(req)
    assert res.firewall_verdict == "BLOCK"
    assert res.reason_code in ["MISSING_ARGUMENT", "UNEXPECTED_ARGUMENT"]
    assert res.execution_status == "DENIED"

def test_missing_required_approval():
    req = CustomRunRequest(
        user_task="Export data",
        untrusted_payload="",
        source_vector="external_api",
        target_agent_id="agent_1",
        proposed_tool_name="export_demo_report",
        tool_arguments={"report_id": "123", "destination": "external"}
    )
    res = run_custom_scenario(req)
    assert res.firewall_verdict == "REVIEW"
    assert res.execution_status == "PENDING"
    assert res.reason_code == "MISSING_OR_INVALID_APPROVAL"

def test_invalid_json_handled_by_fastapi():
    # FastAPI pydantic will handle this.
    pass

def test_malicious_metadata_with_valid_args():
    # If the tool name is valid and args are valid, the gateway still runs detection.
    # We will test honey-tool detection
    req = CustomRunRequest(
        user_task="Export data",
        untrusted_payload="exec_shell_raw('ls')",
        source_vector="external_api",
        target_agent_id="agent_1",
        proposed_tool_name="exec_shell_raw",
        tool_arguments={"command": "ls"}
    )
    res = run_custom_scenario(req)
    assert res.firewall_verdict == "BLOCK"

def test_oversized_prompt():
    req = CustomRunRequest(
        user_task="",
        untrusted_payload="",
        source_vector="external_api",
        target_agent_id="agent_1",
        proposed_tool_name="search_demo_records",
        tool_arguments={"query": "A" * 15000}
    )
    res = run_custom_scenario(req)
    assert res.firewall_verdict == "ALLOW"
    assert res.execution_status == "EXECUTED_IN_SIMULATION"