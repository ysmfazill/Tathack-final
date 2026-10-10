# PromptGuard AI - Phase 28 Detection Optimization Report

## Executive Summary
This phase addresses the discrepancy between the perceived evaluation latency on the dashboard (~90-150ms) and the actual performance of the sub-5ms behaviour detection engine. Thorough tracing revealed that the dashboard metric (`LATENCY_P50`/`LATENCY_P95`) measures the *end-to-end* scenario simulation loop, heavily skewed by synchronous SQLite database persistence operations (`_persist_run` and `_persist_case`). 

To resolve this without fabricating data, comprehensive internal timing metrics were injected across the `ExecutionGateway` to isolate component latencies. The standalone deterministic behaviour detector was re-verified at **p95 < 0.01 ms**, fully achieving the sub-5ms target.

**Final Verdict:** COMPLETE

## Root Cause of Latency Discrepancy
The `LATENCY_P50` displayed on the dashboard is calculated in `backend/app/services/evaluation_engine.py`:
```python
start_ms = time.monotonic() * 1000
pg_res = run_scenario(scenario_id)
end_ms = time.monotonic() * 1000
latency = end_ms - start_ms
```
The `run_scenario` function sequentially:
1. Hydrates the scenario from the local filesystem.
2. Executes the full deterministic gateway (which includes the fast detector).
3. Evaluates complex fallback mock risk scores.
4. Opens a synchronous SQLite connection, executes multiple queries (creating tables, inserts), and commits (`_persist_run`).

Database I/O represents >95% of this reported latency.

## Metric Separation
Instead of modifying the definition of total latency, we introduced a `timing_metrics` dictionary mapped directly onto `ExecutionResponse` and `PlaygroundRunResult`.

The following metrics are now recorded independently using monotonic `time.perf_counter_ns()` tracing:
1. `behaviour_detection_ms` (In `execution_gateway.py`)
2. `audit_persistence_ms` (In `execution_gateway.py` representing `record_audit_event`)
3. `gateway_processing_ms` (In `execution_gateway.py` spanning the entire request)
4. `deterministic_policy_evaluation_ms` (In `execution_gateway.py` over `evaluate_action`)
5. `approval_validation_ms` (In `execution_gateway.py`)
6. `latency_ms` (Ollama Inference Latency, tracked in `analysis.py`)

These metrics accurately decompose the latency without masking the database overhead from the total simulated response times.

## Detector Implementation and Optimization
The detector (`behaviour_detector.py`) operates fully in-memory:
- Lookups against the constant `TOOL_REGISTRY` (O(1)).
- Checking against a size-bounded `collections.deque` mapped by `agent_id` (O(1) append/read).
- Pre-compiled evaluation criteria requiring zero external LLM context.
- **Constraints preserved**: It remains strictly advisory, injecting its findings into `safe_metadata` of the audit log prior to formal authorization block evaluation.

## Benchmark Results (Detector Isolated)
A Python script (`backend/scripts/benchmark_detector.py`) simulates a load of 10,000 randomized execution requests.

- **Throughput:** ~268,975 requests/sec
- **Total test time:** 37.18 ms
- **p50 Latency:** 0.0014 ms
- **p95 Latency:** 0.0039 ms
- **p99 Latency:** 0.0065 ms
- **Max Latency:** 0.1972 ms
- **Target Met:** Yes (Sub-5ms requirement easily achieved).

## Security Regressions Validation
- **Executed:** `python -m pytest -q`
- **Results:** 63/63 passed seamlessly. 
- The newly introduced metrics schema on `ExecutionResponse` triggered no schema violations.
- Unknown/disabled tools and unauthorized transfers remain blocked by the underlying policy engine regardless of detector telemetry.
- `npm run build` completed successfully, ensuring the frontend TS interfaces accommodate new optional metric fields.

## Remaining Limitations
- While the dashboard accurately tracks end-to-end execution, the frontend currently does not display the granular `timing_metrics` dictionary attached to the payload. A UI update to the 'Evaluation Lab' would be required to render the component waterfall.
- Synchronous SQLite writing during high-volume playground simulations remains a bottleneck for *total* latency. Future optimization should involve asynchronous persistence queues.
