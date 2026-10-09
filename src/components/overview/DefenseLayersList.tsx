import React from 'react';

interface DefenseLayer {
  name: string;
  description: string;
  icon: string;
  iconColor: 'primary' | 'secondary' | 'outline';
  status: string;
  statusVariant: 'active' | 'degraded' | 'inactive';
}

const DEFENSE_LAYERS: DefenseLayer[] = [
  {
    name: 'Input Scanner',
    description: 'Detect suspicious instructions.',
    icon: 'terminal',
    iconColor: 'primary',
    status: 'Active',
    statusVariant: 'active',
  },
  {
    name: 'Counterfactual Analysis',
    description: 'Identify document-induced action changes.',
    icon: 'alt_route',
    iconColor: 'primary',
    status: 'Active',
    statusVariant: 'active',
  },
  {
    name: 'Honey-Tool Detection',
    description: 'Detect interactions with decoy tools.',
    icon: 'bolt',
    iconColor: 'secondary',
    status: 'Active',
    statusVariant: 'active',
  },
  {
    name: 'Taint-Aware Authorization',
    description: 'Identify sensitive arguments derived from untrusted content.',
    icon: 'link',
    iconColor: 'secondary',
    status: 'Degraded',
    statusVariant: 'degraded',
  },
  {
    name: 'Cross-Agent Data Guard',
    description: 'Validate data transfers between agents against classification & destination policies.',
    icon: 'hub',
    iconColor: 'secondary',
    status: 'Active • Policy v1.4',
    statusVariant: 'active',
  },
  {
    name: 'Policy Engine',
    description: 'Enforce deterministic allow, approval, and block decisions.',
    icon: 'gavel',
    iconColor: 'primary',
    status: 'Active',
    statusVariant: 'active',
  },
  {
    name: 'Output Guard',
    description: 'Detect and redact supported sensitive information.',
    icon: 'visibility_off',
    iconColor: 'outline',
    status: 'Not Configured',
    statusVariant: 'inactive',
  },
];

export const DefenseLayersList: React.FC = () => {
  return (
    <div className="bg-surface-container-low p-5 sm:p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5">
        <h2 className="font-headline-md text-xl text-white font-semibold tracking-tight">
          Defense Layers
        </h2>
        <span className="px-2.5 py-0.5 rounded bg-surface-container font-mono-code text-xs text-tertiary font-medium border border-outline-variant/20">
          6 of 7 Active
        </span>
      </div>
      <span className="font-body-md text-sm text-[#94a3b8] mb-4">
        Multi-stage behavioral inspection &amp; cross-agent pipeline
      </span>

      {/* Layers List */}
      <div className="flex flex-col gap-2.5">
        {DEFENSE_LAYERS.map((layer) => {
          const isSpecial = layer.name === 'Cross-Agent Data Guard';

          return (
            <div
              key={layer.name}
              className={`p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex items-start justify-between gap-3 border ${
                isSpecial ? 'border-secondary/30 shadow-sm' : 'border-outline-variant/20'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 border border-outline-variant/30 ${
                    layer.iconColor === 'secondary'
                      ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                      : layer.iconColor === 'primary'
                      ? 'bg-surface-container-high text-primary'
                      : 'bg-surface-container-high text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {layer.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-sm text-white font-semibold leading-tight truncate">
                    {layer.name}
                  </span>
                  <span className="font-body-sm text-xs text-[#94a3b8] mt-0.5 leading-normal">
                    {layer.description}
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <span
                className={`px-2 py-0.5 rounded-full font-label-caps text-xs font-semibold uppercase tracking-wider shrink-0 select-none ${
                  layer.statusVariant === 'active'
                    ? 'bg-tertiary-container/30 text-tertiary'
                    : layer.statusVariant === 'degraded'
                    ? 'bg-surface-container-high text-secondary border border-secondary/30'
                    : 'bg-surface-container-high text-outline border border-outline-variant/40 text-[10px]'
                }`}
              >
                {layer.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
