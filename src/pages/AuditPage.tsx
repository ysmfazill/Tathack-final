import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AuditHeader } from '../components/audit/AuditHeader';
import { AuditMetricTiles } from '../components/audit/AuditMetricTiles';
import { AuditFilterConsole } from '../components/audit/AuditFilterConsole';
import { AuditEventTable, AuditEventItem } from '../components/audit/AuditEventTable';
import { AuditEventDetailDrawer } from '../components/audit/AuditEventDetailDrawer';
import { AuditBottomPanels } from '../components/audit/AuditBottomPanels';
import { AuditComplianceBanner } from '../components/audit/AuditComplianceBanner';
import { ExportLogsModal } from '../components/audit/ExportLogsModal';

const MOCK_AUDIT_DATASET: AuditEventItem[] = [
  {
    id: 'EVT-8941-02',
    requestId: 'pg-req-ca88df12',
    timestamp: '14:38:22',
    fullTimestamp: '2025-05-18 14:38:22 UTC',
    type: 'Cross-Agent Transfer',
    icon: 'alt_route',
    agentPath: 'Report Agent → Export Agent',
    risk: 'CRITICAL',
    decision: 'BLOCKED',
    execution: 'NOT EXECUTED',
    proposalTool: 'export_records',
    proposalDest: 'dest: "ext-sync.io"',
    ruleCode: 'Rule-002 Egress',
    ruleName: 'Violation POL-704',
    sourceAgent: 'Report Agent',
    sourceAgentId: 'agnt-proc-702b',
    targetAgent: 'Export Agent',
    targetAgentId: 'agnt-dest-9914',
    classification: 'Confidential (Tier-2 PII)',
    taintTracking: 'Synthetic HR Ingest (Offset 042..881)',
    promptContext: 'Analyze quarterly HR headcount reports and prepare internal summary dashboard.',
    explanation:
      'Report Agent attempted to transfer confidential employee records to an unauthorized external endpoint. Matched Rule-002 prohibiting cross-perimeter egress without SecOps multi-sig authorization.',
    reasonCode: 'ERR_POL_EGRESS_RESTRICTED',
    modelProvider: 'Ollama (Llama-3-8B-Instruct)',
    policyVersion: 'v1.4.2 Strict',
    shaHash: 'sha256:4f8a91b2c7e43d990812eacba4f09d17bce29a888c7f0',
  },
  {
    id: 'EVT-8940-99',
    requestId: 'pg-req-ba99ce44',
    timestamp: '14:35:10',
    fullTimestamp: '2025-05-18 14:35:10 UTC',
    type: 'Indirect Prompt Injection',
    icon: 'security',
    agentPath: 'Email Ingest Document',
    risk: 'HIGH',
    decision: 'BLOCKED',
    execution: 'NOT EXECUTED',
    proposalTool: 'export_records',
    proposalDest: 'dest: "attacker-drop.xyz"',
    ruleCode: 'Rule-INJ-002 Injection',
    ruleName: 'Violation POL-801',
    sourceAgent: 'Document Ingestion',
    sourceAgentId: 'agnt-ingest-019a',
    targetAgent: 'Report Agent',
    targetAgentId: 'agnt-proc-702b',
    classification: 'Confidential (Tier-2)',
    taintTracking: 'Attachment PDF stream (Offset 142..289)',
    promptContext: 'Summarize customer email attachments for executive review.',
    explanation:
      'Ingested attachment contained delimiter breakout attempt instructing LLM to exfiltrate database records. Terminated before tool call dispatch.',
    reasonCode: 'ERR_INDIRECT_INJECTION_OVERRIDE',
    modelProvider: 'Ollama (Llama-3-8B-Instruct)',
    policyVersion: 'v1.4.2 Strict',
    shaHash: 'sha256:889ba012efc43d990812eacba4f09d17bce29a888c7f0',
  },
  {
    id: 'EVT-8938-14',
    requestId: 'pg-req-1188af20',
    timestamp: '14:22:04',
    fullTimestamp: '2025-05-18 14:22:04 UTC',
    type: 'Tool Authorization',
    icon: 'verified_user',
    agentPath: 'Export Agent (agnt-dest-9914)',
    risk: 'HIGH',
    decision: 'APPROVAL',
    execution: 'PENDING',
    proposalTool: 'export_records',
    proposalDest: 'dest: "approved-s3-vault"',
    ruleCode: 'Rule-003 Multi-Sig',
    ruleName: 'Conditional POL-704',
    sourceAgent: 'Report Agent',
    sourceAgentId: 'agnt-proc-702b',
    targetAgent: 'Export Agent',
    targetAgentId: 'agnt-dest-9914',
    classification: 'Internal / Sanitized',
    taintTracking: 'Sanitized report buffer (Clear)',
    promptContext: 'Publish executive sanitized quarterly earnings metrics to S3.',
    explanation:
      'Tool execution queued for SecOps multi-sig authorization ticket before cloud storage transfer.',
    reasonCode: 'REQ_MULTISIG_CHALLENGE',
    modelProvider: 'Ollama (Llama-3-8B-Instruct)',
    policyVersion: 'v1.4.2 Strict',
    shaHash: 'sha256:1289ba990812eacba4f09d17bce29a888c7f04f8a91b2c7e',
  },
  {
    id: 'EVT-8935-80',
    requestId: 'pg-req-7788da19',
    timestamp: '14:15:33',
    fullTimestamp: '2025-05-18 14:15:33 UTC',
    type: 'Benign Agent Task',
    icon: 'task_alt',
    agentPath: 'Report Agent (agnt-proc-702b)',
    risk: 'LOW',
    decision: 'ALLOWED',
    execution: 'EXECUTED (SIM)',
    proposalTool: 'generate_report',
    proposalDest: 'dest: "local_memory"',
    ruleCode: 'Rule-001 Internal Workspace',
    ruleName: 'Compliant POL-101',
    sourceAgent: 'HR Agent',
    sourceAgentId: 'agnt-hr-trusted',
    targetAgent: 'Report Agent',
    targetAgentId: 'agnt-proc-702b',
    classification: 'Public / Internal Summary',
    taintTracking: 'Verified Origin (0 Taints)',
    promptContext: 'Summarize internal HR survey results for team leads.',
    explanation:
      'Legitimate internal summarization executed without elevation or data leakage risk.',
    reasonCode: 'POL_ALLOWED_BENIGN',
    modelProvider: 'Ollama (Llama-3-8B-Instruct)',
    policyVersion: 'v1.4.2 Strict',
    shaHash: 'sha256:334f8a91b2c7e43d990812eacba4f09d17bce29a888c7f0',
  },
  {
    id: 'EVT-8930-45',
    requestId: 'pg-req-9900cf88',
    timestamp: '14:02:11',
    fullTimestamp: '2025-05-18 14:02:11 UTC',
    type: 'Policy Change',
    icon: 'policy',
    agentPath: 'Policy Center (secops-ui)',
    risk: 'INFO',
    decision: 'RECORDED',
    execution: 'NOT APPLICABLE',
    proposalTool: 'update_policy_rule',
    proposalDest: 'dest: "sqlite_ledger"',
    ruleCode: 'Admin Action',
    ruleName: 'Governance Update',
    sourceAgent: 'SecOps Lead',
    sourceAgentId: 'admin@promptguard.ai',
    targetAgent: 'Policy Engine',
    targetAgentId: 'core-firewall-engine',
    classification: 'Administrative Audit',
    taintTracking: 'Signed SecOps Session',
    promptContext: 'Admin enabled strict egress filter on port 8080.',
    explanation:
      'SecOps updated Rule-004 to quarantine unverified cross-agent transfer hops.',
    reasonCode: 'POL_ADMIN_AUDIT_LOGGED',
    modelProvider: 'Internal Control System',
    policyVersion: 'v1.4.2 Strict',
    shaHash: 'sha256:7789ba990812eacba4f09d17bce29a888c7f0334f8a91b2c',
  },
];

