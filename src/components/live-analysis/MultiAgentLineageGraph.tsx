import React from 'react';

export const MultiAgentLineageGraph: React.FC = () => {
  return (
    <section className="bg-surface-container-low p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            Cross-Agent Data Lineage &amp; Policy Boundary
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Trace message provenance across autonomous agent boundaries and inspect policy firewalls.
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-1.5 font-label-caps text-[11px] text-tertiary uppercase">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>Permitted</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-caps text-[11px] text-error uppercase">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-caps text-[11px] text-secondary uppercase">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Requires Approval</span>
          </div>
        </div>
      </div>

      {/* Visual Interactive Graph */}
      <div className="relative bg-surface-container rounded-xl p-space-lg overflow-x-auto border border-outline-variant/20">
        <div className="min-w-[720px] flex items-center justify-between gap-space-lg py-4">
          {/* Node 1: HR Agent */}
          <div className="flex flex-col items-center gap-2 w-52 p-space-md bg-surface-container-high rounded-xl shadow-md border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary/30">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <span className="font-body-md text-body-md text-on-surface font-semibold text-center leading-tight">
              HR Agent
            </span>
            <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
              Source (Trusted Ingestion)
            </span>
            <span className="px-2 py-0.5 bg-surface-container-low text-tertiary font-mono-code text-[11px] rounded border border-tertiary/30">
              State: OK
            </span>
          </div>

          {/* Connector 1: Permitted flow */}
          <div className="flex-1 flex flex-col items-center justify-center relative px-2">
            <div className="flex items-center gap-1 text-tertiary font-label-caps text-[10px] uppercase mb-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>Employee Summary | Authorized</span>
            </div>
            <div className="w-full h-1 bg-tertiary/40 rounded-full relative flex items-center justify-center">
              <span className="absolute -right-1 material-symbols-outlined text-tertiary text-[14px]">
                chevron_right
              </span>
            </div>
            <span className="font-mono-code text-[10px] text-outline mt-1">Trust Score: 0.98</span>
          </div>

          {/* Node 2: Report Agent (Processing) */}
          <div className="flex flex-col items-center gap-2 w-56 p-space-md bg-surface-container-high rounded-xl shadow-md ring-1 ring-error/40 border border-error/30">
            <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center text-error border border-error/30">
              <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
            </div>
            <span className="font-body-md text-body-md text-on-surface font-semibold text-center leading-tight">
              Report Agent
            </span>
            <span className="font-label-caps text-[10px] text-error uppercase tracking-wider">
              Tainted Context Ingested
            </span>
            <span className="px-2 py-0.5 bg-error-container text-on-error-container font-mono-code text-[11px] rounded font-semibold border border-error/40">
              Override Active
            </span>
          </div>

          {/* Connector 2: Intercepted Line */}
          <div className="flex-1 flex flex-col items-center justify-center relative px-2">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-error text-on-error font-label-caps text-[10px] uppercase rounded font-bold mb-1 shadow-md">
              <span className="material-symbols-outlined text-[12px]">security</span>
              <span>Policy Gateway Intercept</span>
            </div>
            <div className="w-full h-1 bg-error/50 rounded-full relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-error ring-4 ring-error/20"></div>
            </div>
            <span className="font-mono-code text-[10px] text-error mt-1 font-semibold">
              Blocked: POL-704 Violation
            </span>
          </div>

          {/* Node 3: Export Agent (Destination) */}
          <div className="flex flex-col items-center gap-2 w-52 p-space-md bg-surface-container-high rounded-xl opacity-60 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            </div>
            <span className="font-body-md text-body-md text-on-surface font-semibold text-center leading-tight">
              Export Agent
            </span>
            <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
              Destination (External)
            </span>
            <span className="px-2 py-0.5 bg-surface-container-low text-outline font-mono-code text-[11px] rounded">
              Unreached
            </span>
          </div>
        </div>
      </div>

      {/* Interception note callout */}
      <div className="flex items-center gap-space-sm p-space-sm bg-surface-container rounded-lg border border-outline-variant/20">
        <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
        <span className="font-body-md text-body-md text-on-surface">
          <strong className="text-tertiary">Interception note:</strong> Unauthorized transfer intercepted before execution. <strong className="text-on-surface">0 records leaked</strong> across the organizational boundary.
        </span>
      </div>
    </section>
  );
};
