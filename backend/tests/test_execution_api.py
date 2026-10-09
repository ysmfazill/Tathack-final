from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_preview_endpoint():
    payload = {
        "agent_id": "test",
        "tool_name": "search_demo_records",
        "action": "search",
        "arguments": {"query": "demo"},
        "idempotency_key": "123"
    }
    response = client.post("/api/execution/preview", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["policy_decision"] == "ALLOW"
    assert data["handler_invoked"] == False
