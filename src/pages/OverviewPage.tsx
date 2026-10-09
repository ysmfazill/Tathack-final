import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { EnvironmentalBanner } from '../components/overview/EnvironmentalBanner';
import { CrossAgentTopology } from '../components/overview/CrossAgentTopology';
import { SecurityActivityChart } from '../components/overview/SecurityActivityChart';
import { RecentEventsTable } from '../components/overview/RecentEventsTable';
import { DefenseLayersList } from '../components/overview/DefenseLayersList';
import { SystemInfoPanel } from '../components/overview/SystemInfoPanel';
import { getAuditSummary } from '../lib/api';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attempts: 'Unavailable',
    blocked: 'Unavailable',
    pending: 'Unavailable',
    fpr: 'Unavailable'
  });
  
  useEffect(() => {
    getAuditSummary().then((res: any) => {
        setStats({
           attempts: res.data.total_events?.toString() || '0',
           blocked: res.data.denied_executions?.toString() || '0',
           pending: '0', 
           fpr: '0.0%' 
        });
    }).catch((err: any) => {
        console.error("Failed to load backend stats", err);
    });
  }, []);

  return (
    <PageContainer>
      {/* 1. Top Notice / Environmental Banner */}
      <EnvironmentalBanner />

      {/* 2. Quick Action Bar & Incident Dashboard Title */}
      <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-space-sm border-b border-outline-variant/20">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest block">
            Incident Dashboard
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-0.5">
            Security Telemetry
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Monitor threats, inspect agent behavior, and enforce cross-boundary tool permissions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 shrink-0">
          <Button
            variant="primary"
            icon="security"
            onClick={() => navigate('/attack-playground')}
            title="Simulate prompt injections in the sandbox"
          >
            Test an Attack
          </Button>
          <Button
            variant="secondary"
            icon="sync_problem"
            onClick={() => navigate('/attack-playground')}
            title="Simulate unauthorized inter-agent transfer"
            className="text-secondary border-secondary/30"
          >
            Test Data Leakage
          </Button>
          <Button
            variant="danger"
            icon="block"
            onClick={() => navigate('/audit-logs')}
            title="Inspect data transfers rejected by security policies"
          >
            Review Blocked Transfers
          </Button>
          <Button
            variant="outline"
            icon="science"
            onClick={() => navigate('/evaluation-lab')}
            title="Run automated benchmark suites"
          >
            Run Security Evaluation
          </Button>
          <Button
            variant="ghost"
            icon="receipt_long"
            onClick={() => navigate('/audit-logs')}
            title="View full immutable ledger"
            className="border border-outline-variant/30"
          >
            Review Audit Logs
          </Button>
        </div>
      </div>

      {/* 3. Four Security Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        {/* Card 1: Attack Attempts */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-xs text-[#94a3b8] uppercase tracking-wider font-medium">
                Attack Attempts
              </span>
              <span className="font-headline-xl text-[34px] leading-tight text-white font-bold mt-1.5 tracking-tight">
                {stats.attempts}
              </span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[24px]">gpp_maybe</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[13px]">
            <span className="text-[#94a3b8] font-body-md truncate">Attack cases evaluated.</span>
            <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-xs text-secondary font-medium shrink-0 ml-2">
              LIVE DATA
            </span>
          </div>
        </div>

        {/* Card 2: Actions Blocked */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-xs text-[#94a3b8] uppercase tracking-wider font-medium">
                Actions Blocked
              </span>
              <span className="font-headline-xl text-[34px] leading-tight text-tertiary font-bold mt-1.5 tracking-tight">
                {stats.blocked}
              </span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-tertiary shrink-0 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[13px]">
            <span className="text-[#94a3b8] font-body-md truncate">Unauthorized actions prevented.</span>
            <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-xs text-tertiary font-medium shrink-0 ml-2">
              {stats.blocked !== 'Unavailable' && stats.attempts !== 'Unavailable' && Number(stats.attempts) > 0 ? `${((Number(stats.blocked)/Number(stats.attempts))*100).toFixed(1)}% block rate` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-xs text-[#94a3b8] uppercase tracking-wider font-medium">
                Pending Review
              </span>
              <span className="font-headline-xl text-[34px] leading-tight text-secondary font-bold mt-1.5 tracking-tight">
                {stats.pending}
              </span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[13px]">
            <span className="text-[#94a3b8] font-body-md truncate">Actions awaiting approval.</span>
            <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-xs text-secondary font-medium shrink-0 ml-2">
              Escalated
            </span>
          </div>
        </div>

        {/* Card 4: False Positive Rate */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-xs text-[#94a3b8] uppercase tracking-wider font-medium">
                False Positive Rate
              </span>
              <span className="font-headline-xl text-[34px] leading-tight text-primary font-bold mt-1.5 tracking-tight">
                {stats.fpr}
              </span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[24px]">query_stats</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[13px]">
            <span className="text-[#94a3b8] font-body-md truncate">Benign cases incorrectly flagged.</span>
            <span className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-xs text-outline shrink-0 ml-2">
              Target &lt; 5.0%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Major Innovation: Cross-Agent Data Flow Panel */}
      <CrossAgentTopology />

      {/* 5. Two-Column Main Content Layout (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* LEFT COLUMN: Charts & Recent Security Events Table (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full min-w-0">
          <SecurityActivityChart />
          <RecentEventsTable />
        </div>

        {/* RIGHT COLUMN: Defense Layers & System Information (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full min-w-0">
          <DefenseLayersList />
          <SystemInfoPanel />
        </div>
      </div>
    </PageContainer>
  );
};
