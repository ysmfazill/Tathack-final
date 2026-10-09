from fastapi import APIRouter, Body
from typing import Dict, Any
from app.services.settings_service import get_settings, update_settings

router = APIRouter()

@router.get("/{category}")
async def fetch_settings(category: str):
    return get_settings(category)

@router.put("/{category}")
async def save_settings(category: str, config: Dict[str, Any] = Body(...)):
    return update_settings(category, config)
