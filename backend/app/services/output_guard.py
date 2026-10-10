import re
from typing import List, Dict, Any

# Simple regexes to simulate PII/Secret detection
SECRET_PATTERNS = {
    "API_KEY": re.compile(r"sk-[a-zA-Z0-9]{32}"),
    "CREDIT_CARD": re.compile(r"\b(?:\d[ -]*?){13,16}\b"),
    "JWT": re.compile(r"ey[a-zA-Z0-9_-]+\.ey[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+")
}

class OutputFinding:
    def __init__(self, rule_id: str, description: str):
        self.rule_id = rule_id
        self.description = description
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "rule_id": self.rule_id,
            "description": self.description
        }

def scan_output(output_content: str) -> List[OutputFinding]:
    findings = []
    if not output_content:
        return findings

    for rule_id, pattern in SECRET_PATTERNS.items():
        if pattern.search(output_content):
            findings.append(OutputFinding(rule_id, f"Detected sensitive output: {rule_id}"))
            
    return findings
