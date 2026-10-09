import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { getSettings, updateSettings, getProviderStatus } from '../../lib/api';

export interface ModelProviderConfig {
  provider_name: string;
  endpoint_url: string;
  model_name: string;
  enabled: boolean;
}

interface ModelProviderSectionProps {
  config?: any; // Kept for legacy compatibility if needed
}

export const ModelProviderSection: React.FC<ModelProviderSectionProps> = () => {
  const [config, setConfig] = useState<ModelProviderConfig>({
    provider_name: 'ollama',
    endpoint_url: 'http://127.0.0.1:11434',
    model_name: 'llama3.2',
    enabled: true
  });
  
  const [status, setStatus] = useState<any>({
    status: 'NOT_CONFIGURED',
    error_code: null
  });
  
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadConfig = async () => {
    try {
      const res = await getSettings('provider');
      setConfig(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const res = await getProviderStatus();
      setStatus(res.data);
    } catch (e) {
      console.error(e);
      setStatus({ status: 'INFERENCE_ERROR', error_code: 'Backend communication failed' });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    loadConfig();
    testConnection();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('provider', config);
      await testConnection();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card elevation="low" className="p-space-lg mb-space-xl border border-outline-variant/30">
      {/* Card Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">hub</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              AI Model Provider
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
            Configure autonomous agent model inference endpoint and parameters.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`font-label-caps text-label-caps px-2.5 py-1 rounded border font-semibold ${
            status.status === 'CONNECTED' 
              ? 'bg-secondary-container/20 text-secondary border-secondary/30'
              : 'bg-error-container/20 text-error border-error/30'
          }`}>
            {status.status}
          </span>
        </div>
      </div>

      {status.error_code && (
        <div className="bg-error-container/10 p-4 rounded-xl border border-error/30 text-xs text-error mb-space-md">
          <strong>Error:</strong> {status.error_code}
        </div>
      )}

      {/* Provider Selector (Ollama only active) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        <div className="rounded-xl p-space-md flex flex-col justify-between bg-surface-container border border-primary/40 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">laptop_chromebook</span>
              </div>
              <div>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold leading-tight">
                  Ollama
                </span>
                <span className="block font-mono-code text-[11px] text-on-surface-variant">Local Engine</span>
              </div>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs">
            Zero-socket egress. Supported.
          </p>
        </div>

        <div className="rounded-xl p-space-md flex flex-col justify-between bg-surface-container border border-outline-variant/30 opacity-60 pointer-events-none grayscale">
          <div className="flex items-start justify-between gap-2 mb-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold leading-tight">
                  Groq LPU
                </span>
                <div className="font-mono-code text-[11px] text-on-surface-variant">Cloud Low-Latency</div>
              </div>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs">
            Remote LPU clusters. (Not configured)
          </p>
        </div>

        <div className="rounded-xl p-space-md flex flex-col justify-between bg-surface-container border border-outline-variant/30 opacity-60 pointer-events-none grayscale">
          <div className="flex items-start justify-between gap-2 mb-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold leading-tight">
                  Google Gemini
                </span>
                <div className="font-mono-code text-[11px] text-on-surface-variant">Multimodal Engine</div>
              </div>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs">
            Complex agentic reasoning. (Not configured)
          </p>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-space-md mb-space-md border border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[10px]">API Base URL</label>
            <input 
              className="w-full bg-surface-container-lowest py-2 px-3 rounded-lg text-sm text-on-surface" 
              type="text" 
              value={config.endpoint_url} 
              onChange={e => setConfig({...config, endpoint_url: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[10px]">Model Name</label>
            <input 
              className="w-full bg-surface-container-lowest py-2 px-3 rounded-lg text-sm text-on-surface" 
              type="text" 
              value={config.model_name} 
              onChange={e => setConfig({...config, model_name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1.5 opacity-50">
            <label className="font-label-caps text-[10px]">Timeout</label>
            <input disabled className="w-full bg-surface-container-lowest py-2 px-3 rounded-lg text-sm" type="text" value="15s" />
          </div>
          <div className="flex flex-col gap-1.5 opacity-50">
            <label className="font-label-caps text-[10px]">Context Window</label>
            <input disabled className="w-full bg-surface-container-lowest py-2 px-3 rounded-lg text-sm" type="text" value="8,192 tokens" />
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/20">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${status.status === 'CONNECTED' ? 'bg-secondary' : 'bg-error'}`}></span>
            <span className={`font-mono-code text-xs font-semibold ${status.status === 'CONNECTED' ? 'text-secondary' : 'text-error'}`}>
              {status.status === 'CONNECTED' ? 'CONNECTED • INFERENCE VERIFIED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button variant="secondary" size="sm" onClick={testConnection} disabled={isTesting || isSaving}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={isTesting || isSaving}>
            {isSaving ? 'Saving...' : 'Save Provider Config'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
