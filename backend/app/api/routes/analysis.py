from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama_provider import generate_advisory

router = APIRouter()

class AnalysisRequest(BaseModel):
    action: str
    target: str
    prompt_context: str

import time

class AnalysisResponse(BaseModel):
    advisory: str
    latency_ms: float = 0.0
    advisory_risk_score: float = 0.0
    risk_tier: str = "UNKNOWN"

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_security_event(req: AnalysisRequest):
    start = time.perf_counter_ns()
    advisory = generate_advisory(req.action, req.target, req.prompt_context)
    latency_ms = (time.perf_counter_ns() - start) / 1_000_000.0
    
    # Calculate an advisory heuristic score (not used for gateway authorization)
    score = 0.0
    if req.action.lower() in ['system_execute', 'network_request', 'write_file']:
        score += 0.4
    if "sudo" in req.prompt_context.lower() or "password" in req.prompt_context.lower() or "secret" in req.prompt_context.lower():
        score += 0.4
    score = min(score, 1.0)
    
    from app.services.settings_service import get_settings
    thresholds = get_settings("thresholds")
    low = thresholds.get("low_risk_max", 0.30)
    med = thresholds.get("medium_risk_max", 0.70)
    high = thresholds.get("high_risk_max", 0.85)
    
    tier = "CRITICAL"
    if score <= low:
        tier = "LOW"
    elif score <= med:
        tier = "MEDIUM"
    elif score <= high:
        tier = "HIGH"
        
    return AnalysisResponse(advisory=advisory, latency_ms=latency_ms, advisory_risk_score=score, risk_tier=tier)
