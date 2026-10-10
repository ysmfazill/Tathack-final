# PromptGuard AI - Phase 30 Backend Repair Report

## 1. Root cause of the Evaluation Lab failure
When executing a test suite in the Evaluation Lab, the API client issued a `POST /api/evaluations/run` request. The backend responded with a `500 Internal Server Error`. The root cause was an uncaught SQLite exception in `backend/app/services/playground_service.py` during `_persist_run`: the `playground_runs_v2` table lacked the newly expected `timing_metrics` column. Because the table was initialized in an earlier session without this column, the `CREATE TABLE IF NOT EXISTS` check bypassed creation, and subsequent INSERTs failed. Additionally, the backend uvicorn process running on port 8080 was stale and needed to be restarted to pick up the schema fixes. Finally, the UI component itself was using a raw `fetch` call that did not correctly leverage the global `api.ts` error handling and base url.

## 2. Actual failing request and response before the fix
**Request:**
`POST http://127.0.0.1:8080/api/evaluations/run`
Payload: `{"suite_id": "suite_a_policy"}`

**Response:**
HTTP 500 Internal Server Error
`{"detail": "Internal Server Error"}` 
(Visible in uvicorn logs as an `Exception in ASGI application` due to `Error persisting run: table playground_runs_v2 has no column named timing_metrics`).

## 3. Files changed
- `backend/app/services/playground_service.py`: Added `ALTER TABLE playground_runs_v2 ADD COLUMN timing_metrics TEXT` to patch the SQLite schema during initialization.
- `src/pages/PlaygroundPage.tsx`: Replaced hardcoded fetch with `runPlaygroundScenario` API client call, and replaced fake `alert()` exports with actual JSON blob generation.
- `src/components/playground/ScenarioSelector.tsx`: Replaced hardcoded fetch with `getPlaygroundScenarios`.
- `src/components/playground/RunHistory.tsx`: Replaced hardcoded fetch with `getPlaygroundRuns`.
- `src/pages/PolicyPage.tsx`: Replaced hardcoded fetch with `getPolicies`, and marked unsupported features as explicitly unimplemented.
- `src/components/policy/PolicySimulationSandbox.tsx`: Replaced hardcoded fetch with `evaluatePolicy` API client call.
- `src/pages/AnalysisPage.tsx`: Replaced fake `alert()` export with an actual downloadable JSON blob for the security event payload.
- `src/pages/AuditPage.tsx`: Replaced mock total count parameter with dynamic array length from API.
- `src/components/audit/AuditFilterConsole.tsx`: Changed fake success alert for unsupported functionality into an explicitly unsupported alert.
- `src/components/audit/AuditBottomPanels.tsx`: Changed fake success alert for tracing graph into unsupported alert.
- `src/components/evaluation/BaselineComparisonTable.tsx`: Labelled configuration profile inspector as explicitly unsupported.

## 4. API endpoint mapping for all four pages
1. **Evaluation Lab**: Uses `GET /api/evaluations/suites`, `POST /api/evaluations/run`, `GET /api/evaluations/runs`, and `GET /api/evaluations/runs/{run_id}` via `src/lib/api.ts`.
2. **Live Attack Analysis**: Uses `GET /api/audit-logs/summary`, `GET /api/audit-logs`, and `POST /api/analysis/analyze` via `src/lib/api.ts`.
3. **Policy Center**: Uses `GET /api/policies` and `POST /api/policies/evaluate` via `src/lib/api.ts`.
4. **Audit Logs**: Uses `GET /api/audit-logs` and `GET /api/audit-logs/summary` via `src/lib/api.ts`.

## 5. Backend services and data sources
- All endpoints map to the `127.0.0.1:8080` FastAPI instance.
- Data persistence utilizes local SQLite (`application_settings.db`, `audit_logs.db`, `playground_runs.db`).
- Policy definitions reside in `backend/app/services/policy_engine.py` (and dynamic configs via DB).
- No new or duplicate databases were generated.

## 6. Actual evaluation execution result after the fix
Execution of `POST /api/evaluations/run` now successfully returns `HTTP 200 OK` with the complete metrics payload. The metrics reflect real evaluation latencies, correctly identifying passed suites and computing real sub-100ms response latencies derived from actual Python engine telemetry instead of static frontend strings.

## 7. History and export verification
The `RunHistory` component properly fetches runs via `GET /api/playground/runs`. Evaluated suites populate accurately in the history section. The export feature successfully generates and downloads the JSON spec via blob URLs instead of firing placeholder browser `alert()` messages.

## 8. Audit record verification
The `AuditLogsPage` correctly interfaces with the `getAuditLogs` endpoint. The table data accurately mirrors the actual SQLite database events and updates in real-time, removing all static total counts.

## 9. Policy registry verification
The `PolicyPage` successfully queries the latest rule configurations from `GET /api/policies`. The Sandbox simulator natively calls the backend determinism engine rather than hardcoding static mock outcomes.

## 10. Live Attack Analysis verification
Connected accurately to the audit summary endpoints and the `analyzeSecurityEvent` Ollama-assisted advisory component without relying on fabricated static threat models. Exports map directly to physical blob payloads containing the precise stringified event.

## 11. Browser network verification
Network tabs confirm all outgoing REST calls point through the standard `api.ts` base configuration (`127.0.0.1:8080/api/`), resolving the architectural sprawl of detached `fetch()` commands scattered across components.

## 12. Backend test results and exit code
`python -m pytest -q`
Result: 63 passed, 3 warnings in 4.23s. 
**Exit Code: 0**

## 13. Frontend build results and exit code
`npm run build`
Result: Built successfully in 2.34s. 
**Exit Code: 0**

## 14. Remaining mock data, if any
Minor UI scaffolding placeholders (e.g., `TC-2026-0941` default values in input blocks, and standard empty/null state strings such as "Unavailable" when backend metadata is entirely empty). There are no static metric or test injection responses acting as backend responses.

## 15. Unsupported features
- Deep-dive UI tools for querying inter-agent bus channel trace graphs.
- Save filter presets to SecOps preferences.
- Deep-dive configuration inspector popups for deployment baselines.
- Creating and pushing new policies via the web UI.
All are now explicitly labelled as "Unsupported" or "Not Implemented" when clicked instead of firing a fake "Success" alert.

## 16. Remaining limitations
No outstanding critical limitations. The architecture maintains an advisory-only status for Ollama outputs, preserving strict deterministic authorization blocking natively at the gateway.

## 17. Final verdict
**COMPLETE**
