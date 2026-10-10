import re
from typing import List, Dict, Any

# Simple regexes that won't cause ReDoS
SUSPICIOUS_PATTERNS = {
    "SQLI_OR_TRUE": re.compile(r"or\s+1\s*=\s*1", re.IGNORECASE),
    "PROMPT_INJECTION_IGNORE": re.compile(r"ignore (all )?previous instructions", re.IGNORECASE),
    "SYSTEM_PROMPT_LEAK": re.compile(r"what is your system prompt", re.IGNORECASE)
}

MAX_INPUT_SIZE = 10000

class ScannerFinding:
    def __init__(self, rule_id: str, description: str):
        self.rule_id = rule_id
        self.description = description
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "rule_id": self.rule_id,
            "description": self.description
        }

def scan_input(text: str) -> List[ScannerFinding]:
    findings = []
    if not text:
        return findings
        
    if len(text) > MAX_INPUT_SIZE:
        text = text[:MAX_INPUT_SIZE]
        findings.append(ScannerFinding("INPUT_TRUNCATED", f"Input exceeded maximum size of {MAX_INPUT_SIZE} bytes."))

    for rule_id, pattern in SUSPICIOUS_PATTERNS.items():
        if pattern.search(text):
            findings.append(ScannerFinding(rule_id, f"Matched suspicious pattern: {rule_id}"))
            
    return findings
