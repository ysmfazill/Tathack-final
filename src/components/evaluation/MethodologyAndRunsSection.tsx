import React from 'react';
import { Card } from '../common/Card';

interface HistoricalRun {
  runId: string;
  timestamp: string;
  target: string;
  policy: string;
  abr: string;
  fpr: string;
  isCurrent?: boolean;
}

const HISTORICAL_RUNS: HistoricalRun[] = [
  {
    runId: 'RUN-EVAL-0842',
    timestamp: 'Today, 14:15',
    target: 'Ollama / Llama-3-70b',
    policy: 'v1.4.2 STRICT',
    abr: '95.8%',
    fpr: '2.1%',
    isCurrent: true
  },
  {
    runId: 'RUN-EVAL-0841',
    timestamp: 'Yesterday, 19:40',
    target: 'GPT-4o Agent Swarm',
    policy: 'v1.4.1 PERMISSIVE',
    abr: '91.2%',
    fpr: '3.4%'
  },
  {
    runId: 'RUN-EVAL-0840',
    timestamp: 'Oct 7, 11:20',
    target: 'Claude-3.5 Sonnet Agent',
    policy: 'v1.3.9 DEFAULT',
    abr: '88.5%',
    fpr: '4.8%'
  },
  {
    runId: 'RUN-EVAL-0839',
    timestamp: 'Oct 5, 16:05',
    target: 'Mixtral-8x22B Local',
    policy: 'v1.3.5 BASELINE',
    abr: '84.0%',
    fpr: '5.9%'
  }
];

export const MethodologyAndRunsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Benchmark Methodology */}
      <Card elevation="low" className="p-6 border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
            <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
              Benchmark Methodology & Math
            </h3>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mb-4">
            Formal mathematical definitions and threat frameworks applied during red-team evaluation
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="text-[10px] font-mono-code font-bold text-error uppercase mb-1">
                Attack Success Rate (ASR)
              </div>
              <div className="font-mono-code text-xs text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/20 mb-1.5">
                ASR = N_bypassed / N_adversarial
              </div>
              <p className="text-[11px] text-on-surface-variant leading-snug">
                Ratio of hostile inputs that penetrated all firewall defenses to reach LLM execution.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="text-[10px] font-mono-code font-bold text-tertiary uppercase mb-1">
                Attack Block Rate (ABR)
              </div>
              <div className="font-mono-code text-xs text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/20 mb-1.5">
                ABR = 1.0 - ASR = 95.8%
              </div>
              <p className="text-[11px] text-on-surface-variant leading-snug">
                Proportion of hostile and injection vectors intercepted across all security layers.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="text-[10px] font-mono-code font-bold text-secondary uppercase mb-1">
                False Positive Rate (FPR)
              </div>
              <div className="font-mono-code text-xs text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/20 mb-1.5">
                FPR = N_benign_blocked / N_benign
              </div>
              <p className="text-[11px] text-on-surface-variant leading-snug">
                Frequency with which valid business actions were erroneously flagged or blocked.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="text-[10px] font-mono-code font-bold text-primary uppercase mb-1">
                Legitimate Task Yield
              </div>
              <div className="font-mono-code text-xs text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/20 mb-1.5">
                Yield = N_passed_clean / N_benign
              </div>
              <p className="text-[11px] text-on-surface-variant leading-snug">
                Percentage of harmless user requests completed without unnecessary interruption.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant font-mono-code">
          <span>Standards: <strong>MITRE ATLAS v4.2.0</strong></span>
          <span><strong>OWASP LLM Top 10</strong></span>
          <span><strong>NIST AI RMF 1.0</strong></span>
        </div>
      </Card>

      {/* Right Column: Historical Evaluation Runs */}
      <Card elevation="low" className="p-6 border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
                Previous Evaluation Runs
              </h3>
            </div>
            <span className="text-[10px] font-mono-code text-on-surface-variant">
              4 runs archived
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mb-4">
            Auditable progression of model robustness and policy enforcement over time
          </p>

          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-high/80 text-on-surface-variant border-b border-outline-variant/30 font-semibold">
                  <th className="py-2.5 px-3">Run ID</th>
                  <th className="py-2.5 px-3">Target & Policy</th>
                  <th className="py-2.5 px-3 text-center">ABR</th>
                  <th className="py-2.5 px-3 text-center">FPR</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                {HISTORICAL_RUNS.map((run) => (
                  <tr
                    key={run.runId}
                    className={`hover:bg-surface-container/50 transition-colors ${
                      run.isCurrent ? 'bg-primary/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-mono-code font-bold text-primary text-xs">
                        {run.runId}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">{run.timestamp}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-on-surface font-semibold text-xs">{run.target}</div>
                      <div className="text-[10px] text-secondary font-mono-code">{run.policy}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono-code font-bold text-tertiary">
                      {run.abr}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono-code text-on-surface-variant">
                      {run.fpr}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {run.isCurrent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-primary/20 text-primary border border-primary/30">
                          CURRENT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                          ARCHIVED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>Continuous Integration / Automated Regression Hooks Active</span>
          <span className="font-mono-code text-primary font-semibold">GitHub Action #1049</span>
        </div>
      </Card>
    </div>
  );
};
