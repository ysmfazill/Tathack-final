import React from 'react';
import { Link } from 'react-router-dom';

export const SystemInfoPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-low p-5 sm:p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <h2 className="font-headline-md text-xl text-white font-semibold tracking-tight">
          System Information
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="font-mono-code text-xs text-tertiary font-medium">
            Sandbox Ready
          </span>
        </div>
      </div>

      {/* Info Rows */}
      <div className="flex flex-col divide-y divide-outline-variant/20 text-sm">
        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Execution Mode</span>
          <span className="font-mono-code text-[13px] text-white font-medium">
            Simulated Tools (Sandbox)
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Model Provider</span>
          <div className="flex items-center gap-2">
            <span className="font-mono-code text-[13px] text-secondary font-medium">
              Ollama (Local)
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
          </div>
        </div>

        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Policy Version</span>
          <span className="px-2.5 py-0.5 rounded bg-surface-container font-mono-code text-xs text-primary font-medium border border-outline-variant/30">
            v1.4.2 (Strict)
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Last Evaluation</span>
          <div className="flex items-center gap-2">
            <span className="text-[#94a3b8] font-body-sm">Not run (Baseline pending)</span>
            <Link
              to="/evaluation-lab"
              className="text-primary hover:text-primary-fixed underline font-mono-code text-xs"
            >
              Run now
            </Link>
          </div>
        </div>

        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Agent Simulation</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span className="font-mono-code text-[13px] text-white font-medium">
              Ready <span className="text-secondary">(3 agents active)</span>
            </span>
          </div>
        </div>

        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Cross-Agent Data Guard</span>
          <span className="font-mono-code text-[12px] text-tertiary font-medium bg-tertiary-container/20 px-2 py-0.5 rounded border border-tertiary/30">
            Enforced (Destination whitelist)
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between gap-3">
          <span className="text-[#94a3b8]">Honeytokens Active</span>
          <span className="font-mono-code text-[13px] text-tertiary font-medium">
            12 deployed
          </span>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div className="mt-4 pt-3.5 bg-surface-container/60 p-3 rounded-lg flex flex-wrap items-center justify-between gap-2 font-mono-code text-xs text-[#94a3b8] border border-outline-variant/20">
        <span>
          Engine PID: <span className="text-white font-semibold">41920</span>
        </span>
        <span>
          Memory: <span className="text-white font-semibold">348 MB</span>
        </span>
        <span className="text-tertiary font-medium">Uptime 99.98%</span>
      </div>
    </div>
  );
};
