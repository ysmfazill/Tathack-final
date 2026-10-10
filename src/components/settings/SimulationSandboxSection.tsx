import React from 'react';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';

export const SimulationSandboxSection: React.FC<{ onResetDemoState?: () => void }> = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">science</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Simulation & Sandbox
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Safe execution environments for testing rule modifications.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> Safe simulation is supported in-process via the Attack Playground API (`evaluate_action`), which evaluates operations against the Deterministic Gateway without triggering external side effects. Ephemeral container isolation is not implemented nor required for this architecture.
        </div>
        
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
            <div className="p-space-md rounded-xl bg-surface-container border border-primary/40 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">bug_report</span>
                  <span className="font-body-md text-sm font-semibold text-on-surface">Playground Simulation</span>
                </div>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                Evaluates suspect code through the gateway, logging violations without executing tools.
              </p>
              <div className="mt-2 text-right">
                <Link to="/attack-playground" className="text-primary text-xs font-semibold hover:underline">
                  Go to Playground &rarr;
                </Link>
              </div>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between pointer-events-none grayscale opacity-60">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">dns</span>
                  <span className="font-body-md text-sm font-semibold text-on-surface">Ephemeral Containers</span>
                </div>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                Execute suspect code inside a gVisor-isolated temporary pod. (UNSUPPORTED)
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
