import type { ScannerResult, ScannerSignal } from './types.ts';

/**
 * Multi-layer Input Scanner
 * 
 * Performs lexical analysis, zero-width / homoglyph normalization,
 * and canary trap detection.
 * 
 * NOTE: The scanner provides advisory signals. In accordance with
 * Defense-in-Depth principles, the Backend Policy Engine remains the
 * sole authoritative enforcement boundary.
 */
class InputScannerImpl {
  private readonly PROMPT_INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    /system\s+prompt\s+(override|leak|dump)/i,
    /you\s+are\s+now\s+in\s+developer\s+mode/i,
    /jailbreak|dan\s+mode/i,
    /disregard\s+(all\s+)?safety\s+guidelines/i,
    /base64\s+dump/i,
  ];

  private readonly HONEY_TOOLS = [
    'exec_shell_raw',
    'export_root_creds',
    'drop_database_tables',
    'bypass_guard_admin',
    'kernel_patch_direct',
  ];

  public scan(rawInput: string): ScannerResult {
    const signals: ScannerSignal[] = [];
    const normalizedInput = this.normalizeUnicode(rawInput);

    // 1. Zero-width character & obfuscation check
    const zeroWidthDetected = /[\u200B-\u200D\uFEFF]/.test(rawInput);
    if (zeroWidthDetected) {
      signals.push({
        layer: 'unicode_normalizer',
        detected: true,
        score: 0.85,
        reason: 'Zero-width Unicode obfuscation / token-smuggling sequence detected.',
        matchedPattern: 'ZERO_WIDTH_JOINER',
      });
    }

    // 2. Lexical / Regex Matching on normalized input
    for (const pattern of this.PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(normalizedInput)) {
        signals.push({
          layer: 'lexical',
          detected: true,
          score: 0.90,
          reason: `Pattern match for adversarial prompt injection phrase: "${pattern.source}"`,
          matchedPattern: pattern.source,
        });
        break;
      }
    }

    // 3. Honey-Tool Canary Trap
    for (const honey of this.HONEY_TOOLS) {
      if (normalizedInput.toLowerCase().includes(honey.toLowerCase())) {
        signals.push({
          layer: 'honey_tool',
          detected: true,
          score: 1.0,
          reason: `Canary tripwire triggered: invocation reference to decoy honey-tool "${honey}".`,
          matchedPattern: honey,
        });
        break;
      }
    }

    // 4. Semantic Intent Heuristics (e.g. data exfiltration acrostic/steganography intent)
    if (
      /first\s+letter\s+of\s+each\s+(word|sentence|paragraph)\s+spells/i.test(normalizedInput) ||
      /encode\s+into\s+markdown\s+table\s+headers/i.test(normalizedInput)
    ) {
      signals.push({
        layer: 'semantic_intent',
        detected: true,
        score: 0.80,
        reason: 'Steganographic / Covert channel data extraction intent detected.',
      });
    }

    // Calculate composite risk score (maximum of individual signals or 0.0)
    const compositeRiskScore = signals.length > 0
      ? Math.max(...signals.map((s) => s.score))
      : 0.05; // baseline noise

    const isFlagged = compositeRiskScore >= 0.70;

    return {
      isFlagged,
      compositeRiskScore,
      signals,
      sanitizedInput: normalizedInput.trim(),
      normalizedInput,
    };
  }

  private normalizeUnicode(str: string): string {
    if (!str) return '';
    // Strip zero-width non-joiners & hidden control chars
    return str
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .normalize('NFKC');
  }
}

export const InputScanner = new InputScannerImpl();
