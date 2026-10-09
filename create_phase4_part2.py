import os

files = {
    "backend/app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, overview, policies, execution, data_guard
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API foundation for PromptGuard AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(overview.router, prefix="/api", tags=["Overview"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])
app.include_router(execution.router, prefix="/api/execution", tags=["Execution"])
app.include_router(data_guard.router, prefix="/api/data-guard", tags=["Data Guard"])
""",
    "backend/app/services/tool_registry.py": """from app.schemas.policy import ToolDefinition, RiskLevel
from typing import Dict, Any, Callable

handler_invocation_counts = {
    "search_demo_records": 0,
    "summarize_demo_record": 0,
    "export_demo_report": 0,
    "delete_demo_record": 0,
    "transfer_demo_records": 0
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

def handler_transfer(args: Dict[str, Any]) -> Dict[str, Any]:
    handler_invocation_counts["transfer_demo_records"] += 1
    return {"status": "transferred_simulated", "destination": args.get("destination_agent")}

TOOL_HANDLERS: Dict[str, Callable] = {
    "search_demo_records": handler_search,
    "summarize_demo_record": handler_summarize,
    "export_demo_report": handler_export,
    "delete_demo_record": handler_delete,
    "error_demo_tool": handler_error,
    "transfer_demo_records": handler_transfer
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
    ),
    "transfer_demo_records": ToolDefinition(
        name="transfer_demo_records",
        description="Transfer records across agents.",
        is_enabled=True,
        requires_approval=False,
        risk_level=RiskLevel.HIGH,
        expected_arguments={"record_ids": list, "destination_agent": str, "purpose": str}
    )
}
""",
    "backend/app/services/execution_gateway.py": """from app.schemas.execution import ExecutionRequest, ExecutionResponse, ExecutionStatus, PreviewResponse
from app.schemas.policy import Decision
from app.schemas.data_guard import TransferRequest
from app.services.policy_engine import evaluate_action, POLICY_VERSION
from app.services.cross_agent_guard import evaluate_transfer
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

    # Integrates Phase 4: Cross-Agent Data Guard
    if request.tool_name == "transfer_demo_records":
        transfer_req = TransferRequest(
            source_agent=request.agent_id,
            destination_agent=request.arguments.get("destination_agent", ""),
            record_ids=request.arguments.get("record_ids", []),
            purpose=request.arguments.get("purpose", "")
        )
        transfer_decision = evaluate_transfer(transfer_req)
        if transfer_decision.decision != Decision.ALLOW:
            response.status = ExecutionStatus.DENIED
            response.reason_code = transfer_decision.reason_code
            idempotency_store[request.idempotency_key] = {"payload_hash": req_payload_hash, "response": response}
            return response

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
    "backend/tests/test_cross_agent_guard.py": """from app.schemas.data_guard import TransferRequest
from app.schemas.policy import Decision
from app.services.cross_agent_guard import evaluate_transfer
from app.schemas.execution import ExecutionRequest, ExecutionStatus
from app.services.execution_gateway import execute_authorized_action
from app.services.tool_registry import handler_invocation_counts
import uuid

def test_authorized_transfer():
    # TEST 1: Known PUBLIC record to an authorized destination
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="report_agent",
        record_ids=["record_public_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.ALLOW

def test_internal_transfer():
    # TEST 2: Known INTERNAL record to a permitted internal destination
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="report_agent",
        record_ids=["record_internal_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.ALLOW

def test_restricted_to_report():
    # TEST 3: RESTRICTED record to Report Agent
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="report_agent", # allowed: public, internal, conf
        record_ids=["record_restricted_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "DESTINATION_CLASSIFICATION_FORBIDDEN"

def test_confidential_to_export():
    # TEST 4: CONFIDENTIAL record to Export Agent
    req = TransferRequest(
        source_agent="report_agent",
        destination_agent="export_agent", # allowed: public only
        record_ids=["record_confidential_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY

def test_unknown_record():
    # TEST 5: Unknown record identifier
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="report_agent",
        record_ids=["hacked_record_123"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "UNKNOWN_RECORD"

def test_unknown_destination():
    # TEST 6: Unknown destination
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="external_agent",
        record_ids=["record_public_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "UNKNOWN_OR_DISABLED_DESTINATION"

def test_disabled_destination():
    # TEST 7: Disabled destination
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="disabled_agent",
        record_ids=["record_public_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY

def test_downgrade_restricted():
    # TEST 8: Caller attempts to downgrade RESTRICTED to PUBLIC
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="report_agent",
        record_ids=["record_restricted_001"],
        purpose="demo",
        untrusted_classification_claim="PUBLIC"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY # Fails because registry rules

def test_source_lacks_access():
    # TEST 11: Source agent lacks access
    req = TransferRequest(
        source_agent="export_agent",
        destination_agent="hr_agent",
        record_ids=["record_confidential_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY
    assert res.reason_code == "SOURCE_ACCESS_DENIED"

def test_mixed_records():
    # TEST 13: Transfer includes both permitted and prohibited records
    req = TransferRequest(
        source_agent="hr_agent",
        destination_agent="export_agent",
        record_ids=["record_public_001", "record_restricted_001"],
        purpose="demo"
    )
    res = evaluate_transfer(req)
    assert res.decision == Decision.DENY # Atomic DENY on the restricted one

def test_gateway_integration_denied():
    # TEST 20: The integrated execution gateway cannot bypass the data guard
    # And TEST 17: Denied transfer invokes zero transfer handlers
    count_before = handler_invocation_counts["transfer_demo_records"]
    req = ExecutionRequest(
        agent_id="hr_agent",
        tool_name="transfer_demo_records",
        action="execute",
        arguments={
            "record_ids": ["record_restricted_001"],
            "destination_agent": "report_agent",
            "purpose": "demo"
        },
        idempotency_key=str(uuid.uuid4())
    )
    res = execute_authorized_action(req)
    assert res.status == ExecutionStatus.DENIED
    assert res.handler_invoked == False
    assert handler_invocation_counts["transfer_demo_records"] == count_before
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"e:\Tathackback\Tathack-final", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 4 gateway and tests files created successfully.")
