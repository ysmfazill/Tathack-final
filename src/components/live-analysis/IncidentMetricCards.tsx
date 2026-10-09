import React from 'react';

interface IncidentMetricCardsProps {
  totalEvents: number;
  policyDenials: number;
  executionAttempts: number;
  deniedTransfers: number;
}

export const IncidentMetricCards: React.FC<IncidentMetricCardsProps> = ({
  totalEvents,
  policyDenials,
  executionAttempts,
  deniedTransfers,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* Card 1: Total Events */}
      <div className="relative overflow-hidden bg-surface-container border border-outline-variant/30 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
            Total Events
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">
            {totalEvents}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[14px]">receipt_long</span>
          <span>Total audit records collected</span>
        </div>
      </div>

      {/* Card 2: Policy Denials */}
      <div className="relative overflow-hidden bg-error-container/30 border border-error/40 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-error tracking-wider uppercase font-semibold">
            Policy Denials
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-error font-bold leading-none">
            {policyDenials}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-error font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[14px]">do_not_disturb_on</span>
          <span>Actions halted by gateway</span>
        </div>
      </div>

      {/* Card 3: Execution Attempts */}
      <div className="relative overflow-hidden bg-surface-container border border-outline-variant/30 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
            Execution Attempts
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">
            {executionAttempts}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          <span className="truncate">Total tool invocations processed</span>
        </div>
      </div>

      {/* Card 4: Denied Transfers */}
      <div className="relative overflow-hidden bg-surface-container border border-outline-variant/30 p-space-md rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-secondary tracking-wider uppercase font-semibold">
            Denied Transfers
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline-xl text-headline-xl text-secondary font-bold leading-none">
            {deniedTransfers}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-body-sm text-body-sm truncate">
          <span className="material-symbols-outlined text-[14px] text-secondary">block</span>
          <span className="truncate">Blocked by Data Guard</span>
        </div>
      </div>
    </section>
  );
};
