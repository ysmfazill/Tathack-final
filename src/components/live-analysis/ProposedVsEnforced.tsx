import React from 'react';

interface ProposedVsEnforcedProps {
  toolName: string;
  payloadArguments: Record<string, any>;
  reasonCode: string;
  authorizationDecision: string;
  executionStatus: string;
  runtimeResult: string;
}

export const ProposedVsEnforced: React.FC<ProposedVsEnforcedProps> = ({
  toolName,
  payloadArguments,
  reasonCode,
  authorizationDecision,
  executionStatus,
  runtimeResult,
}) => {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-0.5">
        <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight uppercase">
          PROPOSED ACTION VS RUNTIME ENFORCEMENT
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Separation of model intent from policy authorization and actual tool execution.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-stretch">
        {/* Left Column: MODEL-PROPOSED ACTION (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container p-space-md rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">
                  Model-Proposed Action
                </span>
              </div>
              <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant font-label-caps text-[10px] uppercase rounded border border-outline-variant/20">
                Untrusted Intent
              </span>
            </div>

            <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
              <span className="font-label-caps text-label-caps text-outline uppercase">Invoked Tool</span>
              <span className="font-mono-code text-mono-code text-on-surface font-bold">{toolName}()</span>
            </div>

            <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase">Payload Arguments</span>
                <span className="font-mono-code text-[10px] text-error font-medium">Tainted Attributes [4]</span>
              </div>
              <pre className="font-mono-code text-[12px] text-on-surface-variant bg-surface-container-lowest p-2 rounded overflow-x-auto leading-relaxed border border-outline-variant/20">
{JSON.stringify(payloadArguments, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/20">
            <span className="font-body-sm text-body-sm text-outline">Intent Classification:</span>
            <span className="font-label-caps text-label-caps text-error bg-error/15 px-2 py-0.5 rounded font-semibold uppercase border border-error/20">
              PROPOSED (Untrusted Model Intent)
            </span>
          </div>
        </div>

        {/* Center Interception Gateway (2 cols) */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center p-space-md bg-surface-container-low rounded-xl shadow-md gap-3 text-center border border-outline-variant/30">
          <div className="w-10 h-10 rounded-full bg-error-container/50 flex items-center justify-center text-error shadow-md animate-pulse border border-error/40">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider font-bold">
              SECURITY POLICY GATEWAY
            </span>
            <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
              Evaluates provenance, taint offsets, &amp; destination whitelist.
            </span>
          </div>

          {/* Flow Visual Arrow */}
          <div className="flex items-center justify-center w-full my-1">
            <div className="h-0.5 w-full bg-error-container relative flex items-center justify-center">
              <span className="px-2 py-0.5 bg-error text-on-error rounded font-mono-code text-[10px] font-bold uppercase tracking-wider shadow-sm">
                INTERCEPTED
              </span>
            </div>
          </div>
          <span className="font-mono-code text-[11px] text-error font-semibold">DROPPED AT GATE</span>
        </div>

        {/* Right Column: BACKEND ENFORCEMENT & EXECUTION (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container p-space-md rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-wider font-semibold">
                  Backend Enforcement &amp; Execution
                </span>
              </div>
              <span className="px-2 py-0.5 bg-error/20 text-error font-label-caps text-[10px] uppercase rounded font-bold border border-error/30">
                Execution Halted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps text-outline uppercase">Authorization</span>
                <span className="font-headline-md text-headline-md text-error font-bold leading-none">
                  {authorizationDecision}
                </span>
                <span className="font-mono-code text-[11px] text-outline">POL-704 strict match</span>
              </div>
              <div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps text-outline uppercase">Execution Status</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold leading-none">
                  {executionStatus}
                </span>
                <span className="font-mono-code text-[11px] text-outline">0ms socket time</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
              <span className="font-label-caps text-label-caps text-outline uppercase">Reason Code</span>
              <span className="font-mono-code text-mono-code text-secondary font-semibold">{reasonCode}</span>
            </div>

            <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
              <span className="font-label-caps text-label-caps text-outline uppercase">Actual Tool Side-Effects</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold">NONE</span>
                <span className="font-mono-code text-body-sm text-on-surface-variant">(0 bytes egressed, socket uncalled)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/20">
            <span className="font-body-sm text-body-sm text-outline">Host Runtime Result:</span>
            <span className="font-mono-code text-[11px] text-tertiary font-semibold">
              {runtimeResult}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
