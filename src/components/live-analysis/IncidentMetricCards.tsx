import React from 'react';

interface IncidentMetricCardsProps {
  riskScore: number; // e.g. 0.96
  decision: 'BLOCKED' | 'PERMITTED' | 'QUARANTINED';
  toolStatus: 'NOT EXECUTED' | 'EXECUTED' | 'SANITIZED';
  triggeredDefenses: string; // e.g. "3 of 7 Active"
  defensePercentage: string; // e.g. "42.8%"
}

export const IncidentMetricCards: React.FC<IncidentMetricCardsProps> = ({
  riskScore,
  decision,
  toolStatus,
  triggeredDefenses,
  defensePercentage,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* Card 1: Risk Level */}
      <div className="relative overflow-hidden bg-error-container/30 border border-error/40 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-error tracking-wider uppercase font-semibold">
            Risk Level
          </span>
          <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-mono-code text-[10px] tracking-wide uppercase font-semibold border border-error/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-error font-bold leading-none">
            CRITICAL
          </span>
          <span className="px-2 py-0.5 rounded-full bg-error/20 text-error font-mono-metric text-mono-metric font-semibold border border-error/30">
            {riskScore.toFixed(2)} / 1.00
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[14px] text-error">gpp_maybe</span>
          <span>High-confidence exfiltration vector</span>
        </div>
      </div>

      {/* Card 2: Security Decision */}
      <div className="relative overflow-hidden bg-surface-container border border-outline-variant/30 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
            Security Decision
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-mono-code text-[10px] tracking-wide uppercase border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span
            className={`font-headline-xl text-headline-xl font-bold leading-none ${
              decision === 'BLOCKED' ? 'text-error' : 'text-tertiary'
            }`}
          >
            {decision}
          </span>
          <span className="px-2 py-0.5 rounded bg-error/20 text-error font-label-caps text-label-caps tracking-wider uppercase font-semibold border border-error/30">
            Zero-Day Policy Halt
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[14px] text-error">do_not_disturb_on</span>
          <span>Gatekeeper dropped proposed action</span>
        </div>
      </div>

      {/* Card 3: Tool Execution */}
      <div className="relative overflow-hidden bg-surface-container border border-outline-variant/30 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
            Tool Execution
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-mono-code text-[10px] tracking-wide uppercase border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">
            {toolStatus}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-error ring-2 ring-error/30"></span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span>
          <span className="truncate">Halted before runtime socket dispatch</span>
        </div>
      </div>

      {/* Card 4: Triggered Defenses */}
      <div className="relative overflow-hidden bg-surface-container border border-outline-variant/30 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-secondary tracking-wider uppercase font-semibold">
            Triggered Defenses
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-mono-code text-[10px] tracking-wide uppercase border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-secondary font-bold leading-none">
            {triggeredDefenses}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-mono-metric text-mono-metric font-semibold border border-secondary/30">
            {defensePercentage}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm truncate">
          <span className="material-symbols-outlined text-[14px] text-secondary">hub</span>
          <span className="truncate">Scanner, Taint, Cross-Agent Guard</span>
        </div>
      </div>
    </section>
  );
};
