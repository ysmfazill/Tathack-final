import type { TrustedDestination } from './types.ts';

/**
 * Trusted Destination Registry
 * 
 * SECURITY INVARIANT:
 * Destinations must be validated against backend-controlled records.
 * Document-supplied or model-generated destination parameters (e.g.
 * claiming destination_type="INTERNAL" or approved=true) are ignored.
 */
class TrustedDestinationRegistryImpl {
  private destinations: Map<string, TrustedDestination> = new Map();

  constructor() {
    this.seedDestinations();
  }

  private seedDestinations() {
    this.registerDestination({
      id: 'internal_report_db',
      name: 'Internal Reporting Data Warehouse',
      type: 'INTERNAL',
      approved: true,
      allowedClassifications: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL'],
      allowedAgents: ['hr_agent', 'report_agent', 'export_agent', 'finance_agent'],
      requiresApprovalFor: ['CONFIDENTIAL'],
    });

    this.registerDestination({
      id: 'quarantine_sink',
      name: 'SecOps Sandbox Quarantine Sink',
      type: 'QUARANTINE',
      approved: true,
      allowedClassifications: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'],
      allowedAgents: ['hr_agent', 'report_agent', 'export_agent', 'secops_agent'],
      requiresApprovalFor: [],
    });

    this.registerDestination({
      id: 'partner_analytics_api',
      name: 'Verified Partner Analytics Ingestion Gateway',
      type: 'PARTNER',
      approved: true,
      allowedClassifications: ['PUBLIC', 'INTERNAL'],
      allowedAgents: ['report_agent', 'export_agent'],
      requiresApprovalFor: ['INTERNAL'],
    });

    this.registerDestination({
      id: 'external_sync',
      name: 'Unverified External Cloud Storage Sync',
      type: 'EXTERNAL',
      approved: false,
      allowedClassifications: [],
      allowedAgents: [],
      requiresApprovalFor: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'],
    });

    this.registerDestination({
      id: 'untrusted_webhook_egress',
      name: 'Arbitrary Webhook Endpoint (External WAN)',
      type: 'EXTERNAL',
      approved: false,
      allowedClassifications: [],
      allowedAgents: [],
      requiresApprovalFor: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'],
    });
  }

  public registerDestination(dest: TrustedDestination): void {
    this.destinations.set(dest.id, { ...dest });
  }

  /**
   * Resolves a destination ID against the backend authoritative store.
   */
  public resolveDestination(destinationId: string): TrustedDestination | null {
    const dest = this.destinations.get(destinationId);
    if (!dest) {
      return null;
    }
    return { ...dest, allowedClassifications: [...dest.allowedClassifications], allowedAgents: [...dest.allowedAgents] };
  }

  public getAllDestinations(): TrustedDestination[] {
    return Array.from(this.destinations.values());
  }

  public resetToSeed(): void {
    this.destinations.clear();
    this.seedDestinations();
  }
}

export const TrustedDestinationRegistry = new TrustedDestinationRegistryImpl();
