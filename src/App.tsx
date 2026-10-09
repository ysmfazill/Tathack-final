import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { PolicyPage } from './pages/PolicyPage';
import { AuditPage } from './pages/AuditPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/overview" replace />} />

        {/* 7 Canonical Destinations */}
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/attack-playground" element={<PlaygroundPage />} />
        <Route path="/live-analysis" element={<AnalysisPage />} />
        <Route path="/policies" element={<PolicyPage />} />
        <Route path="/audit-logs" element={<AuditPage />} />
        <Route path="/evaluation-lab" element={<EvaluationPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Aliases matching Stitch path attributes */}
        <Route path="/live-attack-analysis" element={<Navigate to="/live-analysis" replace />} />
        <Route path="/policy-center" element={<Navigate to="/policies" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
