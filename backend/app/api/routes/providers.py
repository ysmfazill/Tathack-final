from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.ollama_provider import check_provider_status

router = APIRouter()

class ProviderStatus(BaseModel):
    provider: str
    status: str
    model: str
    inference_verified: bool
    last_checked_at: str
    error_code: Optional[str] = None

@router.get("/status", response_model=ProviderStatus)
async def get_provider_status():
    status = check_provider_status()
    return ProviderStatus(**status)