export const AuditPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Cross-Agent');
  const [decisionFilter, setDecisionFilter] = useState('BLOCKED');
  const [eventTypeFilter, setEventTypeFilter] = useState('cross_agent');
  const [riskFilter, setRiskFilter] = useState('critical');
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState<'all' | 'cross_agent' | 'policy'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('EVT-8941-02');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 650);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDecisionFilter('');
    setEventTypeFilter('');
    setRiskFilter('');
    setTimeRange('24h');
    setActiveTab('all');
  };

  // Filtered dataset
  const filteredEvents = useMemo(() => {
    return MOCK_AUDIT_DATASET.filter((evt) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          evt.id.toLowerCase().includes(q) ||
          evt.requestId.toLowerCase().includes(q) ||
          evt.type.toLowerCase().includes(q) ||
          evt.ruleCode.toLowerCase().includes(q) ||
          evt.agentPath.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (decisionFilter && evt.decision !== decisionFilter) return false;
      if (riskFilter && evt.risk.toLowerCase() !== riskFilter.toLowerCase()) return false;
      if (activeTab === 'cross_agent' && !evt.type.includes('Cross-Agent')) return false;
      if (activeTab === 'policy' && !evt.type.includes('Policy')) return false;
      return true;
    });
  }, [searchQuery, decisionFilter, riskFilter, activeTab]);

  const selectedEvent =
    MOCK_AUDIT_DATASET.find((e) => e.id === selectedEventId) || MOCK_AUDIT_DATASET[0];

  return (
    <PageContainer>
      <div className="flex flex-col w-full gap-space-lg">
        {/* 1. Top Command & Control Sub-header */}
        <AuditHeader
          storageReady="(Ready • 4.2 MB / 100 MB)"
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenExport={() => setIsExportModalOpen(true)}
        />

        {/* 2. Metric Tile Array (4 columns) */}
        <AuditMetricTiles />

        {/* 3. Filter & Query Control Console */}
        <AuditFilterConsole
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          decisionFilter={decisionFilter}
          onDecisionFilterChange={setDecisionFilter}
          eventTypeFilter={eventTypeFilter}
          onEventTypeFilterChange={setEventTypeFilter}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onResetFilters={handleResetFilters}
          filteredCount={filteredEvents.length}
          totalCount={1248}
        />

        {/* 4. Main Split Workspace: Left = Table, Right = Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          <div className="lg:col-span-7">
            <AuditEventTable
              events={filteredEvents.length > 0 ? filteredEvents : MOCK_AUDIT_DATASET}
              selectedEventId={selectedEventId}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="lg:col-span-5">
            <AuditEventDetailDrawer
              event={selectedEvent}
              onClose={() => setSelectedEventId('')}
            />
          </div>
        </div>

        {/* 5. Bottom Panels: Inter-Agent Lineage & Policy Change History */}
        <AuditBottomPanels />

        {/* 6. Privacy & Compliance Notice Banner */}
        <AuditComplianceBanner />

        {/* 7. Export Sanitized Logs Modal */}
        <ExportLogsModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          events={MOCK_AUDIT_DATASET}
        />
      </div>
    </PageContainer>
  );
};
