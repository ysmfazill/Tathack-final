import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const AuditStorageSection: React.FC = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between opacity-75">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">database</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-outline">
                Audit Storage &amp; Persistence
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Tamper-evident SQLite event journal in WAL mode.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-caps text-label-caps text-outline px-2.5 py-1 rounded border border-outline-variant/30 font-semibold bg-surface-container">
              UNSUPPORTED BY BACKEND
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> The backend FastAPI application currently uses a hardcoded local SQLite database for audit persistence. Remote sinks and custom retention policies are not supported in this phase.
        </div>

        {/* Database Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md pointer-events-none grayscale opacity-60">
          <div className="p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Storage Engine
            </span>
            <div className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
              SQLite 3.45 (WAL Mode)
            </div>
            <span className="font-body-sm text-[10px] text-tertiary font-mono-code">
              Synchronous: NORMAL
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Connection Status
            </span>
            <div className="font-mono-code text-xs text-tertiary font-semibold mt-0.5 flex items-center gap-1.5">
              HEALTHY (Read/Write)
            </div>
            <span className="font-body-sm text-[10px] text-outline font-mono-code">
              Lock State: UNLOCKED
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container sm:col-span-2 border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Database Path
            </span>
            <div className="font-mono-code text-xs text-secondary mt-0.5 truncate font-semibold">
              /var/data/promptguard_audit.db
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-space-xs flex-wrap pointer-events-none opacity-50">
        <Button variant="secondary" size="sm" disabled>
          Test Connection
        </Button>
        <Button variant="secondary" size="sm" disabled>
          Vacuum DB
        </Button>
        <Button variant="primary" size="sm" disabled>
          Inspect SQLite Metrics
        </Button>
      </div>
    </Card>
  );
};
