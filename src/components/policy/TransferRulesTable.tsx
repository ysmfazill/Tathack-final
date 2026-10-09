import React from 'react';

export interface TransferRuleItem {
  id: string;
  name: string;
  sourceAgent: string;
  sourceType: 'trusted' | 'processing' | 'untrusted';
  destinationAgent: string;
  destinationType: 'external' | 'internal' | 'unknown';
  classification: string;
  classificationVariant: 'secondary' | 'error' | 'tertiary';
  targetEndpoint: string;
  decision: 'ALLOW' | 'BLOCK' | 'REQUIRE APPROVAL';
}

interface TransferRulesTableProps {
  rules: TransferRuleItem[];
  onAddRule: () => void;
  onEditRule: (id: string) => void;
  onAuditRule: (id: string) => void;
}

export const TransferRulesTable: React.FC<TransferRulesTableProps> = ({
  rules,
  onAddRule,
  onEditRule,
  onAuditRule,
}) => {
  return (
    <div className="flex flex-col bg-surface-container-low rounded-xl shadow-md overflow-hidden border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-space-lg bg-surface-container/60 gap-space-sm border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">swap_horiz</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Agent-to-Agent Transfer Rules
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Control which agents may exchange data and under what conditions. Enforced by backend behavioral policy engine.
          </p>
        </div>
        <button
          onClick={onAddRule}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-primary text-body-sm font-medium transition-colors border border-outline-variant/30 shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add Transfer Rule</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest/70 text-outline font-label-caps text-label-caps uppercase tracking-wider border-b border-outline-variant/20">
              <th className="px-space-lg py-3 font-medium">Rule ID &amp; Name</th>
              <th className="px-space-md py-3 font-medium">Source Agent</th>
              <th className="px-space-md py-3 font-medium">Destination Agent</th>
              <th className="px-space-md py-3 font-medium">Data Classification</th>
              <th className="px-space-md py-3 font-medium">Target Endpoint</th>
              <th className="px-space-md py-3 font-medium">Policy Decision</th>
              <th className="px-space-lg py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
            {rules.map((rule) => {
              const isAllow = rule.decision === 'ALLOW';
              const isBlock = rule.decision === 'BLOCK';

              return (
                <tr key={rule.id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-space-lg py-3.5">
                    <div className="flex flex-col">
                      <span className="font-mono-code font-semibold text-on-surface">{rule.id}</span>
                      <span className="text-on-surface-variant text-[12px]">{rule.name}</span>
                    </div>
                  </td>
                  <td className="px-space-md py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono-code text-[12px] border border-outline-variant/20">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          rule.sourceType === 'trusted'
                            ? 'bg-tertiary'
                            : rule.sourceType === 'processing'
                            ? 'bg-secondary'
                            : 'bg-error'
                        }`}
                      />
                      {rule.sourceAgent}
                    </span>
                  </td>
                  <td className="px-space-md py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono-code text-[12px] border ${
                        rule.destinationType === 'unknown'
                          ? 'bg-error-container/20 text-error border-error/30'
                          : 'bg-surface-container text-on-surface border-outline-variant/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          rule.destinationType === 'internal'
                            ? 'bg-secondary'
                            : rule.destinationType === 'unknown'
                            ? 'bg-error'
                            : 'bg-outline'
                        }`}
                      />
                      {rule.destinationAgent}
                    </span>
                  </td>
                  <td className="px-space-md py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-caps text-label-caps border ${
                        rule.classificationVariant === 'error'
                          ? 'bg-error-container/20 text-error border-error/30'
                          : rule.classificationVariant === 'secondary'
                          ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                          : 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                      }`}
                    >
                      {rule.classification}
                    </span>
                  </td>
                  <td
                    className={`px-space-md py-3.5 font-mono-code text-[12px] ${
                      isBlock ? 'text-error' : 'text-on-surface-variant'
                    }`}
                  >
                    {rule.targetEndpoint}
                  </td>
                  <td className="px-space-md py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-label-caps text-label-caps font-semibold border ${
                        isAllow
                          ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
                          : isBlock
                          ? 'bg-error-container/30 text-error border-error/40'
                          : 'bg-surface-container-highest text-secondary border-secondary/30'
                      }`}
                    >
                      {isAllow ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      ) : isBlock ? (
                        <span className="material-symbols-outlined text-[13px]">lock</span>
                      ) : (
                        <span className="material-symbols-outlined text-[13px]">how_to_reg</span>
                      )}
                      {rule.decision}
                    </span>
                  </td>
                  <td className="px-space-lg py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEditRule(rule.id)}
                      className="text-primary hover:text-on-surface font-mono-code text-body-sm px-2 py-1 transition-colors"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onAuditRule(rule.id)}
                      className="text-outline hover:text-on-surface font-mono-code text-body-sm px-2 py-1 transition-colors"
                      type="button"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footnote banner */}
      <div className="px-space-lg py-2.5 bg-surface-container flex items-center gap-space-sm text-body-sm border-t border-outline-variant/20">
        <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
        <span className="font-mono-code text-[12px] text-on-surface-variant">
          <strong className="text-tertiary">Deterministic Policy Check:</strong> Prohibited cross-agent payloads are terminated at runtime. Egress socket will fail closed.
        </span>
      </div>
    </div>
  );
};
