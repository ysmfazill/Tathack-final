import React from 'react';

export const PolicyMetricTiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      {/* Card 1 */}
      <div className="flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-semibold">
            Active Rules
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono-code text-[10px] border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="my-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-xl text-headline-xl text-on-surface font-semibold">42</span>
          <span className="font-mono-code text-body-sm text-tertiary">100% active</span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Enforced across 3 agent pipelines
        </span>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-semibold">
            Restricted Tools
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono-code text-[10px] border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="my-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-xl text-headline-xl text-secondary font-semibold">8</span>
          <span className="font-mono-code text-body-sm text-outline">/ 24 total</span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          High &amp; Critical risk tools constrained
        </span>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-semibold">
            Data Categories
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono-code text-[10px] border border-outline-variant/20">
            DEMO DATA
          </span>
        </div>
        <div className="my-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-xl text-headline-xl text-on-surface font-semibold">4</span>
          <span className="font-label-caps text-body-sm text-tertiary">Tiers Active</span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Public, Internal, Confidential, Restricted
        </span>
      </div>

      {/* Card 4 */}
      <div className="flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-semibold">
            Pending Approvals
          </span>
          <span className="px-1.5 py-0.5 rounded bg-error-container/30 text-error font-mono-code text-[10px] font-semibold border border-error/30">
            ESCALATED
          </span>
        </div>
        <div className="my-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-xl text-headline-xl text-error font-semibold">2</span>
          <span className="font-mono-code text-body-sm text-error">Queued</span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Awaiting SecOps multi-sig authorization
        </span>
      </div>
    </div>
  );
};
