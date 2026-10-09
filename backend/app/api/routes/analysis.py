from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama_provider import generate_advisory

router = APIRouter()

class AnalysisRequest(BaseModel):
    action: str
    target: str
    prompt_context: str

class AnalysisResponse(BaseModel):
    advisory: str

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_security_event(req: AnalysisRequest):
    advisory = generate_advisory(req.action, req.target, req.prompt_context)
    return AnalysisResponse(advisory=advisory)
