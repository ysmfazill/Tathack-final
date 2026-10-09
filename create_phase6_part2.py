import os

files = {
    "backend/tests/test_playground_api.py": """from fastapi.testclient import TestClient
from app.main import app

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
""",
    "backend/app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, overview, policies, execution, data_guard, audit_logs, playground
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API foundation for PromptGuard AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(overview.router, prefix="/api", tags=["Overview"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])
app.include_router(execution.router, prefix="/api/execution", tags=["Execution"])
app.include_router(data_guard.router, prefix="/api/data-guard", tags=["Data Guard"])
app.include_router(audit_logs.router, prefix="/api/audit-logs", tags=["Audit Logs"])
app.include_router(playground.router, prefix="/api/playground", tags=["Playground"])
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 6 tests & main.py created.")
