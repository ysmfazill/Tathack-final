import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const SimulationSandboxSection: React.FC<{ onResetDemoState?: () => void }> = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between opacity-75">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">science</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-outline">
                Simulation & Sandbox
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Safe execution environments for testing rule modifications.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-caps text-label-caps text-outline px-2.5 py-1 rounded border border-outline-variant/30 font-semibold bg-surface-container">
              UNSUPPORTED BY BACKEND
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> The backend FastAPI application currently executes all API calls directly in the live runtime context. The ephemeral simulation containers are not implemented.
        </div>
        
        <div className="pointer-events-none grayscale opacity-60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
            <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">bug_report</span>
                  <span className="font-body-md text-sm font-semibold text-on-surface">Shadow Mode</span>
                </div>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                Log violations without blocking execution. Useful for tuning heuristic models.
              </p>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">dns</span>
                  <span className="font-body-md text-sm font-semibold text-on-surface">Ephemeral Containers</span>
                </div>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                Execute suspect code inside a gVisor-isolated temporary pod.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between mt-space-md pt-space-sm border-t border-outline-variant/20 pointer-events-none opacity-50">
        <Button variant="ghost" size="sm" className="text-error" disabled>
          Reset Sandbox State
        </Button>
        <Button variant="primary" size="sm" disabled>
          Apply Sandbox Settings
        </Button>
      </div>
    </Card>
  );
};
