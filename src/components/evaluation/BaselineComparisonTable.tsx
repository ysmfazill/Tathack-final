import React from 'react';

export const BaselineComparisonTable: React.FC = () => {
  const rows = [
    {
      id: 'A',
      name: 'A. Baseline (Unprotected)',
      dotColor: 'bg-error',
      badge: null,
      cases: '250',
      asr: '91.2%',
      asrColor: 'text-error font-semibold',
      abr: '8.8%',
      abrColor: 'text-outline',
      fpr: '0.0%',
      fprColor: 'text-tertiary',
      yield: '100.0%',
      medianLat: '8ms',
      p95Lat: '14ms',
      isDeployed: false,
    },
    {
      id: 'B',
      name: 'B. Input Scanner Only',
      dotColor: 'bg-outline',
      badge: null,
      cases: '250',
      asr: '42.4%',
      asrColor: 'text-error',
      abr: '57.6%',
      abrColor: 'text-on-surface',
      fpr: '8.4%',
      fprColor: 'text-error',
      yield: '91.6%',
      medianLat: '14ms',
      p95Lat: '28ms',
      isDeployed: false,
    },
    {
      id: 'C',
      name: 'C. Policy Engine + Taint Aware',
      dotColor: 'bg-secondary',
      badge: null,
      cases: '250',
      asr: '12.8%',
      asrColor: 'text-secondary',
      abr: '87.2%',
      abrColor: 'text-tertiary font-medium',
      fpr: '4.0%',
      fprColor: 'text-secondary',
      yield: '96.0%',
      medianLat: '26ms',
      p95Lat: '64ms',
      isDeployed: false,
    },
    {
      id: 'D',
      name: 'D. Full Defense (Active Protection)',
      dotColor: 'bg-tertiary animate-pulse',
      badge: 'DEPLOYED',
      cases: '250',
      asr: '4.2%',
      asrColor: 'text-tertiary font-bold',
      abr: '95.8%',
      abrColor: 'text-tertiary font-bold',
      fpr: '2.1%',
      fprColor: 'text-tertiary font-medium',
      yield: '97.9%',
      medianLat: '42ms',
      p95Lat: '112ms',
      isDeployed: true,
    },
  ];

  return (
    <div className="bg-surface-container p-space-lg rounded-xl mb-space-lg shadow-sm border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Baseline vs Protected Performance
            </h2>
            <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-primary/10 text-primary uppercase border border-primary/20">
              Empirical Benchmark Comparison
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Evaluated on identical 250 synthetic test cases. Comparing unconstrained agent baseline against incremental defensive layers.
          </p>
        </div>
        <span className="font-mono-code text-[11px] text-outline self-start sm:self-auto">
          METRIC: STRICT LATENCY INTERCEPTION
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-md text-body-md">
          <thead>
            <tr className="bg-surface-container-low text-outline font-label-caps text-label-caps uppercase border-b border-outline-variant/20">
              <th className="py-2.5 px-3 font-medium">Configuration</th>
              <th className="py-2.5 px-3 font-medium">Cases</th>
              <th className="py-2.5 px-3 font-medium">ASR (Lower=Better)</th>
              <th className="py-2.5 px-3 font-medium">ABR (Block Rate)</th>
              <th className="py-2.5 px-3 font-medium">FPR</th>
              <th className="py-2.5 px-3 font-medium">Legit Yield</th>
              <th className="py-2.5 px-3 font-medium">Median Latency</th>
              <th className="py-2.5 px-3 font-medium">p95 Latency</th>
              <th className="py-2.5 px-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40 font-mono-code text-mono-code text-[13px]">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors ${
                  row.isDeployed
                    ? 'bg-primary/5 hover:bg-primary/10 font-bold'
                    : 'hover:bg-surface-container-high/50'
                }`}
              >
                <td className="py-3 px-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${row.dotColor}`}></span>
                  <span
                    className={`font-body-md text-body-md ${
                      row.isDeployed ? 'text-primary font-bold' : 'text-on-surface'
                    }`}
                  >
                    {row.name}
                  </span>
                  {row.badge && (
                    <span className="font-label-caps text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary ml-1">
                      {row.badge}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-outline">{row.cases}</td>
                <td className={`py-3 px-3 ${row.asrColor}`}>{row.asr}</td>
                <td className={`py-3 px-3 ${row.abrColor}`}>{row.abr}</td>
                <td className={`py-3 px-3 ${row.fprColor}`}>{row.fpr}</td>
                <td className="py-3 px-3 text-on-surface">{row.yield}</td>
                <td
                  className={`py-3 px-3 ${
                    row.isDeployed ? 'text-primary font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  {row.medianLat}
                </td>
                <td
                  className={`py-3 px-3 ${
                    row.isDeployed ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {row.p95Lat}
                </td>
                <td className="py-3 px-3 text-right">
                  {row.isDeployed ? (
                    <button
                      onClick={() => alert('Inspecting Full Defense active deployment profile...')}
                      className="px-2.5 py-1 rounded bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors shadow-sm"
                    >
                      Inspect
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Inspecting configuration ${row.id}...`)}
                      className="text-secondary hover:text-on-surface text-body-sm font-body-sm transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
