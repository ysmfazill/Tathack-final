import requests
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.services.settings_service import get_settings

def check_provider_status() -> Dict[str, Any]:
    provider_config = get_settings("provider")
    endpoint = provider_config.get("endpoint_url", "http://127.0.0.1:11434")
    model_name = provider_config.get("model_name", "llama3.2")
    
    status = {
        "provider": provider_config.get("provider_name", "ollama"),
        "status": "NOT_CONFIGURED",
        "model": model_name,
        "inference_verified": False,
        "last_checked_at": datetime.now(timezone.utc).isoformat(),
        "error_code": None
    }
    
    if not provider_config.get("enabled"):
        return status
        
    try:
        # First verify the service is up and model is available
        tags_response = requests.get(f"{endpoint}/api/tags", timeout=5)
        tags_response.raise_for_status()
        models = [m.get("name") for m in tags_response.json().get("models", [])]
        
        # Exact match or tagless match (if user specified llama3.2 but it is llama3.2:latest)
        has_model = False
        for m in models:
            if m == model_name or m.startswith(f"{model_name}:"):
                has_model = True
                status["model"] = m # update to the fully qualified name
                break
                
        if not has_model:
            status["status"] = "MODEL_UNAVAILABLE"
            status["error_code"] = f"Model '{model_name}' not found in Ollama instance"
            return status

        # Do a minimal inference check
        payload = {
            "model": status["model"],
            "prompt": "Hello",
            "stream": False
        }
        res = requests.post(f"{endpoint}/api/generate", json=payload, timeout=10)
        res.raise_for_status()
        
        status["status"] = "CONNECTED"
        status["inference_verified"] = True
        
    except requests.exceptions.ConnectionError:
        status["status"] = "SERVICE_UNAVAILABLE"
        status["error_code"] = f"Failed to connect to {endpoint}"
    except requests.exceptions.Timeout:
        status["status"] = "SERVICE_UNAVAILABLE"
        status["error_code"] = "Request timed out"
    except Exception as e:
        status["status"] = "INFERENCE_ERROR"
        status["error_code"] = str(e)
        
    return status

def generate_advisory(action: str, target: str, prompt_context: str) -> str:
    """Generate a security advisory from Ollama regarding an action."""
    status = check_provider_status()
    if status["status"] != "CONNECTED":
        return f"Deterministic Fallback: Provider not connected ({status['error_code']}). Policy engine will evaluate action directly."
        
    provider_config = get_settings("provider")
    endpoint = provider_config.get("endpoint_url", "http://127.0.0.1:11434")
    model_name = status["model"]
    
    prompt = f"Analyze the security risk of action '{action}' on target '{target}' with context: '{prompt_context}'. Keep it under 50 words."
    
    try:
        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": False
        }
        res = requests.post(f"{endpoint}/api/generate", json=payload, timeout=15)
        res.raise_for_status()
        return res.json().get("response", "No analysis provided.")
    except Exception as e:
        return f"Deterministic Fallback: Advisory unavailable ({e}). Policy engine will evaluate action directly."
