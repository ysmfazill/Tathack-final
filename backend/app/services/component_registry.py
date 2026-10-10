from typing import List, Dict, Any

def get_component_registry() -> List[Dict[str, Any]]:
    return [
        {
            "id": "comp-1",
            "name": "Input Scanner",
            "description": "Pattern matching & prompt injection heuristics",
            "icon": "manage_search",
            "status": "IMPLEMENTED",
            "health": "100%",
            "latency": "Live",
            "lastRun": "Live",
            "inspectionDetails": "Lexical regex filters and fast ASCII/Unicode homoglyph normalizers. Intercepts direct prompt injection attempts before tokenization.",
            "is_registered": True,
            "runtime_hook_active": True
        },
        {
            "id": "comp-2",
            "name": "Counterfactual Analysis",
            "description": "Twin-execution action divergence model",
            "icon": "compare_arrows",
            "status": "IMPLEMENTED",
            "health": "100%",
            "latency": "Live",
            "lastRun": "Live",
            "inspectionDetails": "Evaluates parallel hypothetical branches of proposed tool commands to determine if outcome diverges from legitimate intent.",
            "is_registered": True,
            "runtime_hook_active": True
        },
        {
            "id": "comp-3",
            "name": "Taint-Aware Authorization",
            "description": "Data provenance tracking & argument taint flags",
            "icon": "lock_person",
            "status": "IMPLEMENTED",
            "health": "100%",
            "latency": "Live",
            "lastRun": "Live",
            "inspectionDetails": "Maintains bitwise provenance tags across input contexts. If an argument originated from untrusted external content, high-privilege tool execution is denied.",
            "is_registered": True,
            "runtime_hook_active": True
        },
        {
            "id": "comp-4",
            "name": "Honey-Tool Detection",
            "description": "Canary function decoys & tripwire traps",
            "icon": "pest_control",
            "status": "IMPLEMENTED",
            "health": "100%",
            "latency": "Live",
            "lastRun": "Live",
            "inspectionDetails": "Exposes fictitious tools (e.g. exec_shell_raw, export_root_creds) to the agent context. Any invocation immediately raises a Critical Tripwire alert.",
            "is_registered": True,
            "runtime_hook_active": True
        },
        {
            "id": "comp-5",
            "name": "Cross-Agent Data Guard",
            "description": "Inter-agent communication bus boundary",
            "icon": "hub",
            "status": "IMPLEMENTED",
            "health": "100%",
            "latency": "Live",
            "lastRun": "Live",
            "inspectionDetails": "Inspects structured message envelopes exchanged across autonomous agent swarms, preventing indirect prompt injection and cascading privilege escalation.",
            "is_registered": True,
            "runtime_hook_active": True
        },
        {
            "id": "comp-6",
            "name": "Output Guard",
            "description": "PII & Secret regex masking engine",
            "icon": "vpn_key",
            "status": "IMPLEMENTED",
            "health": "100%",
            "latency": "Live",
            "lastRun": "Live",
            "inspectionDetails": "Performs streaming regex and entropy checks across model responses, masking API keys, JWT tokens, credit cards, and SSNs before egress.",
            "is_registered": True,
            "runtime_hook_active": True
        }
    ]
