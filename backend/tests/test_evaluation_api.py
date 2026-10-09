from fastapi.testclient import TestClient
from app.main import app
import pytest
import os
from app.core.database import init_db

TEST_DB_URL = "sqlite:///./data/test_evaluation.db"

@pytest.fixture(autouse=True)
def setup_teardown_db():
    if os.path.exists("./data/test_evaluation.db"):
        os.remove("./data/test_evaluation.db")
    init_db(TEST_DB_URL)
    import app.core.config
    app.core.config.settings.database_url = TEST_DB_URL
    yield
    if os.path.exists("./data/test_evaluation.db"):
        os.remove("./data/test_evaluation.db")

client = TestClient(app)

def test_list_suites():
    response = client.get("/api/evaluations/suites")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_run_unknown_suite():
    response = client.post("/api/evaluations/run", json={"suite_id": "nonexistent"})
    assert response.status_code == 404

def test_run_known_suite():
    response = client.post("/api/evaluations/run", json={"suite_id": "suite_a_policy"})
    assert response.status_code == 200
    res = response.json()
    assert res["run_status"] == "COMPLETED"
    assert res["pass_count"] > 0
    assert len(res["cases"]) > 0

def test_list_runs():
    response = client.get("/api/evaluations/runs")
    assert response.status_code == 200
    assert "items" in response.json()
