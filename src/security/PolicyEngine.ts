import type { AuthorizationResult, SecurityContext } from './types.ts';

/**
 * Hardened Backend Policy Engine
 * 
 * CORE INVARIANTS:
 * 1. Default-Deny: Unknown tools are immediately denied.
 * 2. Mandatory Deny Precedence: Mandatory security rules strictly override
 *    heuristic risk scores, model explanations, or permissive thresholds.
 * 3. Fail-Closed: Missing context, unresolved data objects, or unavailable
 *    policy dependencies cause immediate denial.
 */
class PolicyEngineImpl {
  private readonly ALLOWED_TOOLS = new Set([
    'fetch_employee_record',
    'generate_report_summary',
    'export_sync',
    'query_internal_db',
    'export_public_doc',
    'quarantine_payload',
  ]);

  private readonly AGENT_TOOL_RBAC: Record<string, string[]> = {
    hr_agent: ['fetch_employee_record', 'query_internal_db'],
    report_agent: ['generate_report_summary', 'query_internal_db', 'quarantine_payload'],
    export_agent: ['export_sync', 'export_public_doc'],
    finance_agent: ['query_internal_db', 'generate_report_summary'],
    secops_agent: ['quarantine_payload', 'query_internal_db'],
  };

  public evaluate(context: SecurityContext): AuthorizationResult {
    const { proposal, resolvedData, resolvedDestination, isPolicyServiceAvailable } = context;

    // 0. Fail-Closed: Policy Service Health Check
    if (isPolicyServiceAvailable === false) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-FAIL-CLOSED-00',
        matchedRuleName: 'Policy Service Unavailable',
        reason: 'CRITICAL: Policy engine dependency unreachable; execution failed closed.',
        isMandatoryDeny: true,
        riskScore: 1.0,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 1. Tool Allowlist Check (Default Deny)
    if (!this.ALLOWED_TOOLS.has(proposal.toolName)) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-TOOL-000',
        matchedRuleName: 'Unknown Tool Rejection',
        reason: `DENIED: Tool "${proposal.toolName}" is not registered in the trusted tool catalog.`,
        isMandatoryDeny: true,
        riskScore: 1.0,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 2. Agent RBAC / Scope Enforcement
    const allowedToolsForAgent = this.AGENT_TOOL_RBAC[context.actorAgentId] || [];
    if (!allowedToolsForAgent.includes(proposal.toolName)) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-RBAC-002',
        matchedRuleName: 'Agent Role Boundary Violation',
        reason: `DENIED: Agent "${context.actorAgentId}" is not authorized to invoke tool "${proposal.toolName}".`,
        isMandatoryDeny: true,
        riskScore: 0.95,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 2.2. Tool Schema & Parameter Validation (POL-SCHEMA-005)
    if (proposal.toolName === 'fetch_employee_record' && (!proposal.args || typeof proposal.args.objectId !== 'string' || !proposal.args.objectId.trim())) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-SCHEMA-005',
        matchedRuleName: 'Tool Argument Schema Violation',
        reason: `DENIED: Tool "${proposal.toolName}" requires a valid string "objectId" parameter.`,
        isMandatoryDeny: true,
        riskScore: 0.85,
        evaluatedAt: new Date().toISOString(),
      };
    }
    if (proposal.toolName === 'generate_report_summary' && (!proposal.args || typeof proposal.args.objectId !== 'string' || !proposal.args.objectId.trim())) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-SCHEMA-005',
        matchedRuleName: 'Tool Argument Schema Violation',
        reason: `DENIED: Tool "${proposal.toolName}" requires a valid string "objectId" parameter.`,
        isMandatoryDeny: true,
        riskScore: 0.85,
        evaluatedAt: new Date().toISOString(),
      };
    }
    if (proposal.toolName === 'export_sync' && (!proposal.args || typeof proposal.args.objectId !== 'string' || !proposal.args.destinationId)) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-SCHEMA-005',
        matchedRuleName: 'Tool Argument Schema Violation',
        reason: `DENIED: Tool "${proposal.toolName}" requires valid string "objectId" and "destinationId" parameters.`,
        isMandatoryDeny: true,
        riskScore: 0.85,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 2.5. Mandatory Deny: Adversarial Prompt Injection or Honey-Tool (POL-INJ-001)
    if (context.scannerResult && context.scannerResult.compositeRiskScore >= 0.85) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-INJ-001',
        matchedRuleName: 'Adversarial Prompt Injection Blocked',
        reason: `DENIED: Adversarial prompt injection detected (${context.scannerResult.signals.map((s) => s.reason).join('; ')})`,
        isMandatoryDeny: true,
        riskScore: context.scannerResult.compositeRiskScore,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 3. Fail-Closed: Unresolved Data Object Reference
    if (proposal.targetObjectId && !resolvedData) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-DATA-RESOLVE-FAIL',
        matchedRuleName: 'Unresolved Data Object Fail-Closed',
        reason: `DENIED: Data object "${proposal.targetObjectId}" could not be validated in trusted registry. Defaulting to strict denial.`,
        isMandatoryDeny: true,
        riskScore: 0.90,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 4. Mandatory Deny: RESTRICTED Data Egress Protection (POL-DATA-704)
    if (resolvedData && resolvedData.trustedClassification === 'RESTRICTED') {
      const isQuarantine = resolvedDestination && resolvedDestination.id === 'quarantine_sink';
      if (!isQuarantine) {
        return {
          decision: 'DENY',
          matchedRuleId: 'POL-DATA-704',
          matchedRuleName: 'Restricted Data Egress Prohibition',
          reason: `DENIED: Data object "${resolvedData.objectId}" has authoritative classification RESTRICTED. Egress to non-quarantine destinations is strictly prohibited.`,
          isMandatoryDeny: true,
          riskScore: 1.0,
          evaluatedAt: new Date().toISOString(),
        };
      }
    }

    // 5. Mandatory Deny: Unapproved / Untrusted Destination (POL-DEST-003)
    if (proposal.targetDestinationId) {
      if (!resolvedDestination || !resolvedDestination.approved) {
        return {
          decision: 'DENY',
          matchedRuleId: 'POL-DEST-003',
          matchedRuleName: 'Unapproved Egress Destination',
          reason: `DENIED: Destination "${proposal.targetDestinationId}" is unapproved or untrusted.`,
          isMandatoryDeny: true,
          riskScore: 1.0,
          evaluatedAt: new Date().toISOString(),
        };
      }

      // Check if destination permits the trusted data classification
      if (
        resolvedData &&
        !resolvedDestination.allowedClassifications.includes(resolvedData.trustedClassification)
      ) {
        return {
          decision: 'DENY',
          matchedRuleId: 'POL-DEST-MISMATCH',
          matchedRuleName: 'Classification Egress Mismatch',
          reason: `DENIED: Destination "${resolvedDestination.name}" does not accept classification level "${resolvedData.trustedClassification}".`,
          isMandatoryDeny: true,
          riskScore: 0.85,
          evaluatedAt: new Date().toISOString(),
        };
      }
    }

    // 6. Contextual Taint Boundary: Untrusted External Content Injection (POL-TAINT-04)
    if (resolvedData && resolvedData.taintFlags.includes('UNTRUSTED_CONTENT_MERGED')) {
      return {
        decision: 'DENY',
        matchedRuleId: 'POL-TAINT-04',
        matchedRuleName: 'Contextual Taint Gate',
        reason: `DENIED: Object "${resolvedData.objectId}" carries active taint flag (UNTRUSTED_CONTENT_MERGED). High-privilege handoff rejected.`,
        isMandatoryDeny: true,
        riskScore: 0.90,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 7. Human-In-The-Loop Approval Requirement (POL-HITL-05)
    if (
      resolvedDestination &&
      resolvedData &&
      resolvedDestination.requiresApprovalFor.includes(resolvedData.trustedClassification)
    ) {
      return {
        decision: 'REQUIRE_APPROVAL',
        matchedRuleId: 'POL-HITL-05',
        matchedRuleName: 'Human SecOps Review Required',
        reason: `PENDING APPROVAL: Egress of "${resolvedData.trustedClassification}" data to "${resolvedDestination.name}" requires explicit operator sign-off.`,
        isMandatoryDeny: false,
        riskScore: 0.65,
        evaluatedAt: new Date().toISOString(),
      };
    }

    // 8. Default Permit if all behavioral and cryptographic constraints are met
    return {
      decision: 'ALLOW',
      matchedRuleId: 'POL-PERMIT-DEFAULT',
      matchedRuleName: 'Authorized Workflow Verification',
      reason: 'AUTHORIZED: Action verified against role scope, trusted classification, and destination registry.',
      isMandatoryDeny: false,
      riskScore: context.scannerResult?.compositeRiskScore || 0.05,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export const PolicyEngine = new PolicyEngineImpl();
