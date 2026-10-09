import React from 'react';
import { AuditEventItem } from './AuditEventTable';

interface AuditEventDetailDrawerProps {
  event: AuditEventItem;
  onClose: () => void;
}

export const AuditEventDetailDrawer: React.FC<AuditEventDetailDrawerProps> = ({
  event,
  onClose,
}) => {
  if (!event) return null;

  return (
    <div className="flex flex-col gap-space-md bg-surface-container-low border border-outline-variant/40 rounded-xl p-space-md relative shadow-xl">
      {/* Drawer Header */}
      <div className="flex items-start justify-between pb-space-sm border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
              Audit Event Details
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-label-caps uppercase bg-secondary/15 text-secondary border border-secondary/30">
              SIMULATION TRACE
            </span>
          </div>
          <span className="font-mono-code text-[12px] text-primary mt-1">
            Viewing Event: {event.id} ({event.type})
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded hover:bg-surface-container"
          title="Deselect Event"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* SECTION A: Authorization & Execution Trace (3-Stage Flow) */}
      <div className="flex flex-col gap-space-xs p-space-sm rounded-lg bg-surface-container-lowest/60 border border-outline-variant/30">
        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
          <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
            A. Authorization &amp; Execution Pipeline
          </span>
          <span className="font-mono-code text-[11px] text-outline">Stage Flow</span>
        </div>

        {/* Horizontal Process Trace */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
          {/* Step 1: Model Proposal */}
          <div className="flex flex-col p-2.5 rounded bg-surface-container border border-outline-variant/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                1. Proposal
              </span>
              <span className="px-1.5 py-0.2 rounded font-mono-code text-[9px] bg-primary/20 text-primary">
                PROPOSED
              </span>
            </div>
            <span className="font-mono-code text-[11px] text-on-surface font-semibold">
              {event.proposalTool}()
            </span>
            <span className="font-mono-code text-[10px] text-outline truncate mt-1">
              {event.proposalDest}
            </span>
          </div>

          {/* Step 2: Policy Decision */}
          <div
            className={`flex flex-col p-2.5 rounded border ${
              event.decision === 'BLOCKED'
                ? 'bg-error-container/20 border-error/40'
                : 'bg-tertiary-container/20 border-tertiary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`font-label-caps text-[10px] uppercase font-semibold ${
                  event.decision === 'BLOCKED' ? 'text-error' : 'text-tertiary'
                }`}
              >
                2. Firewall
              </span>
              <span
                className={`px-1.5 py-0.2 rounded font-mono-code text-[9px] font-bold ${
                  event.decision === 'BLOCKED'
                    ? 'bg-error/30 text-error'
                    : 'bg-tertiary/30 text-tertiary'
                }`}
              >
                {event.decision}
              </span>
            </div>
            <span className="font-body-sm text-[11px] text-on-surface font-semibold">
              {event.ruleName}
            </span>
            <span
              className={`font-mono-code text-[10px] mt-1 ${
                event.decision === 'BLOCKED' ? 'text-error/90' : 'text-tertiary/90'
              }`}
            >
              {event.ruleCode}
            </span>
          </div>

          {/* Step 3: Execution Result */}
          <div className="flex flex-col p-2.5 rounded bg-surface-container border border-outline-variant/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                3. Runtime
              </span>
              <span
                className={`px-1.5 py-0.2 rounded font-mono-code text-[9px] ${
                  event.execution === 'NOT EXECUTED'
                    ? 'bg-surface-container-high text-error'
                    : 'bg-tertiary/20 text-tertiary'
                }`}
              >
                {event.execution === 'NOT EXECUTED' ? 'HALT' : 'OK'}
              </span>
            </div>
            <span
              className={`font-body-sm text-[11px] font-semibold ${
                event.execution === 'NOT EXECUTED' ? 'text-error' : 'text-tertiary'
              }`}
            >
              {event.execution}
            </span>
            <span className="font-mono-code text-[10px] text-outline mt-1 truncate">
              {event.execution === 'NOT EXECUTED'
                ? '0 bytes sent • Socket drop'
                : '1.2ms socket execution'}
            </span>
          </div>
        </div>

        {/* Deterministic Guarantee Callout */}
        <div className="p-2 rounded bg-tertiary-container/10 border border-tertiary/20 flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5 shrink-0">
            verified
          </span>
          <p className="font-body-sm text-[11px] text-tertiary leading-snug">
            <strong>Deterministic Guarantee:</strong> Action was verified against behavioral policy prior to socket dispatch. Zero untrusted leakage occurred.
          </p>
        </div>
      </div>

      {/* SECTION B: Identification Metadata */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
          B. Identification
        </span>
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-surface-container border border-outline-variant/20 font-mono-code text-[11px]">
          <div>
            <span className="text-outline block text-[10px]">EVENT ID</span>
            <span className="text-on-surface font-semibold">{event.id}</span>
          </div>
          <div>
            <span className="text-outline block text-[10px]">REQUEST ID</span>
            <span className="text-on-surface">{event.requestId}</span>
          </div>
          <div>
            <span className="text-outline block text-[10px]">TIMESTAMP</span>
            <span className="text-on-surface">{event.fullTimestamp}</span>
          </div>
          <div>
            <span className="text-outline block text-[10px]">ENVIRONMENT</span>
            <span className="text-secondary">Local Sim (Port 8080)</span>
          </div>
        </div>
      </div>

      {/* SECTION C: Security Context & Cross-Agent Topology */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
          C. Security Context &amp; Topology
        </span>
        <div className="p-2.5 rounded bg-surface-container border border-outline-variant/20 flex flex-col gap-2 font-body-sm text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-outline font-mono-code text-[11px]">Source Agent:</span>
            <span className="text-on-surface font-mono-code text-[11px]">
              {event.sourceAgent} <span className="text-outline">({event.sourceAgentId})</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-outline font-mono-code text-[11px]">Target Agent:</span>
            <span className="text-on-surface font-mono-code text-[11px]">
              {event.targetAgent} <span className="text-outline">({event.targetAgentId})</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-outline font-mono-code text-[11px]">Data Classification:</span>
            <span className="px-1.5 py-0.5 rounded bg-error/20 text-error font-mono-code text-[10px] uppercase font-bold border border-error/30">
              {event.classification}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-outline font-mono-code text-[11px]">Taint Tracking:</span>
            <span className="text-secondary font-mono-code text-[11px]">{event.taintTracking}</span>
          </div>
          <div className="pt-1.5 border-t border-outline-variant/20">
            <span className="text-outline block text-[10px] font-mono-code uppercase mb-1">
              User Prompt Context
            </span>
            <p className="text-on-surface-variant italic font-body-sm text-[11px] bg-surface-container-lowest p-2 rounded border border-outline-variant/10">
              "{event.promptContext}"
            </p>
          </div>
        </div>
      </div>

      {/* SECTION D: Decision & Policy Rules */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
          D. Decision &amp; Policy Rules
        </span>
        <div className="p-2.5 rounded bg-surface-container border border-outline-variant/20 flex flex-col gap-2 font-body-sm text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-outline font-mono-code text-[11px]">Matched Rule:</span>
            <span className="text-error font-mono-code text-[11px] font-semibold">
              {event.ruleCode}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-outline font-mono-code text-[11px]">Reason Code:</span>
            <span className="font-mono-code text-[11px] text-on-surface">{event.reasonCode}</span>
          </div>
          <div className="pt-1 border-t border-outline-variant/20">
            <span className="text-outline block text-[10px] font-mono-code uppercase mb-1">
              Firewall Explanation
            </span>
            <p className="text-on-surface font-body-sm text-[11px] leading-relaxed">
              {event.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION E: Execution & Audit Integrity */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
          E. Integrity &amp; Cryptographic Proof
        </span>
        <div className="grid grid-cols-1 gap-1.5 p-2.5 rounded bg-surface-container border border-outline-variant/20 font-mono-code text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-outline text-[10px]">MODEL PROVIDER</span>
            <span className="text-secondary font-semibold">{event.modelProvider}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-outline text-[10px]">POLICY VERSION</span>
            <span className="text-on-surface">{event.policyVersion}</span>
          </div>
          <div className="pt-1 border-t border-outline-variant/20 flex flex-col gap-1">
            <span className="text-outline text-[10px]">TAMPER-EVIDENT HASH</span>
            <span className="text-tertiary font-mono-code text-[10px] truncate bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/20">
              {event.shaHash}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
