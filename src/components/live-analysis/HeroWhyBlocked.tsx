import React from 'react';

interface HeroWhyBlockedProps {
  proposedAction: string;
  sourceAgent: string;
  sourceAgentId: string;
  destination: string;
  classification: string;
  taintedFieldsCount: number;
  violatedPolicy: string;
  policyDescription: string;
  authDecision: string;
  executionStatus: string;
  detailedReason: string;
  latencyText: string;
  onViewPolicy?: () => void;
  onOpenAudit?: () => void;
}

export const HeroWhyBlocked: React.FC<HeroWhyBlockedProps> = ({
  proposedAction,
  sourceAgent,
  sourceAgentId,
  destination,
  classification,
  taintedFieldsCount,
  violatedPolicy,
  policyDescription,
  authDecision,
  executionStatus,
  detailedReason,
  latencyText,
  onViewPolicy,
  onOpenAudit,
}) => {
  return (
    <section className="relative bg-surface-container-high rounded-xl p-space-lg shadow-xl overflow-hidden border border-outline-variant/40">
      {/* Glow and background accent */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-error/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative flex flex-col gap-space-md">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-error-container/40 flex items-center justify-center text-error shadow-inner border border-error/30">
              <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  WHY WAS THIS BLOCKED?
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/20 text-error font-label-caps text-label-caps uppercase font-semibold border border-error/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                  Policy Gate Tripped
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Deterministic evaluation intercepted unauthorized data exfiltration pathway.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={onViewPolicy}
              className="px-3 py-1.5 bg-surface-container text-on-surface hover:bg-surface-bright rounded text-body-sm font-body-sm font-medium transition-colors shadow-sm flex items-center gap-1.5 border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">policy</span>
              <span>View Policy Rule ({violatedPolicy})</span>
            </button>
            <button
              onClick={onOpenAudit}
              className="px-3 py-1.5 bg-primary text-on-primary hover:bg-inverse-primary rounded text-body-sm font-body-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Open Full Audit Event</span>
            </button>
          </div>
        </div>

        {/* Decision Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-sm mt-2">
          <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Proposed Action
            </span>
            <span className="font-mono-code text-mono-code text-on-surface font-semibold truncate">
              {proposedAction}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Simulated batch egress routine
            </span>
          </div>

          <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Source Agent
            </span>
            <span className="font-body-md text-body-md text-secondary font-semibold truncate">
              {sourceAgent}
            </span>
            <span className="font-mono-code text-[11px] text-outline">
              UUID: {sourceAgentId}
            </span>
          </div>

          <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Destination
            </span>
            <span className="font-mono-code text-mono-code text-error font-medium truncate">
              {destination}
            </span>
            <span className="font-body-sm text-body-sm text-error/80">
              Unauthorized external sink
            </span>
          </div>

          <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Data Classification
            </span>
            <span className="font-body-md text-body-md text-tertiary font-semibold truncate">
              {classification}
            </span>
            <span className="font-label-caps text-[10px] text-tertiary uppercase">
              {taintedFieldsCount} Tainted Fields Identified
            </span>
          </div>
        </div>

        {/* Policy & Decision Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm p-space-md bg-surface-container-low rounded-lg items-center border border-outline-variant/20">
          <div className="flex flex-col gap-0.5 md:col-span-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">
              Policy Rule Violated
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-code text-mono-code text-on-surface font-bold">
                {violatedPolicy}:
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                {policyDescription}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-start md:justify-end gap-space-md flex-wrap">
            <div className="flex flex-col items-start md:items-end">
              <span className="font-label-caps text-label-caps text-outline uppercase">Auth Decision</span>
              <span className="px-2.5 py-0.5 bg-error text-on-error rounded font-label-caps text-label-caps font-bold tracking-wider">
                {authDecision}
              </span>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="font-label-caps text-label-caps text-outline uppercase">Execution Status</span>
              <span className="px-2.5 py-0.5 bg-surface-variant text-on-surface rounded font-label-caps text-label-caps font-bold tracking-wider">
                {executionStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Reason Statement */}
        <div className="p-space-md bg-surface-container rounded-lg flex items-start gap-space-sm border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">
            verified_user
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-body-md text-body-md text-on-surface font-medium leading-relaxed">
              {detailedReason}
            </span>
            <span className="font-mono-code text-[11px] text-outline">
              {latencyText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
