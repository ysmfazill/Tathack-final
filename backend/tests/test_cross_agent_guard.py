from app.schemas.data_guard import TransferRequest
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
