import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const RiskThresholdsSection: React.FC = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between opacity-75">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">tune</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-outline">
                Risk Thresholds
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Deterministic boundaries controlling automated approval states.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-caps text-label-caps text-outline px-2.5 py-1 rounded border border-outline-variant/30 font-semibold bg-surface-container">
              UNSUPPORTED BY BACKEND
            </span>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> The backend FastAPI execution gateway relies entirely on deterministic policy evaluation. Risk score heuristics and thresholds are currently not consumed by the runtime architecture. Modifying these values would have no effect on policy decisions.
        </div>

        {/* 4 Threshold Definition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md pointer-events-none grayscale opacity-60">
          {/* Low */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-tertiary">
                Low Risk
              </span>
              <span className="font-mono-code text-[11px] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/30 font-bold">
                &lt; 0.30
              </span>
            </div>
          </div>

          {/* Medium */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-secondary">
                Medium Risk
              </span>
              <span className="font-mono-code text-[11px] text-secondary bg-secondary-container/20 px-1.5 py-0.5 rounded border border-secondary/30 font-bold">
                0.30 - 0.70
              </span>
            </div>
          </div>

          {/* High */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-primary">
                High Risk
              </span>
              <span className="font-mono-code text-[11px] text-primary bg-primary-container/20 px-1.5 py-0.5 rounded border border-primary/30 font-bold">
                0.70 - 0.85
              </span>
            </div>
          </div>

          {/* Critical */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-error">
                Critical Halt
              </span>
              <span className="font-mono-code text-[11px] text-error bg-error-container/20 px-1.5 py-0.5 rounded border border-error/30 font-bold">
                ≥ 0.85
              </span>
            </div>
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
              Explicit policy rules (e.g., POL-704 cross-agent egress) <strong className="text-on-surface">ALWAYS</strong> take precedence over heuristic risk scores. The backend is configured to exclusively use explicit deterministic rules.
            </p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-space-xs pointer-events-none opacity-50">
        <Button variant="primary" size="sm" disabled>
          Apply Configuration
        </Button>
      </div>
    </Card>
  );
};
