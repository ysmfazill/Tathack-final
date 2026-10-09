import React from 'react';

export const AuditMetricTiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      {/* Card 1: Total Events */}
      <div className="flex flex-col p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
            Total Events
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-surface-container-high text-on-surface-variant/80 border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-metric text-headline-xl text-on-surface tracking-tight font-semibold">
              1,248
            </span>
            <span className="font-label-caps text-[11px] text-tertiary flex items-center">
              <span className="material-symbols-outlined text-[13px]">trending_up</span> +8.4%
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          </div>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Recorded security event triggers
        </span>
      </div>

      {/* Card 2: Blocked Actions */}
      <div className="flex flex-col p-space-md rounded-xl bg-surface-container-low border border-error/30 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-error/70"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-caps text-label-caps text-error uppercase tracking-wider font-semibold">
            Blocked Actions
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-error-container/30 text-error border border-error/30">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-metric text-headline-xl text-error tracking-tight font-semibold">
              342
            </span>
            <span className="font-label-caps text-[11px] text-error flex items-center font-medium">
              27.4% rate
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-error-container/20 flex items-center justify-center text-error border border-error/40">
            <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
          </div>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Unauthorized model actions prevented
        </span>
      </div>

      {/* Card 3: Approval Required */}
      <div className="flex flex-col p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-wider font-semibold">
            Approval Required
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-surface-container-high text-on-surface-variant/80 border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-metric text-headline-xl text-secondary-fixed-dim tracking-tight font-semibold">
              18
            </span>
            <span className="font-label-caps text-[11px] text-secondary flex items-center font-medium">
              3 in queue
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px]">pending_actions</span>
          </div>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Actions awaiting multi-sig signoff
        </span>
      </div>

      {/* Card 4: Execution Failures */}
      <div className="flex flex-col p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
            Execution Failures
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-surface-container-high text-on-surface-variant/80 border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-metric text-headline-xl text-on-surface tracking-tight font-semibold">
              3
            </span>
            <span className="font-label-caps text-[11px] text-tertiary flex items-center font-medium">
              0.24% of run
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Tool calls halted due to network/socket drop
        </span>
      </div>
    </div>
  );
};
