import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { ModelProviderSection } from '../components/settings/ModelProviderSection';
import { DetectionComponentsSection } from '../components/settings/DetectionComponentsSection';
import { RuntimeSecurityControls } from '../components/settings/RuntimeSecurityControls';
import { RiskThresholdsSection } from '../components/settings/RiskThresholdsSection';
import { AuditStorageSection } from '../components/settings/AuditStorageSection';
import { SimulationSandboxSection } from '../components/settings/SimulationSandboxSection';
import { ConfigurationHistorySection } from '../components/settings/ConfigurationHistorySection';
import { SettingsComplianceFooter } from '../components/settings/SettingsComplianceFooter';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('18 mins ago by SecOps Admin');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setLastUpdated('Just now by Local User');
      showToast('Settings saved to local browser preferences. No backend endpoints exist.');
    }, 700);
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
    showToast('Discarded local changes.');
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
        <ModelProviderSection />
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
          <RiskThresholdsSection />
        </div>
        <div id="audit-storage-section" className="scroll-mt-24">
          <AuditStorageSection />
        </div>
      </div>

      {/* Row 4: Simulation Sandbox & Configuration History (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        <div id="simulation-sandbox-section" className="lg:col-span-7 scroll-mt-24">
          <SimulationSandboxSection />
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
