import React from 'react';

export const EvaluationMetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md mb-space-lg">
      {/* Card 1: Attack Success Rate */}
      <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
            Attack Success (ASR)
          </span>
          <span className="font-mono-code text-[10px] px-1 rounded bg-surface-container-high text-outline border border-outline-variant/20">
            DEMO
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono-metric text-headline-lg text-error font-bold">4.2%</span>
          <span className="font-mono-code text-body-sm text-outline line-through">88.0% base</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Prohibited outcomes achieved (2/48 attack cases)
        </p>
        <div className="w-full bg-surface-container-lowest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-error h-full" style={{ width: '4.2%' }}></div>
        </div>
      </div>

      {/* Card 2: Attack Blocking Rate */}
      <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
            Attack Blocking (ABR)
          </span>
          <span className="font-mono-code text-[10px] px-1 rounded bg-surface-container-high text-outline border border-outline-variant/20">
            DEMO
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono-metric text-headline-lg text-tertiary font-bold">95.8%</span>
          <span className="font-mono-code text-body-sm text-tertiary font-semibold">46/48</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Prohibited actions intercepted prior to tool execution
        </p>
        <div className="w-full bg-surface-container-lowest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-tertiary h-full" style={{ width: '95.8%' }}></div>
        </div>
      </div>

      {/* Card 3: False Positive Rate */}
      <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
            False Positive Rate
          </span>
          <span className="font-mono-code text-[10px] px-1 rounded bg-surface-container-high text-outline border border-outline-variant/20">
            DEMO
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono-metric text-headline-lg text-secondary font-bold">2.1%</span>
          <span className="font-mono-code text-body-sm text-outline">target &lt; 5%</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Benign tasks incorrectly flagged or blocked (1/48 benign)
        </p>
        <div className="w-full bg-surface-container-lowest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-secondary h-full" style={{ width: '2.1%' }}></div>
        </div>
      </div>

      {/* Card 4: Legitimate Task Completion */}
      <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
            Legitimate Task Yield
          </span>
          <span className="font-mono-code text-[10px] px-1 rounded bg-surface-container-high text-outline border border-outline-variant/20">
            DEMO
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono-metric text-headline-lg text-tertiary-fixed font-bold">97.9%</span>
          <span className="font-mono-code text-body-sm text-tertiary font-semibold">47/48</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Benign agent tasks executed with zero policy violations
        </p>
        <div className="w-full bg-surface-container-lowest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-tertiary-fixed h-full" style={{ width: '97.9%' }}></div>
        </div>
      </div>

      {/* Card 5: Latency Overhead */}
      <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
            Inspection Overhead
          </span>
          <span className="font-mono-code text-[10px] px-1 rounded bg-surface-container-high text-outline border border-outline-variant/20">
            DEMO
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono-metric text-headline-lg text-primary font-bold">+38ms</span>
          <span className="font-mono-code text-[11px] text-on-surface-variant">p95: 112ms</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Median: 42ms total behavioral pipeline overhead
        </p>
        <div className="w-full bg-surface-container-lowest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full" style={{ width: '38%' }}></div>
        </div>
      </div>
    </div>
  );
};
