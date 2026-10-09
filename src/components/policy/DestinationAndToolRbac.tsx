import React from 'react';

export const DestinationAndToolRbac: React.FC = () => {
  const destinations = [
    {
      name: 'Reporting Workspace',
      type: 'Internal',
      permittedData: 'Internal Data',
      approval: 'None',
      status: 'ALLOWED',
      statusVariant: 'tertiary',
    },
    {
      name: 'Approved Export (S3)',
      type: 'Whitelisted Ext',
      permittedData: 'Sanitized Summary',
      approval: 'SecOps Token',
      status: 'RESTRICTED',
      statusVariant: 'secondary',
    },
    {
      name: 'Unknown External Socket',
      type: 'Untrusted Ext',
      permittedData: 'None',
      approval: 'N/A',
      status: 'BLOCKED',
      statusVariant: 'error',
    },
  ];

  const tools = [
    {
      name: 'read_employee_summary',
      allowedAgents: 'HR, Report',
      riskTier: 'Medium',
      approval: 'None',
      status: 'ACTIVE',
      statusVariant: 'tertiary',
    },
    {
      name: 'generate_report',
      allowedAgents: 'Report Agent',
      riskTier: 'Medium',
      approval: 'None',
      status: 'ACTIVE',
      statusVariant: 'tertiary',
    },
    {
      name: 'export_records',
      allowedAgents: 'Export Agent',
      riskTier: 'High',
      approval: 'POL-704 Multi-Sig',
      status: 'CONDITIONAL',
      statusVariant: 'secondary',
    },
    {
      name: 'delete_records',
      allowedAgents: 'Disabled',
      riskTier: 'Critical',
      approval: 'Prohibited',
      status: 'DISABLED',
      statusVariant: 'error',
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg">
      {/* Left: Destination Security Rules */}
      <div className="flex flex-col bg-surface-container-low rounded-xl shadow-md overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between p-space-lg bg-surface-container/60 border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Destination Security Rules
            </h3>
          </div>
          <button
            className="text-primary hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase transition-colors"
            type="button"
          >
            + Add Sink
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container-lowest/70 text-outline font-label-caps text-label-caps uppercase border-b border-outline-variant/20">
                <th className="px-space-md py-2.5 font-medium">Destination</th>
                <th className="px-space-md py-2.5 font-medium">Type</th>
                <th className="px-space-md py-2.5 font-medium">Permitted Data</th>
                <th className="px-space-md py-2.5 font-medium">Approval</th>
                <th className="px-space-md py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {destinations.map((dest, idx) => (
                <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-space-md py-3 font-mono-code text-on-surface">{dest.name}</td>
                  <td
                    className={`px-space-md py-3 ${
                      dest.statusVariant === 'error' ? 'text-error' : 'text-on-surface-variant'
                    }`}
                  >
                    {dest.type}
                  </td>
                  <td className="px-space-md py-3">
                    <span
                      className={`font-mono-code text-[11px] ${
                        dest.statusVariant === 'tertiary'
                          ? 'text-secondary'
                          : dest.statusVariant === 'secondary'
                          ? 'text-primary'
                          : 'text-outline'
                      }`}
                    >
                      {dest.permittedData}
                    </span>
                  </td>
                  <td
                    className={`px-space-md py-3 ${
                      dest.approval === 'None' ? 'text-outline' : 'text-on-surface'
                    }`}
                  >
                    {dest.approval}
                  </td>
                  <td className="px-space-md py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-label-caps text-label-caps font-semibold border ${
                        dest.statusVariant === 'tertiary'
                          ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                          : dest.statusVariant === 'secondary'
                          ? 'bg-surface-container-highest text-secondary border-secondary/30'
                          : 'bg-error-container/30 text-error border-error/40'
                      }`}
                    >
                      {dest.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Tool Access Control (RBAC) */}
      <div className="flex flex-col bg-surface-container-low rounded-xl shadow-md overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between p-space-lg bg-surface-container/60 border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-tertiary text-[20px]">construction</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Tool Access Control (RBAC)
            </h3>
          </div>
          <button
            className="text-primary hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase transition-colors"
            type="button"
          >
            Configure RBAC
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container-lowest/70 text-outline font-label-caps text-label-caps uppercase border-b border-outline-variant/20">
                <th className="px-space-md py-2.5 font-medium">Tool Name</th>
                <th className="px-space-md py-2.5 font-medium">Allowed Agents</th>
                <th className="px-space-md py-2.5 font-medium">Risk Tier</th>
                <th className="px-space-md py-2.5 font-medium">Approval</th>
                <th className="px-space-md py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {tools.map((tool, idx) => (
                <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                  <td
                    className={`px-space-md py-3 font-mono-code ${
                      tool.statusVariant === 'error' ? 'text-outline' : 'text-on-surface'
                    }`}
                  >
                    {tool.name}
                  </td>
                  <td className="px-space-md py-3 text-on-surface-variant font-mono-code text-[11px]">
                    {tool.allowedAgents}
                  </td>
                  <td className="px-space-md py-3">
                    <span
                      className={
                        tool.riskTier === 'Critical'
                          ? 'text-error font-semibold'
                          : tool.riskTier === 'High'
                          ? 'text-error'
                          : 'text-secondary'
                      }
                    >
                      {tool.riskTier}
                    </span>
                  </td>
                  <td
                    className={`px-space-md py-3 ${
                      tool.approval === 'Prohibited'
                        ? 'text-error'
                        : tool.approval === 'None'
                        ? 'text-outline'
                        : 'text-on-surface font-mono-code text-[11px]'
                    }`}
                  >
                    {tool.approval}
                  </td>
                  <td className="px-space-md py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-label-caps text-label-caps font-semibold border ${
                        tool.statusVariant === 'tertiary'
                          ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                          : tool.statusVariant === 'secondary'
                          ? 'bg-surface-container-highest text-secondary border-secondary/30'
                          : 'bg-error-container/30 text-error border-error/40'
                      }`}
                    >
                      {tool.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
