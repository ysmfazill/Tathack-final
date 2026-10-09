import React from 'react';
import { clsx } from 'clsx';

interface ForensicDiffViewerProps {
  originalPrompt: string;
  injectedPayload: string;
  taintedParameters?: string[];
  decision?: string;
  className?: string;
}

export const ForensicDiffViewer: React.FC<ForensicDiffViewerProps> = ({
  originalPrompt,
  injectedPayload,
  taintedParameters = [],
  decision = 'BLOCKED',
  className,
}) => {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 lg:grid-cols-2 gap-4 w-full font-mono-code text-[12px]',
        className
      )}
    >
      {/* Left: Authorized Baseline Task */}
      <div className="flex flex-col rounded-lg bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="font-label-caps text-on-surface uppercase font-semibold">
              1. Authorized User Prompt
            </span>
          </div>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-tertiary-container/20 text-tertiary font-mono-code border border-tertiary/30">
            ORIGIN: TRUSTED
          </span>
        </div>
        <div className="p-3.5 text-on-surface leading-relaxed whitespace-pre-wrap">
          {originalPrompt}
        </div>
      </div>

      {/* Right: Injected Adversarial Payload */}
      <div className="flex flex-col rounded-lg bg-surface-container-lowest border border-error/40 overflow-hidden relative">
        <div className="flex items-center justify-between px-3 py-2 bg-error-container/20 border-b border-error/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span className="font-label-caps text-error uppercase font-semibold">
              2. Untrusted Ingest / Taint Vector
            </span>
          </div>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-error-container/40 text-error font-mono-code border border-error/50 font-bold">
            TAINT VECTOR • {decision}
          </span>
        </div>
        <div className="p-3.5 text-error-container/90 leading-relaxed whitespace-pre-wrap bg-error-container/5">
          {injectedPayload}
        </div>

        {taintedParameters.length > 0 && (
          <div className="p-2.5 bg-surface-container border-t border-error/20 flex items-center gap-2 flex-wrap">
            <span className="font-label-caps text-[10px] text-error font-semibold uppercase">
              Tainted Parameters Detected:
            </span>
            {taintedParameters.map((param, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-error-container/30 text-error font-mono-code text-[11px] border border-error/40"
              >
                {param}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
