from fastapi import APIRouter, Body
from typing import Dict, Any
from app.services.settings_service import get_settings, update_settings

router = APIRouter()

@router.get("/audit-storage")
async def fetch_audit_storage_metrics():
    from app.services.audit_service import get_storage_metrics
    return get_storage_metrics()

@router.get("/components/status")
async def fetch_components_status():
    from app.services.component_registry import get_component_registry
    return get_component_registry()

@router.get("/{category}")
async def fetch_settings(category: str):
    return get_settings(category)

@router.put("/{category}")
async def save_settings(category: str, config: Dict[str, Any] = Body(...)):
    # Record history before updating
    from app.services.settings_service import record_config_history
    record_config_history(category, config, "system")
    return update_settings(category, config)

@router.get("/history/list")
async def fetch_history():
    from app.services.settings_service import get_config_history
    return get_config_history()
