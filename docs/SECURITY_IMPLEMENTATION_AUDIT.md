# PromptGuard AI — Security Implementation Audit
**Document ID:** `SEC-AUDIT-2026-v1.0`  
**Project:** PromptGuard AI — Behavioral Firewall for Tool-Using AI Agents  
**Target:** TatHack '26 — Track 2: Safe & Trustworthy AI  
**Audit Date:** 2026-10-09  
**Auditor:** Automated Security Architecture Review  

---

## 1. Executive Summary

PromptGuard AI is designed as a **Behavioral Firewall for Tool-Using AI Agents**. The current repository consists of a fully implemented, highly responsive React 18 + Vite 5 + TypeScript dashboard with seven screens based on Google Stitch designs. 

Prior to this implementation pass, the frontend operated in a **deterministic local simulation mode** with mock telemetry and mock evaluation metrics. This audit identifies the exact state of security controls across the codebase and outlines the architecture required to establish a true, hardened backend security boundary.

---

## 2. Capability Audit Matrix

| Security Capability | Current Status | Relevant Files / Symbols | Evidence & Current Behavior | Missing Controls / Vulnerabilities | Recommended Correction | Verification Tests Needed |
|---|---|---|---|---|---|---|
| **1. Execution Gateway & Tool Interception** | **UI ONLY / MOCKED** | `src/components/playground/`, `src/components/settings/RuntimeSecurityControls.tsx` | UI displays "Enforced", "Fail-Closed", and simulated execution flows, but no single backend execution gateway intercepts actual runtime tool invocations. | No physical gate wrapping the tool executor; frontend components simulate execution without invoking a verified gateway; lack of executor invocation counter. | Implement a centralized `ExecutionGateway` module with an instrumented `ToolExecutor` that enforces pre-execution authorization and tracks execution counts. | Bypass attempt tests asserting `executor.invocationCount === 0` on unauthorized actions. |
| **2. Policy Engine & Rule Precedence** | **PARTIALLY IMPLEMENTED** | `src/pages/PolicyPage.tsx`, `src/types/index.ts` | Policy definitions (e.g. `POL-DATA-704`, `POL-EXEC-801`) and category rules exist in mock state. UI checks match rule criteria in local state. | Mandatory deny rules are not strictly separated from risk scores; no formal schema validation; missing fail-closed handler when policy dependencies fail. | Implement `PolicyEngine` with mandatory deny precedence, explicit tool allowlisting, schema checking, and fail-closed default deny. | Precedence unit tests (`DENY` overriding high confidence / low risk scores). |
| **3. Data Classification & Label Trust** | **NOT IMPLEMENTED** | `src/types/index.ts`, `src/components/policy/DataClassificationGrid.tsx` | Data classification tiers (`PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `RESTRICTED`) are represented visually in UI cards and mock badges. | System does not verify whether classification originates from a trusted backend registry versus an untrusted model JSON proposal. | Create `TrustedDataRegistry` where classifications are bound to immutable backend object IDs rather than model-provided prompt arguments. | Model label manipulation test (model claims `RESTRICTED` record is `PUBLIC`). |
| **4. Destination Registry & Trust Resolution** | **NOT IMPLEMENTED** | `src/components/overview/CrossAgentTopology.tsx`, `src/components/policy/DestinationControls.tsx` | UI displays approved destinations (e.g., `internal_report_db`) and blocked destinations (e.g., `external_sync`). | Destination approval is not resolved against a backend-authoritative registry; model or prompt can inject arbitrary destination names. | Implement `TrustedDestinationRegistry` with strict destination ID resolution, approved classifications, and role restrictions. | Destination manipulation test (untrusted document injecting pseudo-internal destination). |
| **5. Cross-Agent Taint & Provenance Tracking** | **PARTIALLY IMPLEMENTED** | `src/components/overview/CrossAgentTopology.tsx`, `src/components/playground/` | Taint is visually animated in topology diagrams and timeline steppers. | No runtime object wrapping carrying immutable data provenance, source agent ID, hop history, and taint bitflags across agent handoffs. | Build `TaintTracker` and `CrossAgentGuard` maintaining cryptographically signed/immutable data envelopes between agent nodes. | Multi-agent cascade tests (HR -> Report -> Export Agent). |
| **6. Prompt Injection & Heuristic Scanning** | **PARTIALLY IMPLEMENTED** | `src/components/playground/DualInputWorkbench.tsx`, `src/data/mockData.ts` | Regex heuristics and mock vector similarity checks identify standard jailbreak patterns (e.g., `Ignore previous instructions`). | Keyword and heuristic scanners alone are bypassable via obfuscation/token smuggling; scanner alerts are sometimes conflated with actual enforcement. | Implement multi-layer `InputScanner` with Unicode normalization, regex matching, and semantic intent heuristics, strictly decoupled from authorization. | Disguised payload test where scanner misses attack but backend policy engine denies unauthorized action. |
| **7. Audit Logging & Event Correlation** | **PARTIALLY IMPLEMENTED** | `src/pages/AuditPage.tsx`, `src/components/audit/ExportLogsModal.tsx` | Audit logs render 1,248 simulated events with WAL diagnostics and CSV/JSONL export. CSV formula injection is mitigated. | Audit logs lack end-to-end `trace_id` correlation tying model proposals directly to gateway decisions and verifiable executor traces. | Implement structured `AuditLogger` with deterministic trace correlation, credential redaction, and SHA-256 HMAC event hashing. | Log correlation and sensitive payload redaction tests. |
| **8. Benchmark & Evaluation Engine** | **PARTIALLY IMPLEMENTED** | `src/pages/EvaluationPage.tsx`, `src/components/evaluation/` | Evaluation Lab displays 5 metrics (ASR 4.2%, ABR 95.8%, FPR 2.1%, Yield 97.9%, Latency +38ms) with ablation charts. | Metrics are derived from static demo constants rather than dynamically computed from real executed evaluation suites. | Implement `EvaluationRunner` calculating exact mathematical metrics (ASR, ABR, FPR, Yield, Leakage Rate, p50/p95 latency) from test outcomes. | Benchmark calculation tests verifying numerator/denominator accuracy. |

---

## 3. Detailed File and Code Path Analysis

### 3.1 Frontend Entry Points & Routing
- `src/App.tsx`: Maps 7 primary routes (`/overview`, `/attack-playground`, `/live-analysis`, `/policies`, `/audit-logs`, `/evaluation-lab`, `/settings`).
- `src/components/layout/AppShell.tsx`: Houses the top navigation and responsive sidebar.

### 3.2 Security Risk Hotspots
1. **Unchecked Tool Proposals:** In `src/components/playground/DualInputWorkbench.tsx`, the model proposal is simulated directly in state without passing through a formal gateway.
2. **Untrusted Model JSON Arguments:** When an agent proposes a tool call like `export_sync(data_id="HR-992", classification="PUBLIC")`, the classification must never be read from the model payload.
3. **Execution State vs. Authorization Decision:** Previously, `PolicyDecision` (`BLOCKED` vs `ALLOWED`) was conflated with whether code actually executed. The two concepts must be explicitly decoupled into `AuthorizationDecision` (`ALLOW`, `DENY`, `REQUIRE_APPROVAL`) and `ExecutionStatus` (`EXECUTED_IN_SIMULATION`, `BLOCKED`, `NOT_EXECUTED`, `FAILED`).

---

## 4. Remediation Plan

1. **Phase 2–3:** Construct the core `security/` architecture:
   - `src/security/types.ts`: Authoritative security types, decision enums, and execution statuses.
   - `src/security/TrustedDataRegistry.ts`: Backend registry for data classifications.
   - `src/security/TrustedDestinationRegistry.ts`: Backend registry for authorized egress targets.
   - `src/security/TaintTracker.ts`: Provenance and taint propagation engine.
2. **Phase 4:** Construct `CrossAgentGuard.ts` to manage the deterministic 3-agent flow (HR -> Report -> Export).
3. **Phase 5–7:** Construct:
   - `src/security/InputScanner.ts`: Multi-stage prompt injection & evasion detector.
   - `src/security/PolicyEngine.ts`: Hardened policy engine with mandatory deny precedence.
   - `src/security/ExecutionGateway.ts`: Single-point execution gate with instrumented `SimulatedToolExecutor`.
4. **Phase 8–9:** Construct:
   - `src/security/AuditLogger.ts`: Tamper-evident trace ledger.
   - `src/security/EvaluationRunner.ts`: Dynamic benchmark evaluator with formal mathematical metric computations.
5. **Phase 10–11:** Integrate the security engine into all 7 dashboard screens and run comprehensive automated test suites.
