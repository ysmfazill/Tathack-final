import os

files = {
    "backend/app/schemas/execution.py": """from pydantic import BaseModel
from typing import Dict, Any, Optional
from enum import Enum
from app.schemas.policy import Decision, ActionProposalRequest

class ExecutionStatus(str, Enum):
    PROPOSED = "PROPOSED"
    DENIED = "DENIED"
    NOT_EXECUTED = "NOT_EXECUTED"
    EXECUTED_IN_SIMULATION = "EXECUTED_IN_SIMULATION"
    FAILED = "FAILED"
    PENDING = "PENDING"
    UNKNOWN = "UNKNOWN"

class ExecutionRequest(ActionProposalRequest):
    idempotency_key: str
    approval_token: Optional[str] = None

class ExecutionResponse(BaseModel):
    execution_id: str
    status: ExecutionStatus
    tool_name: str
    policy_decision: Decision
    handler_invoked: bool
    result: Optional[Dict[str, Any]] = None
    reason_code: Optional[str] = None
    policy_version: str
    evaluated_at: str

class PreviewResponse(BaseModel):
    tool_name: str
    arguments_summary: Dict[str, Any]
    policy_decision: Decision
    risk_level: str
    approval_requirement: bool
    explanation: str
    handler_invoked: bool = False
""",
    "backend/app/services/tool_registry.py": """from app.schemas.policy import ToolDefinition, RiskLevel
from typing import Dict, Any, Callable

handler_invocation_counts = {
    "search_demo_records": 0,
    "summarize_demo_record": 0,
    "export_demo_report": 0,
    "delete_demo_record": 0
}

def handler_search(args: Dict[str, Any]) -> Dict[str, Any]:
    handler_invocation_counts["search_demo_records"] += 1
    return {"records": [{"id": 1, "match": args.get("query")}]}

def handler_summarize(args: Dict[str, Any]) -> Dict[str, Any]:
    handler_invocation_counts["summarize_demo_record"] += 1
    return {"summary": f"Simulated summary for {args.get('record_id')}"}

def handler_export(args: Dict[str, Any]) -> Dict[str, Any]:
    handler_invocation_counts["export_demo_report"] += 1
    return {"status": "exported_simulated", "destination": args.get("destination")}

def handler_delete(args: Dict[str, Any]) -> Dict[str, Any]:
    handler_invocation_counts["delete_demo_record"] += 1
    return {"status": "deleted_simulated"}

def handler_error(args: Dict[str, Any]) -> Dict[str, Any]:
    raise ValueError("Simulated handler exception")

TOOL_HANDLERS: Dict[str, Callable] = {
    "search_demo_records": handler_search,
    "summarize_demo_record": handler_summarize,
    "export_demo_report": handler_export,
    "delete_demo_record": handler_delete,
    "error_demo_tool": handler_error
}

TOOL_REGISTRY: Dict[str, ToolDefinition] = {
    "search_demo_records": ToolDefinition(
        name="search_demo_records",
        description="Search synthetic records.",
        is_enabled=True,
        requires_approval=False,
        risk_level=RiskLevel.LOW,
        expected_arguments={"query": str}
    ),
    "summarize_demo_record": ToolDefinition(
        name="summarize_demo_record",
        description="Summarize a synthetic record.",
        is_enabled=True,
        requires_approval=False,
        risk_level=RiskLevel.LOW,
        expected_arguments={"record_id": str}
    ),
    "export_demo_report": ToolDefinition(
        name="export_demo_report",
        description="Simulate exporting a synthetic report.",
        is_enabled=True,
        requires_approval=True,
        risk_level=RiskLevel.HIGH,
        expected_arguments={"report_id": str, "destination": str}
    ),
    "delete_demo_record": ToolDefinition(
        name="delete_demo_record",
        description="Delete a synthetic record.",
        is_enabled=False,
        requires_approval=True,
        risk_level=RiskLevel.CRITICAL,
        expected_arguments={"record_id": str}
    ),
    "error_demo_tool": ToolDefinition(
        name="error_demo_tool",
        description="Throws an error.",
        is_enabled=True,
        requires_approval=False,
        risk_level=RiskLevel.LOW,
        expected_arguments={}
    )
}
""",
    "backend/app/services/policy_engine.py": """from typing import Dict, Any
from app.schemas.policy import (
    ActionProposalRequest,
    PolicyDecisionResponse,
    Decision,
    RiskLevel
)
from app.services.tool_registry import TOOL_REGISTRY
import uuid
from datetime import datetime, timezone

POLICY_VERSION = "1.0.0"

def evaluate_action(request: ActionProposalRequest) -> PolicyDecisionResponse:
    decision_id = str(uuid.uuid4())
    evaluated_at = datetime.now(timezone.utc).isoformat()
    
    def _make_response(decision: Decision, reason: str, explanation: str, risk: RiskLevel, rules: list) -> PolicyDecisionResponse:
        return PolicyDecisionResponse(
            decision_id=decision_id,
            decision=decision,
            reason_code=reason,
            explanation=explanation,
            tool_name=request.tool_name,
            action=request.action,
            risk_level=risk,
            matched_rules=rules,
            policy_version=POLICY_VERSION,
            evaluated_at=evaluated_at
        )

    if request.tool_name not in TOOL_REGISTRY:
        return _make_response(Decision.DENY, "TOOL_NOT_ALLOWLISTED", "The requested tool is not registered in the allowlist.", RiskLevel.CRITICAL, ["DENY_UNKNOWN_TOOLS"])

    tool = TOOL_REGISTRY[request.tool_name]

    if not tool.is_enabled:
        return _make_response(Decision.DENY, "TOOL_DISABLED", "The requested tool is explicitly disabled by the active policy.", tool.risk_level, ["DENY_DISABLED_TOOLS"])

    expected_args = tool.expected_arguments
    provided_args = request.arguments
    
    for arg_name, arg_type in expected_args.items():
        if arg_name not in provided_args:
            return _make_response(Decision.DENY, "MISSING_ARGUMENT", f"Missing required argument: {arg_name}", tool.risk_level, ["VALIDATE_ARGUMENTS"])
        if not isinstance(provided_args[arg_name], arg_type):
            return _make_response(Decision.DENY, "INVALID_ARGUMENT_TYPE", f"Argument {arg_name} has invalid type.", tool.risk_level, ["VALIDATE_ARGUMENTS"])
            
    for arg_name in provided_args:
        if arg_name not in expected_args:
            return _make_response(Decision.DENY, "UNEXPECTED_ARGUMENT", f"Unexpected argument provided: {arg_name}", tool.risk_level, ["VALIDATE_ARGUMENTS"])

    if tool.requires_approval:
        return _make_response(Decision.REQUIRE_APPROVAL, "APPROVAL_REQUIRED", "This action requires human approval before execution.", tool.risk_level, ["REQUIRE_APPROVAL_FOR_SENSITIVE_ACTIONS"])

    return _make_response(Decision.ALLOW, "ACTION_ALLOWED", "The action complies with the active security policy.", tool.risk_level, ["ALLOW_VALIDATED_ACTIONS"])
""",
    "backend/app/services/execution_gateway.py": """from app.schemas.execution import ExecutionRequest, ExecutionResponse, ExecutionStatus, PreviewResponse
from app.schemas.policy import Decision
from app.services.policy_engine import evaluate_action, POLICY_VERSION
from app.services.tool_registry import TOOL_REGISTRY, TOOL_HANDLERS
import uuid
import json
import hashlib
from datetime import datetime, timezone

idempotency_store = {}
approval_store = {
    "valid_token_123": {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
}

def execute_authorized_action(request: ExecutionRequest) -> ExecutionResponse:
    if request.idempotency_key in idempotency_store:
        cached = idempotency_store[request.idempotency_key]
        req_payload_hash = hashlib.sha256(json.dumps(request.arguments, sort_keys=True).encode()).hexdigest()
        if cached["payload_hash"] != req_payload_hash:
            return ExecutionResponse(
                execution_id=str(uuid.uuid4()),
                status=ExecutionStatus.FAILED,
                tool_name=request.tool_name,
                policy_decision=Decision.DENY,
                handler_invoked=False,
                reason_code="IDEMPOTENCY_PAYLOAD_MISMATCH",
                policy_version=POLICY_VERSION,
                evaluated_at=datetime.now(timezone.utc).isoformat()
            )
        return cached["response"]

    req_payload_hash = hashlib.sha256(json.dumps(request.arguments, sort_keys=True).encode()).hexdigest()
    
    try:
        policy_decision = evaluate_action(request)
    except Exception:
        response = ExecutionResponse(
            execution_id=str(uuid.uuid4()),
            status=ExecutionStatus.FAILED,
            tool_name=request.tool_name,
            policy_decision=Decision.DENY,
            handler_invoked=False,
            reason_code="POLICY_ENGINE_FAILURE",
            policy_version=POLICY_VERSION,
            evaluated_at=datetime.now(timezone.utc).isoformat()
        )
        return response

    execution_id = str(uuid.uuid4())
    evaluated_at = policy_decision.evaluated_at
    
    response = ExecutionResponse(
        execution_id=execution_id,
        status=ExecutionStatus.PROPOSED,
        tool_name=request.tool_name,
        policy_decision=policy_decision.decision,
        handler_invoked=False,
        reason_code=policy_decision.reason_code,
        policy_version=POLICY_VERSION,
        evaluated_at=evaluated_at
    )

    if policy_decision.decision == Decision.DENY:
        response.status = ExecutionStatus.DENIED
        idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
        return response

    if policy_decision.decision == Decision.REQUIRE_APPROVAL:
        if not request.approval_token or request.approval_token not in approval_store:
            response.status = ExecutionStatus.PENDING
            response.reason_code = "MISSING_OR_INVALID_APPROVAL"
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            return response
            
        approval = approval_store[request.approval_token]
        if approval["used"] or approval["tool_name"] != request.tool_name or approval["arguments_hash"] != req_payload_hash:
            response.status = ExecutionStatus.DENIED
            response.reason_code = "INVALID_APPROVAL_CONTEXT"
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            return response
            
        approval["used"] = True

    handler = TOOL_HANDLERS.get(request.tool_name)
    if not handler:
        response.status = ExecutionStatus.FAILED
        response.reason_code = "HANDLER_NOT_FOUND"
        idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
        return response

    try:
        result = handler(request.arguments)
        response.status = ExecutionStatus.EXECUTED_IN_SIMULATION
        response.handler_invoked = True
        response.result = result
        response.reason_code = "SUCCESS"
    except Exception as e:
        response.status = ExecutionStatus.FAILED
        response.handler_invoked = True
        response.reason_code = "HANDLER_EXCEPTION"

    idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
    return response

def preview_action(request: ExecutionRequest) -> PreviewResponse:
    policy_decision = evaluate_action(request)
    tool = TOOL_REGISTRY.get(request.tool_name)
    
    return PreviewResponse(
        tool_name=request.tool_name,
        arguments_summary=request.arguments,
        policy_decision=policy_decision.decision,
        risk_level=tool.risk_level.value if tool else "UNKNOWN",
        approval_requirement=tool.requires_approval if tool else False,
        explanation=policy_decision.explanation,
        handler_invoked=False
    )
""",
    "backend/app/api/routes/execution.py": """from fastapi import APIRouter
from app.schemas.execution import ExecutionRequest, ExecutionResponse, PreviewResponse
from app.services.execution_gateway import execute_authorized_action, preview_action

router = APIRouter()

@router.post("/execute", response_model=ExecutionResponse)
async def execute_action(request: ExecutionRequest):
    return execute_authorized_action(request)

@router.post("/preview", response_model=PreviewResponse)
async def preview(request: ExecutionRequest):
    return preview_action(request)
""",
    "backend/tests/test_execution_gateway.py": """from app.schemas.execution import ExecutionRequest, ExecutionStatus
from app.schemas.policy import Decision
from app.services.execution_gateway import execute_authorized_action, idempotency_store, approval_store
from app.services.tool_registry import handler_invocation_counts
import uuid
import json
import hashlib

def get_key():
    return str(uuid.uuid4())

def test_authorized_simulation():
    key = get_key()
    count_before = handler_invocation_counts["search_demo_records"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "hello"},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.EXECUTED_IN_SIMULATION
    assert res.handler_invoked == True
    assert handler_invocation_counts["search_demo_records"] == count_before + 1

def test_unknown_tool():
    key = get_key()
    req = ExecutionRequest(
        agent_id="test",
        tool_name="hacker_tool",
        action="execute",
        arguments={},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert res.reason_code == "TOOL_NOT_ALLOWLISTED"

def test_disabled_tool():
    key = get_key()
    count_before = handler_invocation_counts["delete_demo_record"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="delete_demo_record",
        action="execute",
        arguments={"record_id": "1"},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert res.reason_code == "TOOL_DISABLED"
    assert handler_invocation_counts["delete_demo_record"] == count_before

def test_invalid_arguments():
    key = get_key()
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert res.reason_code == "MISSING_ARGUMENT"

def test_approval_required():
    key = get_key()
    count_before = handler_invocation_counts["export_demo_report"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "abc", "destination": "external"},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.PENDING
    assert res.handler_invoked == False
    assert handler_invocation_counts["export_demo_report"] == count_before

def test_valid_approval():
    key = get_key()
    count_before = handler_invocation_counts["export_demo_report"]
    approval_store["test_token_1"] = {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
    req = ExecutionRequest(
        agent_id="test",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "abc", "destination": "external"},
        idempotency_key=key,
        approval_token="test_token_1"
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.EXECUTED_IN_SIMULATION
    assert res.handler_invoked == True
    assert handler_invocation_counts["export_demo_report"] == count_before + 1

def test_invalid_approval():
    key = get_key()
    approval_store["test_token_2"] = {
        "tool_name": "export_demo_report",
        "arguments_hash": hashlib.sha256(json.dumps({"destination": "external", "report_id": "abc"}, sort_keys=True).encode()).hexdigest(),
        "used": False
    }
    req = ExecutionRequest(
        agent_id="test",
        tool_name="export_demo_report",
        action="execute",
        arguments={"report_id": "different", "destination": "external"}, # Tampered arg
        idempotency_key=key,
        approval_token="test_token_2"
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False

def test_idempotency():
    key = get_key()
    count_before = handler_invocation_counts["search_demo_records"]
    req = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "test_idem"},
        idempotency_key=key
    )
    res1 = execute_authorized_action(req)
    res2 = execute_authorized_action(req)
    assert res1.execution_id == res2.execution_id
    assert handler_invocation_counts["search_demo_records"] == count_before + 1

def test_idempotency_mismatch():
    key = get_key()
    req1 = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "1"},
        idempotency_key=key
    )
    req2 = ExecutionRequest(
        agent_id="test",
        tool_name="search_demo_records",
        action="execute",
        arguments={"query": "2"},
        idempotency_key=key
    )
    execute_authorized_action(req1)
    res2 = execute_authorized_action(req2)
    assert res2.status == ExecutionStatus.FAILED
    assert res2.reason_code == "IDEMPOTENCY_PAYLOAD_MISMATCH"

def test_handler_failure():
    key = get_key()
    req = ExecutionRequest(
        agent_id="test",
        tool_name="error_demo_tool",
        action="execute",
        arguments={},
        idempotency_key=key
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.FAILED
    assert res.handler_invoked == True
    assert res.reason_code == "HANDLER_EXCEPTION"

""",
    "backend/tests/test_execution_api.py": """from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_preview_endpoint():
    payload = {
        "agent_id": "test",
        "tool_name": "search_demo_records",
        "action": "search",
        "arguments": {"query": "demo"},
        "idempotency_key": "123"
    }
    response = client.post("/api/execution/preview", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["policy_decision"] == "ALLOW"
    assert data["handler_invoked"] == False
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 3 files created successfully.")
