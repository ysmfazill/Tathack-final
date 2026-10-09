from app.schemas.policy import ToolDefinition, RiskLevel
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
