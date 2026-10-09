import React from 'react';

export const CrossAgentTopology: React.FC = () => {
  return (
    <div className="w-full bg-surface-container-low p-5 sm:p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col relative overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant/20">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">hub</span>
              <h2 className="font-headline-md text-lg sm:text-xl text-white font-semibold tracking-tight">
                Cross-Agent Data Flow
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-surface-container border border-outline-variant/30 font-label-caps text-[10px] sm:text-[11px] text-secondary uppercase tracking-wider font-medium">
              SIMULATED WORKFLOW • SAMPLE DATA
            </span>
          </div>
          <span className="font-body-sm text-xs sm:text-sm text-[#94a3b8] mt-1">
            Track sensitive information moving between AI agents and enforce gateway authorization rules.
          </span>
        </div>

        {/* Flow Legend */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs font-mono-code self-start sm:self-auto bg-surface-container/80 px-3 py-1.5 rounded-lg border border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
            <span className="text-white font-medium">Permitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="text-white font-medium">Blocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[#94a3b8]">Review Req.</span>
          </div>
        </div>
      </div>

      {/* Connected Multi-Agent Architecture Visualization */}
      <div className="py-6 sm:py-8 px-1 sm:px-4 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(120px,140px)_1fr_minmax(140px,160px)_1fr] gap-4 xl:gap-3 items-stretch">
          
          {/* NODE 1: HR AGENT */}
          <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/40 hover:border-secondary/40 transition-all flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary border border-outline-variant/30 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">badge</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[11px] font-mono-code uppercase font-medium border border-outline-variant/20">
                  Source Agent
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-base text-white font-semibold tracking-tight">
                  HR AGENT
                </span>
                <span className="font-body-sm text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Retrieves employee information and internal staff profiles.
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-outline">
                Scope: <span className="text-on-surface">internal_hr_db</span>
              </span>
              <span className="text-tertiary flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                Trusted
              </span>
            </div>
          </div>

          {/* CONNECTOR 1: HR AGENT -> REPORT AGENT */}
          <div className="flex flex-col items-center justify-center py-2 xl:py-0">
            {/* Desktop Horizontal View */}
            <div className="hidden xl:flex flex-col items-center justify-center w-full px-1">
              <div className="px-2 py-1 rounded bg-tertiary-container/20 border border-tertiary/40 text-tertiary font-mono-code text-[11px] font-semibold flex items-center gap-1 shadow-sm whitespace-nowrap mb-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>Authorized</span>
              </div>
              <span className="text-[10px] text-outline text-center mb-1 font-mono-code leading-tight">
                Employee summary
              </span>
              <div className="w-full h-1 bg-tertiary/30 relative rounded-full overflow-hidden flex items-center my-0.5">
                <div className="w-2/3 h-full bg-tertiary animate-pulse rounded-full" />
              </div>
              <span className="text-tertiary font-mono-code text-[11px]">▶</span>
            </div>

            {/* Mobile / Tablet Vertical View */}
            <div className="xl:hidden flex flex-col items-center py-1">
              <div className="w-0.5 h-3 bg-tertiary/40" />
              <div className="px-3 py-1 rounded bg-tertiary-container/20 border border-tertiary/40 text-tertiary font-mono-code text-xs font-semibold flex items-center gap-1.5 shadow-sm my-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Authorized: Employee summary</span>
              </div>
              <div className="w-0.5 h-3 bg-tertiary/40" />
              <span className="text-tertiary text-xs">▼</span>
            </div>
          </div>

          {/* NODE 2: REPORT AGENT */}
          <div className="bg-surface-container rounded-xl p-5 border border-primary/40 hover:border-primary/60 transition-all flex flex-col justify-between shadow-md ring-1 ring-primary/20">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/30 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary text-[11px] font-mono-code uppercase font-medium border border-primary/30">
                  Processing Agent
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-base text-white font-semibold tracking-tight">
                  REPORT AGENT
                </span>
                <span className="font-body-sm text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Processes authorized information for reports &amp; summaries.
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-outline">
                Taint Engine: <span className="text-secondary">Active</span>
              </span>
              <span className="text-primary font-medium">Policy Enforced</span>
            </div>
          </div>

          {/* CONNECTOR 2: REPORT AGENT -> EXPORT AGENT */}
          <div className="flex flex-col items-center justify-center py-2 xl:py-0">
            {/* Desktop Horizontal View */}
            <div className="hidden xl:flex flex-col items-center justify-center w-full px-1">
              <div className="px-2 py-1 rounded bg-error-container/40 border border-error text-error font-mono-code text-[10px] font-bold flex items-center gap-1 shadow-md shadow-error/10 whitespace-nowrap mb-1">
                <span className="material-symbols-outlined text-[13px]">shield</span>
                <span>FIREWALL BLOCKED</span>
              </div>
              <span className="text-[10px] text-error/90 text-center mb-1 font-mono-code leading-tight">
                Unauthorized dest
              </span>
              <div className="w-full h-1 bg-error/30 relative rounded-full flex items-center justify-center my-0.5">
                <div className="w-3 h-3 rounded-full bg-error border border-white/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[9px] text-surface font-bold">
                    close
                  </span>
                </div>
              </div>
              <span className="text-error font-mono-code text-[10px] uppercase font-semibold mt-0.5">
                Transfer Stopped
              </span>
            </div>

            {/* Mobile / Tablet Vertical View */}
            <div className="xl:hidden flex flex-col items-center py-1">
              <div className="w-0.5 h-3 bg-error/40" />
              <div className="px-3 py-1 rounded bg-error-container/40 border border-error text-error font-mono-code text-xs font-bold flex items-center gap-1.5 shadow-md shadow-error/10 my-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>FIREWALL BLOCKED: Unauthorized destination (external_sync)</span>
              </div>
              <div className="w-0.5 h-3 bg-error/40" />
              <span className="text-error text-xs">▼</span>
            </div>
          </div>

          {/* NODE 3: EXPORT AGENT */}
          <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/40 hover:border-outline-variant/60 transition-all flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-outline-variant shrink-0 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[11px] font-mono-code uppercase font-medium border border-outline-variant/20">
                  Target Destination
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-base text-white font-semibold tracking-tight">
                  EXPORT AGENT
                </span>
                <span className="font-body-sm text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Sends approved report data to an authorized destination.
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-outline">
                Dest: <span className="text-error font-semibold">external_sync [Blocked]</span>
              </span>
              <span className="text-error flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                0 Records leaked
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Telemetry Readout Strip Inside Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-lg bg-surface-container/60 border border-outline-variant/20 text-xs font-mono-code">
        <div className="flex items-center justify-between sm:justify-start gap-2 px-2 py-1 bg-surface-container-low/50 sm:bg-transparent rounded">
          <span className="text-outline">Active Agents:</span>
          <span className="text-white font-semibold text-sm">3</span>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2 px-2 py-1 bg-surface-container-low/50 sm:bg-transparent rounded">
          <span className="text-outline">Protected Transfers:</span>
          <span className="text-tertiary font-semibold text-sm">14</span>
          <span className="text-[10px] text-outline font-normal">(Sample Data)</span>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2 px-2 py-1 bg-surface-container-low/50 sm:bg-transparent rounded">
          <span className="text-outline">Blocked Transfers:</span>
          <span className="text-error font-semibold text-sm">5</span>
          <span className="text-[10px] text-outline font-normal">(Sample Data)</span>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2 px-2 py-1 bg-surface-container-low/50 sm:bg-transparent rounded">
          <span className="text-outline">Pending Approvals:</span>
          <span className="text-amber-400 font-semibold text-sm">2</span>
          <span className="text-[10px] text-outline font-normal">(Sample Data)</span>
        </div>
      </div>

      {/* Data Protection Status Section */}
      <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col min-w-0 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span className="font-headline-md text-sm text-white font-semibold">
              Data Protection Status
            </span>
          </div>
          <span className="font-body-sm text-xs text-[#94a3b8] mt-0.5 leading-relaxed">
            Data classification and destination policies determine whether an agent may transfer information.
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs font-mono-code">
          <div className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Public Data</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-surface-container border border-primary/30 text-primary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Internal Data</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-surface-container border border-amber-400/30 text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Confidential Data</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-surface-container border border-error/30 text-error flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span>Restricted Data</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[11px] font-mono-code text-outline text-right">
        Predefined synthetic classifications (Prototype simulation).
      </div>
    </div>
  );
};
