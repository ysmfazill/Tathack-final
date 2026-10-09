import React from 'react';

interface CrossAgentFlowSimProps {
  scenarioId?: string;
  isBlocked: boolean;
}

export const CrossAgentFlowSim: React.FC<CrossAgentFlowSimProps> = ({
  isBlocked,
}) => {
  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#222a3d]/80 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#adc6ff]/10 border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff]">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#e0e2ec] font-headline tracking-wide">
              Cross-Agent Flow Simulation & Boundary Enforcement
            </h3>
            <p className="text-[11px] text-[#8e9099]">
              Multi-agent delegation graph showing intercepted exfiltration or lateral movement paths
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[#8e9099] bg-[#0b1326] px-2.5 py-1 rounded border border-[#222a3d]">
          Topology: 4 Agents | 3 Delegation Hops
        </span>
      </div>

      {/* Visual Flow Diagram */}
      <div className="relative bg-[#0b1326] border border-[#222a3d] rounded-xl p-6 overflow-x-auto">
        <div className="min-w-[680px] flex items-center justify-between relative">
          {/* Node 1: Ingest Source */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-12 h-12 rounded-xl bg-[#171f33] border border-[#222a3d] flex items-center justify-center text-[#adc6ff] shadow-md">
              <span className="material-symbols-outlined text-[24px]">cloud_download</span>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-[#e0e2ec] font-headline">Ingest Vector</div>
              <div className="text-[10px] text-[#8e9099] font-mono">External API/Doc</div>
            </div>
            <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
              UNTRUSTED INPUT
            </span>
          </div>

          {/* Flow Line 1 */}
          <div className="flex-1 flex flex-col items-center px-3 relative">
            <div className="w-full h-0.5 bg-gradient-to-r from-[#222a3d] via-[#4edea3]/50 to-[#222a3d] relative">
              <span className="material-symbols-outlined absolute left-1/2 -top-2.5 -translate-x-1/2 text-xs text-[#4edea3]">
                chevron_right
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#8e9099] mt-2">Payload Transport</span>
          </div>

          {/* Node 2: Primary Orchestrator Agent */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-12 h-12 rounded-xl bg-[#171f33] border border-[#adc6ff]/40 flex items-center justify-center text-[#adc6ff] shadow-md">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-[#e0e2ec] font-headline">HR / Orchestrator</div>
              <div className="text-[10px] text-[#8e9099] font-mono">Agent Scope: Internal</div>
            </div>
            <span className="font-mono text-[9px] text-[#adc6ff] bg-[#adc6ff]/10 px-2 py-0.5 rounded border border-[#adc6ff]/20">
              PERMITTED
            </span>
          </div>

          {/* Flow Line 2 */}
          <div className="flex-1 flex flex-col items-center px-3 relative">
            <div className="w-full h-0.5 bg-gradient-to-r from-[#222a3d] via-[#4edea3]/50 to-[#222a3d] relative">
              <span className="material-symbols-outlined absolute left-1/2 -top-2.5 -translate-x-1/2 text-xs text-[#4edea3]">
                chevron_right
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#8e9099] mt-2">Sub-task Delegation</span>
          </div>

          {/* Node 3: Synthesis / Report Agent */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-12 h-12 rounded-xl bg-[#171f33] border border-[#222a3d] flex items-center justify-center text-[#e0e2ec] shadow-md">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-[#e0e2ec] font-headline">Report Synthesizer</div>
              <div className="text-[10px] text-[#8e9099] font-mono">Agent Scope: Read-Only</div>
            </div>
            <span className="font-mono text-[9px] text-[#adc6ff] bg-[#adc6ff]/10 px-2 py-0.5 rounded border border-[#adc6ff]/20">
              PERMITTED
            </span>
          </div>

          {/* Flow Line 3 (Interception point) */}
          <div className="flex-1 flex flex-col items-center px-3 relative">
            <div
              className={`w-full h-0.5 relative ${
                isBlocked
                  ? 'bg-gradient-to-r from-[#222a3d] via-[#ffb4ab] to-[#222a3d]'
                  : 'bg-gradient-to-r from-[#222a3d] via-[#4edea3] to-[#222a3d]'
              }`}
            >
              <div
                className={`absolute left-1/2 -top-3.5 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-0.5 ${
                  isBlocked
                    ? 'bg-[#93000a] text-[#ffb4ab] border border-[#ffb4ab]/40 animate-pulse'
                    : 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                }`}
              >
                <span className="material-symbols-outlined text-[11px]">
                  {isBlocked ? 'block' : 'check'}
                </span>
                <span>{isBlocked ? 'FIREWALL CUT' : 'ALLOWED'}</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#ffb4ab] mt-3">
              {isBlocked ? 'Privilege Exceeded' : 'Authorized Hop'}
            </span>
          </div>

          {/* Node 4: Exfiltration / External Egress Agent */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                isBlocked
                  ? 'bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab]'
                  : 'bg-[#171f33] border border-[#222a3d] text-[#e0e2ec]'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isBlocked ? 'cloud_off' : 'cloud_upload'}
              </span>
            </div>
            <div className="text-center">
              <div
                className={`text-xs font-semibold font-headline ${
                  isBlocked ? 'text-[#ffb4ab]' : 'text-[#e0e2ec]'
                }`}
              >
                Export / Public Webhook
              </div>
              <div className="text-[10px] text-[#8e9099] font-mono">External Egress Tool</div>
            </div>
            <span
              className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
                isBlocked
                  ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]/30'
                  : 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20'
              }`}
            >
              {isBlocked ? 'ACCESS BLOCKED' : 'UNRESTRICTED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
