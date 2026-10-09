import React from 'react';

interface FirewallControlsProps {
  firewallMode: 'protected' | 'baseline';
  onFirewallModeChange: (mode: 'protected' | 'baseline') => void;
  isSimulating: boolean;
  onRunSimulation: () => void;
  defenseToggles: {
    promptSanitizer: boolean;
    toolAuthorization: boolean;
    behavioralAnomaly: boolean;
    dlpGuard: boolean;
  };
  onToggleDefense: (key: keyof FirewallControlsProps['defenseToggles']) => void;
}

export const FirewallControls: React.FC<FirewallControlsProps> = ({
  firewallMode,
  onFirewallModeChange,
  isSimulating,
  onRunSimulation,
  defenseToggles,
  onToggleDefense,
}) => {
  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 flex flex-col justify-between gap-5 h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#222a3d]/80 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[18px]">security</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e0e2ec] font-headline tracking-wide">
                Firewall Enforcement Matrix
              </h3>
              <p className="text-[11px] text-[#8e9099]">
                Simulate runtime mitigation policies & interception engines
              </p>
            </div>
          </div>
        </div>

        {/* Firewall Mode Toggle: Baseline vs Protected */}
        <div className="mb-4">
          <label className="block text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider mb-2 font-label-caps">
            Simulation Pipeline Mode
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#0b1326] p-1.5 rounded-lg border border-[#222a3d]">
            <button
              onClick={() => onFirewallModeChange('protected')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium font-headline transition-all ${
                firewallMode === 'protected'
                  ? 'bg-[#171f33] text-[#4edea3] border border-[#4edea3]/40 shadow-sm shadow-[#4edea3]/10 font-semibold'
                  : 'text-[#8e9099] hover:text-[#e0e2ec]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>PromptGuard Active</span>
            </button>
            <button
              onClick={() => onFirewallModeChange('baseline')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium font-headline transition-all ${
                firewallMode === 'baseline'
                  ? 'bg-[#171f33] text-[#ffb4ab] border border-[#ffb4ab]/40 shadow-sm shadow-[#ffb4ab]/10 font-semibold'
                  : 'text-[#8e9099] hover:text-[#e0e2ec]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">gpp_bad</span>
              <span>Unprotected Baseline</span>
            </button>
          </div>
        </div>

        {/* Defense Modules Active Status */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider font-label-caps">
            <span>Enforcement Layers</span>
            <span className="text-[#4edea3] text-[10px] font-mono">4 OF 4 ARMED</span>
          </div>

          <div className="space-y-1.5">
            {[
              {
                id: 'promptSanitizer' as const,
                label: 'Layer 1: Indirect Injection Classifier',
                sub: 'Detects hidden instructions & delimiter overrides',
                icon: 'filter_alt',
                status: '99.4% precision',
              },
              {
                id: 'toolAuthorization' as const,
                label: 'Layer 2: Tool Execution Gatekeeper',
                sub: 'Blocks unauthorized function calls & privilege escalations',
                icon: 'lock',
                status: 'Strict RBAC',
              },
              {
                id: 'dlpGuard' as const,
                label: 'Layer 3: Sensitive Data Redaction (DLP)',
                sub: 'Masks credentials, API keys, and PII payloads',
                icon: 'visibility_off',
                status: 'Active',
              },
              {
                id: 'behavioralAnomaly' as const,
                label: 'Layer 4: Cross-Agent Flow Behavioral Guard',
                sub: 'Verifies data lineage across subordinate agents',
                icon: 'hub',
                status: '0.42ms SLA',
              },
            ].map((layer) => {
              const active = defenseToggles[layer.id];
              return (
                <div
                  key={layer.id}
                  onClick={() => onToggleDefense(layer.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                    active && firewallMode === 'protected'
                      ? 'bg-[#0b1326] border-[#222a3d] hover:border-[#adc6ff]/50'
                      : 'bg-[#0b1326]/40 border-[#222a3d]/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        active && firewallMode === 'protected' ? 'text-[#adc6ff]' : 'text-[#8e9099]'
                      }`}
                    >
                      {layer.icon}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-[#e0e2ec] font-headline">{layer.label}</div>
                      <div className="text-[10px] text-[#8e9099]">{layer.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1.5 py-0.5 rounded border border-[#4edea3]/20">
                      {layer.status}
                    </span>
                    <input
                      type="checkbox"
                      checked={active && firewallMode === 'protected'}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 accent-[#4edea3] rounded cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sandbox Notice */}
        <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg p-3 flex items-start gap-2.5 text-[11px] text-[#8e9099]">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[16px] shrink-0 mt-0.5">
            info
          </span>
          <p className="leading-relaxed">
            <strong className="text-[#e0e2ec]">Deterministic Evaluation:</strong> Simulations run against PromptGuard's isolated mock execution sandbox. No live production LLM tokens or real external endpoints are exposed.
          </p>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-3 border-t border-[#222a3d]/80">
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          className={`w-full py-3.5 px-4 rounded-xl font-headline font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all ${
            isSimulating
              ? 'bg-[#171f33] text-[#8e9099] border border-[#222a3d] cursor-not-allowed'
              : firewallMode === 'protected'
              ? 'bg-gradient-to-r from-[#4d8eff] to-[#adc6ff] text-[#0b1326] hover:brightness-110 hover:shadow-[#adc6ff]/20 active:scale-[0.99] font-bold'
              : 'bg-gradient-to-r from-[#93000a] to-[#ffb4ab] text-[#0b1326] hover:brightness-110 active:scale-[0.99] font-bold'
          }`}
        >
          {isSimulating ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>EVALUATING MULTI-STAGE FIREWALL...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>EXECUTE SECURITY TEST SIMULATION</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
