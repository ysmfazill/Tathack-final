import React from 'react';

export interface AuditEventItem {
  id: string;
  requestId: string;
  timestamp: string;
  fullTimestamp: string;
  type: string;
  icon: string;
  agentPath: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  decision: 'BLOCKED' | 'ALLOWED' | 'APPROVAL' | 'RECORDED' | 'FAILED';
  execution: 'NOT EXECUTED' | 'EXECUTED (SIM)' | 'PENDING' | 'NOT APPLICABLE';
  proposalTool: string;
  proposalDest: string;
  ruleCode: string;
  ruleName: string;
  sourceAgent: string;
  sourceAgentId: string;
  targetAgent: string;
  targetAgentId: string;
  classification: string;
  taintTracking: string;
  promptContext: string;
  explanation: string;
  reasonCode: string;
  modelProvider: string;
  policyVersion: string;
  shaHash: string;
}

interface AuditEventTableProps {
  events: AuditEventItem[];
  selectedEventId: string;
  onSelectEvent: (event: AuditEventItem) => void;
  activeTab: 'all' | 'cross_agent' | 'policy';
  onTabChange: (tab: 'all' | 'cross_agent' | 'policy') => void;
}

export const AuditEventTable: React.FC<AuditEventTableProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col gap-space-sm bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header & View Tabs */}
      <div className="p-space-md border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest/40">
        <div className="flex items-center gap-space-sm">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            Security Event History
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
            SAMPLE DEMO DATASET
          </span>
        </div>
      </div>

      {/* Segmented View Filter Tabs */}
      <div className="px-space-md pt-space-xs flex items-center gap-2 border-b border-outline-variant/20 overflow-x-auto">
        <button
          onClick={() => onTabChange('all')}
          className={`px-3 py-2 border-b-2 font-body-sm text-body-sm flex items-center gap-2 transition-colors ${
            activeTab === 'all'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span>Security Events</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-primary/20 text-primary">
            {events.length}
          </span>
        </button>
        <button
          onClick={() => onTabChange('cross_agent')}
          className={`px-3 py-2 border-b-2 font-body-sm text-body-sm flex items-center gap-2 transition-colors ${
            activeTab === 'cross_agent'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span>Cross-Agent Transfer</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-surface-container text-on-surface-variant">
            {events.filter((e) => e.type.includes('Cross-Agent')).length}
          </span>
        </button>
        <button
          onClick={() => onTabChange('policy')}
          className={`px-3 py-2 border-b-2 font-body-sm text-body-sm flex items-center gap-2 transition-colors ${
            activeTab === 'policy'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span>Policy Revisions</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-surface-container text-on-surface-variant">
            {events.filter((e) => e.type.includes('Policy')).length}
          </span>
        </button>
      </div>

      {/* Real-time Event Ledger Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-high/40 text-on-surface-variant font-label-caps text-label-caps">
              <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Timestamp</th>
              <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Event ID</th>
              <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Type / Agent</th>
              <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Risk</th>
              <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Decision</th>
              <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Execution</th>
              <th className="py-2.5 px-3 uppercase tracking-wider text-right font-medium">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-body-sm">
            {events.map((evt) => {
              const isSelected = evt.id === selectedEventId;

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-container/10 border-l-4 border-l-primary'
                      : 'hover:bg-surface-container-high/40'
                  }`}
                >
                  <td className="py-3 px-3 font-mono-code text-[12px] text-on-surface whitespace-nowrap">
                    {evt.timestamp} <span className="text-outline text-[10px]">UTC</span>
                  </td>
                  <td className="py-3 px-3 font-mono-code text-[12px] font-medium text-primary whitespace-nowrap">
                    {evt.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-medium text-on-surface">
                        <span
                          className={`material-symbols-outlined text-[15px] ${
                            evt.risk === 'CRITICAL'
                              ? 'text-secondary'
                              : evt.risk === 'HIGH'
                              ? 'text-error'
                              : 'text-tertiary'
                          }`}
                        >
                          {evt.icon}
                        </span>
                        <span>{evt.type}</span>
                      </div>
                      <span className="font-mono-code text-[11px] text-on-surface-variant">
                        {evt.agentPath}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-caps text-[10px] uppercase font-semibold border ${
                        evt.risk === 'CRITICAL' || evt.risk === 'HIGH'
                          ? 'bg-error/15 text-error border-error/30'
                          : evt.risk === 'MEDIUM'
                          ? 'bg-surface-container-high text-secondary-fixed-dim border-secondary-fixed-dim/30'
                          : 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                      }`}
                    >
                      {evt.risk === 'CRITICAL' && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                      {evt.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-caps text-[10px] uppercase font-semibold border ${
                        evt.decision === 'BLOCKED'
                          ? 'bg-error/20 text-error border-error/40'
                          : evt.decision === 'ALLOWED'
                          ? 'bg-tertiary-container/20 text-tertiary border-tertiary/40'
                          : evt.decision === 'APPROVAL'
                          ? 'bg-surface-container-high text-secondary-fixed-dim border-secondary-fixed-dim/40'
                          : 'bg-primary-container/20 text-primary border-primary/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {evt.decision === 'BLOCKED'
                          ? 'block'
                          : evt.decision === 'ALLOWED'
                          ? 'check_circle'
                          : evt.decision === 'APPROVAL'
                          ? 'schedule'
                          : 'policy'}
                      </span>
                      {evt.decision}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono-code text-[10px] border bg-surface-container-lowest ${
                        evt.execution === 'NOT EXECUTED'
                          ? 'text-error border-error/40'
                          : evt.execution === 'EXECUTED (SIM)'
                          ? 'text-tertiary border-tertiary/40'
                          : evt.execution === 'PENDING'
                          ? 'text-secondary-fixed-dim border-secondary-fixed-dim/40'
                          : 'text-outline border-outline-variant/30'
                      }`}
                    >
                      {evt.execution}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-0.5 text-primary text-[12px] font-semibold">
                        Inspecting <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    ) : (
                      <button
                        className="px-2 py-1 text-on-surface-variant hover:text-on-surface text-[12px]"
                        type="button"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-space-md border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/30">
        <span className="font-mono-code text-[12px] text-on-surface-variant">
          Page 1 of 250 • Showing {events.length} rows
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-2.5 py-1 rounded bg-surface-container text-outline hover:text-on-surface border border-outline-variant/30 text-[12px] font-mono-code disabled:opacity-40"
            disabled
            type="button"
          >
            Prev
          </button>
          <span className="px-2 py-1 rounded bg-primary-container text-on-primary-container font-mono-code text-[12px] font-bold">
            1
          </span>
          <button
            className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-[12px] font-mono-code"
            type="button"
          >
            2
          </button>
          <button
            className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-[12px] font-mono-code"
            type="button"
          >
            3
          </button>
          <button
            className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-[12px] font-mono-code"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
