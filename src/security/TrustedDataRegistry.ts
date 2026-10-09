import type { DataEnvelope } from './types.ts';

/**
 * Trusted Data Registry
 * 
 * SECURITY INVARIANT:
 * Data classifications are derived strictly from trusted backend records.
 * Model proposals (e.g. {"classification": "PUBLIC"}) MUST NEVER override
 * this registry.
 */
class TrustedDataRegistryImpl {
  private records: Map<string, DataEnvelope> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    this.registerData({
      objectId: 'DATA-HR-101',
      name: 'Full Employee SSN & Compensation Record',
      trustedClassification: 'RESTRICTED',
      sourceAgentId: 'hr_agent',
      currentAgentId: 'hr_agent',
      provenanceChain: ['hr_agent'],
      taintFlags: ['SSN', 'COMPENSATION', 'RESTRICTED_PII'],
      payload: { employeeId: 'E-904', salary: 145000, ssn: '***-**-4491' },
      createdAt: new Date().toISOString(),
    });

    this.registerData({
      objectId: 'DATA-HR-202',
      name: 'Employee Aggregate Summary (Sanitized)',
      trustedClassification: 'INTERNAL',
      sourceAgentId: 'hr_agent',
      currentAgentId: 'report_agent',
      provenanceChain: ['hr_agent', 'report_agent'],
      taintFlags: ['AGGREGATE_ONLY'],
      payload: { department: 'Engineering', headcount: 42, avgTenureYears: 3.4 },
      createdAt: new Date().toISOString(),
    });

    this.registerData({
      objectId: 'DATA-PUB-303',
      name: 'Public Press Release / Hiring Notice',
      trustedClassification: 'PUBLIC',
      sourceAgentId: 'report_agent',
      currentAgentId: 'export_agent',
      provenanceChain: ['report_agent', 'export_agent'],
      taintFlags: [],
      payload: { title: 'Q3 Open Roles', publicUrl: 'https://company.com/careers' },
      createdAt: new Date().toISOString(),
    });

    this.registerData({
      objectId: 'DATA-FIN-404',
      name: 'Quarterly Operating Budget Draft',
      trustedClassification: 'CONFIDENTIAL',
      sourceAgentId: 'finance_agent',
      currentAgentId: 'finance_agent',
      provenanceChain: ['finance_agent'],
      taintFlags: ['FINANCIAL_DRAFT'],
      payload: { fiscalQuarter: 'Q3-2026', totalBudget: 4200000 },
      createdAt: new Date().toISOString(),
    });
  }

  public registerData(data: DataEnvelope): void {
    this.records.set(data.objectId, { ...data });
  }

  /**
   * Resolves data envelope purely by trusted backend object ID.
   * Untrusted model claims are ignored.
   */
  public resolveData(objectId: string): DataEnvelope | null {
    const item = this.records.get(objectId);
    if (!item) {
      return null;
    }
    return { ...item, provenanceChain: [...item.provenanceChain], taintFlags: [...item.taintFlags] };
  }

  public getAllRecords(): DataEnvelope[] {
    return Array.from(this.records.values());
  }

  public resetToSeed(): void {
    this.records.clear();
    this.seedDefaultData();
  }
}

export const TrustedDataRegistry = new TrustedDataRegistryImpl();
