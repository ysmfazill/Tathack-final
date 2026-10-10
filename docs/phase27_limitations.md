# PromptGuard AI - Phase 27 Supported Features and Limitations

## Overview
This document outlines the current state of PromptGuard AI, identifying which security mechanisms are fully enforced, what actions are simulated, and known limitations to ensure transparency regarding the application's readiness.

## Implemented and Enforced Features

### Deterministic Security Controls
- **Tool Allowlisting:** The execution gateway actively blocks any proposed tool that is not registered within the explicit system allowlist (`TOOL_NOT_ALLOWLISTED`).
- **Data Guard Cross-Agent Transfer Restrictions:** Transfers of data labeled as `RESTRICTED` to unauthorized destination agents are actively prevented (`DESTINATION_CLASSIFICATION_FORBIDDEN`).
- **Approval Workflows:** High-risk actions (such as data export) correctly trigger an approval requirement and are held in a `PENDING` state until explicitly authorized. They do not automatically execute.
- **Strict Settings Validation:** The backend API actively validates configurations via Pydantic models. Malformed boolean values or incorrect payload structures sent to `/api/settings/security` are rejected by the server, preserving safe persistent states.

### Auditing and Observability
- **Audit Logging:** Security verdicts, simulated tool executions, and intercepted actions are persisted to the SQLite database.
- **Playground Verification:** The Attack Playground fully integrates with the backend API (`/api/playground/run`). It successfully displays the deterministic reasoning for blocks, allowances, and pending states.

### Model Integration (Advisory Role)
- **Ollama Provider Status:** The backend correctly checks the status of the local Ollama provider at `/api/providers/status`.
- **Advisory Only:** LLM-generated risk signals are surfaced in the UI for context (e.g., Live Attack Analysis) but they *do not* possess the authority to override the deterministic policy engine.
- **Graceful Degradation:** If the Ollama model is offline, the core deterministic firewall operations still function without issue.

## Simulated Actions and Limitations

### Synthetic Simulations vs Real Side-Effects
- **Synthetic Handlers:** The tools in the application (`search_demo_records`, `export_demo_report`, `transfer_demo_records`) are currently backed by synthetic simulation handlers. They log execution locally but do not actually reach out to third-party live APIs or databases. 
- Real-world side-effects (e.g., deleting an actual database record) are non-functional and operate entirely in a sandbox.

### Policy Configuration Boundaries
- Not all settings displayed in the frontend currently map to dynamic behaviors in the backend engine. Some UI toggles are placeholders for future advanced rules.
- The `strict_mode` setting enforces stringent approvals, but dynamically updating custom policies in the "Policy Center" is limited to the predefined scenarios mapped in `attack_scenarios.py`.

### Known Limitations & Test Coverage
- **Semantic Prompt Injection Coverage:** The deterministic firewall does not inherently block complex semantic attacks (e.g., highly obfuscated indirect prompt injections) unless they result in a forbidden tool call or parameter mismatch. Protection against purely conversational jailbreaks relies on the LLM advisory analysis which is not 100% robust.
- **Coverage Gaps:** The automated test suite (`pytest`) verifies core engine logic but does not include full end-to-end Cypress/Playwright integration tests for UI rendering edge cases.
- **Production Readiness:** This application is configured for local demonstration and SecOps evaluation. It uses a local SQLite file without a production-ready WSGI/ASGI configuration (e.g., Gunicorn clustering), rate-limiting, or authenticated user sessions.

## Conclusion
PromptGuard AI successfully demonstrates the architecture of a Behavioral Firewall. It enforces robust, deterministic security rules independent of LLM hallucinations. However, users should be aware that the currently active tools are sandboxed simulations, and full conversational prompt-injection defense remains a challenging area bounded by model limitations.
