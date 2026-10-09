import React from 'react';

interface EvaluationHeaderProps {
  isRunning: boolean;
  onRunEvaluation: () => void;
  onExportJson: () => void;
  onViewHistory: () => void;
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  isRunning,
  onRunEvaluation,
  onExportJson,
  onViewHistory,
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md mb-space-lg">
      <div className="flex flex-col">
        <span className="font-body-md text-body-md text-on-surface-variant">
          Evaluation Lab: Measure attack resistance, false positives, and legitimate task completion across defense layers.
        </span>
        <div className="flex flex-wrap items-center gap-space-xs mt-space-sm">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-tertiary-container/15 text-tertiary font-label-caps text-label-caps border border-tertiary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            LOCAL SIMULATION
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-on-surface-variant border border-outline-variant/20">
            DATASET: <span className="text-on-surface font-medium">SYNTH-EVAL-v2.1 (HELD-OUT 250 CASES)</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-on-surface-variant border border-outline-variant/20">
            MODEL: <span className="text-secondary font-medium">OLLAMA (LLAMA-3-8B-INSTRUCT)</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-on-surface-variant border border-outline-variant/20">
            POLICY: <span className="text-primary font-medium">v1.4.2 STRICT</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-outline border border-outline-variant/20">
            LAST RUN: <span className="text-tertiary">RUN-EVAL-0842 • COMPLETED</span> (DEMO DATA)
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
        <button
          onClick={onViewHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm transition-colors border border-outline-variant/30 shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">history</span>
          <span>View History</span>
        </button>
        <button
          onClick={onExportJson}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm transition-colors border border-outline-variant/30 shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">download</span>
          <span>Export Benchmark JSON</span>
        </button>
        <button
          onClick={onRunEvaluation}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-body-sm text-body-sm font-semibold shadow-sm"
          type="button"
        >
          <span className={`material-symbols-outlined text-[16px] ${isRunning ? 'animate-spin' : ''}`}>
            {isRunning ? 'refresh' : 'play_arrow'}
          </span>
          <span>{isRunning ? 'Evaluating Suite...' : 'Run Evaluation'}</span>
        </button>
      </div>
    </div>
  );
};
