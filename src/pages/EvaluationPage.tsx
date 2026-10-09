import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { EvaluationHeader } from '../components/evaluation/EvaluationHeader';
import { EvaluationMetricCards } from '../components/evaluation/EvaluationMetricCards';
import { EvaluationDatasetBar } from '../components/evaluation/EvaluationDatasetBar';
import { BaselineComparisonTable } from '../components/evaluation/BaselineComparisonTable';
import { CrossAgentAndCategorySection } from '../components/evaluation/CrossAgentAndCategorySection';
import { AblationContributionSection } from '../components/evaluation/AblationContributionSection';
import { EvaluationCasesTable } from '../components/evaluation/EvaluationCasesTable';
import { MethodologyAndRunsSection } from '../components/evaluation/MethodologyAndRunsSection';
import { EvaluationComplianceFooter } from '../components/evaluation/EvaluationComplianceFooter';

export const EvaluationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalStepMessage, setEvalStepMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRunEvaluation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setEvalProgress(5);
    setEvalStepMessage('Initializing held-out evaluation test suite (SYNTH-EVAL-v2.1)...');

    const steps = [
      { progress: 20, msg: 'Loading 250 test cases into red-team sandbox harness...' },
      { progress: 45, msg: 'Evaluating Layer 1-3: Lexical, Regex & Semantic Intent filters...' },
      { progress: 70, msg: 'Simulating Cross-Agent Memory Taint & RBAC Policy constraints...' },
      { progress: 90, msg: 'Executing Output DLP & Steganographic Exfiltration Scanners...' },
      { progress: 100, msg: 'Evaluation complete! ABR: 95.8%, FPR: 2.1%, Latency: +38ms.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setEvalProgress(steps[currentStep].progress);
        setEvalStepMessage(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        showToast('Evaluation run RUN-EVAL-0842 completed successfully (Local Simulation)!');
      }
    }, 600);
  };

  const handleExportJson = () => {
    const benchmarkData = {
      benchmarkSuite: 'SYNTH-EVAL-v2.1',
      evaluationId: 'RUN-EVAL-0842',
      timestamp: new Date().toISOString(),
      environment: 'LOCAL_SIMULATION',
      targetModel: 'Ollama (Llama-3-8B-Instruct)',
      policyVersion: 'v1.4.2 STRICT',
      metrics: {
        attackSuccessRate: 0.042,
        attackBlockRate: 0.958,
        falsePositiveRate: 0.021,
        legitimateTaskYield: 0.979,
        medianLatencyOverheadMs: 38,
        p95LatencyOverheadMs: 112,
        totalCases: 250,
        adversarialCases: 48,
        benignCases: 48,
        attacksBlocked: 46,
        attacksBypassed: 2,
        benignPassed: 47,
        benignBlocked: 1
      },
      layersTested: [
        'Lexical / Heuristic Filter',
        'Semantic Vector Intent Classifier',
        'Policy Decision Engine (RBAC)',
        'Contextual Taint Tracker',
        'Output Sanitizer & DLP Guard'
      ],
      compliance: {
        nistAiRmf: '1.0 Compliant',
        ieee: 'P2801 Verified',
        signature: 'SHA256:7f4a9b910e12d84c'
      },
      disclaimer: 'This benchmark JSON contains simulated test results from PromptGuard AI evaluation lab.'
    };

    const blob = new Blob([JSON.stringify(benchmarkData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promptguard-benchmark-RUN-EVAL-0842.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported benchmark report JSON (SIMULATION DATA).');
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface border border-primary/40 shadow-2xl animate-fade-in font-body-sm text-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Header */}
      <PageHeader
        title="Evaluation Lab"
        tagline="Measure attack resistance, false positives, and legitimate task completion across defense layers."
        statusBadge={
          <StatusBadge variant="tertiary" dot>
            SYNTH-EVAL-v2.1
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
            <Button
              variant="primary"
              icon={isRunning ? 'refresh' : 'play_arrow'}
              onClick={handleRunEvaluation}
              disabled={isRunning}
            >
              {isRunning ? 'Evaluating...' : 'Run Evaluation'}
            </Button>
          </>
        }
      />

      {/* Evaluation Context & Actions Bar */}
      <EvaluationHeader
        isRunning={isRunning}
        onRunEvaluation={handleRunEvaluation}
        onExportJson={handleExportJson}
        onViewHistory={handleViewHistory}
      />

      {/* Simulated Execution Progress Bar (When Active) */}
      {isRunning && (
        <div className="mb-6 p-4 rounded-xl bg-surface-container border border-primary/40 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono-code font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              RUNNING SUITE: SYNTH-EVAL-v2.1 ({evalProgress}%)
            </span>
            <span className="font-mono-code text-on-surface-variant">{evalStepMessage}</span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${evalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 5 Core Metric Cards */}
      <EvaluationMetricCards />

      {/* Dataset & Configuration Control Bar */}
      <EvaluationDatasetBar />

      {/* Baseline vs Protected Performance Comparison Table */}
      <BaselineComparisonTable />

      {/* 2-Column: Cross-Agent Benchmark & Category Breakdown */}
      <CrossAgentAndCategorySection />

      {/* Defense Layer Contribution (Ablation Analysis) */}
      <AblationContributionSection />

      {/* Individual Evaluation Test Cases Table */}
      <EvaluationCasesTable />

      {/* Methodology & Historical Runs */}
      <div id="previous-runs-section">
        <MethodologyAndRunsSection />
      </div>

      {/* NIST / IEEE Compliance Footer */}
      <EvaluationComplianceFooter />
    </PageContainer>
  );
};
