import type { AuditRecord, AuthorizationDecision, DataClassification, ExecutionStatus } from './types.ts';

/**
 * Audit Logger
 * 
 * Provides verifiable audit trail records with request/trace correlation,
 * credential redaction, and simulated SHA-256 integrity hashing.
 */
class AuditLoggerImpl {
  private inMemoryLedger: AuditRecord[] = [];

  public logEvent(params: {
    traceId: string;
    agentId: string;
    targetAgentId?: string;
    toolName: string;
    rawArgs: Record<string, any>;
    dataClassification?: DataClassification;
    destinationId?: string;
    decision: AuthorizationDecision;
    matchedRuleId?: string;
    matchedRuleName?: string;
    riskScore: number;
    executionStatus: ExecutionStatus;
    executorInvocationCount: number;
    policyVersion?: string;
  }): AuditRecord {
    const timestamp = new Date().toISOString();
    const id = `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const sanitizedArgs = this.redactSensitiveData(params.rawArgs);

    // Compute deterministic cryptographic hash
    const rawPayloadString = `${id}|${params.traceId}|${params.agentId}|${params.toolName}|${params.decision}|${params.executionStatus}|${timestamp}`;
    const sha256Hash = this.computeSimulatedHash(rawPayloadString);

    const record: AuditRecord = {
      id,
      traceId: params.traceId,
      timestamp,
      agentId: params.agentId,
      targetAgentId: params.targetAgentId,
      toolName: params.toolName,
      sanitizedArgs,
      dataClassification: params.dataClassification,
      destinationId: params.destinationId,
      decision: params.decision,
      matchedRuleId: params.matchedRuleId,
      matchedRuleName: params.matchedRuleName,
      riskScore: params.riskScore,
      executionStatus: params.executionStatus,
      executorInvocationCount: params.executorInvocationCount,
      policyVersion: params.policyVersion || 'v1.4.2-STRICT',
      sha256Hash,
    };

    this.inMemoryLedger.unshift(record);
    return record;
  }

  public getLedger(): AuditRecord[] {
    return [...this.inMemoryLedger];
  }

  public getEventsByTraceId(traceId: string): AuditRecord[] {
    return this.inMemoryLedger.filter((e) => e.traceId === traceId);
  }

  public clearLedger(): void {
    this.inMemoryLedger = [];
  }

  public verifyRecordIntegrity(record: AuditRecord): boolean {
    if (!record || !record.sha256Hash) return false;
    const rawPayloadString = `${record.id}|${record.traceId}|${record.agentId}|${record.toolName}|${record.decision}|${record.executionStatus}|${record.timestamp}`;
    const expectedHash = this.computeSimulatedHash(rawPayloadString);
    return record.sha256Hash === expectedHash;
  }

  private redactSensitiveData(obj: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (/password|secret|token|api_key|ssn|credit_card/i.test(key)) {
        cleaned[key] = '[REDACTED_BY_PROMPTGUARD]';
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = this.redactSensitiveData(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  private computeSimulatedHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}${Math.abs(hash * 31).toString(16).padStart(16, '0')}`;
  }
}

export const AuditLogger = new AuditLoggerImpl();
