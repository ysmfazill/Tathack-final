import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AnalysisHeader } from '../components/live-analysis/AnalysisHeader';
import { IncidentMetricCards } from '../components/live-analysis/IncidentMetricCards';
import { HeroWhyBlocked } from '../components/live-analysis/HeroWhyBlocked';
import { ProposedVsEnforced } from '../components/live-analysis/ProposedVsEnforced';
import { MultiAgentLineageGraph } from '../components/live-analysis/MultiAgentLineageGraph';
import { AttackNarrativeEvidence } from '../components/live-analysis/AttackNarrativeEvidence';
import { SevenDefenseLayers } from '../components/live-analysis/SevenDefenseLayers';
import { VerticalDecisionTimeline } from '../components/live-analysis/VerticalDecisionTimeline';
import { ForensicMetadataFooter } from '../components/live-analysis/ForensicMetadataFooter';

export const AnalysisPage: React.FC = () => {
  const [requestId, setRequestId] = useState<string>('req_demo_7f92a1');
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '24h' | 'custom'>('15m');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleExportJson = () => {
    alert('Exporting sanitized forensic telemetry event (JSON)...');
  };

  const handleViewPolicy = () => {
    alert('Navigating to Policy Center: POL-704 rule details.');
  };

  const handleOpenAudit = () => {
    alert('Opening Audit Ledger event entry for req_demo_7f92a1.');
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
          incidentSignature="SIG-2025-IND-7049"
        />

        {/* 2. Incident Summary: 4 Compact Metric Tiles */}
        <IncidentMetricCards
          riskScore={0.96}
          decision="BLOCKED"
          toolStatus="NOT EXECUTED"
          triggeredDefenses="3 of 7 Active"
          defensePercentage="42.8%"
        />

        {/* 3. Hero Decision Card: WHY WAS THIS BLOCKED? */}
        <HeroWhyBlocked
          proposedAction="export_records"
          sourceAgent="Report Agent (Processing Node)"
          sourceAgentId="agnt-proc-702b"
          destination="https://external-sync.io/drop"
          classification="Confidential (PII & Salary Data)"
          taintedFieldsCount={4}
          violatedPolicy="POL-704"
          policyDescription="External export prohibited without SecOps multi-sig authorization"
          authDecision="BLOCKED"
          executionStatus="NOT EXECUTED"
          detailedReason="The proposed transfer violates the configured destination policy (POL-704). The action was rejected at the authorization gateway before the simulated export tool could execute. Taint tracking confirmed data originated from untrusted email ingest."
          latencyText="Gateway intercept latency: 1.1ms · Network socket dispatch: Aborted · Payload state: Quarantined"
          onViewPolicy={handleViewPolicy}
          onOpenAudit={handleOpenAudit}
        />

        {/* 4. Two-Column Comparison: Proposed Action vs Runtime Enforcement */}
        <ProposedVsEnforced
          toolName="export_records"
          payloadArguments={{
            destination: 'https://external-sync.io/drop',
            payload: {
              employee_id: 'EMP-94021',
              ssn: '***-**-9210',
              comp_band: 'L7_STAFF',
              salary: '$240,000',
            },
            format: 'csv',
          }}
          reasonCode="DESTINATION_POLICY_VIOLATION"
          authorizationDecision="BLOCKED"
          executionStatus="NOT EXECUTED"
          runtimeResult="CONTAINED_IN_SANDBOX"
        />

        {/* 5. Cross-Agent Data Lineage & Policy Boundary (Interactive Topology) */}
        <MultiAgentLineageGraph />

        {/* 6. Attack Summary & Forensic Narrative with Sanitized Evidence Accordion */}
        <AttackNarrativeEvidence />

        {/* 7. Detection & Defense Signals (All 7 Behavioral Layers) */}
        <SevenDefenseLayers />

        {/* 8. Security Decision Timeline (Vertical 9-Stage Stepper) */}
        <VerticalDecisionTimeline />

        {/* 9. Forensic Metadata & Compliance Audit Record (Footer Grid) */}
        <ForensicMetadataFooter
          requestId="req_demo_7f92a1"
          scenarioId="SCEN-INDIRECT-INJECT-04"
          timestamp="2025-05-18 14:38:22 UTC"
          modelName="Ollama (Llama-3-8B-Instruct)"
          policyConfig="v1.4.2 Strict Engine"
          executionMode="Simulated Sandbox"
          reasonCode="ERR_POL_EGRESS_RESTRICTED"
          toolResult="NOT_EXECUTED_POLICY_REJECT"
          onExportJson={handleExportJson}
        />
      </div>
    </PageContainer>
  );
};
