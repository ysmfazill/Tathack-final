# PromptGuard AI Backend

This is the FastAPI backend foundation for PromptGuard AI.

## Prerequisites
- Python 3.11+
- Windows PowerShell (or another suitable terminal)

## Directory Structure
```
backend/
  app/
    api/
    core/
    schemas/
    main.py
  tests/
  requirements.txt
```

## Setup & Installation (Windows PowerShell)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Environment Configuration
Copy `.env.example` to `.env` to configure your environment:
```powershell
cp .env.example .env
```

## Running the Backend
```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## API Documentation
Once running, Swagger UI is available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Running Tests
```powershell
python -m pytest -q
```

## Endpoints
- `GET /api/health` - Health check.
- `GET /api/overview` - Implementation status overview.
- `POST /api/policies/evaluate` - Evaluates an action proposal against the deterministic policy engine.
- `GET /api/policies` - Returns a safe description of the active policy and registered tools.
- `POST /api/execution/preview` - Validates and evaluates a proposal without executing any handler (informational only).
- `POST /api/execution/execute` - The secure execution boundary. Re-authorizes actions before dispatching to handlers.
- `POST /api/data-guard/evaluate` - Evaluates a data transfer request between agents using trusted classification labels.
- `POST /api/data-guard/evaluate` - Evaluates a data transfer request between agents using trusted classification labels.
- `GET /api/audit-logs` - Fetches securely persisted and paginated audit logs.
- `GET /api/audit-logs/summary` - Fetches summarized telemetry statistics based on actual persisted data.
- `GET /api/playground/scenarios` - Returns a registry of predefined security testing scenarios.
- `POST /api/playground/run` - Safely executes a scenario through the execution gateway and returns the observed outcome vs expected outcome.
- `GET /api/playground/runs` - Fetches the paginated history of playground test runs.
- `GET /api/playground/summary` - Fetches aggregate statistics of playground scenario outcomes (PASS/FAIL/INCONCLUSIVE).
- `GET /api/evaluations/suites` - Returns a registry of predefined security evaluation test suites.
- `POST /api/evaluations/run` - Executes an entire evaluation suite and calculates security metrics.
- `GET /api/evaluations/runs` - Fetches the paginated history of suite evaluations.

## Deterministic Policy Engine (Phase 2)
The policy engine enforces a strict set of deterministic rules to authorize AI-agent action proposals:
1. **Invalid Request Check**: Malformed requests are rejected.
2. **Explicit Deny Rules**: Disabled tools or prohibited actions are mandatorily denied.
3. **Tool Allowlist**: Unknown or unregistered tools are strictly denied.
4. **Argument Validation**: Arguments must comply with the registered tool's expected schema constraints.
5. **Approval Requirement**: High-risk tools are flagged as `REQUIRE_APPROVAL` before they can proceed.
6. **Risk Policy**: Legitimate requests mapping to allowed risk profiles are marked as `ALLOW`.

## Secure Execution Gateway (Phase 3)
The gateway acts as the single execution boundary for all tool actions. It guarantees that an ALLOW decision from the policy engine is re-verified immediately before execution.
- **Fresh Authorization**: Previous policy decisions are ignored. The gateway performs a completely fresh evaluation against the current active policy.
- **Approval Mechanism**: High-risk actions require an explicit `approval_token`. Approvals are contextually bound to the tool name and argument hashes. Tampered arguments invalidate the approval.
- **Idempotency implementation**: A unique `idempotency_key` is required to prevent duplicate execution of identical payloads. Reusing a key with different arguments causes a strict `FAILED` state to prevent replay tampering.
- **Execution Flow**: Valid Request -> Idempotency Check -> Policy Evaluation -> Approval Verification -> Handler Dispatch -> Return Status & Result.
- **Execution Status Semantics**: Includes explicit statuses: `PROPOSED`, `DENIED`, `PENDING` (needs approval), `EXECUTED_IN_SIMULATION` (safe synthetic handlers only), and `FAILED` (handler exceptions). `DENIED` actions explicitly guarantee `handler_invoked=false`.

## Cross-Agent Data Guard (Phase 4)
Provides deterministic information-flow control to prevent sensitive data leakage between agents.
- **Trusted Record Registry**: Data is assigned authoritative classifications (`PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `RESTRICTED`) via a backend-controlled trusted registry.
- **Spoofing Prevention**: AI-supplied classifications, downgrades, or unknown record spoofing attempts are strictly ignored in favor of the trusted registry.
- **Destination Registry**: Enforces agent-to-agent permissions. For example, the `export_agent` is explicitly blocked from receiving `CONFIDENTIAL` or `RESTRICTED` data.
- **Information-Flow Policy**: Transfer requests are systematically checked: Source Agent Permissions -> Authoritative Record Classification -> Destination Agent Permissions. If a request includes mixed records (permitted and prohibited), the entire transfer is atomically denied.
- **Gateway Integration**: Data transfers proposed through the `transfer_demo_records` tool are dynamically routed through the Data Guard before the Execution Gateway dispatches the synthetic transfer handler.

