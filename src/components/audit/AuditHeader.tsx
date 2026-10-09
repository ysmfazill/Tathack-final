import React from 'react';

interface AuditHeaderProps {
  storageReady: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenExport: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({
  storageReady,
  onRefresh,
  isRefreshing,
  onOpenExport,
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pb-space-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
            Audit Logs
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-label-caps uppercase tracking-wider bg-surface-container-high text-secondary border border-outline-variant/30">
            Local Simulation
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-label-caps uppercase tracking-wider bg-tertiary-container/20 text-tertiary border border-tertiary/30">
            Immutable Ledger
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
          Trace security decisions, inspect policy enforcement, and investigate agent activity across the behavioral firewall runtime.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-space-sm">
        {/* Storage Telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container-low border border-outline-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          <span className="font-mono-code text-[11px] text-on-surface-variant uppercase tracking-wider">
            Storage: <span className="text-on-surface font-semibold">SQLite-WAL</span>{' '}
            <span className="text-tertiary font-medium">{storageReady}</span>
          </span>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-sm text-body-sm border border-outline-variant/30"
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[16px] text-secondary ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            sync
          </span>
          <span>Refresh Logs</span>
        </button>

        {/* Primary Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary-container text-on-primary-container hover:bg-primary transition-all font-body-sm text-body-sm font-semibold shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Export Sanitized Logs</span>
        </button>
      </div>
    </div>
  );
};
