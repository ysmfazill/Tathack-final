from fastapi import APIRouter
from app.schemas.policy import ActionProposalRequest, PolicyDecisionResponse, PolicyInfoResponse
from app.services.policy_engine import evaluate_action, TOOL_REGISTRY, POLICY_VERSION

router = APIRouter()

@router.post("/evaluate", response_model=PolicyDecisionResponse)
async def evaluate_policy(request: ActionProposalRequest):
    # Route passes valid pydantic request object directly to deterministic engine
    return evaluate_action(request)

@router.get("/", response_model=PolicyInfoResponse)
async def get_policy_info():
    registered_tools = list(TOOL_REGISTRY.keys())
    disabled_tools = [name for name, t in TOOL_REGISTRY.items() if not t.is_enabled]
    approval_required = [name for name, t in TOOL_REGISTRY.items() if t.requires_approval]
    
    return PolicyInfoResponse(
        policy_version=POLICY_VERSION,
        registered_tools=registered_tools,
        disabled_tools=disabled_tools,
        approval_required_tools=approval_required,
        summary="Deterministic policy engine active. Model proposals are strictly validated against backend registries."
    )
