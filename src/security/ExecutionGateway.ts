import { PolicyEngine } from './PolicyEngine.ts';
import type { ExecutionResult, SecurityContext } from './types.ts';

/**
 * Instrumented Simulated Tool Executor
 * 
 * Tracks invocation counts to provide verifiable empirical proof that
 * denied actions never reach the execution boundary.
 */
class SimulatedToolExecutorImpl {
  private invocationCount = 0;
  private executionLog: Array<{ toolName: string; args: any; traceId: string; timestamp: string }> = [];

  public execute(toolName: string, args: Record<string, any>, traceId: string): any {
    this.invocationCount++;
    const record = {
      toolName,
      args: { ...args },
      traceId,
      timestamp: new Date().toISOString(),
    };
    this.executionLog.push(record);

    // Deterministic safe mock execution
    switch (toolName) {
      case 'fetch_employee_record':
        return { status: 'success', recordId: args.objectId || 'DATA-HR-101', bytesRead: 512 };
      case 'generate_report_summary':
        return { status: 'success', summary: 'Clean aggregated employee report generated.', rowsProcessed: 42 };
      case 'export_public_doc':
        return { status: 'success', exportedUrl: 'https://company.internal/docs/public.pdf' };
      case 'export_sync':
        return { status: 'success', recordsTransferred: 1, destination: args.destinationId };
      case 'quarantine_payload':
        return { status: 'success', quarantinedInSandbox: true };
      default:
        return { status: 'executed_simulated' };
    }
  }

  public getInvocationCount(): number {
    return this.invocationCount;
  }

  public resetInvocationCount(): void {
    this.invocationCount = 0;
    this.executionLog = [];
  }

  public getExecutionLog() {
    return [...this.executionLog];
  }
}

export const SimulatedToolExecutor = new SimulatedToolExecutorImpl();

/**
 * Controlled Execution Gateway
 * 
 * CORE SECURITY INVARIANT:
 * All tool actions MUST pass through this gateway.
 * The executor CANNOT be reached if authorization is DENIED or REQUIRE_APPROVAL.
 */
class ExecutionGatewayImpl {
  public executeAction(context: SecurityContext): ExecutionResult {
    const authResult = PolicyEngine.evaluate(context);
    const traceId = context.traceId || `TRC-${Date.now()}`;
    const auditId = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (authResult.decision === 'DENY') {
      // INVARIANT: Executor is NOT called when denied.
      return {
        traceId,
        toolName: context.proposal.toolName,
        authorizationDecision: 'DENY',
        executionStatus: 'BLOCKED',
        error: authResult.reason,
        matchedRuleId: authResult.matchedRuleId,
        executorInvocationEvidence: {
          executed: false,
          invocationIndex: SimulatedToolExecutor.getInvocationCount(),
          timestamp: new Date().toISOString(),
        },
        auditId,
      };
    }

    if (authResult.decision === 'REQUIRE_APPROVAL') {
      // INVARIANT: Executor is NOT called while awaiting approval.
      return {
        traceId,
        toolName: context.proposal.toolName,
        authorizationDecision: 'REQUIRE_APPROVAL',
        executionStatus: 'PENDING',
        error: authResult.reason,
        matchedRuleId: authResult.matchedRuleId,
        executorInvocationEvidence: {
          executed: false,
          invocationIndex: SimulatedToolExecutor.getInvocationCount(),
          timestamp: new Date().toISOString(),
        },
        auditId,
      };
    }

    // Authorization is ALLOW: Dispatch to instrumented executor
    const output = SimulatedToolExecutor.execute(
      context.proposal.toolName,
      context.proposal.args,
      traceId
    );

    return {
      traceId,
      toolName: context.proposal.toolName,
      authorizationDecision: 'ALLOW',
      executionStatus: 'EXECUTED_IN_SIMULATION',
      output,
      matchedRuleId: authResult.matchedRuleId,
      executorInvocationEvidence: {
        executed: true,
        invocationIndex: SimulatedToolExecutor.getInvocationCount(),
        timestamp: new Date().toISOString(),
      },
      auditId,
    };
  }
}

export const ExecutionGateway = new ExecutionGatewayImpl();