## Durable Audit Logging (Phase 5)
Provides immutable, structured records of system evaluations and operations, using an SQLite local database.
- **Redaction Strategy**: Protects sensitive inputs (e.g. passwords, real identities) using a rigid allowlist (`redact_sensitive_data`) before persisting any metadata to disk.
- **Lifecycle Auditing**: The Execution Gateway strictly logs events like `EXECUTION_REQUESTED`, `EXECUTION_DENIED`, `EXECUTION_STARTED`, and finally `EXECUTION_SUCCEEDED` only *after* a handler physically returns without exceptions.
- **Data Integrity**: Uses SQLite Transactions. A failure to write an audit log does not silently convert a DENY to an ALLOW, and errors are handled defensively to avoid crashing the policy engine.
- **Metrics API**: The `/summary` endpoint aggregates accurate telemetry directly from the transactional SQL store rather than unreliable memory counters.

## Attack Playground API (Phase 6)
Provides a structured, safe test harness for launching adversarial scenarios against the active policy engine, data guard, and execution gateway.
- **Trusted Scenario Registry**: Defines hardcoded deterministic test cases on the backend (e.g. "Classification Spoofing", "Unauthorized Tool Use"). The client cannot alter the expected outcomes.
- **Gateway Integration**: All playground runs route natively through the exact same `/api/execution/execute` core logic used by standard agent tasks. The playground does not mock the security layers; it exercises the actual stack.
- **Evidence Verification**: The playground strictly validates that a `DENY` decision mathematically correlates with `handler_invoked=False`. Test `PASS` explicitly means the security mechanism blocked the attack.
- **Semantic Injection Coverage**: Semantic LLM injections (e.g. natural language Prompt Injections) are included in the registry but are currently marked `UNSUPPORTED`, preventing them from falsely generating passing scores until an LLM evaluation node is available.
- **Run Persistence**: Test executions are written durably into a `playground_runs` SQLite table.

## Security Evaluation Engine (Phase 7)
Provides automated, reproducible benchmarking for the security components, aggregating playground scenarios into cohesive evaluation suites (e.g. Policy Enforcement, Data Protection, Adversarial Injections).
- **Metric Definitions**: Rigorously calculates Attack Success Rate (ASR), Attack Blocking Rate, False Positive Rate, Legitimate Task Completion Rate, and End-to-End Latency percentiles (P50/P95).
- **Evidence-Based Numerators**: Excludes `INCONCLUSIVE` or `UNSUPPORTED` test runs from metric denominators to prevent false confidence inflation.
- **Database Persistence**: Durably logs every case result within an evaluation run, creating historically reproducible snapshots inside SQLite tables (`evaluation_runs` and `evaluation_case_results`).

## Frontend Integration & Testing (Phase 8)
- Centralized TypeScript `axios` API Client implemented (`src/lib/api.ts`).
- React `OverviewPage` dynamically fetches aggregate metadata directly from the SQLite database logic, bypassing unverified static configurations.
- Formalized `IMPLEMENTATION.md` completed.

**IMPORTANT**: The current implementation restricts execution to safe, synthetic demonstration handlers only. No external networks, databases, or file systems are accessed. In-memory approvals and idempotency caches do not survive restarts. Arbitrary free-text paraphrasing tracking is not perfectly implemented by this foundational guard.

## Current Limitations
- The policy engine configuration (e.g., Tool Registry, Trusted Records, Destinations) is currently hardcoded in Python and operates without a backend database.
- The system is not connected to a formal authentication or IdP provider.
- In-memory state (approvals, idempotency cache) is wiped upon application restart.
- SQLite is appropriate for this prototype, but an enterprise deployment requires a high-concurrency remote store.
- Semantic Prompt Injection evaluations (Suite E) currently return UNSUPPORTED because the engine lacks real Generative AI detection models.
- Operates as a foundational structure; do not use in a production environment.
- Several UI screens still display demo configuration until the API data mapping is fully completed.

## Deferred Features (Phase 9+)
- LLM Agent & Model integration for natural language processing of injections.
- Complete mapping of the UI dashboard hooks to the new API Client.
