import React from 'react';

export const AuditBottomPanels: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
      {/* Left Bottom: Cross-Agent Transfer History */}
      <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">swap_calls</span>
            <span className="font-headline-md text-[16px] text-on-surface font-semibold">
              Cross-Agent Transfer Lineage
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
            Live Mesh
          </span>
        </div>

        {/* Topology Card Visual */}
        <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-center justify-between text-body-sm flex-wrap gap-2">
            <div className="flex items-center gap-2 font-mono-code text-[12px]">
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold border border-outline-variant/20">
                Report Agent
              </span>
              <span className="material-symbols-outlined text-[14px] text-error">arrow_forward</span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold border border-outline-variant/20">
                Export Agent
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-error/20 text-error uppercase font-bold border border-error/30">
              BLOCKED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-outline-variant/20 text-[11px] font-mono-code">
            <div>
              <span className="text-outline block text-[9px]">DATA CLASSIFICATION</span>
              <span className="text-error font-medium">Confidential</span>
            </div>
            <div>
              <span className="text-outline block text-[9px]">DESTINATION</span>
              <span className="text-on-surface-variant truncate block" title="Unauthorized External Destination">
                Unauthorized Ext
              </span>
            </div>
            <div>
              <span className="text-outline block text-[9px]">POLICY TRIGGER</span>
              <span className="text-secondary">POL-704</span>
            </div>
            <div>
              <span className="text-outline block text-[9px]">STATUS</span>
              <span className="text-error font-medium">Not Executed</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <span className="text-outline text-[11px]">Inter-Agent Bus Channel: #agent-bus-secure-01</span>
            <button
              onClick={() => alert('Unsupported (Trace graph UI not implemented)')}
              className="text-primary hover:underline font-body-sm text-[12px] font-medium"
              type="button"
            >
              View Lineage Details →
            </button>
          </div>
        </div>
      </div>

      {/* Right Bottom: Policy Change History */}
      <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">history_edu</span>
            <span className="font-headline-md text-[16px] text-on-surface font-semibold">
              Recent Policy Change Ledger
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
            Immutable
          </span>
        </div>

        {/* Compact Policy Revision Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-sm text-[12px]">
            <thead className="text-outline font-label-caps text-[10px] uppercase border-b border-outline-variant/20">
              <tr>
                <th className="py-1.5 px-2 font-medium">Version / Rule</th>
                <th className="py-1.5 px-2 font-medium">Modification</th>
                <th className="py-1.5 px-2 font-medium">Author</th>
                <th className="py-1.5 px-2 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-mono-code text-[11px]">
              <tr>
                <td className="py-2.5 px-2 whitespace-nowrap">
                  <span className="text-on-surface font-semibold">v1.4.2</span>
                  <span className="block text-outline text-[10px]">RULE-004 Quarantine</span>
                </td>
                <td className="py-2.5 px-2 font-body-sm text-[11px] text-on-surface-variant">
                  Added quarantine trigger for untrusted agent transfers.
                </td>
                <td className="py-2.5 px-2 text-secondary whitespace-nowrap">alex.chen</td>
                <td className="py-2.5 px-2 text-right text-outline whitespace-nowrap">Today, 14:18 UTC</td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 whitespace-nowrap">
                  <span className="text-on-surface font-semibold">v1.4.1</span>
                  <span className="block text-outline text-[10px]">POL-704 Multi-Sig</span>
                </td>
                <td className="py-2.5 px-2 font-body-sm text-[11px] text-on-surface-variant">
                  Require SecOps multi-sig for external record export.
                </td>
                <td className="py-2.5 px-2 text-secondary whitespace-nowrap">sarah.m</td>
                <td className="py-2.5 px-2 text-right text-outline whitespace-nowrap">Yesterday, 09:42 UTC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
