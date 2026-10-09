import React from 'react';
import { Card } from '../common/Card';

interface SecurityParam {
  label: string;
  sublabel: string;
  value: string;
  badgeStyle: 'tertiary' | 'error' | 'secondary' | 'neutral';
}

const SECURITY_PARAMS: SecurityParam[] = [
  {
    label: 'Tool Execution Gateway',
    sublabel: 'Deterministic interception layer',
    value: 'ENFORCED',
    badgeStyle: 'tertiary'
  },
  {
    label: 'Unknown Tool Handling',
    sublabel: 'Unregistered schema behavior',
    value: 'DENY BY DEFAULT',
    badgeStyle: 'error'
  },
  {
    label: 'Protected Action Failure Mode',
    sublabel: 'Auth daemon unreachable',
    value: 'FAIL-CLOSED',
    badgeStyle: 'error'
  },
  {
    label: 'Approval Verification',
    sublabel: 'Payload SHA-256 HMAC binding',
    value: 'CRYPTOGRAPHIC',
    badgeStyle: 'secondary'
  },
  {
    label: 'Max Request Input Size',
    sublabel: 'Prevents memory heap flood',
    value: '64 KB',
    badgeStyle: 'neutral'
  },
  {
    label: 'Execution Watchdog Timeout',
    sublabel: 'Per tool invocation dispatch',
    value: '15.0s',
    badgeStyle: 'neutral'
  }
];

export const RuntimeSecurityControls: React.FC = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">shield_lock</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Runtime Security Controls
            </h2>
          </div>
          <span className="font-label-caps text-label-caps text-primary px-2.5 py-1 rounded bg-primary-container/20 border border-primary/30 font-semibold">
            BACKEND GATE
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {SECURITY_PARAMS.map((param) => (
            <div
              key={param.label}
              className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container border border-outline-variant/20"
            >
              <div className="flex flex-col">
                <span className="font-body-md text-xs sm:text-sm text-on-surface font-semibold">
                  {param.label}
                </span>
                <span className="font-body-sm text-[11px] text-outline">
                  {param.sublabel}
                </span>
              </div>
              <span
                className={`font-mono-code text-[11px] px-2.5 py-0.5 rounded font-bold ${
                  param.badgeStyle === 'tertiary'
                    ? 'text-tertiary bg-tertiary-container/20 border border-tertiary/30'
                    : param.badgeStyle === 'error'
                    ? 'text-error bg-error-container/20 border border-error/30'
                    : param.badgeStyle === 'secondary'
                    ? 'text-secondary bg-secondary-container/20 border border-secondary/30'
                    : 'text-on-surface bg-surface-container-high border border-outline-variant/30'
                }`}
              >
                {param.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lock Notice */}
      <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-lowest/90 flex items-start gap-2 text-outline font-mono-code text-[11px] border border-outline-variant/20">
        <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">lock</span>
        <span>
          Security parameters are enforced deterministically at the backend runtime layer and cannot be bypassed via UI.
        </span>
      </div>
    </Card>
  );
};
