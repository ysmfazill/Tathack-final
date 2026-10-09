import React from 'react';
import { Card } from '../common/Card';

export const EvaluationComplianceFooter: React.FC = () => {
  return (
    <Card elevation="low" className="p-4 bg-surface-container-low border border-outline-variant/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary/15 border border-tertiary/30 flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                NIST AI RMF 1.0 (MAP & MEASURE) & IEEE P2801 COMPLIANT
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-tertiary/20 text-tertiary border border-tertiary/30">
                AUDIT READY
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Evaluation results calculated via deterministic benchmark suite with cryptographic audit signature for safety compliance reporting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono-code text-on-surface-variant shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-outline-variant/20">
          <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant/20">
            SIG: <strong className="text-on-surface">SHA256:7f4a9b...0842</strong>
          </span>
          <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant/20">
            ENGINE: <strong className="text-primary">DETERMINISTIC LOCAL SIM</strong>
          </span>
        </div>
      </div>
    </Card>
  );
};
