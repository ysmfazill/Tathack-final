import React from 'react';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';

interface ConfigMutation {
  time: string;
  parameter: string;
  fromVal: string;
  toVal: string;
  author: string;
  badge: 'PERSISTED' | 'VERIFIED';
}

const MUTATIONS: ConfigMutation[] = [
  {
    time: '14:22 UTC',
    parameter: 'model_timeout',
    fromVal: '30s',
    toVal: '60s',
    author: 'SecOps Admin',
    badge: 'PERSISTED'
  },
  {
    time: '12:05 UTC',
    parameter: 'ollama_model',
    fromVal: 'mistral-7b',
    toVal: 'llama-3-8b',
    author: 'SecOps Admin',
    badge: 'PERSISTED'
  },
  {
    time: 'Yesterday',
    parameter: 'audit_wal_mode',
    fromVal: 'OFF',
    toVal: 'PRAGMA WAL',
    author: 'System Init',
    badge: 'VERIFIED'
  }
];

export const ConfigurationHistorySection: React.FC = () => {
  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Configuration History
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Immutable audit trail of parameter mutations.
            </p>
          </div>
          <span className="font-label-caps text-label-caps text-outline px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 font-mono-code font-semibold">
            SYSTEM LEDGER
          </span>
        </div>

        {/* History Event Rows */}
        <div className="flex flex-col gap-2">
          {MUTATIONS.map((m, idx) => (
            <div
              key={idx}
              className="p-space-sm rounded-xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-[11px] text-secondary font-semibold">
                    {m.time}
                  </span>
                  <span className="font-mono-code text-xs text-on-surface font-semibold">
                    {m.parameter}
                  </span>
                </div>
                <span className="font-mono-code text-[10px] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/30 font-bold">
                  {m.badge}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono-code text-[11px] text-outline">
                <span>
                  Mutation: <span className="text-error line-through">{m.fromVal}</span> → <span className="text-tertiary font-bold">{m.toVal}</span>
                </span>
                <span className="text-on-surface-variant">By: {m.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="pt-space-md flex items-center justify-end">
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
