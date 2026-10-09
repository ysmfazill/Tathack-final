import React from 'react';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';

export const ConfigurationHistorySection: React.FC = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between opacity-75">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-outline">
                Configuration History
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Immutable audit trail of parameter mutations.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-caps text-label-caps text-outline px-2.5 py-1 rounded border border-outline-variant/30 font-semibold bg-surface-container">
              UNSUPPORTED BY BACKEND
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> The backend FastAPI application currently does not track settings mutations in the audit log. History is not available.
        </div>

        {/* History Event Rows */}
        <div className="flex flex-col gap-2 pointer-events-none grayscale opacity-60">
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-[11px] text-secondary font-semibold">
                  N/A
                </span>
                <span className="font-mono-code text-xs text-on-surface font-semibold">
                  No records
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between font-mono-code text-[11px] text-outline">
              <span>
                Mutation: None
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-space-md flex items-center justify-end pointer-events-none opacity-50">
        <Link
          to="/audit-logs"
          className="font-body-md text-xs sm:text-sm text-primary hover:text-primary-fixed flex items-center gap-1 font-semibold transition-colors"
        >
          <span>View Complete Configuration Audit Log</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </Card>
  );
};
