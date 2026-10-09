import React from 'react';

interface DefenseLayerItem {
  id: string;
  letter: string;
  name: string;
  pattern: string;
  metricLabel: string;
  metricValue: string;
  metricColor: 'error' | 'secondary' | 'tertiary';
  latency: string;
  status: 'TRIGGERED' | 'NOT TRIGGERED' | 'ENFORCED' | 'ACTIVE / READY';
  statusVariant: 'error' | 'tertiary' | 'secondary';
}

export const SevenDefenseLayers: React.FC = () => {
  const layers: DefenseLayerItem[] = [
    {
      id: 'layer-a',
      letter: 'A',
      name: 'Input Scanner',
      pattern: 'Pattern: Indirect injection override in email body',
      metricLabel: 'Score',
      metricValue: '0.94 / 1.00',
      metricColor: 'error',
      latency: '4.1ms',
      status: 'TRIGGERED',
      statusVariant: 'error',
    },
    {
      id: 'layer-b',
      letter: 'B',
      name: 'Counterfactual Action Analysis',
      pattern: 'Action drift: Yes (+87% divergence from baseline plan)',
      metricLabel: 'Deviation',
      metricValue: '+87% Divergence',
      metricColor: 'secondary',
      latency: '22.0ms',
      status: 'TRIGGERED',
      statusVariant: 'error',
    },
    {
      id: 'layer-c',
      letter: 'C',
      name: 'Honey-Tool Detection',
      pattern: 'Decoys touched: 0/4 Decoys (canary shell uncontacted)',
      metricLabel: 'Probes',
      metricValue: '0 Decoys',
      metricColor: 'tertiary',
      latency: '0.8ms',
      status: 'NOT TRIGGERED',
      statusVariant: 'tertiary',
    },
    {
      id: 'layer-d',
      letter: 'D',
      name: 'Taint-Aware Authorization',
      pattern: 'Affected: employee_id, ssn, comp_band, salary (Egress denied)',
      metricLabel: 'Tainted Fields',
      metricValue: '4 Fields',
      metricColor: 'error',
      latency: '3.4ms',
      status: 'TRIGGERED',
      statusVariant: 'error',
    },
    {
      id: 'layer-e',
      letter: 'E',
      name: 'Policy Engine',
      pattern: 'Policy: POL-704 (Strict Whitelist) · Rule: Restricted inter-tenant export',
      metricLabel: 'Decision',
      metricValue: 'BLOCKED',
      metricColor: 'error',
      latency: '8.4ms',
      status: 'ENFORCED',
      statusVariant: 'error',
    },
    {
      id: 'layer-f',
      letter: 'F',
      name: 'Cross-Agent Data Guard',
      pattern: 'Report Agent -> Export Agent · Classification: Confidential',
      metricLabel: 'Boundary',
      metricValue: 'DROPPED',
      metricColor: 'error',
      latency: '5.2ms',
      status: 'TRIGGERED',
      statusVariant: 'error',
    },
    {
      id: 'layer-g',
      letter: 'G',
      name: 'Output Guard',
      pattern: 'Sanitized alert returned to user · Redactions: 4 Secrets staged',
      metricLabel: 'Sanitization',
      metricValue: 'Ready',
      metricColor: 'secondary',
      latency: '1.9ms',
      status: 'ACTIVE / READY',
      statusVariant: 'secondary',
    },
  ];

  return (
    <section className="bg-surface-container-low p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            Detection &amp; Defense Signals (7 Behavioral Layers)
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Multi-stage pipeline inspection scores across real-time guard components.
          </span>
        </div>
        <span className="px-2.5 py-0.5 bg-surface-container rounded-full text-secondary font-mono-code text-[11px] border border-outline-variant/30">
          Full Pipeline Telemetry
        </span>
      </div>

      {/* 7 Behavioral Layers List */}
      <div className="flex flex-col gap-space-xs">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="flex flex-wrap items-center justify-between gap-space-sm p-space-md bg-surface-container rounded-lg border border-outline-variant/20 hover:border-outline-variant/40 transition-colors"
          >
            <div className="flex items-center gap-space-md min-w-[240px]">
              <span className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center font-mono-code text-mono-code text-outline font-bold border border-outline-variant/30">
                {layer.letter}
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md text-on-surface font-semibold">
                  {layer.name}
                </span>
                <span className="font-mono-code text-[11px] text-outline">
                  {layer.pattern}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-lg flex-wrap">
              <div className="flex flex-col items-end">
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  {layer.metricLabel}
                </span>
                <span
                  className={`font-mono-code text-mono-code font-bold ${
                    layer.metricColor === 'error'
                      ? 'text-error'
                      : layer.metricColor === 'secondary'
                      ? 'text-secondary'
                      : 'text-tertiary'
                  }`}
                >
                  {layer.metricValue}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-label-caps text-label-caps text-outline uppercase">Latency</span>
                <span className="font-mono-code text-mono-code text-on-surface">{layer.latency}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded font-label-caps text-label-caps font-bold uppercase tracking-wider ${
                  layer.status === 'ENFORCED'
                    ? 'bg-error text-on-error'
                    : layer.statusVariant === 'error'
                    ? 'bg-error/20 text-error border border-error/30'
                    : layer.statusVariant === 'secondary'
                    ? 'bg-secondary-container/20 text-secondary border border-secondary/30'
                    : 'bg-surface-container-high text-tertiary border border-tertiary/30'
                }`}
              >
                {layer.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
