import React from 'react';
import { Card } from '../common/Card';

export interface MethodologyAndRunsSectionProps {
  runs: any[];
  onSelectRun: (runId: string) => void;
  currentRunId?: string;
}

export const MethodologyAndRunsSection: React.FC<MethodologyAndRunsSectionProps> = ({ runs, onSelectRun, currentRunId }) => {
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
                ABR = 1.0 - ASR
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
              {runs.length} runs archived
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
                  <th className="py-2.5 px-3">Suite & Dataset</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Cases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                {runs.map((run) => {
                  const isCurrent = run.run_id === currentRunId;
                  return (
                    <tr
                      key={run.run_id}
                      onClick={() => onSelectRun(run.run_id)}
                      className={`cursor-pointer hover:bg-surface-container/50 transition-colors ${
                        isCurrent ? 'bg-primary/5 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono-code font-bold text-primary text-xs">
                          {run.run_id.substring(0, 8)}
                        </div>
                        <div className="text-[10px] text-on-surface-variant">{new Date(run.started_at).toLocaleString()}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-on-surface font-semibold text-xs">{run.suite_id}</div>
                        <div className="text-[10px] text-secondary font-mono-code">{run.dataset_version}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono-code font-bold text-tertiary">
                        {run.run_status}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="font-mono-code text-on-surface-variant">{run.executed_case_count}/{run.total_case_count}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {runs.length === 0 && (
              <div className="p-4 text-center text-on-surface-variant text-xs">No historical runs found.</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
