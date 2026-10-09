import React from 'react';

interface ComparativeDifferentialProps {
  unprotectedOutput: string;
  protectedOutput: string;
  isBlocked?: boolean;
}

export const ComparativeDifferential: React.FC<ComparativeDifferentialProps> = ({
  unprotectedOutput,
  protectedOutput,
}) => {
  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#222a3d]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#adc6ff]/10 border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff]">
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#e0e2ec] font-headline tracking-wide">
              Behavioral Differential Analysis: Unprotected vs PromptGuard
            </h3>
            <p className="text-[11px] text-[#8e9099]">
              Side-by-side behavioral comparison showing real-time mitigation impact
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[#8e9099] bg-[#0b1326] px-2.5 py-1 rounded border border-[#222a3d]">
          Deterministic Difference Engine
        </span>
      </div>

      {/* Side-by-Side Dual Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Baseline Unprotected Result */}
        <div className="bg-[#0b1326] border border-[#93000a]/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">
                  error
                </span>
                <span className="text-xs font-semibold text-[#ffb4ab] font-headline uppercase">
                  Unprotected Baseline (Compromised)
                </span>
              </div>
              <span className="font-mono text-[9px] text-[#ffb4ab] bg-[#93000a]/30 px-2 py-0.5 rounded border border-[#ffb4ab]/30">
                EXPLOIT SUCCESSFUL
              </span>
            </div>

            <p className="text-[11px] text-[#8e9099] mb-2 leading-relaxed">
              Without PromptGuard, the LLM executes untrusted instruction strings unconditionally, leaking keys and triggering unauthorized tools:
            </p>

            <div className="bg-[#060e20] p-3 rounded-lg border border-[#93000a]/30 font-mono text-[11px] text-[#ffb4ab] leading-relaxed whitespace-pre-wrap">
              {unprotectedOutput}
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#222a3d] flex items-center justify-between text-[10px] font-mono text-[#8e9099]">
            <span>Status: Vulnerability Confirmed</span>
            <span className="text-[#ffb4ab]">Zero Defense Interception</span>
          </div>
        </div>

        {/* Right: PromptGuard Protected Result */}
        <div className="bg-[#0b1326] border border-[#4edea3]/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                  verified_user
                </span>
                <span className="text-xs font-semibold text-[#4edea3] font-headline uppercase">
                  PromptGuard Secured Agent
                </span>
              </div>
              <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/20 px-2 py-0.5 rounded border border-[#4edea3]/40">
                ATTACK NEUTRALIZED
              </span>
            </div>

            <p className="text-[11px] text-[#8e9099] mb-2 leading-relaxed">
              With PromptGuard active, untrusted prompts are classified, tool permissions are audited, and safe sanitized responses are synthesized:
            </p>

            <div className="bg-[#060e20] p-3 rounded-lg border border-[#4edea3]/30 font-mono text-[11px] text-[#4edea3] leading-relaxed whitespace-pre-wrap">
              {protectedOutput}
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#222a3d] flex items-center justify-between text-[10px] font-mono text-[#8e9099]">
            <span>Status: Policy Compliant</span>
            <span className="text-[#4edea3]">Full Remediation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
