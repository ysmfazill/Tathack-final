import { ExecutionGateway } from './ExecutionGateway.ts';
import { TaintTracker } from './TaintTracker.ts';
import { TrustedDataRegistry } from './TrustedDataRegistry.ts';
import { TrustedDestinationRegistry } from './TrustedDestinationRegistry.ts';
import type { ExecutionResult, SecurityContext, ToolProposal } from './types.ts';

export interface WorkflowStepResult {
  stepIndex: number;
  scenarioName: string;
  sourceAgent: string;
  targetAgent?: string;
  toolProposed: string;
  targetObjectId?: string;
  targetDestinationId?: string;
  trustedClassification?: string;
  authorizationDecision: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
  executionStatus: string;
  ruleTriggered: string;
  reason: string;
  executorInvoked: boolean;
}

/**
 * Cross-Agent Data Guard
 * 
 * Orchestrates deterministic multi-agent simulation workflows
 * and guarantees strict policy enforcement across agent boundaries.
 */
class CrossAgentGuardImpl {
  public runScenario(scenarioIndex: 1 | 2 | 3 | 4 | 5 | 6): WorkflowStepResult {
    switch (scenarioIndex) {
      case 1: {
        // SCENARIO 1: Authorized Transfer
        const data = TrustedDataRegistry.resolveData('DATA-HR-202')!; // INTERNAL
        const dest = TrustedDestinationRegistry.resolveDestination('internal_report_db')!; // Approved

        const proposal: ToolProposal = {
          toolName: 'generate_report_summary',
          args: { objectId: data.objectId, destinationId: dest.id },
          proposedByAgentId: 'report_agent',
          targetObjectId: data.objectId,
          targetDestinationId: dest.id,
        };

        const ctx: SecurityContext = {
          traceId: `TRC-SCENARIO-1-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorAgentId: 'report_agent',
          proposal,
          resolvedData: data,
          resolvedDestination: dest,
        };

        const execRes: ExecutionResult = ExecutionGateway.executeAction(ctx);

        return {
          stepIndex: 1,
          scenarioName: 'Scenario 1: Authorized Internal Reporting Workflow',
          sourceAgent: 'hr_agent',
          targetAgent: 'report_agent',
          toolProposed: proposal.toolName,
          targetObjectId: data.objectId,
          targetDestinationId: dest.id,
          trustedClassification: data.trustedClassification,
          authorizationDecision: execRes.authorizationDecision,
          executionStatus: execRes.executionStatus,
          ruleTriggered: execRes.matchedRuleId || 'POL-PERMIT-DEFAULT',
          reason: 'Authorized internal transfer between HR and Reporting agent.',
          executorInvoked: execRes.executorInvocationEvidence.executed,
        };
      }

      case 2: {
        // SCENARIO 2: Restricted Export to Unapproved Destination
        const data = TrustedDataRegistry.resolveData('DATA-HR-101')!; // RESTRICTED
        const dest = TrustedDestinationRegistry.resolveDestination('external_sync')!; // Unapproved

        const proposal: ToolProposal = {
          toolName: 'export_sync',
          args: { objectId: data.objectId, destinationId: dest.id },
          proposedByAgentId: 'export_agent',
          targetObjectId: data.objectId,
          targetDestinationId: dest.id,
        };

        const ctx: SecurityContext = {
          traceId: `TRC-SCENARIO-2-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorAgentId: 'export_agent',
          proposal,
          resolvedData: data,
          resolvedDestination: dest,
        };

        const execRes: ExecutionResult = ExecutionGateway.executeAction(ctx);

        return {
          stepIndex: 2,
          scenarioName: 'Scenario 2: Restricted Data Egress Blocked',
          sourceAgent: 'report_agent',
          targetAgent: 'export_agent',
          toolProposed: proposal.toolName,
          targetObjectId: data.objectId,
          targetDestinationId: dest.id,
          trustedClassification: data.trustedClassification,
          authorizationDecision: execRes.authorizationDecision,
          executionStatus: execRes.executionStatus,
          ruleTriggered: execRes.matchedRuleId || 'POL-DATA-704',
          reason: execRes.error || 'RESTRICTED data egress blocked by policy.',
          executorInvoked: execRes.executorInvocationEvidence.executed,
        };
      }

      case 3: {
        // SCENARIO 3: Model Label Manipulation (Model claims RESTRICTED is PUBLIC)
        const authoritativeData = TrustedDataRegistry.resolveData('DATA-HR-101')!; // RESTRICTED in DB
        const dest = TrustedDestinationRegistry.resolveDestination('external_sync')!;

        const proposal: ToolProposal = {
          toolName: 'export_sync',
          args: {
            objectId: authoritativeData.objectId,
            destinationId: dest.id,
            // ATTACK PAYLOAD: Model attempts to claim this is public to bypass guard
            data_classification: 'PUBLIC',
          },
          proposedByAgentId: 'export_agent',
          targetObjectId: authoritativeData.objectId,
          targetDestinationId: dest.id,
          untrustedModelClaims: {
            claimedClassification: 'PUBLIC',
          },
        };

        const ctx: SecurityContext = {
          traceId: `TRC-SCENARIO-3-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorAgentId: 'export_agent',
          proposal,
          resolvedData: authoritativeData, // Trusted backend classification remains RESTRICTED
          resolvedDestination: dest,
        };

        const execRes = ExecutionGateway.executeAction(ctx);

        return {
          stepIndex: 3,
          scenarioName: 'Scenario 3: Model Classification Manipulation Resisted',
          sourceAgent: 'export_agent',
          toolProposed: proposal.toolName,
          targetObjectId: authoritativeData.objectId,
          targetDestinationId: dest.id,
          trustedClassification: authoritativeData.trustedClassification,
          authorizationDecision: execRes.authorizationDecision,
          executionStatus: execRes.executionStatus,
          ruleTriggered: execRes.matchedRuleId || 'POL-DATA-704',
          reason: 'Model claimed PUBLIC was ignored. Trusted backend RESTRICTED enforced.',
          executorInvoked: execRes.executorInvocationEvidence.executed,
        };
      }

      case 4: {
        // SCENARIO 4: Destination Manipulation (Document injection claims destination is approved)
        const data = TrustedDataRegistry.resolveData('DATA-HR-202')!;
        const resolvedDest = TrustedDestinationRegistry.resolveDestination('untrusted_webhook_egress')!;

        const proposal: ToolProposal = {
          toolName: 'export_sync',
          args: {
            objectId: data.objectId,
            destinationId: 'untrusted_webhook_egress',
            destination_type: 'INTERNAL', // Model injected claim
          },
          proposedByAgentId: 'export_agent',
          targetObjectId: data.objectId,
          targetDestinationId: 'untrusted_webhook_egress',
          untrustedModelClaims: {
            claimedDestinationType: 'INTERNAL',
            claimedApprovalStatus: true,
          },
        };

        const ctx: SecurityContext = {
          traceId: `TRC-SCENARIO-4-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorAgentId: 'export_agent',
          proposal,
          resolvedData: data,
          resolvedDestination: resolvedDest,
        };

        const execRes = ExecutionGateway.executeAction(ctx);

        return {
          stepIndex: 4,
          scenarioName: 'Scenario 4: Destination Parameter Manipulation Blocked',
          sourceAgent: 'export_agent',
          toolProposed: proposal.toolName,
          targetObjectId: data.objectId,
          targetDestinationId: 'untrusted_webhook_egress',
          trustedClassification: data.trustedClassification,
          authorizationDecision: execRes.authorizationDecision,
          executionStatus: execRes.executionStatus,
          ruleTriggered: execRes.matchedRuleId || 'POL-DEST-003',
          reason: 'Untrusted destination injection rejected by backend registry.',
          executorInvoked: execRes.executorInvocationEvidence.executed,
        };
      }

      case 5: {
        // SCENARIO 5: Multi-Agent Handoff with Taint Preservation
        const rawHrData = TrustedDataRegistry.resolveData('DATA-HR-101')!; // RESTRICTED
        // Transfer from HR to Report
        const reportEnvelope = TaintTracker.transferToAgent(rawHrData, 'report_agent', false);
        // Transfer from Report to Export
        const exportEnvelope = TaintTracker.transferToAgent(reportEnvelope, 'export_agent', true); // Injected prompt merged

        const dest = TrustedDestinationRegistry.resolveDestination('partner_analytics_api')!;

        const proposal: ToolProposal = {
          toolName: 'export_sync',
          args: { objectId: exportEnvelope.objectId, destinationId: dest.id },
          proposedByAgentId: 'export_agent',
          targetObjectId: exportEnvelope.objectId,
          targetDestinationId: dest.id,
        };

        const ctx: SecurityContext = {
          traceId: `TRC-SCENARIO-5-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorAgentId: 'export_agent',
          proposal,
          resolvedData: exportEnvelope,
          resolvedDestination: dest,
        };

        const execRes = ExecutionGateway.executeAction(ctx);

        return {
          stepIndex: 5,
          scenarioName: 'Scenario 5: Multi-Agent Cascade Taint Preserved & Blocked',
          sourceAgent: 'report_agent',
          targetAgent: 'export_agent',
          toolProposed: proposal.toolName,
          targetObjectId: exportEnvelope.objectId,
          targetDestinationId: dest.id,
          trustedClassification: exportEnvelope.trustedClassification,
          authorizationDecision: execRes.authorizationDecision,
          executionStatus: execRes.executionStatus,
          ruleTriggered: execRes.matchedRuleId || 'POL-DATA-704',
          reason: 'Provenance chain and RESTRICTED label persisted across hops; export denied.',
          executorInvoked: execRes.executorInvocationEvidence.executed,
        };
      }

      case 6: {
        // SCENARIO 6: Missing Classification Fail-Closed
        const dest = TrustedDestinationRegistry.resolveDestination('internal_report_db')!;
        const proposal: ToolProposal = {
          toolName: 'generate_report_summary',
          args: { objectId: 'DATA-UNREGISTERED-GHOST-999' },
          proposedByAgentId: 'report_agent',
          targetObjectId: 'DATA-UNREGISTERED-GHOST-999',
        };

        const ctx: SecurityContext = {
          traceId: `TRC-SCENARIO-6-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorAgentId: 'report_agent',
          proposal,
          resolvedData: undefined, // Cannot resolve in trusted registry
          resolvedDestination: dest,
        };

        const execRes = ExecutionGateway.executeAction(ctx);

        return {
          stepIndex: 6,
          scenarioName: 'Scenario 6: Missing Classification (Fail-Closed)',
          sourceAgent: 'report_agent',
          toolProposed: proposal.toolName,
          targetObjectId: 'DATA-UNREGISTERED-GHOST-999',
          trustedClassification: 'UNRESOLVED',
          authorizationDecision: execRes.authorizationDecision,
          executionStatus: execRes.executionStatus,
          ruleTriggered: execRes.matchedRuleId || 'POL-DATA-RESOLVE-FAIL',
          reason: 'Unresolved object failed closed; refused to default to PUBLIC.',
          executorInvoked: execRes.executorInvocationEvidence.executed,
        };
      }
    }
  }
}

export const CrossAgentGuard = new CrossAgentGuardImpl();
