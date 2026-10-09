import React from 'react';

export const SettingsComplianceFooter: React.FC = () => {
  return (
    <footer className="mt-space-lg pt-space-md bg-surface-container-lowest/50 p-space-md rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-md text-outline font-mono-code text-[11px]">
      <div className="flex items-center gap-space-md flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          <span className="text-on-surface-variant font-medium">NIST AI RMF 1.0 Aligned</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="text-on-surface-variant font-medium">IEEE P2801 Compliant</span>
        </div>
        <span>•</span>
        <span className="text-on-surface-variant">Local-First Zero-Trust Architecture</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-outline">
          PROMPTGUARD RUNTIME KERNEL
        </span>
        <span className="text-secondary font-semibold">v0.1.0-rc2</span>
      </div>
    </footer>
  );
};
