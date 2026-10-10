import React from 'react';

interface InputWorkbenchProps {
  userTask: string;
  onUserTaskChange: (val: string) => void;
  untrustedPayload: string;
  onUntrustedPayloadChange: (val: string) => void;
  sourceVector: string;
  onSourceVectorChange: (val: string) => void;
  testCaseId: string;
  onLoadSample: () => void;
  onClear: () => void;
  
  targetAgentId: string;
  onTargetAgentIdChange: (val: string) => void;
  proposedToolName: string;
  onProposedToolNameChange: (val: string) => void;
  toolArguments: string;
  onToolArgumentsChange: (val: string) => void;
  jsonError: string | null;
}

export const InputWorkbench: React.FC<InputWorkbenchProps> = ({
  userTask,
  onUserTaskChange,
  untrustedPayload,
  onUntrustedPayloadChange,
  sourceVector,
  onSourceVectorChange,
  testCaseId,
  onLoadSample,
  onClear,
  targetAgentId,
  onTargetAgentIdChange,
  proposedToolName,
  onProposedToolNameChange,
  toolArguments,
  onToolArgumentsChange,
  jsonError,
}) => {
  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222a3d]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#adc6ff]/10 border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff]">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#e0e2ec] font-headline tracking-wide">
              Test Input Workbench
            </h3>
            <p className="text-[11px] text-[#8e9099]">
              Configure user prompt, injected untrusted payloads, and ingest sources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#adc6ff] bg-[#0b1326] px-2.5 py-1 rounded border border-[#222a3d]">
            ID: {testCaseId}
          </span>
          <button
            onClick={onLoadSample}
            className="text-[11px] font-mono text-[#4cd7f6] hover:text-[#adc6ff] bg-[#171f33] hover:bg-[#222a3d] px-2.5 py-1 rounded border border-[#222a3d] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            Reset Sample
          </button>
          <button
            onClick={onClear}
            className="text-[11px] font-mono text-[#8e9099] hover:text-[#ffb4ab] bg-[#171f33] hover:bg-[#222a3d] px-2.5 py-1 rounded border border-[#222a3d] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">backspace</span>
            Clear
          </button>
        </div>
      </div>

      {/* Top Controls: Source Vector & Model Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider mb-1.5 font-label-caps">
            Ingest Source Vector
          </label>
          <div className="relative">
            <select
              value={sourceVector}
              onChange={(e) => onSourceVectorChange(e.target.value)}
              aria-label="Ingest Source Vector"
              className="w-full bg-[#0b1326] border border-[#222a3d] rounded-lg px-3 py-2 text-xs text-[#e0e2ec] focus:outline-none focus:border-[#adc6ff] font-mono appearance-none"
            >
              <option value="external_api">External Webhook / REST API</option>
              <option value="s3_document">External Storage / Untrusted PDF or Doc</option>
              <option value="browser_extension">Browser DOM Agent Scratchpad</option>
              <option value="user_chat">Direct User Chat Input (Web App)</option>
              <option value="email_body">Inbound Email / Customer Ticket</option>
              <option value="database_record">3rd Party CRM Database Read</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-[#8e9099] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider mb-1.5 font-label-caps">
            Simulated Target Agent
          </label>
          <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg px-3 py-2 text-xs text-[#4cd7f6] font-mono flex items-center justify-between">
            <input 
              type="text" 
              value={targetAgentId} 
              onChange={(e) => onTargetAgentIdChange(e.target.value)}
              className="bg-transparent border-none outline-none text-[#4cd7f6] w-full"
              placeholder="e.g. agent_123"
            />
          </div>
        </div>
      </div>

      {/* Primary User Task Prompt */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider font-label-caps flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">chat</span>
            Legitimate User Task Prompt
          </label>
          <span className="text-[10px] font-mono text-[#8e9099]">
            {userTask.length} chars
          </span>
        </div>
        <textarea
          value={userTask}
          onChange={(e) => onUserTaskChange(e.target.value)}
          rows={3}
          placeholder="Enter the initial benign instruction given by the user..."
          className="w-full bg-[#0b1326] border border-[#222a3d] rounded-lg p-3 text-xs text-[#e0e2ec] font-mono placeholder-[#44474f] focus:outline-none focus:border-[#adc6ff] resize-y transition-colors leading-relaxed"
        />
      </div>

      {/* Tool Execution Request */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider mb-1.5 font-label-caps">
            Proposed Tool Name
          </label>
          <div className="bg-[#0b1326] border border-[#222a3d] rounded-lg px-3 py-2 text-xs text-[#4cd7f6] font-mono">
            <input 
              type="text" 
              value={proposedToolName} 
              onChange={(e) => onProposedToolNameChange(e.target.value)}
              className="bg-transparent border-none outline-none text-[#4cd7f6] w-full"
              placeholder="e.g. export_credentials"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#c4c6d0] uppercase tracking-wider mb-1.5 font-label-caps flex justify-between">
            <span>Tool Arguments (JSON)</span>
            {jsonError && <span className="text-error">{jsonError}</span>}
          </label>
          <textarea
            value={toolArguments}
            onChange={(e) => onToolArgumentsChange(e.target.value)}
            rows={3}
            placeholder='{"key": "value"}'
            className={`w-full bg-[#0b1326] border ${jsonError ? 'border-error' : 'border-[#222a3d]'} rounded-lg p-3 text-xs text-[#e0e2ec] font-mono placeholder-[#44474f] focus:outline-none focus:border-[#adc6ff] resize-y transition-colors leading-relaxed`}
          />
        </div>
      </div>

      {/* Untrusted / Injected Payload */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-medium text-[#ffb4ab] uppercase tracking-wider font-label-caps flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">warning</span>
            Untrusted Ingest Content / Simulated Attack Payload
          </label>
          <span className="text-[10px] font-mono text-[#ffb4ab]/80 bg-[#ffb4ab]/10 px-2 py-0.5 rounded border border-[#ffb4ab]/20">
            Adversarial Surface
          </span>
        </div>
        <textarea
          value={untrustedPayload}
          onChange={(e) => onUntrustedPayloadChange(e.target.value)}
          rows={5}
          placeholder="Paste untrusted document body, injection payload, or prompt leak string here..."
          className="w-full bg-[#060e20] border border-[#93000a]/40 focus:border-[#ffb4ab] rounded-lg p-3 text-xs text-[#ffb4ab] font-mono placeholder-[#44474f] focus:outline-none resize-y transition-colors leading-relaxed selection:bg-[#93000a]/50"
        />
      </div>
    </div>
  );
};
