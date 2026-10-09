# Final Audit: PromptGuard AI

## A. Gateway Coverage
1. **List every function that can invoke a tool**: 
   - `execute_authorized_action` in `backend/app/services/execution_gateway.py`.
   - Call graph: API Route `execute_action()` -> `execute_authorized_action()` -> `evaluate_action()` -> `TOOL_HANDLERS.get()` -> `handler()`.
2. **Confirm ONE module imports executor**: Confirmed. Only `app/api/routes/execution.py` and `app/services/playground_service.py` import it. No frontend files import it.
3. **Confirm re-check**: Confirmed. Line 75 of `execution_gateway.py` evaluates the policy before execution.
4. **Dev-only flags**: Grep for `SKIP_AUTH` and `DEBUG` returned no results. No bypasses found.

## B. Trust Boundaries
5. **Authorization fields**: `cross_agent_guard.py` looks up destination policies and classifications exclusively from backend registries (`get_destination_policy`, `get_trusted_classification`).
6. **Unknown tools/malformed args**: Confirmed. Policy engine denies unknown tools and raises an error on schema validation (DENIED).
7. **Mandatory deny precedence**: Confirmed. `Decision.DENY` halts the pipeline immediately before checking approval stores or executing.

## C. Data Guard
8. **Registries**: `get_trusted_classification` returns `PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `RESTRICTED`. 
9. **Missing Classification**: Confirmed. Line 61 of `cross_agent_guard.py` explicitly DENIES unknown records instead of defaulting to `PUBLIC`.

## D. Audit
10. **Trace ID / Redaction**: `audit_service.py` handles redaction. `execution_gateway.py` sets `handler_invoked = False` upon DENY.
11. **Immutable / Signed UI**: Found "IMMUTABLE LEDGER", "Recorded & Signed" in the React frontend. These are UI marketing claims that do not correspond to cryptographic backend features. Status: UI ONLY (MOCKED). Flagged for removal.

## E. Evaluation Integrity
12. **Numbers in UI**: "99.4% precision", "0.42ms SLA" found hardcoded in `FirewallControls.tsx` and `PlaygroundPage.tsx`. Event counts like "1,248" found in `RecentEventsTable.tsx`. Status: HARDCODED / DEMO.
13. **Metric Math**: `evaluation_metrics.py` dynamically calculates ASR and FPR from saved test case rows. Confirmed.

## F. Secrets and Network
14. **API Keys**: No hardcoded API keys found in the backend or frontend bundles.
15. **Outbound Network Calls**: None. Handlers are synthetic.

## G. UI Truthfulness
16. **Mode Banner**: Missing.
17. **Guarantees**: "Deterministic Guarantee... Zero untrusted leakage occurred" found in `AuditEventDetailDrawer.tsx`. Status: HARDCODED.

## H. Dependencies
18. **NPM Audit**: FAILED. 11 vulnerabilities (6 high, 5 moderate).
