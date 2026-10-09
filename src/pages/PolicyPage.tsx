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

export const PolicyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transfers');
  const [searchFilter, setSearchFilter] = useState('');
  const [rules, setRules] = useState<TransferRuleItem[]>([]);
  const [policyVersion, setPolicyVersion] = useState("v1.4.2 Strict");

  React.useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8080/api/policies');
        const data = await res.json();
        setPolicyVersion(data.policy_version || "v1.4.2 Strict");
        
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

  const handleAddRule = () => {
    alert('Opening Create Policy Rule builder modal...');
  };

  const handleEditRule = (id: string) => {
    alert(`Editing policy rule definition for ${id}...`);
  };

  const handleAuditRule = (id: string) => {
    alert(`Inspecting audit trace and provenance logs for ${id}...`);
  };

  return (
    <PageContainer>
      <div className="flex flex-col w-full gap-space-xl pb-16">
        {/* 1. Page Header */}
        <PolicyHeader
          version={policyVersion}
          updatedTime="Updated recently by Backend"
          onViewHistory={() => alert('Viewing Policy Center version history ledger...')}
          onCreateRule={handleAddRule}
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
          onAddRule={handleAddRule}
          onEditRule={handleEditRule}
          onAuditRule={handleAuditRule}
        />

        {/* 5. Section B: Sensitive Data Classification (4 Tiers) */}
        <DataClassificationTiers />

        {/* 6. Section C: Two-Column Split (Destination Security & Tool Access RBAC) */}
        <DestinationAndToolRbac />

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
