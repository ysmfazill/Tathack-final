import React from 'react';
import { StatusBadge } from '../common/StatusBadge';

export interface ToolCallSpec {
  toolName: string;
  parameters: Record<string, any>;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  authorized: boolean;
  verdict: 'BLOCKED' | 'PERMITTED' | 'SANITIZED';
  reason: string;
}

interface ResultsInspectorProps {
  decision: 'BLOCKED' | 'PERMITTED' | 'QUARANTINED';
  confidence: number;
  injectionProbability: number;
  exfiltrationRisk: number;
  privilegeDeviation: number;
  summaryText: string;
  toolCalls: ToolCallSpec[];
}

export const ResultsInspector: React.FC<ResultsInspectorProps> = ({
  decision,
  confidence,
  injectionProbability,
  exfiltrationRisk,
  privilegeDeviation,
  summaryText,
  toolCalls,
}) => {
  const isBlocked = decision === 'BLOCKED' || decision === 'QUARANTINED';

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
                Confidence: {(confidence * 100).toFixed(1)}%
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
              injectionProbability > 0.6 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
            }`}
          >
            {(injectionProbability * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                injectionProbability > 0.6 ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${injectionProbability * 100}%` }}
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
              exfiltrationRisk > 0.6 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
            }`}
          >
            {(exfiltrationRisk * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                exfiltrationRisk > 0.6 ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${exfiltrationRisk * 100}%` }}
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
              privilegeDeviation > 0.6 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
            }`}
          >
            {(privilegeDeviation * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                privilegeDeviation > 0.6 ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${privilegeDeviation * 100}%` }}
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
            {(confidence * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-[#171f33] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4edea3] transition-all"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Proposed Tool Authorization Table */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#e0e2ec] font-headline tracking-wide uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">build</span>
            Proposed Agent Tool Invocations
          </span>
          <span className="text-[10px] font-mono text-[#8e9099]">
            {toolCalls.length} tool calls analyzed
          </span>
        </div>

        <div className="overflow-x-auto border border-[#222a3d] rounded-lg bg-[#0b1326]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#222a3d] text-[10px] uppercase font-label-caps text-[#8e9099] bg-[#171f33]/40">
                <th className="py-2.5 px-3.5 font-medium">Tool Function</th>
                <th className="py-2.5 px-3.5 font-medium">Extracted Parameters</th>
                <th className="py-2.5 px-3.5 font-medium">Risk Tier</th>
                <th className="py-2.5 px-3.5 font-medium">RBAC Gate</th>
                <th className="py-2.5 px-3.5 font-medium">Firewall Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]">
              {toolCalls.map((tc, idx) => (
                <tr key={idx} className="hover:bg-[#171f33]/30 transition-colors">
                  <td className="py-3 px-3.5 font-mono text-[#adc6ff] font-medium whitespace-nowrap">
                    {tc.toolName}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-[#c4c6d0]">
                    <pre className="max-w-xs md:max-w-md overflow-x-auto bg-[#060e20] p-1.5 rounded border border-[#222a3d] text-[10px]">
                      {JSON.stringify(tc.parameters, null, 2)}
                    </pre>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <StatusBadge
                      variant={
                        tc.riskLevel === 'critical'
                          ? 'error'
                          : tc.riskLevel === 'high'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {tc.riskLevel.toUpperCase()}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px]">
                    {tc.authorized ? (
                      <span className="text-[#4edea3] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Authorized
                      </span>
                    ) : (
                      <span className="text-[#ffb4ab] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                        Forbidden
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                        tc.verdict === 'BLOCKED'
                          ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]/30'
                          : tc.verdict === 'SANITIZED'
                          ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40'
                          : 'bg-[#4edea3]/20 text-[#4edea3] border-[#4edea3]/40'
                      }`}
                    >
                      {tc.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
