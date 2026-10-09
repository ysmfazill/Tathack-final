from fastapi import APIRouter
from app.schemas.execution import ExecutionRequest, ExecutionResponse, PreviewResponse
from app.services.execution_gateway import execute_authorized_action, preview_action

router = APIRouter()

@router.post("/execute", response_model=ExecutionResponse)
async def execute_action(request: ExecutionRequest):
    return execute_authorized_action(request)

@router.post("/preview", response_model=PreviewResponse)
async def preview(request: ExecutionRequest):
    return preview_action(request)
