from fastapi.testclient import TestClient
from app.main import app
from app.schemas.policy import Decision

client = TestClient(app)

def test_api_evaluate_valid_request():
    # TEST 13 - API VALIDATION
    payload = {
        "agent_id": "demo",
        "tool_name": "search_demo_records",
        "action": "execute",
        "arguments": {"query": "test"}
    }
    response = client.post("/api/policies/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == Decision.ALLOW

def test_api_evaluate_invalid_request():
    # TEST 13 - API VALIDATION
    payload = {
        # missing agent_id
        "tool_name": "search_demo_records",
        "action": "execute"
    }
    response = client.post("/api/policies/evaluate", json=payload)
    assert response.status_code == 422 # Pydantic validation error

def test_api_policy_info():
    # TEST 14 - POLICY INFORMATION
    response = client.get("/api/policies")
    assert response.status_code == 200
    data = response.json()
    assert "search_demo_records" in data["registered_tools"]
    assert "delete_demo_record" in data["disabled_tools"]
    assert "export_demo_report" in data["approval_required_tools"]
