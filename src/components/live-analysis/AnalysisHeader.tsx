import React from 'react';

interface AnalysisHeaderProps {
  requestId: string;
  onRequestIdChange: (id: string) => void;
  timeRange: '15m' | '1h' | '24h' | 'custom';
  onTimeRangeChange: (range: '15m' | '1h' | '24h' | 'custom') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  incidentSignature: string;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  requestId,
  onRequestIdChange,
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isRefreshing,
  incidentSignature,
}) => {
  return (
    <section className="flex flex-col gap-space-md bg-surface-container-low p-space-lg rounded-xl shadow-md border border-outline-variant/30">
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              Live Attack Analysis
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-caps text-label-caps uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Simulation Sandbox
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono-code text-[10px] tracking-wide uppercase">
              Synthetic Incident Trace
            </span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Investigate attack signals, inspect agent behavior, and understand security decisions.
          </span>
        </div>

        {/* Controls Right */}
        <div className="flex items-center gap-space-sm flex-wrap">
          {/* Search Input */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline">
              search
            </span>
            <input
              aria-label="Search by Request ID"
              className="pl-8 pr-24 py-1.5 bg-surface-container border border-outline-variant/30 text-on-surface font-mono-code text-mono-code rounded focus:outline-none focus:ring-1 focus:ring-primary w-64 shadow-sm"
              type="text"
              value={requestId}
              onChange={(e) => onRequestIdChange(e.target.value)}
            />
            <span className="absolute right-2 px-1.5 py-0.5 bg-surface-container-high rounded text-[10px] font-label-caps text-outline uppercase tracking-wider">
              Sample Data
            </span>
          </div>

          {/* Time Selector */}
          <div className="flex items-center bg-surface-container rounded p-0.5 shadow-sm border border-outline-variant/30">
            {(['15m', '1h', '24h', 'custom'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={`px-2.5 py-1 rounded font-label-caps text-label-caps tracking-wider transition-colors ${
                  timeRange === range
                    ? 'bg-primary-container text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {range === '15m' ? 'Last 15m' : range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded font-body-sm text-body-sm transition-colors shadow-sm border border-outline-variant/40"
            id="btn-refresh-stream"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[16px] text-secondary ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>Refresh Stream</span>
          </button>
        </div>
      </div>

      {/* Alert Sub-Banner */}
      <div className="flex items-center justify-between px-space-md py-2 bg-surface-container rounded-lg border border-outline-variant/20 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="material-symbols-outlined text-secondary text-[18px]">biotech</span>
          <span className="font-body-sm text-body-sm text-on-surface font-medium">
            Viewing Synthetic Incident Trace — Sandbox Mode
          </span>
          <span className="text-outline-variant font-mono-code text-body-sm hidden sm:inline">|</span>
          <span className="font-mono-code text-body-sm text-on-surface-variant">
            Incident Signature: <span className="text-on-surface font-semibold">{incidentSignature}</span>
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-mono-code text-[11px] text-tertiary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Telemetry Verified
          </span>
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
            DEMO TRACE
          </span>
        </div>
      </div>
    </section>
  );
};
