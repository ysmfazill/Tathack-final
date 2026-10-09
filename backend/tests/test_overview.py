from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_overview_endpoint():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["backend_status"] == "foundation_ready"
    assert "policy_engine" in data["planned_capabilities"]
    assert "policy_engine" not in data["implemented_capabilities"]
