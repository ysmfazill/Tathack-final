from app.schemas.policy import ActionProposalRequest, Decision, RiskLevel
from app.services.policy_engine import evaluate_action

def test_allowed_low_risk_action():
    # TEST 1 - ALLOWED LOW-RISK ACTION
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test"}
    )
    res = evaluate_action(req)
    assert res.decision == Decision.ALLOW
    assert res.reason_code == "ACTION_ALLOWED"
    assert "ALLOW_VALIDATED_ACTIONS" in res.matched_rules

def test_unknown_tool():
    # TEST 2 - UNKNOWN TOOL
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="hacker_tool",
        action="execute",
        arguments={}
    )
    res = evaluate_action(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "TOOL_NOT_ALLOWLISTED"
    assert "DENY_UNKNOWN_TOOLS" in res.matched_rules

def test_explicitly_disabled_tool():
    # TEST 3 - EXPLICITLY DISABLED TOOL
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="delete_demo_record",
        action="execute",
        arguments={"record_id": "123"}
    )
    res = evaluate_action(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "TOOL_DISABLED"

def test_missing_argument():
    # TEST 4 - MISSING ARGUMENT
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="search_demo_records",
        action="execute",
        arguments={} # Missing query
    )
    res = evaluate_action(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "MISSING_ARGUMENT"

def test_invalid_argument_type():
    # TEST 5 - INVALID ARGUMENT TYPE
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": 123} # Should be str
    )
    res = evaluate_action(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "INVALID_ARGUMENT_TYPE"

def test_unexpected_argument():
    # TEST 6 - UNEXPECTED ARGUMENT
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test", "extra": "boom"}
    )
    res = evaluate_action(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "UNEXPECTED_ARGUMENT"

def test_high_risk_export():
    # TEST 7 - HIGH-RISK EXPORT
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "abc", "destination": "external"}
    )
    res = evaluate_action(req)
    assert res.decision == Decision.REQUIRE_APPROVAL
    assert res.reason_code == "APPROVAL_REQUIRED"

def test_deny_overrides_approval():
    # TEST 8 - DENY OVERRIDES APPROVAL
    # "delete_demo_record" is disabled AND requires approval. It should be DENIED.
    req = ActionProposalRequest(
        agent_id="test-agent",
        tool_name="delete_demo_record",
        action="execute",
        arguments={"record_id": "123"}
    )
    res = evaluate_action(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "TOOL_DISABLED"

def test_deterministic_decisions():
    # TEST 12 - DETERMINISTIC DECISIONS
    req = ActionProposalRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "a"}
    )
    res1 = evaluate_action(req)
    res2 = evaluate_action(req)
    assert res1.decision == res2.decision
    assert res1.reason_code == res2.reason_code
    assert res1.decision_id != res2.decision_id
