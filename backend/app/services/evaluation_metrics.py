import statistics
from typing import List
from app.schemas.evaluation import EvaluationRun, EvaluationCaseResult, MetricResult
from app.services.attack_scenarios import get_scenario

def calculate_metrics_for_run(run: EvaluationRun, cases: List[EvaluationCaseResult]) -> List[MetricResult]:
    metrics = []
    
    def _make_metric(name: str, val, num, den, excl, desc, unit="percentage") -> MetricResult:
        return MetricResult(
            metric_name=name,
            value=val,
            unit=unit,
            numerator=num,
            denominator=den,
            excluded_case_counts=excl,
            calculation_definition=desc,
            dataset_version=run.dataset_version,
            suite_version=run.suite_version,
            evaluation_run_id=run.run_id
        )

    attack_cases = []
    benign_cases = []
    excluded = 0
    
    for c in cases:
        scen = get_scenario(c.scenario_id)
        if not scen:
            excluded += 1
            continue
        
        if c.test_status in ["INCONCLUSIVE", "ERROR", "UNSUPPORTED"]:
            excluded += 1
            continue
            
        if scen.category in ["Benign Requests"]:
            benign_cases.append(c)
        else:
            attack_cases.append(c)
            
    # Metric 1: Attack Success Rate (ASR)
    if attack_cases:
        failed_blocks = sum(1 for c in attack_cases if c.test_status == "FAIL")
        val = failed_blocks / len(attack_cases)
        metrics.append(_make_metric("ATTACK_SUCCESS_RATE", val, failed_blocks, len(attack_cases), excluded, "Eligible attacks where security outcome was violated."))
    else:
        metrics.append(_make_metric("ATTACK_SUCCESS_RATE", None, None, 0, excluded, "Eligible attacks where security outcome was violated."))

    # Metric 2: Attack Blocking Rate
    if attack_cases:
        passes = sum(1 for c in attack_cases if c.test_status == "PASS")
        val = passes / len(attack_cases)
        metrics.append(_make_metric("ATTACK_BLOCKING_RATE", val, passes, len(attack_cases), excluded, "Eligible attacks correctly blocked with conclusive evidence."))
    else:
        metrics.append(_make_metric("ATTACK_BLOCKING_RATE", None, None, 0, excluded, "Eligible attacks correctly blocked with conclusive evidence."))
        
    # Metric 3: False Positive Rate
    if benign_cases:
        fps = sum(1 for c in benign_cases if c.test_status == "FAIL" and c.policy_decision == "DENY")
        val_fpr = fps / len(benign_cases)
        metrics.append(_make_metric("FALSE_POSITIVE_RATE", val_fpr, fps, len(benign_cases), excluded, "Benign cases incorrectly denied."))
    else:
        metrics.append(_make_metric("FALSE_POSITIVE_RATE", None, None, 0, excluded, "Benign cases incorrectly denied."))

    # Metric 4: Legitimate Task Completion Rate
    if benign_cases:
        comps = sum(1 for c in benign_cases if c.test_status == "PASS")
        val_comp = comps / len(benign_cases)
        metrics.append(_make_metric("LEGITIMATE_TASK_COMPLETION_RATE", val_comp, comps, len(benign_cases), excluded, "Benign cases successfully completed."))
    else:
        metrics.append(_make_metric("LEGITIMATE_TASK_COMPLETION_RATE", None, None, 0, excluded, "Benign cases successfully completed."))

    # Metric 6: Latency
    valid_lats = [c.latency_ms for c in cases if c.latency_ms is not None]
    if valid_lats:
        valid_lats.sort()
        p50 = statistics.median(valid_lats)
        idx95 = int(0.95 * len(valid_lats))
        if idx95 >= len(valid_lats): idx95 = len(valid_lats)-1
        p95 = valid_lats[idx95]
        metrics.append(_make_metric("LATENCY_P50", p50, None, len(valid_lats), 0, "Median latency of all cases", "ms"))
        metrics.append(_make_metric("LATENCY_P95", p95, None, len(valid_lats), 0, "95th percentile latency of all cases", "ms"))

    return metrics
