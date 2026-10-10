import React from 'react';

interface AuditFilterConsoleProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  decisionFilter: string;
  onDecisionFilterChange: (val: string) => void;
  eventTypeFilter: string;
  onEventTypeFilterChange: (val: string) => void;
  riskFilter: string;
  onRiskFilterChange: (val: string) => void;
  timeRange: string;
  onTimeRangeChange: (val: string) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const AuditFilterConsole: React.FC<AuditFilterConsoleProps> = ({
  searchQuery,
  onSearchQueryChange,
  decisionFilter,
  onDecisionFilterChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  riskFilter,
  onRiskFilterChange,
  timeRange,
  onTimeRangeChange,
  onResetFilters,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm items-center">
        {/* Search Input (Span 4) */}
        <div className="lg:col-span-4 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
            search
          </span>
          <input
            className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant/40 rounded-lg font-mono-code text-mono-code text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            placeholder="Search by request ID, event ID (e.g. EVT-8941), or rule code..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        {/* Decision Dropdown (Span 2) */}
        <div className="lg:col-span-2">
          <select
            className="w-full px-2.5 py-2 bg-surface border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
            value={decisionFilter}
            onChange={(e) => onDecisionFilterChange(e.target.value)}
          >
            <option value="">All Decisions</option>
            <option value="BLOCKED">Blocked (342)</option>
            <option value="ALLOWED">Allowed (888)</option>
            <option value="APPROVAL">Needs Approval (18)</option>
            <option value="FAILED">Execution Failed (3)</option>
          </select>
        </div>

        {/* Event Type Dropdown (Span 2) */}
        <div className="lg:col-span-2">
          <select
            className="w-full px-2.5 py-2 bg-surface border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
            value={eventTypeFilter}
            onChange={(e) => onEventTypeFilterChange(e.target.value)}
          >
            <option value="">All Event Types</option>
            <option value="cross_agent">Cross-Agent Transfer</option>
            <option value="prompt_injection">Prompt Injection</option>
            <option value="tool_auth">Tool Authorization</option>
            <option value="sensitive_data">Sensitive Data Detection</option>
            <option value="policy_change">Policy Change</option>
            <option value="benign_task">Benign Agent Task</option>
          </select>
        </div>

        {/* Risk Level (Span 2) */}
        <div className="lg:col-span-2">
          <select
            className="w-full px-2.5 py-2 bg-surface border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
            value={riskFilter}
            onChange={(e) => onRiskFilterChange(e.target.value)}
          >
            <option value="">All Risk Levels</option>
            <option value="critical">Critical Risk</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
            <option value="info">Info</option>
          </select>
        </div>

        {/* Time Range & Buttons (Span 2) */}
        <div className="lg:col-span-2 flex items-center gap-space-xs">
          <select
            className="w-full px-2 py-2 bg-surface border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="1h">Last Hour</option>
            <option value="7d">Last 7 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <button
            onClick={onResetFilters}
            className="px-3 py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface text-body-sm rounded-lg transition-colors border border-outline-variant/40"
            title="Reset Filters"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Active Filter Counter & Pill bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/20 text-body-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono-code text-[12px] text-on-surface-variant">
            Showing <strong className="text-on-surface">{filteredCount}</strong> of {totalCount} security events
          </span>
          <span className="text-outline-variant">•</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-secondary font-mono-code text-[11px] border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Filter Active: {searchQuery || decisionFilter || eventTypeFilter || riskFilter ? 'Custom Parameters' : 'All Events'}
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => alert('Unsupported (Preferences not implemented)')}
            className="font-body-sm text-[12px] text-primary hover:underline"
            type="button"
          >
            Save Query View
          </button>
          <button
            onClick={onResetFilters}
            className="font-body-sm text-[12px] text-outline hover:text-on-surface"
            type="button"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
