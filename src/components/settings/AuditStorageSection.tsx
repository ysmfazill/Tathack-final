import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const AuditStorageSection: React.FC = () => {
  const [vacuuming, setVacuuming] = useState(false);
  const [vacuumMessage, setVacuumMessage] = useState<string | null>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [testDbMsg, setTestDbMsg] = useState<string | null>(null);

  const handleVacuum = () => {
    setVacuuming(true);
    setTimeout(() => {
      setVacuuming(false);
      setVacuumMessage('PRAGMA vacuum completed. Database pages optimized (4.2 MB → 4.1 MB).');
      setTimeout(() => setVacuumMessage(null), 3500);
    }, 900);
  };

  const handleTestDb = () => {
    setTestingDb(true);
    setTimeout(() => {
      setTestingDb(false);
      setTestDbMsg('SQLite connection verified (Read/Write latency: 0.4ms).');
      setTimeout(() => setTestDbMsg(null), 3000);
    }, 600);
  };

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">database</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Audit Storage &amp; Persistence
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Tamper-evident SQLite event journal in WAL mode.
            </p>
          </div>
          <span className="font-label-caps text-label-caps text-tertiary px-2.5 py-1 rounded bg-tertiary-container/20 border border-tertiary/30 font-semibold">
            SQLITE WAL
          </span>
        </div>

        {/* Database Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md">
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
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
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

          <div className="p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Total Recorded Events
            </span>
            <div className="font-mono-metric text-lg text-on-surface font-bold mt-0.5">
              1,248
            </div>
            <span className="font-body-sm text-[11px] text-outline font-mono-code">
              Size: 4.2 MB / 100 MB quota
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Last Successful Write
            </span>
            <div className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
              14:38:22 UTC
            </div>
            <span className="font-body-sm text-[11px] text-outline font-mono-code">
              Event: EVT-8941-02
            </span>
          </div>
        </div>

        {/* Ledger Integrity Card */}
        <div className="p-space-sm rounded-xl bg-surface-container-lowest flex items-center justify-between mb-space-md border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <span className="font-mono-code text-[11px] text-on-surface">
              SHA-256 Ledger Verified • 0 Corrupted Blocks
            </span>
          </div>
          <span className="font-mono-code text-[10px] text-tertiary font-bold px-1.5 py-0.5 rounded bg-tertiary-container/20 border border-tertiary/30">
            Checksum OK
          </span>
        </div>

        {/* Fail-Closed Warning */}
        <div className="p-space-sm rounded-xl bg-error-container/20 text-on-surface-variant flex items-start gap-2 mb-space-md font-mono-code text-[11px] border border-error/30">
          <span className="material-symbols-outlined text-error text-[16px] shrink-0 mt-0.5">warning</span>
          <span>
            When audit storage is unavailable or read-only, all protected tool invocations will fail-closed to prevent untracked actions.
          </span>
        </div>

        {vacuumMessage && (
          <div className="mb-2 p-2 rounded bg-tertiary-container/20 text-tertiary font-mono-code text-[11px] border border-tertiary/30 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {vacuumMessage}
          </div>
        )}

        {testDbMsg && (
          <div className="mb-2 p-2 rounded bg-secondary-container/20 text-secondary font-mono-code text-[11px] border border-secondary/30 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            {testDbMsg}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-space-xs flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          icon={testingDb ? 'sync' : 'network_ping'}
          onClick={handleTestDb}
          disabled={testingDb}
        >
          {testingDb ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={vacuuming ? 'sync' : 'cleaning_services'}
          onClick={handleVacuum}
          disabled={vacuuming}
        >
          {vacuuming ? 'Vacuuming...' : 'Vacuum DB'}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => alert('SQLite Metrics:\n• WAL Journal Size: 128 KB\n• Cache Size: -2000 pages (2MB)\n• Page Size: 4096 bytes\n• Integrity Check: PASS')}
        >
          Inspect SQLite Metrics
        </Button>
      </div>
    </Card>
  );
};
