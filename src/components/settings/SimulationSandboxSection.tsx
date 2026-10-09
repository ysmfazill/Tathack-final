import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface SimulationSandboxSectionProps {
  onResetDemoState: () => void;
}

export const SimulationSandboxSection: React.FC<SimulationSandboxSectionProps> = ({
  onResetDemoState,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">science</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Simulation &amp; Safety Isolation
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Safe deterministic execution boundary for attack evaluations.
            </p>
          </div>
          <span className="font-label-caps text-label-caps text-secondary px-2.5 py-1 rounded bg-secondary-container/20 border border-secondary/30 font-semibold">
            AIR-GAPPED
          </span>
        </div>

        {/* Sandbox Status Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md">
          <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code">
                Execution Mode
              </span>
              <span className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
                SIMULATED TOOLS
              </span>
            </div>
            <span className="font-mono-code text-[10px] text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20 border border-tertiary/30 font-bold">
              Zero Sockets
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code">
                Agent Sandboxing
              </span>
              <span className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
                ACTIVE
              </span>
            </div>
            <span className="font-mono-code text-[10px] text-secondary px-1.5 py-0.5 rounded bg-secondary-container/20 border border-secondary/30 font-bold">
              Mock HR &amp; Report
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code">
                Synthetic Dataset
              </span>
              <span className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
                SYNTH-EVAL-v2.1
              </span>
            </div>
            <span className="font-mono-code text-[10px] text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20 border border-tertiary/30 font-bold">
              LOADED
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code">
                Network Egress Guard
              </span>
              <span className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
                BLOCKED
              </span>
            </div>
            <span className="font-mono-code text-[10px] text-primary px-1.5 py-0.5 rounded bg-primary-container/20 border border-primary/30 font-bold">
              127.0.0.1 Only
            </span>
          </div>
        </div>

        {/* DANGER ZONE CARD */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest/90 mb-space-sm flex flex-col gap-space-sm border border-error/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">warning</span>
              <span className="font-headline-md text-sm sm:text-base font-bold text-error">
                Danger Zone: Reset Demo State
              </span>
            </div>
            <span className="font-label-caps text-[10px] text-outline font-mono-code">
              NON-DESTRUCTIVE TO RULES
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Resets the synthetic event log, evaluation cache, and test payloads back to the clean baseline seed. Active policy rules and custom thresholds remain intact.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2">
            <span className="font-mono-code text-[11px] text-outline">
              Requires SecOps approval confirmation
            </span>
            <Button
              variant="danger"
              size="sm"
              icon="restart_alt"
              onClick={() => setShowConfirmModal(true)}
            >
              Reset Demo Data
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container rounded-2xl border border-error/40 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-error-container/30 border border-error/40 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[24px]">restart_alt</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Reset Demo Simulation State?
                </h3>
                <span className="text-xs text-on-surface-variant">
                  SecOps Verification Required
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              This action will clear all live and simulated incident history, restoring the clean factory demonstration state. Custom policy rules in the Policy Center will be preserved.
            </p>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon="restart_alt"
                onClick={() => {
                  setShowConfirmModal(false);
                  onResetDemoState();
                }}
              >
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
