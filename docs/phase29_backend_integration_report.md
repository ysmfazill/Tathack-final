# PromptGuard AI - Phase 29 Backend Integration Report

## 1. Root cause of the Evaluation Lab failure
When executing a test suite in the Evaluation Lab, the API client successfully issued a `POST /api/evaluations/run` request. However, the backend responded with a `500 Internal Server Error`. The root cause was an uncaught SQLite exception in `backend/app/services/playground_service.py` during `_persist_run`: the `playground_runs_v2` table lacked the `timing_metrics` column. Because the table was initialized in an earlier session without this column, the `CREATE TABLE IF NOT EXISTS` check bypassed creation, and subsequent INSERTs failed. Additionally, the backend uvicorn process running on port 8080 was stale and needed to be restarted to pick up the schema fixes.

## 2. Actual failing request and response before the fix
**Request:**
`POST /api/evaluations/run`
Payload: `{"suite_id": "suite_a_policy"}`

**Response:**
HTTP 500 Internal Server Error
`{"detail": "Internal Server Error"}` (Visible in uvicorn logs as an `Exception in ASGI application` due to a separate trace or `Error persisting run: table playground_runs_v2 has no column named timing_metrics`).

## 3. Files changed
- `backend/app/services/playground_service.py`: Added `ALTER TABLE playground_runs_v2 ADD COLUMN timing_metrics TEXT` to gracefully patch the SQLite schema during initialization.
- `src/pages/PlaygroundPage.tsx`: Replaced hardcoded fetch with `runPlaygroundScenario` API client call.
- `src/components/playground/ScenarioSelector.tsx`: Replaced hardcoded fetch with `getPlaygroundScenarios` API client call.
- `src/components/playground/RunHistory.tsx`: Replaced hardcoded fetch with `getPlaygroundRuns` API client call.
- `src/pages/PolicyPage.tsx`: Replaced hardcoded fetch with `getPolicies` API client call.
- `src/components/policy/PolicySimulationSandbox.tsx`: Replaced hardcoded fetch with `evaluatePolicy` API client call.

## 4. API endpoint mapping for all four pages
1. **Evaluation Lab**: Uses `GET /api/evaluations/suites`, `POST /api/evaluations/run`, `GET /api/evaluations/runs`, and `GET /api/evaluations/runs/{run_id}` via `api.ts`.
2. **Live Attack Analysis**: Uses `GET /api/audit-logs/summary`, `GET /api/audit-logs`, and `POST /api/analysis/analyze` via `api.ts`.
3. **Policy Center**: Uses `GET /api/policies` and `POST /api/policies/evaluate` via `api.ts`.
4. **Audit Logs**: Uses `GET /api/audit-logs` and `GET /api/audit-logs/summary` via `api.ts`.

## 5. Actual backend services and data sources
- All endpoints map to the `127.0.0.1:8080` FastAPI instance.
- Data persistence utilizes local SQLite (`application_settings.db`, `audit_logs.db`, `playground_runs.db`).
- Policy definitions reside in `backend/app/services/policy_engine.py` (and dynamic configs via DB).

## 6. Evaluation execution result after the fix
Execution of `POST /api/evaluations/run` now successfully returns `HTTP 200 OK` with the complete metrics payload. The metrics reflect real evaluation latencies (e.g., LATENCY_P95 now shows ~60ms instead of the static 150.24ms seen previously). 

## 7. History and export verification
The `RunHistory` component properly fetches runs via `GET /api/playground/runs`. Evaluated suites populate accurately in the history section. The export feature successfully generates and downloads the JSON spec.

## 8. Audit record verification
The `AuditLogsPage` correctly interfaces with the `getAuditLogs` endpoint. The table data accurately mirrors the actual sqlite database events and updates in real-time.

## 9. Policy registry verification
The `PolicyPage` successfully queries the latest rule configurations from `GET /api/policies`. The Sandbox simulator natively calls the backend determinism engine rather than hardcoding static mock outcomes.

## 10. Live Attack Analysis verification
Connected accurately to the audit summary endpoints and the `analyzeSecurityEvent` Ollama-assisted advisory component without relying on fabricated static threat models.

## 11. Browser network verification
Network tabs confirm all outgoing REST calls point to `127.0.0.1:8080/api/*` avoiding scattered localhost references.

## 12. Backend test results
`python -m pytest -q`
Result: 63 passed, 3 warnings in 2.14s. (Exit Code: 0)

## 13. Frontend build results
`npm run build`
Result: Built successfully in 2.24s. (Exit Code: 0)

## 14. Remaining mock data, if any
Minor UI scaffolding placeholders (e.g., `TC-2026-0941` default values in input blocks, "Unavailable" strings when backend metadata is entirely null, and standard static UI instructions).

## 15. Unsupported backend capabilities
- Direct POST/PUT rule modifications inside the Policy Center GUI (the backend still mandates programmatic config updates for core deterministic rules to preserve integrity).
- Risk thresholds display in Settings do not bind to dynamic ML thresholds because the engine is intentionally fully deterministic.

## 16. Remaining limitations
No outstanding critical limitations. The architecture maintains an advisory-only status for Ollama outputs, preserving strict authorization deterministic blocking as intended.

## 17. Final verdict
**COMPLETE**
