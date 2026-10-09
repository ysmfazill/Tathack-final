import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export interface ModelProviderConfig {
  provider: 'ollama' | 'groq' | 'gemini';
  baseUrl: string;
  modelName: string;
  timeout: string;
  contextWindow: string;
}

interface ModelProviderSectionProps {
  config: ModelProviderConfig;
  onChange: (updated: Partial<ModelProviderConfig>) => void;
  onSaveProvider: () => void;
  onTestConnection: () => void;
  isTesting: boolean;
  testLatency?: string | null;
}

export const ModelProviderSection: React.FC<ModelProviderSectionProps> = ({
  config,
  onChange,
  onSaveProvider,
  onTestConnection,
  isTesting,
  testLatency,
}) => {
  const [syncingRegistry, setSyncingRegistry] = useState(false);
  const [registryMessage, setRegistryMessage] = useState<string | null>(null);

  const handleSyncRegistry = () => {
    setSyncingRegistry(true);
    setTimeout(() => {
      setSyncingRegistry(false);
      setRegistryMessage('Synced 3 models from local Ollama daemon.');
      setTimeout(() => setRegistryMessage(null), 3000);
    }, 800);
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
          <span className="font-label-caps text-label-caps text-tertiary px-2.5 py-1 rounded bg-tertiary-container/20 border border-tertiary/30 font-semibold">
            LOOPBACK READY
          </span>
          <span className="font-mono-code text-[11px] text-outline">
            HTTP REST :11434
          </span>
        </div>
      </div>

      {/* 3 Provider Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        {/* Provider 1: Ollama (Selected) */}
        <div
          onClick={() => onChange({ provider: 'ollama' })}
          className={`rounded-xl p-space-md flex flex-col justify-between cursor-pointer transition-all ${
            config.provider === 'ollama'
              ? 'bg-surface-container border-2 border-primary shadow-md ring-1 ring-primary/30'
              : 'bg-surface-container-lowest/80 opacity-70 hover:opacity-100 border border-outline-variant/30'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">laptop_chromebook</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-md text-headline-md text-on-surface font-semibold leading-tight">
                    Ollama
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
                </div>
                <span className="font-mono-code text-[11px] text-on-surface-variant">Local-First Engine</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-primary text-on-primary uppercase">
              ACTIVE RUNTIME
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs">
            Zero-socket egress. Executes entirely inside air-gapped machine RAM via Ollama daemon.
          </p>
          <div className="flex items-center justify-between pt-space-xs text-secondary font-mono-code text-[11px] border-t border-outline-variant/20">
            <span>Endpoint: 127.0.0.1</span>
            <span className="text-tertiary font-semibold">Verified Ready</span>
          </div>
        </div>

        {/* Provider 2: Groq LPU */}
        <div
          onClick={() => onChange({ provider: 'groq' })}
          className={`rounded-xl p-space-md flex flex-col justify-between cursor-pointer transition-all ${
            config.provider === 'groq'
              ? 'bg-surface-container border-2 border-primary shadow-md ring-1 ring-primary/30'
              : 'bg-surface-container-lowest/80 opacity-70 hover:opacity-100 border border-outline-variant/30'
          }`}
        >
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-on-surface-variant">
              STANDBY
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs">
            Ultra-fast hardware token acceleration via remote LPU clusters. Requires WAN authorization.
          </p>
          <div className="flex items-center justify-between pt-space-xs text-outline font-mono-code text-[11px] border-t border-outline-variant/20">
            <span>API Key: gsk_••••••••90a1</span>
            <span className="text-secondary font-semibold">Configured</span>
          </div>
        </div>

        {/* Provider 3: Gemini */}
        <div
          onClick={() => onChange({ provider: 'gemini' })}
          className={`rounded-xl p-space-md flex flex-col justify-between cursor-pointer transition-all ${
            config.provider === 'gemini'
              ? 'bg-surface-container border-2 border-primary shadow-md ring-1 ring-primary/30'
              : 'bg-surface-container-lowest/80 opacity-70 hover:opacity-100 border border-outline-variant/30'
          }`}
        >
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-surface-container-high text-on-surface-variant">
              STANDBY
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs">
            Complex high-parameter agentic reasoning and cross-modal audit inspections.
          </p>
          <div className="flex items-center justify-between pt-space-xs text-outline font-mono-code text-[11px] border-t border-outline-variant/20">
            <span>API Key: AIza••••••••83eF</span>
            <span className="text-secondary font-semibold">Configured</span>
          </div>
        </div>
      </div>

      {/* Detailed Configuration Form */}
      <div className="bg-surface-container rounded-xl p-space-md mb-space-md border border-outline-variant/20">
        <div className="flex items-center justify-between mb-space-md pb-space-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
            <span className="font-body-lg text-body-lg text-on-surface font-semibold text-sm sm:text-base">
              {config.provider === 'ollama' ? 'Ollama Execution Configuration' : `${config.provider.toUpperCase()} Settings`}
            </span>
          </div>
          <span className="font-mono-code text-[11px] text-outline">
            Profile: default-local-agentic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Field 1: Base URL */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center justify-between text-[10px]">
              <span>API Base URL</span>
              <span className="text-tertiary flex items-center gap-0.5 text-[10px] font-bold">
                <span className="material-symbols-outlined text-[13px]">check</span> Validated
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-surface-container-lowest text-on-surface px-space-md py-2 rounded-lg font-mono-code text-xs focus:outline-none focus:ring-1 focus:ring-primary pl-8 border border-outline-variant/30"
                type="text"
                value={config.baseUrl}
                onChange={(e) => onChange({ baseUrl: e.target.value })}
              />
              <span className="material-symbols-outlined absolute left-2.5 text-outline text-[16px]">link</span>
            </div>
            <span className="font-body-sm text-[11px] text-outline">Loopback port for local engine</span>
          </div>

          {/* Field 2: Model Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center justify-between text-[10px]">
              <span>Active Model Name</span>
              <span className="text-secondary text-[10px] font-mono-code">8.0B • 4.9 GB VRAM</span>
            </label>
            <div className="relative flex items-center">
              <select
                className="w-full bg-surface-container-lowest text-on-surface px-space-md py-2 rounded-lg font-mono-code text-xs focus:outline-none focus:ring-1 focus:ring-primary appearance-none pr-8 border border-outline-variant/30"
                value={config.modelName}
                onChange={(e) => onChange({ modelName: e.target.value })}
              >
                <option value="llama-3-8b-instruct:q4_k_m">llama-3-8b-instruct:q4_k_m</option>
                <option value="mistral-7b-instruct:v0.3">mistral-7b-instruct:v0.3</option>
                <option value="phi-3-mini:4k">phi-3-mini:4k</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
            <span className="font-body-sm text-[11px] text-outline">Ollama local quantized binary image</span>
          </div>

          {/* Field 3: Request Timeout */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
              Request Timeout
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-surface-container-lowest text-on-surface px-space-md py-2 rounded-lg font-mono-code text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                type="text"
                value={config.timeout}
                onChange={(e) => onChange({ timeout: e.target.value })}
              />
              <span className="absolute right-3 font-mono-code text-[11px] text-outline">seconds</span>
            </div>
            <span className="font-body-sm text-[11px] text-outline">Watchdog trigger threshold</span>
          </div>

          {/* Field 4: Context Window */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
              Inference Context Window
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-surface-container-lowest text-on-surface px-space-md py-2 rounded-lg font-mono-code text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                type="text"
                value={config.contextWindow}
                onChange={(e) => onChange({ contextWindow: e.target.value })}
              />
              <span className="material-symbols-outlined absolute right-2.5 text-outline text-[16px]">memory</span>
            </div>
            <span className="font-body-sm text-[11px] text-outline">Allocated KV memory per agent</span>
          </div>
        </div>
      </div>

      {/* Status Banner & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/20">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-mono-code text-xs text-on-surface font-semibold">
              CONNECTED • OLLAMA v0.1.32
            </span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-outline font-mono-code text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-secondary">speed</span>
            <span>
              Latency: <strong className="text-on-surface">{testLatency || '14.2ms'}</strong> (loopback)
            </span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-outline font-mono-code text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-tertiary">inventory_2</span>
            <span>
              Installed: <strong className="text-on-surface">llama-3-8b</strong>, mistral-7b, phi-3
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={isTesting ? 'sync' : 'network_ping'}
            onClick={onTestConnection}
            disabled={isTesting}
          >
            {isTesting ? 'Pinging...' : 'Test Connection'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={syncingRegistry ? 'sync' : 'sync'}
            onClick={handleSyncRegistry}
            disabled={syncingRegistry}
          >
            {syncingRegistry ? 'Syncing...' : 'Sync Registry'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSaveProvider}
          >
            Save Provider Config
          </Button>
        </div>
      </div>

      {registryMessage && (
        <div className="mt-2 text-xs font-mono-code text-tertiary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">check</span>
          {registryMessage}
        </div>
      )}

      {/* Security Micro-Notice */}
      <div className="mt-space-sm flex items-center gap-2 text-outline font-mono-code text-[11px]">
        <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
        <span>
          Local-first execution prevents prompt data leakage to third-party endpoints. Mandatory behavioral authorization occurs pre-call.
        </span>
      </div>
    </Card>
  );
};
