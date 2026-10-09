import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AuditHeader } from '../components/audit/AuditHeader';
import { AuditMetricTiles } from '../components/audit/AuditMetricTiles';
import { AuditFilterConsole } from '../components/audit/AuditFilterConsole';
import { AuditEventTable, AuditEventItem } from '../components/audit/AuditEventTable';
import { AuditEventDetailDrawer } from '../components/audit/AuditEventDetailDrawer';
import { AuditBottomPanels } from '../components/audit/AuditBottomPanels';
import { AuditComplianceBanner } from '../components/audit/AuditComplianceBanner';
import { ExportLogsModal } from '../components/audit/ExportLogsModal';
import { getAuditLogs } from '../lib/api';

export const AuditPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState<'all' | 'cross_agent' | 'policy'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>([]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getAuditLogs();
      const mappedEvents: AuditEventItem[] = res.data.items.map((e: any) => ({
        id: e.event_id,
        requestId: e.request_id || e.event_id,
        timestamp: e.timestamp_utc.split('T')[1] || e.timestamp_utc,
        fullTimestamp: e.timestamp_utc,
        type: e.event_type,
        icon: 'security',
        agentPath: e.agent_id || e.source_agent || 'Unknown',
        risk: e.policy_decision === 'DENY' ? 'HIGH' : 'LOW',
        decision: e.policy_decision === 'DENY' ? 'BLOCKED' : (e.policy_decision || 'N/A'),
        execution: e.execution_status || 'N/A',
        proposalTool: e.tool_name || 'N/A',
        proposalDest: e.destination_agent || 'N/A',
        ruleCode: e.reason_code || 'N/A',
        ruleName: 'Backend Rule',
        sourceAgent: e.source_agent || e.agent_id || 'System',
        sourceAgentId: e.source_agent || e.agent_id || 'System',
        targetAgent: e.destination_agent || 'None',
        targetAgentId: e.destination_agent || 'None',
        classification: e.data_classification || 'N/A',
        taintTracking: e.safe_metadata || 'None',
        promptContext: e.action || 'None',
        explanation: e.reason_code || 'No explanation provided.',
        reasonCode: e.reason_code || 'NONE',
        modelProvider: 'System Engine',
        policyVersion: e.policy_version || '1.0',
        shaHash: e.event_id
      }));
      setAuditEvents(mappedEvents);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
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
    return auditEvents.filter((evt) => {
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
  }, [searchQuery, decisionFilter, riskFilter, activeTab, auditEvents]);

  const selectedEvent =
    auditEvents.find((e) => e.id === selectedEventId) || auditEvents[0];

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
              events={filteredEvents.length > 0 ? filteredEvents : auditEvents}
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
          events={auditEvents}
        />
      </div>
    </PageContainer>
  );
};
