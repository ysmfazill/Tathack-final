import React, { useEffect, useState } from 'react';

export const RunHistory: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRuns = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8080/api/playground/runs');
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setRuns(data.items || []);
        setError('');
      } catch (e) {
        setError('Connection error loading history');
      } finally {
        setLoading(false);
      }
    };
    fetchRuns();
  }, [refreshTrigger]);

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md mt-space-md">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm font-semibold">Persisted Run History</h3>
      
      {error && <p className="text-error font-mono-code text-[12px]">{error}</p>}
      {loading && <p className="text-on-surface-variant text-[12px]">Loading history...</p>}
      
      {!loading && !error && runs.length === 0 && (
        <p className="text-on-surface-variant text-[12px]">No history exists. Run a scenario to see results.</p>
      )}

      {!loading && !error && runs.length > 0 && (
        <div className="overflow-x-auto border border-outline-variant/20 rounded-lg bg-surface-container-lowest">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-[10px] uppercase font-label-caps text-on-surface-variant bg-surface-container/40">
                <th className="py-2.5 px-3.5 font-medium">Run ID</th>
                <th className="py-2.5 px-3.5 font-medium">Scenario ID</th>
                <th className="py-2.5 px-3.5 font-medium">Start Time</th>
                <th className="py-2.5 px-3.5 font-medium">Outcome</th>
                <th className="py-2.5 px-3.5 font-medium">Decision</th>
                <th className="py-2.5 px-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {runs.map((r, i) => (
                <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-3.5 font-mono-code text-[11px] text-on-surface">{r.simulation_id ? r.simulation_id.substring(0,8) : 'N/A'}</td>
                  <td className="py-3 px-3.5 font-mono-code text-[11px] text-on-surface-variant truncate max-w-[150px]">{r.scenario_id}</td>
                  <td className="py-3 px-3.5 text-on-surface-variant text-[11px]">{r.timestamp ? new Date(r.timestamp).toLocaleString() : 'N/A'}</td>
                  <td className="py-3 px-3.5 font-bold">{r.scenario_outcome}</td>
                  <td className="py-3 px-3.5">{r.policy_decision || 'N/A'}</td>
                  <td className="py-3 px-3.5 text-on-surface-variant text-[11px]">{r.execution_status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
