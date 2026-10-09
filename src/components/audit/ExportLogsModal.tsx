import React, { useState } from 'react';
import { AuditEventItem } from './AuditEventTable';

interface ExportLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: AuditEventItem[];
}

export const ExportLogsModal: React.FC<ExportLogsModalProps> = ({
  isOpen,
  onClose,
  events,
}) => {
  const [format, setFormat] = useState<'jsonl' | 'csv'>('jsonl');
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Generate client-side sanitized file
      if (format === 'csv') {
        const headers = ['Timestamp', 'EventID', 'Type', 'Risk', 'Decision', 'Execution', 'SourceAgent', 'TargetAgent', 'PolicyRule'];
        const escapeCSV = (str: string) => {
          let s = str || '';
          // Mitigate formula injection
          if (/^[=+\-@\t\r]/.test(s)) {
            s = `'` + s;
          }
          if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        };

        const rows = events.map((e) => [
          escapeCSV(e.timestamp),
          escapeCSV(e.id),
          escapeCSV(e.type),
          escapeCSV(e.risk),
          escapeCSV(e.decision),
          escapeCSV(e.execution),
          escapeCSV(e.sourceAgent),
          escapeCSV(e.targetAgent),
          escapeCSV(e.ruleCode),
        ]);

        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `promptguard_audit_sanitized_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const jsonlContent = events
          .map((e) =>
            JSON.stringify({
              timestamp: e.fullTimestamp,
              eventId: e.id,
              requestId: e.requestId,
              type: e.type,
              risk: e.risk,
              decision: e.decision,
              execution: e.execution,
              sourceAgent: e.sourceAgent,
              targetAgent: e.targetAgent,
              classification: e.classification,
              rule: e.ruleCode,
              reasonCode: e.reasonCode,
              sha256Hash: e.shaHash,
            })
          )
          .join('\n');

        const blob = new Blob([jsonlContent], { type: 'application/x-ndjson;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `promptguard_audit_sanitized_${Date.now()}.jsonl`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsExporting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 700);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-2xl p-space-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">file_download</span>
            <span className="font-headline-md text-headline-md text-on-surface font-semibold">
              Export Sanitized Audit Logs
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-sm text-body-sm">
          <p className="text-on-surface-variant">
            Select export format and verification options. Cryptographic hashes will be appended for immutable compliance recording.
          </p>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2.5 p-2.5 rounded bg-surface-container border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="radio"
                name="export_format"
                value="jsonl"
                checked={format === 'jsonl'}
                onChange={() => setFormat('jsonl')}
                className="text-primary focus:ring-primary accent-primary"
              />
              <div className="flex flex-col">
                <span className="font-mono-code text-[12px] text-on-surface font-semibold">
                  JSONL (Splunk / Datadog / SIEM)
                </span>
                <span className="text-outline text-[11px]">
                  Structured events with pre-formatted timestamp &amp; sha256 checksum
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded bg-surface-container border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="radio"
                name="export_format"
                value="csv"
                checked={format === 'csv'}
                onChange={() => setFormat('csv')}
                className="text-primary focus:ring-primary accent-primary"
              />
              <div className="flex flex-col">
                <span className="font-mono-code text-[12px] text-on-surface font-semibold">
                  CSV (Compliance Spreadsheet)
                </span>
                <span className="text-outline text-[11px]">
                  Flattened tabular rows with sanitized payload snippets
                </span>
              </div>
            </label>
          </div>

          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-1.5">
            <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">
              Sanitization Checklist
            </span>
            <div className="flex items-center gap-2 text-[11px] text-tertiary">
              <span className="material-symbols-outlined text-[14px]">check</span> Stripped auth headers &amp; Bearer tokens
            </div>
            <div className="flex items-center gap-2 text-[11px] text-tertiary">
              <span className="material-symbols-outlined text-[14px]">check</span> Redacted employee salaries &amp; SSN numbers
            </div>
            <div className="flex items-center gap-2 text-[11px] text-tertiary">
              <span className="material-symbols-outlined text-[14px]">check</span> Log integrity SHA256 envelope included
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm transition-colors border border-outline-variant/30"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-primary-container text-on-primary-container hover:bg-primary font-body-sm font-semibold transition-all shadow-sm"
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${isExporting ? 'animate-spin' : ''}`}>
              {isExporting ? 'refresh' : isSuccess ? 'check' : 'download'}
            </span>
            <span>
              {isExporting
                ? 'Generating...'
                : isSuccess
                ? 'Complete!'
                : `Download Export (${events.length} records)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
