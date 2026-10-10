import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AnalysisHeader } from '../components/live-analysis/AnalysisHeader';
import { IncidentMetricCards } from '../components/live-analysis/IncidentMetricCards';
import { HeroWhyBlocked } from '../components/live-analysis/HeroWhyBlocked';
import { ProposedVsEnforced } from '../components/live-analysis/ProposedVsEnforced';
import { ForensicMetadataFooter } from '../components/live-analysis/ForensicMetadataFooter';
import { getAuditLogs, getAuditSummary, analyzeSecurityEvent } from '../lib/api';

export const AnalysisPage: React.FC = () => {
  const [requestId, setRequestId] = useState<string>('');
  const [advisoryText, setAdvisoryText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '24h' | 'custom'>('15m');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const [summary, setSummary] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [sumRes, logRes] = await Promise.all([
        getAuditSummary(),
        getAuditLogs({ page: 1, page_size: 50 })
      ]);
      setSummary(sumRes.data);
      setLogs(logRes.data.items || []);
      setError('');
    } catch (e) {
      console.error(e);
      setError('Connection error loading live data.');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleExportJson = () => {
    if (selectedEvent) {
      const blob = new Blob([JSON.stringify(selectedEvent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `security_event_${selectedEvent.event_id || 'export'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const selectedEvent = requestId 
    ? logs.find(l => l.event_id.includes(requestId) || l.request_id?.includes(requestId)) || logs[0]
    : logs[0];

  const handleAnalyze = async () => {
    if (!selectedEvent) return;
    setIsAnalyzing(true);
    try {
      const action = selectedEvent.action || selectedEvent.tool_name || 'Unknown Action';
      const target = selectedEvent.destination_agent || 'Unknown Target';
      const prompt_context = selectedEvent.safe_metadata || '{}';
      const res = await analyzeSecurityEvent(action, target, prompt_context);
      setAdvisoryText(res.data.advisory);
    } catch (e) {
      console.error(e);
      setAdvisoryText('Analysis failed: Backend or provider unavailable.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-on-surface p-4">Loading live data...</div>;
    }
    if (error && logs.length === 0) {
      return <div className="text-error p-4">{error}</div>;
    }
    if (logs.length === 0) {
      return <div className="text-on-surface-variant p-4">No security events found. System is monitoring.</div>;
    }

    let parsedPayload = {};
    try {
      if (selectedEvent.safe_metadata) {
        parsedPayload = JSON.parse(selectedEvent.safe_metadata);
      }
    } catch (e) {
      parsedPayload = { raw: selectedEvent.safe_metadata };
    }

    return (
      <>
        {/* 3. Hero Decision Card: WHY WAS THIS BLOCKED? */}
        <HeroWhyBlocked
          proposedAction={selectedEvent.action || 'Unknown'}
          sourceAgent={selectedEvent.source_agent || 'Unknown'}
          sourceAgentId={selectedEvent.agent_id || 'Unknown'}
          destination={selectedEvent.destination_agent || 'Unknown'}
          classification={selectedEvent.data_classification || 'Unknown'}
          taintedFieldsCount={0}
          violatedPolicy={selectedEvent.policy_decision === 'DENY' ? 'POLICY_VIOLATION' : 'N/A'}
          policyDescription={selectedEvent.reason_code || 'N/A'}
          authDecision={selectedEvent.policy_decision || 'N/A'}
          executionStatus={selectedEvent.execution_status || 'N/A'}
          detailedReason={selectedEvent.reason_code || 'No additional details provided.'}
          latencyText="Latency metrics unavailable"
        />

        {/* 4. Two-Column Comparison: Proposed Action vs Runtime Enforcement */}
        <ProposedVsEnforced
          toolName={selectedEvent.tool_name || 'N/A'}
          payloadArguments={parsedPayload}
          reasonCode={selectedEvent.reason_code || 'N/A'}
          authorizationDecision={selectedEvent.policy_decision || 'N/A'}
          executionStatus={selectedEvent.execution_status || 'N/A'}
          runtimeResult={selectedEvent.outcome || 'N/A'}
        />

        {/* AI Advisory Panel */}
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-on-surface">AI Security Advisory</h3>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Generate Advisory'}
            </button>
          </div>
          {advisoryText && (
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/20 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-primary text-[18px] inline-block align-middle mr-2">psychology</span>
              <span className="align-middle leading-relaxed">{advisoryText}</span>
            </div>
          )}
        </div>

        {/* 9. Forensic Metadata & Compliance Audit Record (Footer Grid) */}
        <ForensicMetadataFooter
          requestId={selectedEvent.request_id || selectedEvent.event_id || 'Unknown'}
          scenarioId="Unavailable"
          timestamp={new Date(selectedEvent.timestamp_utc).toLocaleString()}
          modelName="Unavailable"
          policyConfig={selectedEvent.policy_version || 'Unavailable'}
          executionMode="Live"
          reasonCode={selectedEvent.reason_code || 'N/A'}
          toolResult={selectedEvent.outcome || 'N/A'}
          onExportJson={handleExportJson}
        />
      </>
    );
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-space-lg w-full">
        {/* 1. Header & Live Search / Time Filter Controls */}
        <AnalysisHeader
          requestId={requestId}
          onRequestIdChange={setRequestId}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          incidentSignature={selectedEvent ? selectedEvent.event_id : "Awaiting Data"}
        />

        {/* 2. Incident Summary: 4 Compact Metric Tiles */}
        <IncidentMetricCards
          totalEvents={summary?.total_events || 0}
          policyDenials={summary?.policy_denials || 0}
          executionAttempts={summary?.execution_attempts || 0}
          deniedTransfers={summary?.denied_transfers || 0}
        />

        {renderContent()}
      </div>
    </PageContainer>
  );
};
