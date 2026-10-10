# PromptGuard AI - Phase 28 Detection Report

## Executive Summary
A lightweight, high-performance agent behaviour detection engine was introduced into the PromptGuard AI backend. This detector operates completely independently of any LLM (Ollama) inference and provides heuristic context (unknown tools, suspicious data transfer endpoints, rapid repeated errors) to the audit log. The engine achieves a p95 execution latency of < 0.01 ms, comfortably meeting the < 5ms requirement.

**Final Verdict:** COMPLETE

## Detector Design
The detector was designed to be synchronous and purely heuristic, relying on precomputed lists and in-memory bound-limited queues (`collections.deque` mapped by `agent_id`).
The detector calculates a `risk_score` and flags an `is_anomaly` boolean if the score crosses a deterministic threshold (0.7). The detector is fully isolated in `backend/app/services/behaviour_detector.py`.

### Supported Behavioural Signals
- **`UNKNOWN_TOOL`**: Triggers if the requested tool does not exist in the active `TOOL_REGISTRY`. (Severity: HIGH, Risk: +0.8).
- **`SUSPICIOUS_TRANSFER_DESTINATION`**: Triggers if a sensitive tool (e.g., `transfer_demo_records` or `export_demo_report`) attempts to send data to an untrusted external agent. (Severity: HIGH, Risk: +0.6).
- **`REPEATED_HIGH_RISK_ACTION`**: Triggers if the agent has repeatedly invoked the same tool in a short sliding window, combined with existing high risk. (Severity: CRITICAL, Risk: +0.5).

## Integration Point & Security Boundary
The detector is integrated directly inside `execute_authorized_action` in `backend/app/services/execution_gateway.py`.
It runs *before* the deterministic policy engine evaluates the action.
**Crucially, the detector is advisory only.**
- It does not mutate the request.
- It does not bypass the policy engine.
- Its outputs (`risk_score`, `is_anomaly`, `signals`) are attached to the `safe_metadata` of the `EXECUTION_REQUESTED` audit event.
The execution gateway proceeds to independently enforce rules (e.g., unknown tools will subsequently be denied by the gateway regardless of the detector's score).

## Failure Handling
The detector encapsulates its logic within a broad `try-except` block.
If an unexpected exception occurs, the detector safely degrades, returning `is_anomaly=False`, `risk_score=0.0`, and appending a `DETECTOR_ERROR` signal containing the exception string. This prevents detector failure from blocking legitimate traffic or bypassing the execution gateway's mandatory authorization checks.

## Benchmark Methodology
A Python script (`backend/scripts/benchmark_detector.py`) was created to simulate workload.
- **Warmup:** 1,000 requests.
- **Test Set:** 10,000 requests consisting of a 10:10:80 mix of Unknown Tools, Suspicious Transfers, and Normal Safe Actions.
- **Measurement:** Latency is measured directly across the detector's logic block using `time.perf_counter_ns()`.

### Benchmark Results
- **Throughput:** ~297,786 requests/sec
- **Total test time:** 33.58 ms
- **p50 Latency:** 0.0012 ms
- **p95 Latency:** 0.0034 ms
- **p99 Latency:** 0.0061 ms
- **Max Latency:** 0.0893 ms
- **Target Met:** Yes (Sub-5ms requirement easily achieved).

## Test Results
6 new tests were added in `test_behaviour_detector.py` to validate:
- Normal safe behaviour.
- Unknown tool identification.
- Suspicious transfer detection.
- Bounded history checking for repeated risky actions.
- Empty/malformed input handling.
- Oversized input handling (to ensure it doesn't artificially spike risk).
All 6 detector tests and the existing 57 integration tests passed seamlessly, confirming that the new detection engine does not weaken existing authorization assertions.

## Known Limitations
- The detector's in-memory `agent_history` is ephemeral and bound by a hard limit (`AGENT_STATE_SIZE = 1000`). If scaled across multiple instances, it would require a centralized store (e.g., Redis) which would add network latency (typically 1-2ms).
- The current implementation of `REPEATED_HIGH_RISK_ACTION` only looks at bursts of the exact same tool sequentially, rather than complex temporal patterns.
