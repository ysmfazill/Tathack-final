import React from 'react';
import { Link } from 'react-router-dom';

interface RuleInspectorAndAuditProps {
  onSaveDraft?: () => void;
  onActivatePolicy?: () => void;
}

export const RuleInspectorAndAudit: React.FC<RuleInspectorAndAuditProps> = ({
  onSaveDraft,
  onActivatePolicy,
}) => {
  const auditEntries = [
    {
      version: 'v1.4.2',
      status: 'ACTIVE',
      statusVariant: 'tertiary',
      title: 'Added RULE-004 Restricted Record Quarantine',
      author: 'alex.chen@promptguard.ai',
      time: 'Today, 14:18 UTC',
    },
    {
      version: 'v1.4.1',
      status: 'SUPERSEDED',
      statusVariant: 'neutral',
      title: 'Updated POL-704 multi-sig requirement for export_records',
      author: 'sarah.m@promptguard.ai',
      time: 'Yesterday, 09:42 UTC',
    },
    {
      version: 'v1.4.0',
      status: 'SUPERSEDED',
      statusVariant: 'neutral',
      title: 'Initialized Cross-Agent Data Guard behavioral boundary',
      author: 'secops-ci-bot',
      time: '3 days ago',
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
      {/* Section E: Embedded Rule Editor Drawer Preview (7 cols) */}
      <div className="xl:col-span-7 flex flex-col bg-surface-container-low rounded-xl shadow-md p-space-lg gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">edit_document</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Policy Rule Inspector
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono-code text-[11px] font-semibold border border-primary/30">
            RULE-005 (DRAFT)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase font-medium">
              Source Agent
            </span>
            <div className="p-2 rounded bg-surface-container text-on-surface font-mono-code text-body-sm border border-outline-variant/20">
              Report Agent
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase font-medium">
              Destination Agent
            </span>
            <div className="p-2 rounded bg-surface-container text-on-surface font-mono-code text-body-sm border border-outline-variant/20">
              Audit Collector
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase font-medium">
              Data Classification
            </span>
            <div className="p-2 rounded bg-surface-container text-secondary font-mono-code text-body-sm border border-outline-variant/20">
              Confidential
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase font-medium">
              Destination Target
            </span>
            <div className="p-2 rounded bg-surface-container text-on-surface font-mono-code text-body-sm border border-outline-variant/20">
              Internal Splunk / SIEM
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase font-medium">
              Intervention Mode
            </span>
            <div className="p-2 rounded bg-surface-container text-tertiary font-mono-code text-body-sm border border-outline-variant/20">
              Require Multi-Sig Approval
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase font-medium">
              Designated Reviewer &amp; Priority
            </span>
            <div className="p-2 rounded bg-surface-container text-on-surface font-mono-code text-body-sm border border-outline-variant/20">
              SecOps Lead • Priority 10
            </div>
          </div>
        </div>

        <div className="mt-space-sm pt-space-md flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest/50 p-space-md rounded-lg border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-tertiary font-mono-code text-[12px]">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Syntax Validation: PASSED (AST valid)</span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={onSaveDraft}
              className="px-space-md py-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface text-body-sm font-body-sm rounded transition-colors border border-outline-variant/30"
              type="button"
            >
              Save Draft
            </button>
            <button
              onClick={onActivatePolicy}
              className="px-space-md py-1.5 bg-primary-container hover:bg-inverse-primary text-on-primary text-body-sm font-body-sm font-semibold rounded transition-colors shadow-sm"
              type="button"
            >
              Activate Policy (Multi-Sig)
            </button>
          </div>
        </div>
      </div>

      {/* Section F: Recent Policy Audit & Change History (5 cols) */}
      <div className="xl:col-span-5 flex flex-col bg-surface-container-low rounded-xl shadow-md p-space-lg gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline text-[20px]">manage_history</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Recent Policy Audit
            </h3>
          </div>
          <span className="font-mono-code text-[11px] text-tertiary">Tamper-Proof Log</span>
        </div>

        <div className="flex flex-col divide-y divide-surface-container">
          {auditEntries.map((entry, idx) => (
            <div key={idx} className="py-space-sm flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono-code text-[12px] font-semibold ${
                    entry.status === 'ACTIVE' ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {entry.version}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-label-caps text-[10px] font-semibold border ${
                    entry.status === 'ACTIVE'
                      ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                      : 'bg-surface-container-highest text-outline border-outline-variant/20'
                  }`}
                >
                  {entry.status}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">{entry.title}</p>
              <div className="flex items-center justify-between font-mono-code text-[11px] text-outline">
                <span>{entry.author}</span>
                <span>{entry.time}</span>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/audit-logs"
          className="mt-auto pt-space-xs text-primary hover:text-on-surface font-body-sm text-body-sm text-left transition-colors flex items-center gap-1"
        >
          <span>View Full Tamper-Evident History</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};
