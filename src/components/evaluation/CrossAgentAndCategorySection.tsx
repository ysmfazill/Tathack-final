import React from 'react';

export const CrossAgentAndCategorySection: React.FC = () => {
  const categories = [
    {
      name: 'Direct Prompt Injection',
      cases: '40 cases',
      pct: 97.5,
      detail: '97.5% (39/40)',
      color: 'bg-tertiary',
      errorPct: 2.5,
    },
    {
      name: 'Indirect Prompt Injection (Ingest Docs)',
      cases: '45 cases (1 FP)',
      pct: 95.5,
      detail: '95.5% (43/45)',
      color: 'bg-tertiary',
      errorPct: 4.5,
    },
    {
      name: 'Scanner Evasion & Obfuscation (Base64/Ciphers)',
      cases: '35 cases',
      pct: 91.4,
      detail: '91.4% (32/35)',
      color: 'bg-secondary',
      errorPct: 8.6,
    },
    {
      name: 'Unauthorized Tool Invocation (exec_bash, rm)',
      cases: '40 cases',
      pct: 100.0,
      detail: '100.0% (40/40)',
      color: 'bg-tertiary',
      errorPct: 0,
    },
    {
      name: 'Cross-Agent Data Leakage',
      cases: '50 cases',
      pct: 98.0,
      detail: '98.0% (49/50)',
      color: 'bg-tertiary',
      errorPct: 2.0,
    },
    {
      name: 'Sensitive Data Exposure / PII Egress',
      cases: '40 cases',
      pct: 97.5,
      detail: '97.5% (39/40)',
      color: 'bg-tertiary',
      errorPct: 2.5,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg mb-space-lg">
      {/* Col 1: Cross-Agent Data Protection Benchmark */}
      <div className="bg-surface-container p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center justify-between mb-space-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">hub</span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Cross-Agent Data Protection Benchmark
              </h3>
            </div>
            <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/30">
              SIGNATURE INNOVATION
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Simulated multi-agent communication bus between HR Agent, Report Agent, and Export Agent.
          </p>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-space-md font-mono-code">
            <div className="p-2.5 rounded bg-surface-container-low flex flex-col border border-outline-variant/20">
              <span className="text-[11px] text-outline uppercase font-medium">Transfers Run</span>
              <span className="text-headline-md font-mono-metric text-on-surface mt-0.5 font-bold">60</span>
              <span className="text-[10px] text-outline">Total Cases</span>
            </div>
            <div className="p-2.5 rounded bg-surface-container-low flex flex-col border border-outline-variant/20">
              <span className="text-[11px] text-outline uppercase font-medium">Unauthorized</span>
              <span className="text-headline-md font-mono-metric text-tertiary mt-0.5 font-bold">28/28</span>
              <span className="text-[10px] text-tertiary">100% Contained</span>
            </div>
            <div className="p-2.5 rounded bg-surface-container-low flex flex-col border border-outline-variant/20">
              <span className="text-[11px] text-outline uppercase font-medium">Authorized</span>
              <span className="text-headline-md font-mono-metric text-primary mt-0.5 font-bold">24/24</span>
              <span className="text-[10px] text-primary">100% Delivered</span>
            </div>
            <div className="p-2.5 rounded bg-surface-container-low flex flex-col border border-outline-variant/20">
              <span className="text-[11px] text-outline uppercase font-medium">Escalated</span>
              <span className="text-headline-md font-mono-metric text-secondary mt-0.5 font-bold">7/8</span>
              <span className="text-[10px] text-secondary">87.5% Required</span>
            </div>
          </div>

          {/* Specific Scenario Results */}
          <div className="space-y-1.5 font-mono-code text-body-sm">
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span className="text-on-surface text-[12px]">1. Authorized HR Summary to Report Agent</span>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-bold border border-tertiary/30">
                100% ALLOWED
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                <span className="text-on-surface text-[12px]">2. Confidential PII Egress to External Socket</span>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-error-container/40 text-error font-bold border border-error/40">
                100% INTERCEPTED
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                <span className="text-on-surface text-[12px]">3. Restricted Exec Records to Unknown Agent</span>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-error-container/40 text-error font-bold border border-error/40">
                100% INTERCEPTED
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span className="text-on-surface text-[12px]">4. Sanitized Report to Approved S3 Sink</span>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-bold border border-tertiary/30">
                100% ALLOWED
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="text-on-surface text-[12px]">5. Borderline Financial Summary</span>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-bold border border-secondary/30">
                87.5% ESCALATED
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                <span className="text-on-surface text-[12px]">6. Tainted Ingest Argument Injection</span>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-error-container/40 text-error font-bold border border-error/40">
                100% INTERCEPTED
              </span>
            </div>
          </div>
        </div>

        <div className="mt-space-md pt-2 flex items-center justify-between font-mono-code text-[11px] text-outline border-t border-outline-variant/20 flex-wrap gap-2">
          <span>False Blocks on Authorized: 0/24 (0.0%)</span>
          <span className="text-tertiary">All Interceptions Pre-Tool Execution</span>
        </div>
      </div>

      {/* Col 2: Performance by Attack Category */}
      <div className="bg-surface-container p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center justify-between mb-space-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">analytics</span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Performance by Attack Category
              </h3>
            </div>
            <span className="font-label-caps text-label-caps text-outline uppercase">
              250 Test Vectors
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Detailed breakdown across distinct threat vectors (cases run vs blocked):
          </p>

          {/* Threat Bars */}
          <div className="space-y-space-md font-mono-code">
            {categories.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-body-sm mb-1">
                  <span className="text-on-surface text-[12px]">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-outline text-[11px]">{cat.cases}</span>
                    <span
                      className={`font-bold text-[12px] ${
                        cat.color === 'bg-secondary' ? 'text-secondary' : 'text-tertiary'
                      }`}
                    >
                      {cat.detail}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex border border-outline-variant/20">
                  <div className={`${cat.color} h-full`} style={{ width: `${cat.pct}%` }}></div>
                  {cat.errorPct > 0 && (
                    <div className="bg-error h-full" style={{ width: `${cat.errorPct}%` }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-space-md pt-2 flex items-center justify-between font-mono-code text-[11px] text-outline border-t border-outline-variant/20 flex-wrap gap-2">
          <span>Aggregate ABR: 95.8% (239/250 Intercepted)</span>
          <span className="text-secondary">Average Latency: 38ms</span>
        </div>
      </div>
    </div>
  );
};
