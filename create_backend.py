import os

files = {
    "backend/requirements.txt": """fastapi
uvicorn
pydantic
pydantic-settings
pytest
httpx
""",
    "backend/.env.example": """APP_NAME=PromptGuard AI API
APP_VERSION=0.1.0
APP_ENV=development
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000
""",
    "backend/.gitignore": """__pycache__/
*.pyc
.env
.venv/
""",
    "backend/app/__init__.py": "",
    "backend/app/api/__init__.py": "",
    "backend/app/api/routes/__init__.py": "",
    "backend/app/core/__init__.py": "",
    "backend/app/schemas/__init__.py": "",
    "backend/tests/__init__.py": "",
    "backend/app/core/config.py": """from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "PromptGuard AI API"
    app_version: str = "0.1.0"
    app_env: str = "development"
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]

    class Config:
        env_file = ".env"

settings = Settings()
""",
    "backend/app/schemas/common.py": """from pydantic import BaseModel
from typing import List

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

class OverviewResponse(BaseModel):
    application: str
    api_version: str
    mode: str
    backend_status: str
    implemented_capabilities: List[str]
    planned_capabilities: List[str]
""",
    "backend/app/api/routes/health.py": """from fastapi import APIRouter
from app.schemas.common import HealthResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version
    )
""",
    "backend/app/api/routes/overview.py": """from fastapi import APIRouter
from app.schemas.common import OverviewResponse
from app.core.config import settings

router = APIRouter()

@router.get("/overview", response_model=OverviewResponse)
async def get_overview():
    return OverviewResponse(
        application=settings.app_name,
        api_version=settings.app_version,
        mode=settings.app_env,
        backend_status="foundation_ready",
        implemented_capabilities=[
            "health_endpoint",
            "overview_endpoint"
        ],
        planned_capabilities=[
            "policy_engine",
            "secure_execution_gateway",
            "cross_agent_data_guard",
            "audit_logging",
            "evaluation_engine"
        ]
    )
""",
    "backend/app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, overview
from app.core.config import settings

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

app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(overview.router, prefix="/api", tags=["Overview"])
""",
    "backend/tests/test_health.py": """from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data
    assert "version" in data
""",
    "backend/tests/test_overview.py": """from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_overview_endpoint():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["backend_status"] == "foundation_ready"
    assert "policy_engine" in data["planned_capabilities"]
    assert "policy_engine" not in data["implemented_capabilities"]
""",
    "backend/README.md": """# PromptGuard AI Backend

This is the FastAPI backend foundation for PromptGuard AI.

## Prerequisites
- Python 3.11+
- Windows PowerShell (or another suitable terminal)

## Directory Structure
```
backend/
  app/
    api/
    core/
    schemas/
    main.py
  tests/
  requirements.txt
```

## Setup & Installation (Windows PowerShell)
```powershell
cd backend
py -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
```

## Environment Configuration
Copy `.env.example` to `.env` to configure your environment:
```powershell
cp .env.example .env
```

## Running the Backend
```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## API Documentation
Once running, Swagger UI is available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Running Tests
```powershell
python -m pytest -q
```

## Endpoints
- `GET /api/health` - Health check.
- `GET /api/overview` - Implementation status overview.

## Current Limitations
- Operates as a foundational structure without database integration.
- No real policy engine or execution gateway is active.
- Does not prevent prompt injection in this phase.

## Deferred Features (Phase 2+)
- Policy engine enforcement.
- Secure execution gateway.
- Cross-agent data guard.
- Audit logging database.
- Evaluation engine.
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Files created successfully.")
