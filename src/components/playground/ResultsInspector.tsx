import React from 'react';

export interface ToolCallSpec {
  toolName: string;
  parameters: Record<string, any>;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  authorized: boolean;
  verdict: 'BLOCKED' | 'PERMITTED' | 'SANITIZED';
  reason: string;
}

interface ResultsInspectorProps {
  decision: string;
  confidence: number | null;
  injectionProbability: number | null;
  exfiltrationRisk: number | null;
  privilegeDeviation: number | null;
  summaryText: string;
  safeMetadata: string | null;
}

export const ResultsInspector: React.FC<ResultsInspectorProps> = ({
  decision,
  confidence,
  injectionProbability,
  exfiltrationRisk,
  privilegeDeviation,
  summaryText,
  safeMetadata,
}) => {
  const isBlocked = decision === 'BLOCKED' || decision === 'QUARANTINED' || decision === 'DENY';

  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 flex flex-col gap-5">
      {/* Decision Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isBlocked
            ? 'bg-gradient-to-r from-[#93000a]/20 via-[#131b2e] to-[#0b1326] border-[#ffb4ab]/40'
            : 'bg-gradient-to-r from-[#4edea3]/15 via-[#131b2e] to-[#0b1326] border-[#4edea3]/40'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isBlocked
                ? 'bg-[#93000a] text-[#ffb4ab] shadow-md shadow-[#93000a]/40'
                : 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40 shadow-md'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isBlocked ? 'gpp_bad' : 'verified_user'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`text-sm font-bold font-headline tracking-wide uppercase ${
                  isBlocked ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
                }`}
              >
                FIREWALL VERDICT: {decision}
              </span>
              <span className="font-mono text-[10px] text-[#8e9099] bg-[#0b1326] px-2 py-0.5 rounded border border-[#222a3d]">
                Confidence: {confidence !== null ? (confidence * 100).toFixed(1) : 'N/A'}%
              </span>
            </div>
            <p className="text-xs text-[#c4c6d0] leading-relaxed">{summaryText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button className="text-xs font-mono text-[#adc6ff] bg-[#171f33] hover:bg-[#222a3d] px-3 py-1.5 rounded-lg border border-[#222a3d] transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">code</span>
            Export JSON Trace
          </button>
        </div>
      </div>

      {/* 4 Risk Signals Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-[#8e9099] uppercase font-label-caps">
              Injection Probability
            </span>
            <span className="material-symbols-outlined text-xs text-[#adc6ff]">
              psychology_alt
            </span>
          </div>
          <div
            className={`text-xl font-bold font-mono mb-1 ${
              (injectionProbability ?? 0) > 0.6 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
            }`}
          >
            {injectionProbability !== null ? (injectionProbability * 100).toFixed(1) : 'N/A'}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                (injectionProbability ?? 0) > 0.6 ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${(injectionProbability ?? 0) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-[#8e9099] uppercase font-label-caps">
              Exfiltration Risk
            </span>
            <span className="material-symbols-outlined text-xs text-[#ffb4ab]">
              output
            </span>
          </div>
          <div
            className={`text-xl font-bold font-mono mb-1 ${
              (exfiltrationRisk ?? 0) > 0.6 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
            }`}
          >
            {exfiltrationRisk !== null ? (exfiltrationRisk * 100).toFixed(1) : 'N/A'}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                (exfiltrationRisk ?? 0) > 0.6 ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${(exfiltrationRisk ?? 0) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-[#8e9099] uppercase font-label-caps">
              Privilege Deviation
            </span>
            <span className="material-symbols-outlined text-xs text-[#4cd7f6]">
              admin_panel_settings
            </span>
          </div>
          <div
            className={`text-xl font-bold font-mono mb-1 ${
              (privilegeDeviation ?? 0) > 0.6 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
            }`}
          >
            {privilegeDeviation !== null ? (privilegeDeviation * 100).toFixed(1) : 'N/A'}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                (privilegeDeviation ?? 0) > 0.6 ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${(privilegeDeviation ?? 0) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-[#8e9099] uppercase font-label-caps">
              Policy Confidence
            </span>
            <span className="material-symbols-outlined text-xs text-[#4edea3]">
              verified
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-[#4edea3] mb-1">
            {confidence !== null ? (confidence * 100).toFixed(1) : 'N/A'}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4edea3] transition-all"
              style={{ width: `${(confidence ?? 0) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Execution Safe Metadata */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#e0e2ec] font-headline tracking-wide uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">data_object</span>
            Execution Safe Metadata
          </span>
        </div>

        <div className="overflow-x-auto border border-[#222a3d] rounded-lg bg-[#0b1326] p-4 text-xs font-mono-code text-on-surface-variant">
          {safeMetadata ? (
            <pre className="whitespace-pre-wrap">{safeMetadata}</pre>
          ) : (
            <span>No metadata available.</span>
          )}
        </div>
      </div>
    </div>
  );
};
