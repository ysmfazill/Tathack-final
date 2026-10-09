# Security Implementation Audit

## 1. Stack and Backend Consistency
- **Expected Stack**: Node + TypeScript, Fastify, Zod, better-sqlite3.
- **Current State**: The repository currently contains a Python/FastAPI backend (developed in earlier phases). A new Fastify backend will need to be bootstrapped in `/server` as per Stage 2 requirements.

## 2. API Clients & Network
- **Status**: Mostly hardcoded. An `api.ts` file was introduced in Phase 8 connecting to the Python backend, but the vast majority of the UI components (like AnalysisPage, EvaluationPage, PolicyPage, SettingsPage) are entirely driven by static mock data.
- **Fix Needed**: We need to wire a new Fastify backend to these clients.

## 3. UI Claims and Hardcoded Metrics
I audited the specific claims in the UI and determined their source:

- **"99.4% precision" and "0.42ms SLA"**:
  - Found in `src/components/playground/FirewallControls.tsx` (Line 111): `status: '0.42ms SLA'` (Hardcoded).
  - Found in `src/pages/PlaygroundPage.tsx` (Line 201): `confidence={0.994}` (Hardcoded).
  - *Fix*: Replace with "NOT MEASURED" or real metrics.

- **"IMMUTABLE LEDGER" / "Immutable event telemetry"**:
  - Found in `src/pages/OverviewPage.tsx` (Line 93): `"View full immutable ledger"` (Hardcoded description).
  - Found in `src/components/audit/AuditHeader.tsx` (Line 27): `"Immutable Ledger"` (Hardcoded badge).
  - *Fix*: Replace with "Audit log (SQLite WAL)". Tamper evidence will be implemented in Stage 5.

- **"Recorded & Signed"**:
  - Found in `src/components/live-analysis/VerticalDecisionTimeline.tsx` (Line 21): `badge: 'Recorded & Signed'` (Hardcoded).
  - *Fix*: Remove "Signed" as real signing does not exist yet.

- **"Deterministic Guarantee ... Zero untrusted leakage occurred" and "0 bytes sent"**:
  - Found in `src/components/audit/AuditEventDetailDrawer.tsx` (Line 132): `'0 bytes sent • Socket drop'`.
  - Found in `src/components/audit/AuditEventDetailDrawer.tsx` (Line 144): `Deterministic Guarantee: Action was verified against behavioral policy prior to socket dispatch. Zero untrusted leakage occurred.`
  - *Fix*: Reword to "Denied before the simulated executor was invoked (this scenario)." Conditionally render based on execution evidence.

- **Stale date "2025-05-18" and static policies**:
  - Found extensively in `src/pages/AuditPage.tsx` and `src/pages/AnalysisPage.tsx`. (e.g. `'2025-05-18 14:38:22 UTC'`).
  - *Fix*: Read dates and policy versions from the backend/config dynamically.

- **"Llama-3-8B-Instruct"**:
  - Found hardcoded in `src/pages/SettingsPage.tsx`, `AuditPage.tsx`, `AnalysisPage.tsx`, `EvaluationHeader.tsx`, and `EvaluationDatasetBar.tsx`.
  - *Fix*: Fetch configured model dynamically.

- **Overview KPIs (1,248 events, 342 blocked, 27.4%)**:
  - While I updated `OverviewPage.tsx` in a previous phase to use dynamic `api.ts` calls for some numbers, a full cleanup is required to ensure no mock data is mixed with real data.

## 4. Policy Functions & Execution Gateway
- **Current State**: The current FastAPI backend has `ExecutionGateway` and `PolicyEngine`, but the UI mock data assumes it is handling authorization without contacting a backend. 
- **Fix Needed (Stage 2/3)**: Move all policy logic and the execution gateway to the new Fastify backend. Ensure the executor is isolated and requires re-authorization. Unknown tools must fail closed.

## 5. Classification and Data Guard
- **Current State**: A Python `DataGuard` exists, but the UI is mostly hardcoded to show HR -> Report -> Export mock flows.
- **Fix Needed (Stage 4)**: Build the Node Data Guard with a strictly defined label registry (PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED).

## 6. Audit & SQLite
- **Current State**: Python backend uses `sqlite3`. 
- **Fix Needed (Stage 5)**: Port to `better-sqlite3` with WAL mode in Node. Include the executor invocation evidence.

## 7. Next Steps
1. The repository requires significant refactoring to migrate the theoretical backend logic to the specified Node.js + Fastify architecture.
2. The UI requires a scrubbing of hardcoded marketing claims ("Immutable", "Deterministic Guarantee", etc.) as per Stage 1.
