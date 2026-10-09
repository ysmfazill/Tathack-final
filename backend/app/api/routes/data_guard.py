from fastapi import APIRouter
from app.schemas.data_guard import TransferRequest, TransferDecisionResponse
from app.services.cross_agent_guard import evaluate_transfer

router = APIRouter()

@router.post("/evaluate", response_model=TransferDecisionResponse)
async def evaluate_data_transfer(request: TransferRequest):
    return evaluate_transfer(request)
