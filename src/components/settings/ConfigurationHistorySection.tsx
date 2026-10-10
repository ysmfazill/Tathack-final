import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';
import { getConfigHistory } from '../../lib/api';

export const ConfigurationHistorySection: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getConfigHistory();
        setHistory(res.data);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
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
        </div>

        {/* History Event Rows */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-xs text-on-surface-variant">Loading...</div>
          ) : error ? (
            <div className="text-xs text-error">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-xs text-on-surface-variant">No configuration changes recorded yet.</div>
          ) : (
            history.map((record) => (
              <div key={record.change_id} className="p-space-sm rounded-xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-[11px] text-secondary font-semibold">
                      {new Date(record.timestamp).toLocaleString()}
                    </span>
                    <span className="font-mono-code text-xs text-on-surface font-semibold">
                      {record.category} UPDATE
                    </span>
                  </div>
                  <span className="font-mono-code text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {record.actor}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono-code text-[11px] text-outline truncate max-w-full">
                  <span className="truncate">
                    Result: {record.operation_result}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
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
