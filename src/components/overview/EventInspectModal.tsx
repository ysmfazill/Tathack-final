import React from 'react';
import { SecurityEvent } from '../../types';
import { DecisionIndicator } from '../common/DecisionIndicator';
import { SeverityBadge } from '../common/SeverityBadge';
import { CodeBlock } from '../common/CodeBlock';
import { ForensicDiffViewer } from '../common/ForensicDiffViewer';

interface EventInspectModalProps {
  event: SecurityEvent | null;
  onClose: () => void;
}

export const EventInspectModal: React.FC<EventInspectModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-surface-container-low rounded-2xl border border-outline-variant/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error-container/20 border border-error/30 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]">gpp_bad</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-lg text-white font-semibold">
                  {event.vector}
                </h3>
                <SeverityBadge level={event.severity} size="sm" />
              </div>
              <span className="font-mono-code text-xs text-[#94a3b8]">
                Event ID: <span className="text-secondary">{event.id}</span> • Timestamp: {event.timestamp}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-white hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Status & Attribution Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-xs text-outline uppercase">Firewall Action</span>
              <div className="mt-1">
                <DecisionIndicator decision={event.decision} size="sm" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-xs text-outline uppercase">Source Agent</span>
              <span className="font-mono-code text-sm text-white font-semibold mt-1">
                {event.agentName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-xs text-outline uppercase">Policy Triggered</span>
              <span className="font-mono-code text-xs text-error font-medium mt-1 truncate">
                {event.policyTriggered || 'NONE'}
              </span>
            </div>
          </div>

          {/* Forensic Prompt vs Injected Diff */}
          <div>
            <h4 className="font-label-caps text-xs text-outline uppercase tracking-wider mb-2">
              Forensic Prompt & Taint Payload
            </h4>
            <ForensicDiffViewer
              originalPrompt={event.details.userPrompt}
              injectedPayload={event.details.injectedContent || 'No adversarial injection detected.'}
              taintedParameters={event.details.taintedParameters}
              decision={event.decision}
            />
          </div>

          {/* Raw Telemetry JSON & Hash */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-label-caps text-xs text-outline uppercase tracking-wider">
                Event Cryptographic Digest & Raw Telemetry
              </h4>
              <span className="font-mono-code text-[11px] text-tertiary">SHA-256 Verified</span>
            </div>
            <CodeBlock
              language="json"
              code={JSON.stringify(
                {
                  id: event.id,
                  timestamp: event.timestamp,
                  agentId: event.agentId,
                  decision: event.decision,
                  riskScore: event.riskScore,
                  targetTool: event.targetTool,
                  latencyMs: event.details.latencyMs,
                  sha256Hash: event.details.sha256Hash,
                  telemetry: event.details.rawTelemetry,
                },
                null,
                2
              )}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-surface-container/80 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-mono-code text-xs text-[#94a3b8]">
            Telemetry source: Local simulation sandbox
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-body-md text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
