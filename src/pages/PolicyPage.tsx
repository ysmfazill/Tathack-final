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

  const rules: TransferRuleItem[] = [
    {
      id: 'RULE-001',
      name: 'Internal HR Summarization',
      sourceAgent: 'HR Agent (trusted)',
      sourceType: 'trusted',
      destinationAgent: 'Report Agent',
      destinationType: 'internal',
      classification: 'Internal Employee Summary',
      classificationVariant: 'secondary',
      targetEndpoint: 'Internal Workspace',
      decision: 'ALLOW',
    },
    {
      id: 'RULE-002',
      name: 'Confidential Record Egress',
      sourceAgent: 'Report Agent',
      sourceType: 'processing',
      destinationAgent: 'Export Agent',
      destinationType: 'external',
      classification: 'Confidential Employee Records',
      classificationVariant: 'error',
      targetEndpoint: 'External Destination',
      decision: 'BLOCK',
    },
    {
      id: 'RULE-003',
      name: 'Approved Sanity Export',
      sourceAgent: 'Report Agent',
      sourceType: 'processing',
      destinationAgent: 'Export Agent',
      destinationType: 'external',
      classification: 'Sanitized Summary',
      classificationVariant: 'tertiary',
      targetEndpoint: 'Approved Export S3',
      decision: 'REQUIRE APPROVAL',
    },
    {
      id: 'RULE-004',
      name: 'Restricted Record Boundary',
      sourceAgent: 'HR Agent',
      sourceType: 'trusted',
      destinationAgent: 'Unknown Agent',
      destinationType: 'unknown',
      classification: 'Restricted Employee Records',
      classificationVariant: 'error',
      targetEndpoint: 'Unknown / Any',
      decision: 'BLOCK',
    },
  ];

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
          version="v1.4.2 Strict"
          updatedTime="Updated 14 mins ago by SecOps Lead"
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
