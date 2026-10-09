import React from 'react';
import { StatusBadge } from '../common/StatusBadge';

export const EnvironmentalBanner: React.FC = () => {
  return (
    <div className="w-full bg-surface-container-low px-4 sm:px-space-lg py-space-sm rounded-lg flex items-center justify-between shadow-sm border border-outline-variant/20">
      <div className="flex items-center gap-space-md min-w-0">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-secondary-container/20 text-secondary shrink-0">
          <span className="material-symbols-outlined text-[16px]">info</span>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <StatusBadge variant="secondary" size="sm">
            Demo Data
          </StatusBadge>
          <span className="text-outline-variant font-mono-code text-body-sm hidden sm:inline">•</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
            Metrics and log streams are simulated for local development environment. Backend integration ready.
          </span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-mono-code text-[11px] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
        <span>READY: PORT 8080</span>
      </div>
    </div>
  );
};
