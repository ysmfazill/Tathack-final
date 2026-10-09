from fastapi import APIRouter
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
