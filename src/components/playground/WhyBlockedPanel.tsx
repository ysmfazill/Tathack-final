import React from 'react';

interface WhyBlockedPanelProps {
  proposedAction: string;
  sourceContext: string;
  destinationContext: string;
  classification: string;
  violatedPolicy: string;
  authorizationRequired: string;
  isBlocked: boolean;
}

export const WhyBlockedPanel: React.FC<WhyBlockedPanelProps> = ({
  proposedAction,
  sourceContext,
  destinationContext,
  classification,
  violatedPolicy,
  authorizationRequired,
  isBlocked,
}) => {
  const attributes = [
    {
      label: 'Proposed Agent Action',
      value: proposedAction,
      icon: 'terminal',
      tone: isBlocked ? 'critical' : 'normal',
    },
    {
      label: 'Source Boundary / Agent',
      value: sourceContext,
      icon: 'source',
      tone: 'normal',
    },
    {
      label: 'Target Destination',
      value: destinationContext,
      icon: 'flag',
      tone: isBlocked ? 'critical' : 'normal',
    },
    {
      label: 'Attack Vector Classification',
      value: classification,
      icon: 'warning',
      tone: isBlocked ? 'critical' : 'success',
    },
    {
      label: 'Triggered Firewall Rule',
      value: violatedPolicy,
      icon: 'policy',
      tone: isBlocked ? 'critical' : 'success',
    },
    {
      label: 'RBAC Authorization Check',
      value: authorizationRequired,
      icon: 'key',
      tone: isBlocked ? 'critical' : 'success',
    },
  ];

  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222a3d]/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isBlocked
                ? 'bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab]'
                : 'bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isBlocked ? 'report_problem' : 'verified'}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#e0e2ec] font-headline tracking-wide uppercase">
              {isBlocked ? 'WHY WAS THIS BLOCKED? — ROOT CAUSE EXPLAINABILITY' : 'SECURITY PASS AUDIT SPECIFICATION'}
            </h3>
            <p className="text-[11px] text-[#8e9099]">
              {isBlocked
                ? 'Detailed deterministic attribution and policy boundary analysis for intercepted action'
                : 'All behavioral verification policies satisfied without escalation or data leakage'}
            </p>
          </div>
        </div>

        <span
          className={`font-mono text-[10px] px-2.5 py-1 rounded border uppercase ${
            isBlocked
              ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]/30'
              : 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20'
          }`}
        >
          {isBlocked ? 'INTERCEPTION CONFIRMED' : 'NORMAL EXECUTION'}
        </span>
      </div>

      {/* 6 Grid Attribute Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className="bg-[#0b1326] border border-[#222a3d] rounded-lg p-3.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-[#8e9099] uppercase font-label-caps tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">
                  {attr.icon}
                </span>
                {attr.label}
              </span>
            </div>
            <div
              className={`text-xs font-mono font-medium break-all leading-relaxed ${
                attr.tone === 'critical'
                  ? 'text-[#ffb4ab]'
                  : attr.tone === 'success'
                  ? 'text-[#4edea3]'
                  : 'text-[#e0e2ec]'
              }`}
            >
              {attr.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
