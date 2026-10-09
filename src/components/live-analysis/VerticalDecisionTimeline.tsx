import React from 'react';

interface TimelineStep {
  step: string;
  name: string;
  latency: string;
  badge: string;
  type: 'passed' | 'warning' | 'evaluated' | 'taint' | 'violation' | 'blocked' | 'halted' | 'signed';
}

export const VerticalDecisionTimeline: React.FC = () => {
  const steps: TimelineStep[] = [
    { step: '01', name: 'Input Received', latency: '1.2ms', badge: 'Passed', type: 'passed' },
    { step: '02', name: 'Content Normalized', latency: '2.8ms', badge: 'Passed', type: 'passed' },
    { step: '03', name: 'Security Scan', latency: '7.9ms', badge: 'Triggered / Warning', type: 'warning' },
    { step: '04', name: 'Agent Plan Generated', latency: '142.0ms', badge: 'Evaluated', type: 'evaluated' },
    { step: '05', name: 'Provenance Analysis', latency: '16.0ms', badge: 'Taint Flagged', type: 'taint' },
    { step: '06', name: 'Policy Evaluation', latency: '8.4ms', badge: 'Violation Found', type: 'violation' },
    { step: '07', name: 'Authorization Decision', latency: '1.1ms', badge: 'BLOCKED', type: 'blocked' },
    { step: '08', name: 'Tool Execution', latency: '0.0ms', badge: 'NOT EXECUTED - Halted', type: 'halted' },
    { step: '09', name: 'Audit Event', latency: '2.1ms', badge: 'Recorded & Signed', type: 'signed' },
  ];

  return (
    <section className="bg-surface-container p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            Security Decision Timeline
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Deterministic chronological execution trace from input ingestion to final audit commit.
          </span>
        </div>
        <span className="font-mono-code text-mono-code text-secondary font-semibold">
          Total Elapsed: 184.4ms
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 flex flex-col gap-space-sm">
        <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-surface-container-high"></div>

        {steps.map((st) => {
          const isError = st.type === 'blocked' || st.type === 'taint' || st.type === 'violation';
          const isWarning = st.type === 'warning';
          const isPassed = st.type === 'passed' || st.type === 'signed';

          return (
            <div
              key={st.step}
              className={`relative flex items-center justify-between p-space-sm rounded-lg border transition-all ${
                st.type === 'blocked'
                  ? 'bg-error-container/20 border-error/40 shadow-sm'
                  : 'bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-code text-[10px] font-bold z-10 ${
                    isError
                      ? 'bg-error text-on-error'
                      : isWarning
                      ? 'bg-secondary-container text-on-secondary'
                      : isPassed
                      ? 'bg-tertiary text-on-tertiary'
                      : 'bg-surface-variant text-on-surface'
                  }`}
                >
                  {isError ? '✕' : isWarning ? '!' : isPassed ? '✓' : '•'}
                </div>
                <span
                  className={`font-mono-code text-[12px] font-semibold ${
                    st.type === 'blocked' ? 'text-error' : 'text-outline'
                  }`}
                >
                  {st.step}
                </span>
                <span
                  className={`font-body-md text-body-md font-medium ${
                    st.type === 'blocked' ? 'text-error font-bold' : 'text-on-surface'
                  }`}
                >
                  {st.name}
                </span>
              </div>

              <div className="flex items-center gap-space-md">
                <span className="font-mono-code text-[12px] text-on-surface-variant">{st.latency}</span>
                <span
                  className={`px-2 py-0.5 rounded font-label-caps text-[10px] uppercase font-bold ${
                    st.type === 'blocked'
                      ? 'bg-error text-on-error'
                      : isError
                      ? 'bg-error/20 text-error border border-error/30'
                      : isWarning
                      ? 'bg-secondary/20 text-secondary border border-secondary/30'
                      : isPassed
                      ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {st.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
