import React from 'react';
import { Card } from '../common/Card';

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

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between opacity-75">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[22px]">security</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-outline">
                Detection Components
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Modular behavioral inspection layers running in local pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-caps text-label-caps text-outline px-2.5 py-1 rounded border border-outline-variant/30 font-semibold bg-surface-container">
              UNSUPPORTED BY BACKEND
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> The backend FastAPI execution gateway currently utilizes explicit deterministic rules. Modular detection components (heuristics, regex scanning, twin-execution) are not connected to the live request path.
        </div>

        {/* Component Table/Rows */}
        <div className="flex flex-col gap-2 pointer-events-none grayscale opacity-60">
          {DETECTION_COMPONENTS.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container gap-space-sm transition-colors border border-outline-variant/20"
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
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-surface-container-high text-outline font-bold">
                      Not Configured
                    </span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                    {comp.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-space-md shrink-0">
                <div className="flex items-center gap-3 font-mono-code text-[11px] text-outline">
                  <span>-</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
