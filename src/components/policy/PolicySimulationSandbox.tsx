import React, { useState } from 'react';

export const PolicySimulationSandbox: React.FC = () => {
  const [sourceAgent, setSourceAgent] = useState('Report Agent');
  const [destinationAgent, setDestinationAgent] = useState('Export Agent');
  const [classification, setClassification] = useState('Confidential (PII)');
  const [requestedTool, setRequestedTool] = useState('export_records');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    decision: string;
    matchedRule: string;
    reason: string;
    consequence: string;
  }>({
    decision: 'BLOCKED',
    matchedRule: 'RULE-002 (POL-704 Strict Egress)',
    reason: 'Payload contains Confidential PII targeting untrusted external sink without valid SecOps authorization ticket.',
    consequence: 'Socket Terminated • 0 Bytes Dispatched',
  });

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setEvaluationResult({
      decision: 'BLOCKED',
      matchedRule: '...',
      reason: '...',
      consequence: '...',
    });

    try {
      const response = await fetch('http://127.0.0.1:8080/api/policies/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: sourceAgent,
          tool_name: requestedTool,
          action: `User requested ${requestedTool} from ${sourceAgent} to ${destinationAgent} with class ${classification}`,
          arguments: {
             destination: destinationAgent,
             classification: classification
          }
        })
      });
      const data = await response.json();
      
      let consequence = 'Socket Terminated';
      if (data.decision === 'ALLOW') consequence = 'Socket Permitted • Dispatch Authorized';
      else if (data.decision === 'REQUIRE_APPROVAL') consequence = 'Execution Queued • Awaiting Approval';
      
      setEvaluationResult({
        decision: data.decision,
        matchedRule: data.matched_rules?.length ? data.matched_rules.join(", ") : data.reason_code,
        reason: data.explanation,
        consequence: consequence,
      });
    } catch (err) {
      setEvaluationResult({
        decision: 'BLOCKED',
        matchedRule: 'NETWORK_ERROR',
        reason: 'Failed to connect to policy engine.',
        consequence: 'Cannot evaluate policy.',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const isBlocked = evaluationResult.decision === 'DENY' || evaluationResult.decision === 'BLOCKED';
  const isAllowed = evaluationResult.decision === 'ALLOW' || evaluationResult.decision === 'ALLOWED';

  return (
    <div className="flex flex-col bg-surface-container-low rounded-xl shadow-md p-space-lg gap-space-md border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">play_circle</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Test Policy Against Scenario
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Simulate policy engine evaluation against synthetic agent transfers prior to deployment.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-outline font-label-caps text-label-caps tracking-wider uppercase border border-outline-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          POLICY SIMULATION — NO TOOL EXECUTION
        </span>
      </div>

      {/* Simulation Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md p-space-md bg-surface-container rounded-lg items-end border border-outline-variant/20">
        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-outline uppercase font-semibold">
            Source Agent
          </label>
          <select
            value={sourceAgent}
            onChange={(e) => setSourceAgent(e.target.value)}
            className="bg-surface-container-high text-on-surface text-body-sm font-mono-code p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
          >
            <option>Report Agent</option>
            <option>HR Agent</option>
            <option>Export Agent</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-outline uppercase font-semibold">
            Destination Agent
          </label>
          <select
            value={destinationAgent}
            onChange={(e) => setDestinationAgent(e.target.value)}
            className="bg-surface-container-high text-on-surface text-body-sm font-mono-code p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
          >
            <option>Export Agent</option>
            <option>Audit Collector</option>
            <option>External Endpoint</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-outline uppercase font-semibold">
            Classification
          </label>
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="bg-surface-container-high text-on-surface text-body-sm font-mono-code p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
          >
            <option>Confidential (PII)</option>
            <option>Public / Sanitized</option>
            <option>Restricted (Vault)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-outline uppercase font-semibold">
            Requested Tool
          </label>
          <select
            value={requestedTool}
            onChange={(e) => setRequestedTool(e.target.value)}
            className="bg-surface-container-high text-on-surface text-body-sm font-mono-code p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
          >
            <option>export_records</option>
            <option>generate_report</option>
            <option>read_employee_summary</option>
            <option>delete_records</option>
          </select>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full py-2 px-space-md bg-primary-container hover:bg-inverse-primary text-on-primary font-body-sm text-body-sm font-semibold rounded shadow-sm transition-colors flex items-center justify-center gap-1.5"
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isEvaluating ? 'animate-spin' : ''
            }`}
          >
            {isEvaluating ? 'sync' : 'bolt'}
          </span>
          <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Policy'}</span>
        </button>
      </div>

      {/* Evaluation Output Result */}
      <div
        className={`p-space-lg bg-surface-container-lowest rounded-lg border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-inner border border-outline-variant/20 ${
          isBlocked ? 'border-l-error' : isAllowed ? 'border-l-tertiary' : 'border-l-secondary'
        }`}
      >
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-label-caps text-label-caps font-bold tracking-wider border ${
                isBlocked
                  ? 'bg-error-container/40 text-error border-error/40'
                  : isAllowed
                  ? 'bg-tertiary-container/30 text-tertiary border-tertiary/40'
                  : 'bg-secondary-container/30 text-secondary border-secondary/40'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isBlocked ? 'shield' : isAllowed ? 'verified' : 'how_to_reg'}
              </span>
              DECISION: {evaluationResult.decision}
            </span>
            <span className="font-mono-code text-[12px] text-outline">
              Matched: <strong className="text-on-surface">{evaluationResult.matchedRule}</strong>
            </span>
          </div>
          <p className="font-mono-code text-[13px] text-on-surface-variant">
            Deterministic Reason: {evaluationResult.reason}
          </p>
        </div>
        <div className="flex flex-col md:text-right shrink-0">
          <span className="font-label-caps text-label-caps text-outline uppercase">
            Runtime Consequence
          </span>
          <span
            className={`font-mono-code text-[12px] font-semibold ${
              isBlocked ? 'text-error' : isAllowed ? 'text-tertiary' : 'text-secondary'
            }`}
          >
            {evaluationResult.consequence}
          </span>
        </div>
      </div>
    </div>
  );
};
