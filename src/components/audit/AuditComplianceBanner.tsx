import React from 'react';

export const AuditComplianceBanner: React.FC = () => {
  return (
    <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-space-md shadow-sm flex-wrap">
      <div className="flex items-center gap-space-sm">
        <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0 border border-outline-variant/20">
          <span className="material-symbols-outlined text-[16px]">privacy_tip</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <strong className="text-on-surface">Privacy &amp; Data Protection:</strong> All exported and rendered audit logs automatically mask API keys, session tokens, and employee PII under IEEE/NIST AI Safety standards.
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span className="px-2 py-0.5 rounded font-mono-code text-[10px] bg-tertiary-container/20 text-tertiary border border-tertiary/30">
          NIST SP 800-218 COMPLIANT
        </span>
      </div>
    </div>
  );
};
