import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { getAuditStorageMetrics } from '../../lib/api';

export const AuditStorageSection: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getAuditStorageMetrics();
        setMetrics(res.data);
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.detail || e.message || 'Failed to load storage metrics');
      }
    };
    fetchMetrics();
  }, []);

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
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
        </div>

        {/* Database Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md">
          {error && (
            <div className="sm:col-span-2 p-3 rounded bg-error-container text-error text-xs font-mono-code mb-2">
              {error}
            </div>
          )}
          <div className="p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Storage Engine
            </span>
            <div className="font-mono-code text-xs text-on-surface font-semibold mt-0.5">
              {error ? 'ERROR' : (metrics?.storage_engine || 'Loading...')}
            </div>
            <span className="font-body-sm text-[10px] text-tertiary font-mono-code">
              Size: {metrics?.file_size_kb || 0} KB
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Connection Status
            </span>
            <div className="font-mono-code text-xs text-tertiary font-semibold mt-0.5 flex items-center gap-1.5">
              {metrics?.connection_status || 'Loading...'}
            </div>
            <span className="font-body-sm text-[10px] text-outline font-mono-code">
              Lock State: {metrics?.lock_state || 'Loading...'}
            </span>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container sm:col-span-2 border border-outline-variant/20">
            <span className="font-label-caps text-[10px] text-outline uppercase font-mono-code font-semibold">
              Database Path
            </span>
            <div className="font-mono-code text-xs text-secondary mt-0.5 truncate font-semibold">
              {metrics?.database_path || 'Loading...'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-space-xs flex-wrap">
        <Button variant="secondary" size="sm" onClick={() => alert('Unsupported (Test connection via ping implemented in API layer only)')}>
          Test Connection
        </Button>
        <Button variant="secondary" size="sm" onClick={() => alert('Unsupported (Vacuum DB not available in UI)')}>
          Vacuum DB
        </Button>
      </div>
    </Card>
  );
};
