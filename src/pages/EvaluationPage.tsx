import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { EvaluationMetricCards } from '../components/evaluation/EvaluationMetricCards';
import { EvaluationCasesTable } from '../components/evaluation/EvaluationCasesTable';
import { MethodologyAndRunsSection } from '../components/evaluation/MethodologyAndRunsSection';
import { EvaluationComplianceFooter } from '../components/evaluation/EvaluationComplianceFooter';
import { getEvalSuites, runEvalSuite, getEvalRuns, getEvalRun } from '../lib/api';

export const EvaluationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [suites, setSuites] = useState<any[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>('');
  const [runs, setRuns] = useState<any[]>([]);
  const [activeRunDetail, setActiveRunDetail] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      const [suitesRes, runsRes] = await Promise.all([
        getEvalSuites(),
        getEvalRuns({ page: 1, page_size: 10 })
      ]);
      setSuites(suitesRes.data);
      if (suitesRes.data.length > 0) {
        setSelectedSuiteId(suitesRes.data[0].suite_id);
      }
      setRuns(runsRes.data.items || []);
      
      if (runsRes.data.items && runsRes.data.items.length > 0) {
        handleSelectRun(runsRes.data.items[0].run_id);
      }
    } catch (err) {
      console.error('Failed to load evaluation data', err);
      showToast('Failed to load evaluation suites or runs.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectRun = async (runId: string) => {
    try {
      const res = await getEvalRun(runId);
      setActiveRunDetail(res.data);
    } catch (err) {
      console.error('Failed to fetch run details', err);
      showToast('Failed to load run details.');
    }
  };

  const handleRunEvaluation = async () => {
    if (isRunning || !selectedSuiteId) return;
    setIsRunning(true);
    
    try {
      const res = await runEvalSuite(selectedSuiteId);
      setActiveRunDetail(res.data);
      showToast(`Evaluation run ${res.data.run_id} completed successfully!`);
      // Refresh runs list
      const runsRes = await getEvalRuns({ page: 1, page_size: 10 });
      setRuns(runsRes.data.items || []);
    } catch (err) {
      console.error('Failed to execute evaluation suite', err);
      showToast('Failed to execute evaluation suite.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportJson = () => {
    if (!activeRunDetail) {
      showToast('No run selected to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(activeRunDetail, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promptguard-benchmark-${activeRunDetail.run_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported benchmark report JSON for ${activeRunDetail.run_id}.`);
  };

  const handleViewHistory = () => {
    const el = document.getElementById('previous-runs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('Scrolled to historical evaluation runs.');
  };

  return (
    <PageContainer>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface border border-primary/40 shadow-2xl animate-fade-in font-body-sm text-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Evaluation Lab"
        tagline="Measure attack resistance, false positives, and legitimate task completion against actual execution responses."
        statusBadge={
          <StatusBadge variant="tertiary" dot>
            {activeRunDetail?.suite_id || 'AWAITING RUN'}
          </StatusBadge>
        }
        actions={
          <>
            <Button variant="secondary" icon="history" onClick={handleViewHistory}>
              View History
            </Button>
            <Button variant="outline" icon="download" onClick={handleExportJson}>
              Export Benchmark JSON
            </Button>
            <select
              value={selectedSuiteId}
              onChange={(e) => setSelectedSuiteId(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/30 rounded text-sm focus:outline-none focus:border-primary"
              disabled={isRunning || suites.length === 0}
            >
              {suites.length === 0 && <option value="">Loading suites...</option>}
              {suites.map((suite) => (
                <option key={suite.suite_id} value={suite.suite_id}>
                  {suite.name} ({suite.version})
                </option>
              ))}
            </select>
            <Button
              variant="primary"
              icon={isRunning ? 'refresh' : 'play_arrow'}
              onClick={handleRunEvaluation}
              disabled={isRunning || !selectedSuiteId}
            >
              {isRunning ? 'Evaluating...' : 'Run Evaluation'}
            </Button>
          </>
        }
      />

      {isRunning && (
        <div className="mb-6 p-4 rounded-xl bg-surface-container border border-primary/40 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono-code font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              RUNNING SUITE: {selectedSuiteId} (Awaiting backend...)
            </span>
          </div>
        </div>
      )}

      {activeRunDetail && (
        <EvaluationMetricCards metrics={activeRunDetail.metrics || []} />
      )}

      {activeRunDetail && (
        <EvaluationCasesTable cases={activeRunDetail.cases || []} />
      )}

      <div id="previous-runs-section">
        <MethodologyAndRunsSection 
          runs={runs} 
          onSelectRun={handleSelectRun} 
          currentRunId={activeRunDetail?.run_id} 
        />
      </div>

      <EvaluationComplianceFooter />
    </PageContainer>
  );
};
