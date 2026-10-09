import requests
import json
import time
import uuid

BASE_URL = "http://127.0.0.1:8080/api"

def print_result(scenario, response):
    print(f"--- SCENARIO: {scenario} ---")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print()

def get_key():
    return str(uuid.uuid4())

# A. Unknown tool
res_a = requests.post(f"{BASE_URL}/execution/execute", json={
    "agent_id": "test_agent",
    "tool_name": "unknown_tool",
    "action": "test",
    "arguments": {},
    "idempotency_key": get_key()
})
print_result("A. Unknown tool", res_a)

# B. Disabled tool
res_b = requests.post(f"{BASE_URL}/execution/execute", json={
    "agent_id": "test_agent",
    "tool_name": "delete_demo_record",
    "action": "test",
    "arguments": {"record_id": "123"},
    "idempotency_key": get_key()
})
print_result("B. Disabled tool", res_b)

# C. Malformed arguments
res_c = requests.post(f"{BASE_URL}/execution/execute", json={
    "agent_id": "test_agent",
    "tool_name": "export_demo_report",
    "action": "test",
    "arguments": {"report_id": "test"},
    "idempotency_key": get_key()
})
print_result("C. Malformed arguments", res_c)

# D. Approval-required action without valid approval
res_d = requests.post(f"{BASE_URL}/execution/execute", json={
    "agent_id": "test_agent",
    "tool_name": "export_demo_report",
    "action": "test",
    "arguments": {"report_id": "test", "destination": "ext"},
    "idempotency_key": get_key()
})
print_result("D. Approval without valid token", res_d)

# E. Valid approved action
# The token "valid_token_123" requires "destination": "external", "report_id": "abc"
# But it is marked as used after first time! So we'll have to rely on seeing if it handles validation.
# We'll test with a new valid approval if possible, but the backend memory only has "valid_token_123" which is already used.
# Let's skip E for a moment or restart the backend to get the token back. 
# We'll just run it.
res_e = requests.post(f"{BASE_URL}/execution/execute", json={
    "agent_id": "test_agent",
    "tool_name": "export_demo_report",
    "action": "test",
    "arguments": {"destination": "external", "report_id": "abc"},
    "approval_token": "valid_token_123",
    "idempotency_key": get_key()
})
print_result("E. Valid approved action (may fail if token used)", res_e)

# F. Valid synthetic action
res_f = requests.post(f"{BASE_URL}/execution/execute", json={
    "agent_id": "test_agent",
    "tool_name": "search_demo_records",
    "action": "test",
    "arguments": {"query": "test query"},
    "idempotency_key": get_key()
})
print_result("F. Valid synthetic action", res_f)

# G. Cross-agent transfer
res_g = requests.post(f"{BASE_URL}/data-guard/evaluate", json={
    "source_agent": "hr_agent",
    "destination_agent": "report_agent",
    "record_ids": ["record_public_001"],
    "purpose": "test"
})
print_result("G. Cross-agent transfer valid", res_g)

# H. Cross-agent transfer to unauthorized
res_h = requests.post(f"{BASE_URL}/data-guard/evaluate", json={
    "source_agent": "hr_agent",
    "destination_agent": "export_agent",
    "record_ids": ["record_confidential_001"],
    "purpose": "test"
})
print_result("H. Cross-agent transfer invalid", res_h)

# Check Audit Logs
res_audit = requests.get(f"{BASE_URL}/audit-logs")
print("--- RECENT AUDIT LOGS ---")
print(json.dumps(res_audit.json().get("items", [])[:10], indent=2))
