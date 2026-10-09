import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface DetectionComponentItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'Active' | 'Standby';
  health: string;
  latency: string;
  lastRun: string;
  inspectionDetails: string;
}

const DETECTION_COMPONENTS: DetectionComponentItem[] = [
  {
    id: 'comp-1',
    name: 'Input Scanner',
    description: 'Pattern matching & prompt injection heuristics',
    icon: 'manage_search',
    status: 'Active',
    health: '100%',
    latency: '4.1ms',
    lastRun: '1m ago',
    inspectionDetails: 'Lexical regex filters and fast ASCII/Unicode homoglyph normalizers. Intercepts direct prompt injection attempts before tokenization.'
  },
  {
    id: 'comp-2',
    name: 'Counterfactual Analysis',
    description: 'Twin-execution action divergence model',
    icon: 'compare_arrows',
    status: 'Active',
    health: '100%',
    latency: '22.0ms',
    lastRun: '1m ago',
    inspectionDetails: 'Evaluates parallel hypothetical branches of proposed tool commands to determine if outcome diverges from legitimate intent.'
  },
  {
    id: 'comp-3',
    name: 'Taint-Aware Authorization',
    description: 'Data provenance tracking & argument taint flags',
    icon: 'lock_person',
    status: 'Active',
    health: '100%',
    latency: '3.4ms',
    lastRun: '1m ago',
    inspectionDetails: 'Maintains bitwise provenance tags across input contexts. If an argument originated from untrusted external content, high-privilege tool execution is denied.'
  },
  {
    id: 'comp-4',
    name: 'Honey-Tool Detection',
    description: 'Canary function decoys & tripwire traps',
    icon: 'pest_control',
    status: 'Active',
    health: '100%',
    latency: '0.8ms',
    lastRun: '1m ago',
    inspectionDetails: 'Exposes fictitious tools (e.g. exec_shell_raw, export_root_creds) to the agent context. Any invocation immediately raises a Critical Tripwire alert.'
  },
  {
    id: 'comp-5',
    name: 'Cross-Agent Data Guard',
    description: 'Inter-agent communication bus boundary',
    icon: 'hub',
    status: 'Active',
    health: '100%',
    latency: '5.2ms',
    lastRun: '1m ago',
    inspectionDetails: 'Inspects structured message envelopes exchanged across autonomous agent swarms, preventing indirect prompt injection and cascading privilege escalation.'
  },
  {
    id: 'comp-6',
    name: 'Output Guard',
    description: 'PII & Secret regex masking engine',
    icon: 'vpn_key',
    status: 'Active',
    health: '100%',
    latency: '1.9ms',
    lastRun: '1m ago',
    inspectionDetails: 'Performs streaming regex and entropy checks across model responses, masking API keys, JWT tokens, credit cards, and SSNs before egress.'
  }
];

export const DetectionComponentsSection: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<DetectionComponentItem | null>(null);

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[22px]">security</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Detection Components
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Modular behavioral inspection layers running in local pipeline.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-container/20 text-tertiary font-mono-code text-[11px] border border-tertiary/30 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span>6 / 6 OPERATIONAL</span>
          </div>
        </div>

        {/* Component Table/Rows */}
        <div className="flex flex-col gap-2">
          {DETECTION_COMPONENTS.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container gap-space-sm hover:bg-surface-container-high transition-colors border border-outline-variant/20"
            >
              <div className="flex items-center gap-space-md min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[18px]">{comp.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-body-md text-xs sm:text-sm text-on-surface font-semibold truncate">
                      {comp.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-tertiary-container/30 text-tertiary font-bold">
                      {comp.status}
                    </span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                    {comp.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-space-md shrink-0">
                <div className="flex items-center gap-3 font-mono-code text-[11px] text-outline">
                  <span className="text-tertiary font-bold">{comp.health}</span>
                  <span>{comp.latency}</span>
                  <span className="hidden md:inline">{comp.lastRun}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedComp(comp)}
                >
                  Inspect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Notice */}
      <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-lowest/80 flex items-center gap-2 text-outline font-mono-code text-[11px] border border-outline-variant/20">
        <span className="material-symbols-outlined text-secondary text-[16px]">info</span>
        <span>Mandatory policy checks fail-closed even if optional detectors are bypassed.</span>
      </div>

      {/* Modal Inspector */}
      {selectedComp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedComp(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/40 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">{selectedComp.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                    {selectedComp.name}
                  </h3>
                  <span className="font-mono-code text-[10px] text-tertiary">
                    STATUS: {selectedComp.status} • {selectedComp.health}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedComp(null)}
                className="w-7 h-7 rounded hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="font-mono-code text-[10px] uppercase text-on-surface-variant block mb-1">
                  Component Logic & Purpose
                </span>
                <p className="text-on-surface leading-relaxed text-[11px]">
                  {selectedComp.inspectionDetails}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono-code">
                <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant block">Avg Latency</span>
                  <span className="text-xs font-bold text-primary">{selectedComp.latency}</span>
                </div>
                <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant block">Last Execution</span>
                  <span className="text-xs font-bold text-on-surface">{selectedComp.lastRun}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedComp(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
