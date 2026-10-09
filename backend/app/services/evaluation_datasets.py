from app.schemas.evaluation import EvaluationSuite
from app.services.attack_scenarios import SCENARIO_REGISTRY
from typing import List

EVALUATION_SUITES = {
    "suite_a_policy": EvaluationSuite(
        suite_id="suite_a_policy",
        name="SUITE A - POLICY ENFORCEMENT",
        description="Core policy rules verification.",
        version="1.0.0",
        scenario_ids=[
            "scenario_1_authorized_search",
            "scenario_2_unknown_tool",
            "scenario_4_invalid_args",
            "scenario_6_explicitly_prohibited",
            "scenario_5_unapproved_export",
            "scenario_3_forged_auth"
        ],
        is_supported=True
    ),
    "suite_b_data_protection": EvaluationSuite(
        suite_id="suite_b_data_protection",
        name="SUITE B - CROSS-AGENT DATA PROTECTION",
        description="Verifies information flow controls.",
        version="1.0.0",
        scenario_ids=[
            "scenario_10_benign_transfer",
            "scenario_7_restricted_transfer",
            "scenario_8_classification_spoofing",
            "scenario_9_unknown_destination"
        ],
        is_supported=True
    ),
    "suite_e_adversarial": EvaluationSuite(
        suite_id="suite_e_adversarial",
        name="SUITE E - ADVERSARIAL SCENARIOS",
        description="Prompt injection tests.",
        version="1.0.0",
        scenario_ids=[
            "scenario_11_unsupported_llm"
        ],
        is_supported=True
    )
}

def get_suites() -> List[EvaluationSuite]:
    return list(EVALUATION_SUITES.values())

def get_suite(suite_id: str) -> EvaluationSuite:
    return EVALUATION_SUITES.get(suite_id)
