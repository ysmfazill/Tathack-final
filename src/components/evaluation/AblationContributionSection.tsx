import React from 'react';
import { Card } from '../common/Card';

interface AblationStep {
  layer: string;
  abr: number;
  latency: string;
  deltaGain: string;
  status: 'baseline' | 'active';
  description: string;
}

const ABLATION_STEPS: AblationStep[] = [
  {
    layer: 'No Defense (Baseline)',
    abr: 12.5,
    latency: '0ms',
    deltaGain: '—',
    status: 'baseline',
    description: 'Raw LLM without any behavioral interceptors or input scanners'
  },
  {
    layer: '+ Lexical / Regex',
    abr: 38.2,
    latency: '+4ms',
    deltaGain: '+25.7%',
    status: 'active',
    description: 'Static pattern matches & blacklisted token combinations'
  },
  {
    layer: '+ Semantic Intent',
    abr: 64.6,
    latency: '+12ms',
    deltaGain: '+26.4%',
    status: 'active',
    description: 'Vector embedding proximity to known jailbreak clusters'
  },
  {
    layer: '+ Policy Engine (RBAC)',
    abr: 82.1,
    latency: '+21ms',
    deltaGain: '+17.5%',
    status: 'active',
    description: 'Enforces tool calling schemas, scopes & role constraints'
  },
  {
    layer: '+ Contextual Taint',
    abr: 91.7,
    latency: '+29ms',
    deltaGain: '+9.6%',
    status: 'active',
    description: 'Propagates trust boundaries across cross-agent memory flows'
  },
  {
    layer: '+ Output Sanitizer',
    abr: 95.8,
    latency: '+38ms',
    deltaGain: '+4.1%',
    status: 'active',
    description: 'Full PromptGuard stack with egress filtering & DLP guard'
  }
];

export const AblationContributionSection: React.FC = () => {
  return (
    <Card elevation="low" className="p-6 border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
            <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
              Defense Layer Contribution (Ablation Analysis)
            </h3>
          </div>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1">
            Incremental security gain and latency impact of each cumulative PromptGuard layer
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-surface-container-high text-on-surface-variant border border-outline-variant/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          N=250 TEST RUNS (EVAL-0842)
        </span>
      </div>

      {/* Grid of Ablation Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {ABLATION_STEPS.map((step, idx) => {
          const isHighest = idx === ABLATION_STEPS.length - 1;
          return (
            <div
              key={step.layer}
              className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
                isHighest
                  ? 'bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20'
                  : 'bg-surface-container/60 border-outline-variant/30 hover:border-outline-variant/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono-code text-on-surface-variant/80 font-semibold uppercase">
                    Step {idx + 1}
                  </span>
                  {isHighest && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                      FULL STACK
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-on-surface mb-2 line-clamp-2 min-h-[32px]">
                  {step.layer}
                </h4>

                {/* Metric Bar Visual */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant text-[11px]">ABR</span>
                    <span className={`font-mono-code font-bold ${isHighest ? 'text-primary' : 'text-on-surface'}`}>
                      {step.abr}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isHighest ? 'bg-primary' : idx === 0 ? 'bg-error' : 'bg-primary/70'
                      }`}
                      style={{ width: `${step.abr}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-on-surface-variant/90 leading-snug mb-3">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] font-mono-code">
                <span className="text-on-surface-variant">Lat: <strong className="text-on-surface">{step.latency}</strong></span>
                <span className={step.deltaGain.startsWith('+') ? 'text-tertiary font-bold' : 'text-on-surface-variant'}>
                  Δ {step.deltaGain}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empirical Takeaway Callout */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
        <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">insights</span>
        <div className="text-xs leading-relaxed text-on-surface-variant">
          <strong className="text-on-surface font-semibold">Key Empirical Takeaway:</strong> Semantic Intent Classification + Contextual Taint Tracking account for{' '}
          <span className="text-tertiary font-bold font-mono-code">68%</span> of advanced multi-agent attack mitigations. Lexical/regex filters alone fail against{' '}
          <span className="text-error font-bold font-mono-code">61.8%</span> of multi-stage semantic evasion and prompt injection payloads.
        </div>
      </div>
    </Card>
  );
};
