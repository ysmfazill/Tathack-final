import React from 'react';
import { Link } from 'react-router-dom';

interface ForensicMetadataFooterProps {
  requestId: string;
  scenarioId: string;
  timestamp: string;
  modelName: string;
  policyConfig: string;
  executionMode: string;
  reasonCode: string;
  toolResult: string;
  onExportJson?: () => void;
}

export const ForensicMetadataFooter: React.FC<ForensicMetadataFooterProps> = ({
  requestId,
  scenarioId,
  timestamp,
  modelName,
  policyConfig,
  executionMode,
  reasonCode,
  toolResult,
  onExportJson,
}) => {
  return (
    <section className="bg-surface-container-low p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">fingerprint</span>
          <span className="font-headline-md text-headline-md text-on-surface font-semibold">
            Forensic Metadata &amp; Compliance Audit Record
          </span>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={onExportJson}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-bright text-on-surface rounded text-body-sm font-body-sm font-medium transition-colors shadow-sm flex items-center gap-1.5 border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Sanitized Event (JSON)</span>
          </button>
          <Link
            to="/audit-logs"
            className="px-3 py-1.5 bg-primary-container hover:bg-primary text-on-primary-container rounded text-body-sm font-body-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>View Full Audit Event</span>
          </Link>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm bg-surface-container p-space-md rounded-lg border border-outline-variant/20">
        <div className="flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Request ID
          </span>
          <span className="font-mono-code text-mono-code text-secondary font-bold truncate">
            {requestId}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Scenario ID
          </span>
          <span className="font-mono-code text-mono-code text-on-surface truncate">
            {scenarioId}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Timestamp (UTC)
          </span>
          <span className="font-mono-code text-mono-code text-on-surface truncate">
            {timestamp}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Model Provider &amp; Checkpoint
          </span>
          <span className="font-mono-code text-mono-code text-on-surface truncate">
            {modelName}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 mt-2">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Policy Engine Config
          </span>
          <span className="font-mono-code text-mono-code text-on-surface truncate">
            {policyConfig}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 mt-2">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Execution Mode
          </span>
          <span className="font-mono-code text-mono-code text-tertiary truncate">
            {executionMode}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 mt-2">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Decision Reason Code
          </span>
          <span className="font-mono-code text-mono-code text-error font-medium truncate">
            {reasonCode}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 mt-2">
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            Tool Execution Result
          </span>
          <span className="font-mono-code text-mono-code text-error font-medium truncate">
            {toolResult}
          </span>
        </div>
      </div>
    </section>
  );
};
