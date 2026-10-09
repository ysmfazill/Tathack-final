import React from 'react';
import { TestScenario } from '../../types';
import { MOCK_TEST_SCENARIOS } from '../../data/mockData';

export type AttackScenario = TestScenario;

interface ScenarioSelectorProps {
  selectedScenarioId: string;
  onSelectScenario: (scenario: TestScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenarioId,
  onSelectScenario,
}) => {
  return (
    <div className="flex flex-col gap-space-xs mb-space-lg">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
          Adversarial Test Scenarios
        </span>
        <span className="font-label-caps text-[11px] text-outline/70 hidden sm:inline">
          Controlled benchmarks • Synthetic payloads
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
        {MOCK_TEST_SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;
          const isDefense = scenario.badgeVariant === 'secondary';
          const isControl = scenario.badgeVariant === 'tertiary';

          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`p-space-md rounded cursor-pointer transition-all flex flex-col justify-between gap-space-sm relative select-none ${
                isSelected
                  ? 'bg-surface-container-high border-2 border-primary ring-1 ring-primary/20 shadow-md'
                  : 'bg-surface-container border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-high'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 right-3">
                  <span className="font-label-caps text-[9px] bg-primary text-on-primary font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                    ACTIVE BENCHMARK
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center border ${
                    isDefense
                      ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                      : isControl
                      ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                      : 'bg-error-container/20 text-error border-error/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isDefense
                      ? 'document_scanner'
                      : isControl
                      ? 'verified_user'
                      : scenario.id === 'cross-agent'
                      ? 'hub'
                      : scenario.id === 'direct'
                      ? 'gpp_maybe'
                      : scenario.id === 'indirect'
                      ? 'warning'
                      : 'shield_lock'}
                  </span>
                </div>

                <span
                  className={`font-label-caps text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                    isDefense
                      ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                      : isControl
                      ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                      : 'bg-error-container/20 text-error border-error/30'
                  }`}
                >
                  {scenario.category}
                </span>
              </div>

              {/* Body */}
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                  {scenario.title}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  {scenario.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-outline text-label-caps pt-1 border-t border-outline-variant/20 text-[10px]">
                <span className="truncate">Vector: {scenario.vector}</span>
                <span
                  className={`font-mono-code shrink-0 ${
                    isDefense
                      ? 'text-secondary'
                      : isControl
                      ? 'text-tertiary'
                      : 'text-error font-semibold'
                  }`}
                >
                  {isControl
                    ? 'Pass 0.05'
                    : isDefense
                    ? 'Behavioral'
                    : `Risk: ${scenario.severity}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
