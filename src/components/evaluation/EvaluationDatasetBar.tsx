import React from 'react';

export const EvaluationDatasetBar: React.FC = () => {
  return (
    <div className="bg-surface-container-low p-space-md rounded-xl mb-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border border-outline-variant/30 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-xs font-mono-code text-mono-code">
        <div className="flex items-center gap-1.5">
          <span className="text-outline">Suite:</span>
          <span className="text-on-surface font-semibold">Synth-Security-Eval v2.1</span>
          <span className="text-outline text-[11px]">(150 Dev / 100 Held-Out)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-outline">Profile:</span>
          <span className="text-secondary font-semibold">Full Defense (All 7 Behavioral Layers)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-outline">Engine:</span>
          <span className="text-on-surface">Llama-3-8B-Instruct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-outline">Seed:</span>
          <span className="text-on-surface">42</span>
          <span className="text-outline">|</span>
          <span className="text-outline">Repeat:</span>
          <span className="text-on-surface">3x Avg</span>
        </div>
      </div>

      <div className="flex items-center gap-space-md shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-tertiary font-mono-code text-[11px] border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          <span>250/250 Cases Evaluated • 0 Dropped</span>
        </div>
        <div className="hidden xl:flex items-center gap-1 text-outline font-label-caps text-label-caps">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>Deterministic Simulation Sandbox</span>
        </div>
      </div>
    </div>
  );
};
