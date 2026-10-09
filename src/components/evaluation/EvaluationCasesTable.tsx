import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export interface EvaluationCasesTableProps {
  cases: any[];
}

export const EvaluationCasesTable: React.FC<EvaluationCasesTableProps> = ({ cases }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  if (!cases || cases.length === 0) {
    return null;
  }

  const filteredCases = cases.filter((tc) => {
    if (activeFilter === 'Passed' && tc.test_status !== 'PASS') return false;
    if (activeFilter === 'Failed' && tc.test_status !== 'FAIL') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tc.case_result_id?.toLowerCase().includes(q) ||
        tc.scenario_id?.toLowerCase().includes(q) ||
        tc.test_status?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <Card elevation="low" className="p-6 border border-outline-variant/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
            <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
              Evaluation Test Cases
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search test case or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-high text-on-surface rounded-lg border border-outline-variant/40 focus:border-primary focus:outline-none placeholder:text-on-surface-variant/60"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
        {['All', 'Passed', 'Failed'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
              }`}
            >
              {filter}
              {filter === 'All' && ` (${cases.length})`}
              {filter === 'Passed' && ` (${cases.filter((c) => c.test_status === 'PASS').length})`}
              {filter === 'Failed' && ` (${cases.filter((c) => c.test_status === 'FAIL').length})`}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container-high/80 text-on-surface-variant border-b border-outline-variant/30 font-semibold">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Scenario</th>
              <th className="py-3 px-4">Expected</th>
              <th className="py-3 px-4">Observed Result</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-body-sm">
            {filteredCases.map((tc) => (
              <tr
                key={tc.case_result_id}
                className="hover:bg-surface-container/50 transition-colors group cursor-pointer"
                onClick={() => setSelectedCase(tc)}
              >
                <td className="py-3 px-4 font-mono-code font-bold text-primary whitespace-nowrap">
                  {tc.case_result_id}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-on-surface">{tc.scenario_id}</div>
                </td>
                <td className="py-3 px-4 font-mono-code font-semibold whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                    {tc.expected_outcome}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-mono-code text-xs font-semibold text-on-surface">
                    {tc.observed_outcome}
                  </div>
                </td>
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono-code ${
                      tc.test_status === 'PASS'
                        ? 'bg-tertiary/20 text-tertiary border border-tertiary/40'
                        : tc.test_status === 'FAIL' 
                        ? 'bg-error/20 text-error border border-error/40'
                        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                    }`}
                  >
                    {tc.test_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="visibility"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCase(tc);
                    }}
                  >
                    Inspect
                  </Button>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] text-outline mb-2 block">
                    search_off
                  </span>
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="w-full max-w-2xl bg-surface-container rounded-2xl border border-outline-variant/40 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono-code font-bold ${
                    selectedCase.test_status === 'PASS'
                      ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                      : 'bg-error/20 text-error border border-error/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {selectedCase.test_status === 'PASS' ? 'verified' : 'gpp_bad'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-sm text-primary">
                      {selectedCase.case_result_id}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
                    {selectedCase.scenario_id}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 font-mono-code">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase">Expected</span>
                  <p className="font-semibold text-tertiary text-xs mt-0.5">
                    {selectedCase.expected_outcome}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase">Observed</span>
                  <p className="font-semibold text-primary text-xs mt-0.5">
                    {selectedCase.observed_outcome}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase">Eval Latency</span>
                  <p className="font-semibold text-on-surface text-xs mt-0.5">
                    {selectedCase.latency_ms !== null ? `${selectedCase.latency_ms}ms` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase">Status</span>
                  <p className="font-semibold text-on-surface text-xs mt-0.5">
                    {selectedCase.test_status}
                  </p>
                </div>
              </div>

              {selectedCase.safe_evidence_metadata && (
                <div>
                  <label className="block font-semibold text-on-surface uppercase text-[10px] tracking-wider mb-1">
                    Metadata Evidence
                  </label>
                  <div className="p-3 rounded-xl bg-surface-container-lowest font-mono-code text-[11px] text-on-surface border border-outline-variant/30 whitespace-pre-wrap">
                    {selectedCase.safe_evidence_metadata}
                  </div>
                </div>
              )}

              {selectedCase.reason_code && (
                <div>
                  <label className="block font-semibold text-on-surface uppercase text-[10px] tracking-wider mb-1">
                    Reason Code
                  </label>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      {selectedCase.reason_code}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-outline-variant/30 pt-4 mt-4 flex items-center justify-between">
              <Button variant="secondary" size="sm" onClick={() => setSelectedCase(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
