from typing import List, Dict, Any
from app.schemas.execution import ExecutionRequest
from app.services.policy_engine import evaluate_action

def analyze_counterfactual(request: ExecutionRequest) -> Dict[str, Any]:
    original_decision = evaluate_action(request)
    
    # Generate alternative requests for counterfactual analysis
    alternatives = []
    
    # Alternative 1: What if it were a high privilege tool instead of what it is?
    # (If the original is already high privilege, maybe test low privilege)
    alt1_req = ExecutionRequest(
        agent_id=request.agent_id,
        tool_name="system_execute" if request.tool_name != "system_execute" else "get_weather",
        action=request.action,
        arguments=request.arguments,
        idempotency_key=request.idempotency_key + "_alt1"
    )
    
    try:
        alt1_decision = evaluate_action(alt1_req)
        alternatives.append({
            "scenario": f"Changed tool to {alt1_req.tool_name}",
            "decision": alt1_decision.decision.value,
            "reason": alt1_decision.reason_code
        })
    except Exception:
        pass
        
    return {
        "original_decision": original_decision.decision.value,
        "original_reason": original_decision.reason_code,
        "alternatives_evaluated": len(alternatives),
        "divergences": alternatives
    }
