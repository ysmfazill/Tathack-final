import json
from datetime import datetime, timezone
from app.core.database import get_db_connection
from typing import Dict, Any
from app.schemas.settings import ProviderSettings, SecuritySettings
from pydantic import ValidationError
from fastapi import HTTPException

DEFAULT_SETTINGS = {
    "provider": {
        "provider_name": "ollama",
        "endpoint_url": "http://127.0.0.1:11434",
        "model_name": "llama3.2",
        "enabled": True
    },
    "security": {
        "enforce_mandatory_deny": True,
        "require_approval_for_destructive": True,
        "log_level": "INFO"
    }
}

def get_settings(category: str) -> Dict[str, Any]:
    with get_db_connection() as conn:
        row = conn.execute("SELECT config_json FROM application_settings WHERE category = ?", (category,)).fetchone()
        if row:
            return json.loads(row["config_json"])
    return DEFAULT_SETTINGS.get(category, {})

def update_settings(category: str, config: Dict[str, Any]) -> Dict[str, Any]:
    current = get_settings(category)
    current.update(config)
    
    # Validate the complete settings
    try:
        if category == "provider":
            ProviderSettings(**current)
        elif category == "security":
            SecuritySettings(**current)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown settings category: {category}")
    except ValidationError as e:
        # Return a structured validation error
        raise HTTPException(status_code=422, detail=e.errors())
    
    now = datetime.now(timezone.utc).isoformat()
    
    with get_db_connection() as conn:
        conn.execute('''
            INSERT INTO application_settings (category, config_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(category) DO UPDATE SET config_json=excluded.config_json, updated_at=excluded.updated_at
        ''', (category, json.dumps(current), now))
        conn.commit()
    return current
