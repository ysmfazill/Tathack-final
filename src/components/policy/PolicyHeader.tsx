import React from 'react';

interface PolicyHeaderProps {
  version: string;
  updatedTime: string;
  onViewHistory: () => void;
  onCreateRule: () => void;
}

export const PolicyHeader: React.FC<PolicyHeaderProps> = ({
  version,
  updatedTime,
  onViewHistory,
  onCreateRule,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-surface-container-low p-space-xl rounded-xl shadow-md border border-outline-variant/30">
      <div className="flex flex-col gap-space-xs max-w-2xl">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
            Policy Center
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-caps text-label-caps tracking-wider uppercase font-semibold border border-tertiary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            Active ({version})
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Define how autonomous AI agents access tools, handle sensitive telemetry, and transfer classified information between perimeter boundaries.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
        <div className="flex flex-col sm:text-right">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
            Engine State
          </span>
          <span className="font-mono-code text-[12px] text-on-surface-variant">
            {updatedTime}
          </span>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={onViewHistory}
            className="inline-flex items-center gap-1.5 px-space-md py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface text-body-sm font-body-sm rounded transition-colors shadow-sm border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">history</span>
            <span>View Change History</span>
          </button>
          <button
            onClick={onCreateRule}
            className="inline-flex items-center gap-1.5 px-space-md py-2 bg-primary-container hover:bg-inverse-primary text-on-primary text-body-sm font-body-sm font-medium rounded transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add_moderator</span>
            <span>+ Create Policy Rule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
