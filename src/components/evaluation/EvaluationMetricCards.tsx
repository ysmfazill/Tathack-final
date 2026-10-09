import React from 'react';

export interface MetricResult {
  metric_name: string;
  value?: number;
  unit: string;
  numerator?: number;
  denominator?: number;
  excluded_case_counts: number;
  calculation_definition: string;
  dataset_version: string;
  suite_version: string;
  evaluation_run_id?: string;
}

interface EvaluationMetricCardsProps {
  metrics: MetricResult[];
}

export const EvaluationMetricCards: React.FC<EvaluationMetricCardsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return <div className="text-on-surface-variant p-4">No metrics available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-space-md mb-space-lg">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group border border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
              {metric.metric_name}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono-metric text-headline-lg text-primary font-bold">
              {metric.value !== undefined && metric.value !== null ? metric.value.toFixed(2) : 'N/A'}{metric.unit === '%' ? '%' : metric.unit}
            </span>
            {metric.numerator !== undefined && metric.denominator !== undefined && (
              <span className="font-mono-code text-body-sm text-outline">
                {metric.numerator}/{metric.denominator}
              </span>
            )}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate" title={metric.calculation_definition}>
            {metric.calculation_definition}
          </p>
        </div>
      ))}
    </div>
  );
};
