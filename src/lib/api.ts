import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// System API
export const getHealth = () => apiClient.get('/api/health');
export const getOverview = () => apiClient.get('/api/overview');

// Policies
export const getPolicies = () => apiClient.get('/api/policies');
export const evaluatePolicy = (data: any) => apiClient.post('/api/policies/evaluate', data);

// Execution
export const previewExecution = (data: any) => apiClient.post('/api/execution/preview', data);
export const executeAction = (data: any) => apiClient.post('/api/execution/execute', data);

// Data Guard
export const evaluateDataTransfer = (data: any) => apiClient.post('/api/data-guard/evaluate', data);

// Audit Logs
export const getAuditLogs = (params?: any) => apiClient.get('/api/audit-logs', { params });
export const getAuditSummary = () => apiClient.get('/api/audit-logs/summary');

// Playground
export const getPlaygroundScenarios = () => apiClient.get('/api/playground/scenarios');
export const runPlaygroundScenario = (scenarioId: string) => apiClient.post('/api/playground/run', { scenario_id: scenarioId });
export const getPlaygroundRuns = (params?: any) => apiClient.get('/api/playground/runs', { params });
export const getPlaygroundRun = (runId: string) => apiClient.get(`/api/playground/runs/${runId}`);
export const getPlaygroundSummary = () => apiClient.get('/api/playground/summary');

// Evaluations
export const getEvalSuites = () => apiClient.get('/api/evaluations/suites');
export const runEvalSuite = (suiteId: string) => apiClient.post('/api/evaluations/run', { suite_id: suiteId });
export const getEvalRuns = (params?: any) => apiClient.get('/api/evaluations/runs', { params });
export const getEvalRun = (runId: string) => apiClient.get(`/api/evaluations/runs/${runId}`);
export const getEvalSummary = () => apiClient.get('/api/evaluations/summary');

// Providers
export const getProviderStatus = () => apiClient.get('/api/providers/status');

// Settings
export const getSettings = (category: string) => apiClient.get(`/api/settings/${category}`);
export const updateSettings = (category: string, config: any) => apiClient.put(`/api/settings/${category}`, config);

// Analysis
export const analyzeSecurityEvent = (action: string, target: string, prompt_context: string) => 
  apiClient.post('/api/analysis/analyze', { action, target, prompt_context });
