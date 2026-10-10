import json
from datetime import datetime, timezone
from app.core.database import get_db_connection
from typing import Dict, Any
from app.schemas.settings import ProviderSettings, SecuritySettings, RiskThresholdSettings
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
    },
    "thresholds": {
        "low_risk_max": 0.30,
        "medium_risk_max": 0.70,
        "high_risk_max": 0.85
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
        elif category == "thresholds":
            RiskThresholdSettings(**current)
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

def record_config_history(category: str, new_config: Dict[str, Any], actor: str):
    import uuid
    current = get_settings(category)
    if current == new_config:
        return
    
    # Do not log raw secrets
    safe_new_config = {k: v for k, v in new_config.items() if "secret" not in k.lower() and "key" not in k.lower()}
    safe_old_config = {k: v for k, v in current.items() if "secret" not in k.lower() and "key" not in k.lower()}
    
    now = datetime.now(timezone.utc).isoformat()
    change_id = str(uuid.uuid4())
    
    with get_db_connection() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS config_history (
                change_id TEXT PRIMARY KEY,
                category TEXT,
                actor TEXT,
                timestamp TEXT,
                previous_config TEXT,
                new_config TEXT,
                operation_result TEXT
            )
        ''')
        conn.execute('''
            INSERT INTO config_history (change_id, category, actor, timestamp, previous_config, new_config, operation_result)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (change_id, category, actor, now, json.dumps(safe_old_config), json.dumps(safe_new_config), "SUCCESS"))
        conn.commit()

def get_config_history() -> list:
    try:
        with get_db_connection() as conn:
            rows = conn.execute("SELECT * FROM config_history ORDER BY timestamp DESC LIMIT 50").fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []
