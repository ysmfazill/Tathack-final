import pytest
from app.schemas.execution import ExecutionRequest
from app.services.behaviour_detector import detect_behaviour

def test_safe_action():
    req = ExecutionRequest(
        agent_id="test_agent_1",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test"},
        idempotency_key="test_key_1"
    )
    result = detect_behaviour(req)
    assert result.is_anomaly == False
    assert result.risk_score == 0.0
    assert len(result.signals) == 0

def test_unknown_tool():
    req = ExecutionRequest(
        agent_id="test_agent_2",
        tool_name="unknown_malicious_tool",
        action="execute",
        arguments={"data": "test"},
        idempotency_key="test_key_2"
    )
    result = detect_behaviour(req)
    assert result.is_anomaly == True
    assert result.risk_score >= 0.7
    assert len(result.signals) >= 1
    assert any(s.signal_type == "UNKNOWN_TOOL" for s in result.signals)

def test_suspicious_transfer():
    req = ExecutionRequest(
        agent_id="test_agent_3",
        tool_name="transfer_demo_records",
        action="execute",
        arguments={"destination_agent": "external", "record_ids": [1]},
        idempotency_key="test_key_3"
    )
    result = detect_behaviour(req)
    assert result.is_anomaly == False  # Actually risk is 0.6, so < 0.7
    assert result.risk_score == 0.6
    assert any(s.signal_type == "SUSPICIOUS_TRANSFER_DESTINATION" for s in result.signals)

def test_repeated_high_risk_actions():
    agent_id = "test_agent_4"
    for i in range(5):
        req = ExecutionRequest(
            agent_id=agent_id,
            tool_name="unknown_malicious_tool",
            action="execute",
            arguments={"data": "test"},
            idempotency_key=f"test_key_4_{i}"
        )
        result = detect_behaviour(req)
        
    assert result.is_anomaly == True
    assert result.risk_score == 1.0 # 0.8 (unknown tool) + 0.5 (repeated) = 1.3 -> capped at 1.0
    assert any(s.signal_type == "REPEATED_HIGH_RISK_ACTION" for s in result.signals)

def test_empty_malformed_input():
    req = ExecutionRequest(
        agent_id="test_agent_5",
        tool_name="",
        action="execute",
        arguments={},
        idempotency_key="test_key_5"
    )
    result = detect_behaviour(req)
    assert result.is_anomaly == True # empty tool is unknown
    assert result.risk_score >= 0.7
    assert any(s.signal_type == "UNKNOWN_TOOL" for s in result.signals)

def test_oversized_input():
    # Large arguments string
    req = ExecutionRequest(
        agent_id="test_agent_6",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "A" * 100000},
        idempotency_key="test_key_6"
    )
    result = detect_behaviour(req)
    assert result.is_anomaly == False
