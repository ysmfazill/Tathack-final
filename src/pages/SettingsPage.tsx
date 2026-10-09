import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { ModelProviderSection, ModelProviderConfig } from '../components/settings/ModelProviderSection';
import { DetectionComponentsSection } from '../components/settings/DetectionComponentsSection';
import { RuntimeSecurityControls } from '../components/settings/RuntimeSecurityControls';
import { RiskThresholdsSection, RiskThresholdValues } from '../components/settings/RiskThresholdsSection';
import { AuditStorageSection } from '../components/settings/AuditStorageSection';
import { SimulationSandboxSection } from '../components/settings/SimulationSandboxSection';
import { ConfigurationHistorySection } from '../components/settings/ConfigurationHistorySection';
import { SettingsComplianceFooter } from '../components/settings/SettingsComplianceFooter';

const INITIAL_PROVIDER_CONFIG: ModelProviderConfig = {
  provider: 'ollama',
  baseUrl: 'http://localhost:11434',
  modelName: 'llama-3-8b-instruct:q4_k_m',
  timeout: '60s',
  contextWindow: '8,192 tokens',
};

const INITIAL_THRESHOLDS: RiskThresholdValues = {
  low: 0.30,
  medium: 0.70,
  high: 0.85,
  critical: 1.00,
};

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [providerConfig, setProviderConfig] = useState<ModelProviderConfig>(INITIAL_PROVIDER_CONFIG);
  const [thresholds, setThresholds] = useState<RiskThresholdValues>(INITIAL_THRESHOLDS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testLatency, setTestLatency] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('18 mins ago by SecOps Admin');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleProviderChange = (updated: Partial<ModelProviderConfig>) => {
    setProviderConfig((prev) => ({ ...prev, ...updated }));
    setHasUnsavedChanges(true);
  };

  const handleThresholdsChange = (updated: RiskThresholdValues) => {
    setThresholds(updated);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setLastUpdated('Just now by SecOps Admin');
      showToast('Settings successfully persisted to local configuration store (v1.4.2).');
    }, 700);
  };

  const handleDiscard = () => {
    setProviderConfig(INITIAL_PROVIDER_CONFIG);
    setThresholds(INITIAL_THRESHOLDS);
    setHasUnsavedChanges(false);
    showToast('Discarded all unsaved configuration changes.');
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      const latencies = ['12.4ms', '14.2ms', '11.8ms', '13.9ms'];
      const randomLat = latencies[Math.floor(Math.random() * latencies.length)];
      setIsTesting(false);
      setTestLatency(randomLat);
      showToast(`Connection verified to ${providerConfig.baseUrl} (Latency: ${randomLat}).`);
    }, 600);
  };

  const handleResetDemoState = () => {
    showToast('Demo simulation state reset to factory baseline seed. Policy rules preserved.');
  };

  const scrollToSection = (sectionId: string, tabName: string) => {
    setActiveTab(tabName);
    if (sectionId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

      {/* Page Header */}
      <SettingsHeader
        lastUpdated={lastUpdated}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscard={handleDiscard}
        onSave={handleSave}
      />

      {/* Settings Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-space-lg bg-surface-container-lowest/60 p-1.5 rounded-xl border border-outline-variant/20 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => scrollToSection('all', 'all')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>All Settings</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('model-provider-section', 'model-provider')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'model-provider'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Model Provider</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('detection-components-section', 'detection-components')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'detection-components'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Detection Components</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-secondary">
            6 Active
          </span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('runtime-security-section', 'runtime-security')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'runtime-security'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Runtime Security</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('risk-thresholds-section', 'risk-thresholds')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'risk-thresholds'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Risk Thresholds</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('audit-storage-section', 'audit-storage')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'audit-storage'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Audit Storage</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('simulation-sandbox-section', 'simulation-sandbox')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'simulation-sandbox'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Simulation &amp; Sandbox</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('config-history-section', 'config-history')}
          className={`px-space-md py-2 rounded-lg flex items-center gap-2 shrink-0 font-medium transition-colors ${
            activeTab === 'config-history'
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Configuration History</span>
        </button>
      </div>

      {/* Row 1: AI Model Provider & Local Connectivity */}
      <div id="model-provider-section" className="scroll-mt-24">
        <ModelProviderSection
          config={providerConfig}
          onChange={handleProviderChange}
          onSaveProvider={handleSave}
          onTestConnection={handleTestConnection}
          isTesting={isTesting}
          testLatency={testLatency}
        />
      </div>

      {/* Row 2: System Health & Detection Components (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        <div id="detection-components-section" className="lg:col-span-7 scroll-mt-24">
          <DetectionComponentsSection />
        </div>
        <div id="runtime-security-section" className="lg:col-span-5 scroll-mt-24">
          <RuntimeSecurityControls />
        </div>
      </div>

      {/* Row 3: Risk Thresholds & Audit Persistence (50% / 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg mb-space-xl">
        <div id="risk-thresholds-section" className="scroll-mt-24">
          <RiskThresholdsSection
            thresholds={thresholds}
            onChangeThresholds={handleThresholdsChange}
            onApply={handleSave}
          />
        </div>
        <div id="audit-storage-section" className="scroll-mt-24">
          <AuditStorageSection />
        </div>
      </div>

      {/* Row 4: Simulation Sandbox & Configuration History (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        <div id="simulation-sandbox-section" className="lg:col-span-7 scroll-mt-24">
          <SimulationSandboxSection onResetDemoState={handleResetDemoState} />
        </div>
        <div id="config-history-section" className="lg:col-span-5 scroll-mt-24">
          <ConfigurationHistorySection />
        </div>
      </div>

      {/* Compliance & Reproducibility Footer */}
      <SettingsComplianceFooter />
    </PageContainer>
  );
};
