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

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_security_event(req: AnalysisRequest):
    start = time.perf_counter_ns()
    advisory = generate_advisory(req.action, req.target, req.prompt_context)
    latency_ms = (time.perf_counter_ns() - start) / 1_000_000.0
    return AnalysisResponse(advisory=advisory, latency_ms=latency_ms)
