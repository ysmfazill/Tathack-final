import React from 'react';

export const DataClassificationTiers: React.FC = () => {
  const tiers = [
    {
      id: 'tier-0',
      label: 'PUBLIC',
      tier: 'TIER-0',
      color: 'bg-tertiary',
      badgeBg: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
      desc: 'Information approved for unrestricted sharing.',
      defaultPolicy: 'Default: Allow to all destinations.',
    },
    {
      id: 'tier-1',
      label: 'INTERNAL',
      tier: 'TIER-1',
      color: 'bg-secondary',
      badgeBg: 'bg-secondary-container/20 text-secondary border-secondary/30',
      desc: 'Information intended for authorized internal operations.',
      defaultPolicy: 'Default: Intra-cluster only. Restricted egress.',
    },
    {
      id: 'tier-2',
      label: 'CONFIDENTIAL',
      tier: 'TIER-2',
      color: 'bg-primary',
      badgeBg: 'bg-primary-container/20 text-primary border-primary/30',
      desc: 'Sensitive business data or PII requiring restricted access.',
      defaultPolicy: 'Default: Block egress; multi-sig required.',
    },
    {
      id: 'tier-3',
      label: 'RESTRICTED',
      tier: 'TIER-3',
      color: 'bg-error',
      badgeBg: 'bg-error-container/30 text-error border-error/40',
      desc: 'Highly sensitive credentials, private keys, and core vault data.',
      defaultPolicy: 'Default: Zero-trust isolation. Auto-blocked.',
    },
  ];

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]">category</span>
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Sensitive Data Classification
          </h2>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Application-level classifications governing inter-agent payload routing and storage taint flags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl shadow-sm relative overflow-hidden group border border-outline-variant/30 hover:border-outline-variant/50 transition-colors"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${tier.color}`}></div>
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded font-label-caps text-label-caps font-semibold tracking-wider border ${tier.badgeBg}`}
                >
                  {tier.label}
                </span>
                <span className="font-mono-code text-[11px] text-outline">{tier.tier}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-1">{tier.desc}</p>
              <div className="p-2 rounded bg-surface-container font-mono-code text-[11px] text-on-surface-variant border border-outline-variant/20">
                {tier.defaultPolicy}
              </div>
            </div>
            <button
              className="mt-space-lg self-start text-primary hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase transition-colors"
              type="button"
            >
              Configure Rules →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
