from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, overview, policies, execution, data_guard, audit_logs, playground, evaluation, providers, settings as settings_routes, analysis
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
app.include_router(evaluation.router, prefix="/api/evaluations", tags=["Evaluation"])
app.include_router(providers.router, prefix="/api/providers", tags=["Providers"])
app.include_router(settings_routes.router, prefix="/api/settings", tags=["Settings"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
