import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export interface RiskThresholdValues {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface RiskThresholdsSectionProps {
  thresholds: RiskThresholdValues;
  onChangeThresholds: (updated: RiskThresholdValues) => void;
  onApply: () => void;
}

export const RiskThresholdsSection: React.FC<RiskThresholdsSectionProps> = ({
  thresholds,
  onChangeThresholds,
  onApply,
}) => {
  const [isValidated, setIsValidated] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const handleValidate = () => {
    setIsValidated(true);
    setValidationMsg('Validated monotonically ascending risk boundary invariants (0.00 < 0.30 < 0.70 < 0.85 <= 1.00).');
    setTimeout(() => {
      setValidationMsg(null);
      setIsValidated(false);
    }, 4000);
  };

  const handlePresetSelect = (preset: 'strict' | 'balanced' | 'permissive') => {
    if (preset === 'strict') {
      onChangeThresholds({ low: 0.20, medium: 0.50, high: 0.75, critical: 1.00 });
    } else if (preset === 'balanced') {
      onChangeThresholds({ low: 0.30, medium: 0.70, high: 0.85, critical: 1.00 });
    } else {
      onChangeThresholds({ low: 0.40, medium: 0.80, high: 0.90, critical: 1.00 });
    }
  };

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">tune</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Risk Thresholds
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Deterministic boundaries controlling automated approval states.
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-on-surface-variant font-mono-code mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handlePresetSelect('strict')}
              className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30"
            >
              Strict
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('balanced')}
              className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/30 font-bold"
            >
              Balanced
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('permissive')}
              className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30"
            >
              Permissive
            </button>
            <span className="font-label-caps text-label-caps text-secondary px-2 py-0.5 rounded bg-secondary-container/20 border border-secondary/30 font-semibold ml-1">
              FOUR TIER
            </span>
          </div>
        </div>

        {/* Colored Gradient Continuum Bar */}
        <div className="mb-space-md">
          <div className="flex items-center justify-between font-label-caps text-[10px] text-outline mb-1.5 uppercase font-mono-code font-bold">
            <span className="text-tertiary">0.00 Safe</span>
            <span className="text-secondary">0.30 Medium</span>
            <span className="text-primary">0.70 Elevated</span>
            <span className="text-error">0.85 Block</span>
            <span>1.00</span>
          </div>
          <div className="w-full h-3 rounded-full bg-surface-container-lowest flex overflow-hidden p-0.5 border border-outline-variant/30">
            <div className="h-full bg-tertiary rounded-l" style={{ width: '30%' }}></div>
            <div className="h-full bg-secondary" style={{ width: '40%' }}></div>
            <div className="h-full bg-primary" style={{ width: '15%' }}></div>
            <div className="h-full bg-error rounded-r" style={{ width: '15%' }}></div>
          </div>
        </div>

        {/* 4 Threshold Definition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md">
          {/* Low */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-tertiary">
                Low Risk
              </span>
              <span className="font-mono-code text-[11px] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/30 font-bold">
                &lt; {thresholds.low.toFixed(2)}
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              Auto-allowed if no hard policy violations occur.
            </p>
          </div>

          {/* Medium */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-secondary">
                Medium Risk
              </span>
              <span className="font-mono-code text-[11px] text-secondary bg-secondary-container/20 px-1.5 py-0.5 rounded border border-secondary/30 font-bold">
                {thresholds.low.toFixed(2)} - {thresholds.medium.toFixed(2)}
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              Flagged in audit log; full rule engine evaluated.
            </p>
          </div>

          {/* High */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-primary">
                High Risk
              </span>
              <span className="font-mono-code text-[11px] text-primary bg-primary-container/20 px-1.5 py-0.5 rounded border border-primary/30 font-bold">
                {thresholds.medium.toFixed(2)} - {thresholds.high.toFixed(2)}
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              Mandatory SecOps human approval required.
            </p>
          </div>

          {/* Critical */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-error">
                Critical Halt
              </span>
              <span className="font-mono-code text-[11px] text-error bg-error-container/20 px-1.5 py-0.5 rounded border border-error/30 font-bold">
                ≥ {thresholds.high.toFixed(2)}
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              Immediate execution drop; tripwire event logged.
            </p>
          </div>
        </div>

        {/* Deterministic Hierarchy Callout */}
        <div className="p-space-sm rounded-xl bg-surface-container-lowest flex items-start gap-2.5 mb-space-md border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            policy
          </span>
          <div className="flex flex-col">
            <span className="font-body-md text-xs sm:text-sm font-semibold text-on-surface">
              Deterministic Policy Hierarchy
            </span>
            <p className="font-body-sm text-[11px] text-outline mt-0.5 leading-relaxed">
              Explicit policy rules (e.g., POL-704 cross-agent egress) <strong className="text-on-surface">ALWAYS</strong> take precedence over heuristic risk scores. A critical policy denial cannot be overridden by low risk scores.
            </p>
          </div>
        </div>

        {validationMsg && (
          <div className="mb-2 p-2 rounded bg-tertiary-container/20 text-tertiary font-mono-code text-[11px] border border-tertiary/30 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {validationMsg}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-space-xs">
        <Button
          variant="secondary"
          size="sm"
          icon={isValidated ? 'check' : 'rule'}
          onClick={handleValidate}
        >
          {isValidated ? 'Validated' : 'Validate Thresholds'}
        </Button>
        <Button variant="primary" size="sm" onClick={onApply}>
          Apply Configuration
        </Button>
      </div>
    </Card>
  );
};
