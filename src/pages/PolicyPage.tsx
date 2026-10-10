import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PolicyHeader } from '../components/policy/PolicyHeader';
import { PolicyMetricTiles } from '../components/policy/PolicyMetricTiles';
import { PolicyCategoryTabs } from '../components/policy/PolicyCategoryTabs';
import { TransferRulesTable, TransferRuleItem } from '../components/policy/TransferRulesTable';
import { DataClassificationTiers } from '../components/policy/DataClassificationTiers';
import { DestinationAndToolRbac } from '../components/policy/DestinationAndToolRbac';
import { PolicySimulationSandbox } from '../components/policy/PolicySimulationSandbox';
import { RuleInspectorAndAudit } from '../components/policy/RuleInspectorAndAudit';
import { getPolicies } from '../lib/api';

export const PolicyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transfers');
  const [searchFilter, setSearchFilter] = useState('');
  const [rules, setRules] = useState<TransferRuleItem[]>([]);
  const [toolsRbac, setToolsRbac] = useState<any[]>([]);
  const [policyVersion, setPolicyVersion] = useState("v1.4.2 Strict");

  React.useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await getPolicies();
        const data = res.data;
        setPolicyVersion(data.policy_version || "v1.4.2 Strict");
        
        const mappedTools = data.registered_tools.map((t: string) => {
          const isDisabled = data.disabled_tools.includes(t);
          const needsApproval = data.approval_required_tools.includes(t);
          
          let status = 'ACTIVE';
          let statusVariant = 'tertiary';
          let approval = 'None';
          
          if (isDisabled) {
            status = 'DISABLED';
            statusVariant = 'error';
            approval = 'Prohibited';
          } else if (needsApproval) {
            status = 'CONDITIONAL';
            statusVariant = 'secondary';
            approval = 'Approval Required';
          }
          
          return {
            name: t,
            allowedAgents: 'Any',
            riskTier: isDisabled ? 'Critical' : (needsApproval ? 'High' : 'Medium'),
            approval: approval,
            status: status,
            statusVariant: statusVariant,
          };
        });
        setToolsRbac(mappedTools);
        
        const mappedRules: TransferRuleItem[] = data.registered_tools.map((t: string, idx: number) => {
          const isDisabled = data.disabled_tools.includes(t);
          const needsApproval = data.approval_required_tools.includes(t);
          let decision = "ALLOW";
          if (isDisabled) decision = "BLOCK";
          else if (needsApproval) decision = "REQUIRE APPROVAL";
          
          return {
            id: `RULE-TOOL-${idx}`,
            name: `Tool Execution: ${t}`,
            sourceAgent: 'Any Requesting Agent',
            sourceType: 'processing',
            destinationAgent: t,
            destinationType: 'external',
            classification: 'Tool Policy',
            classificationVariant: isDisabled ? 'error' : 'secondary',
            targetEndpoint: t,
            decision: decision,
          };
        });
        setRules(mappedRules);
      } catch(e) {
        console.error("Failed to fetch policies", e);
      }
    };
    fetchPolicies();
  }, []);

  const filteredRules = rules.filter(
    (r) =>
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.sourceAgent.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.destinationAgent.toLowerCase().includes(searchFilter.toLowerCase())
  );


  return (
    <PageContainer>
      <div className="flex flex-col w-full gap-space-xl pb-16">
        {/* 1. Page Header */}
        <PolicyHeader
          version={policyVersion}
          updatedTime="Updated recently by Backend"
          onViewHistory={() => alert('Viewing Policy Center version history ledger...')}
          onCreateRule={() => alert('Creation via UI is unsupported (Backend config only)')}
        />

        {/* 2. Top Overview Metrics (4 Compact Tiles) */}
        <PolicyMetricTiles />

        {/* 3. Policy Category Navigation Tabs & Filter Bar */}
        <PolicyCategoryTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
        />

        {/* 4. Section A: Agent-to-Agent Transfer Rules Table */}
        <TransferRulesTable
          rules={filteredRules}
        />

        {/* 5. Section B: Sensitive Data Classification (4 Tiers) */}
        <DataClassificationTiers />

        {/* 6. Section C: Two-Column Split (Destination Security & Tool Access RBAC) */}
        <DestinationAndToolRbac tools={toolsRbac} destinations={[]} />

        {/* 7. Section D: Interactive Policy Simulation Sandbox */}
        <PolicySimulationSandbox />

        {/* 8. Section E & F: Rule Inspector & Recent Policy Audit */}
        <RuleInspectorAndAudit
          onSaveDraft={() => alert('Draft saved successfully to local storage.')}
          onActivatePolicy={() => alert('Triggering SecOps multi-sig activation challenge for RULE-005...')}
        />
      </div>
    </PageContainer>
  );
};
