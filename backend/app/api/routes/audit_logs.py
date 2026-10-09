from fastapi import APIRouter, Query
from app.schemas.audit import PaginatedAuditResponse, AuditSummary
from app.services.audit_service import get_audit_logs, get_audit_summary

router = APIRouter()

@router.get("/", response_model=PaginatedAuditResponse)
async def fetch_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    event_type: str = None,
    tool_name: str = None
):
    items, total = get_audit_logs(page=page, page_size=page_size, event_type=event_type, tool_name=tool_name)
    return PaginatedAuditResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total
    )

@router.get("/summary", response_model=AuditSummary)
async def fetch_audit_summary():
    return AuditSummary(**get_audit_summary())
