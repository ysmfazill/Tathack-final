from fastapi.testclient import TestClient
from app.main import app
import pytest
import os
from app.core.database import init_db

TEST_DB_URL = "sqlite:///./data/test_playground.db"

@pytest.fixture(autouse=True)
def setup_teardown_db():
    if os.path.exists("./data/test_playground.db"):
        os.remove("./data/test_playground.db")
    init_db(TEST_DB_URL)
    import app.core.config
    app.core.config.settings.database_url = TEST_DB_URL
    yield
    if os.path.exists("./data/test_playground.db"):
        os.remove("./data/test_playground.db")

client = TestClient(app)

def test_list_scenarios():
    response = client.get("/api/playground/scenarios")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_run_unknown_scenario():
    response = client.post("/api/playground/run", json={"scenario_id": "nonexistent"})
    assert response.status_code == 404

def test_run_known_scenario():
    response = client.post("/api/playground/run", json={"scenario_id": "scenario_2_unknown_tool"})
    assert response.status_code == 200
    res = response.json()
    assert res["test_outcome"] == "PASS"
    assert res["execution_status"] == "DENIED"

def test_list_runs():
    response = client.get("/api/playground/runs")
    assert response.status_code == 200
    assert "items" in response.json()
    assert "total" in response.json()

def test_summary():
    response = client.get("/api/playground/summary")
    assert response.status_code == 200
    assert "total_runs" in response.json()
