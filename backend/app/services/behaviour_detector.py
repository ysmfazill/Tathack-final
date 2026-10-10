import time
from collections import deque
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from app.schemas.execution import ExecutionRequest
from app.services.tool_registry import TOOL_REGISTRY

# Bounded state for lightweight tracking
AGENT_STATE_SIZE = 1000
agent_history: Dict[str, deque] = {} 

class BehaviourSignal(BaseModel):
    signal_type: str
    severity: str
    description: str

class DetectionResult(BaseModel):
    is_anomaly: bool
    risk_score: float  # 0.0 to 1.0
    signals: List[BehaviourSignal]
    latency_ms: float

def _extract_indicators(request: ExecutionRequest) -> tuple[List[BehaviourSignal], float]:
    signals = []
    risk = 0.0
    
    agent_id = request.agent_id
    tool = request.tool_name
    
    # Check 1: Unknown tool attempts
    if tool not in TOOL_REGISTRY:
        signals.append(BehaviourSignal(
            signal_type="UNKNOWN_TOOL",
            severity="HIGH",
            description=f"Attempted to use unknown tool: {tool}"
        ))
        risk += 0.8

    # Check 2: Sensitive-data transfer indicators
    if tool == "transfer_demo_records" or tool == "export_demo_report":
        dest = request.arguments.get("destination_agent", "") or request.arguments.get("destination", "")
        if dest in ["external", "unknown_agent", "export_agent"]:
            signals.append(BehaviourSignal(
                signal_type="SUSPICIOUS_TRANSFER_DESTINATION",
                severity="HIGH",
                description=f"Data transfer to high-risk destination: {dest}"
            ))
            risk += 0.6

    # Update history and Check 3: Repeated actions / unexpected sequences
    if agent_id not in agent_history:
        if len(agent_history) >= AGENT_STATE_SIZE:
            # Simple eviction
            agent_history.pop(next(iter(agent_history)))
        agent_history[agent_id] = deque(maxlen=20)
        
    history = agent_history[agent_id]
    
    # If the last 3 actions were all denied or problematic tools, flag it.
    # For now, just look for bursts of the same tool
    if len(history) >= 4:
        recent_tools = [h["tool"] for h in list(history)[-4:]]
        if all(t == tool for t in recent_tools) and risk > 0:
            signals.append(BehaviourSignal(
                signal_type="REPEATED_HIGH_RISK_ACTION",
                severity="CRITICAL",
                description="Agent is repeatedly trying a risky or unknown tool."
            ))
            risk += 0.5
            
    history.append({"tool": tool, "timestamp": time.perf_counter_ns()})
    
    return signals, min(1.0, risk)

def detect_behaviour(request: ExecutionRequest) -> DetectionResult:
    """
    Sub-5ms deterministic agent behaviour detector.
    Advisory only. Does not authorize or deny actions.
    """
    start_time = time.perf_counter_ns()
    try:
        signals, risk = _extract_indicators(request)
        is_anomaly = risk >= 0.7
        
        elapsed_ns = time.perf_counter_ns() - start_time
        return DetectionResult(
            is_anomaly=is_anomaly,
            risk_score=risk,
            signals=signals,
            latency_ms=elapsed_ns / 1_000_000.0
        )
    except Exception as e:
        # Failure handling: Must not bypass authorization
        # Return a safe fallback indicating detector failure
        elapsed_ns = time.perf_counter_ns() - start_time
        return DetectionResult(
            is_anomaly=False,
            risk_score=0.0,
            signals=[BehaviourSignal(
                signal_type="DETECTOR_ERROR",
                severity="LOW",
                description=f"Detection failed: {str(e)}"
            )],
            latency_ms=elapsed_ns / 1_000_000.0
        )
