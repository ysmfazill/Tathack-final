/**
 * PromptGuard AI — Core Security Boundary Types
 * 
 * CORE INVARIANT:
 * 1. The Model PROPOSES actions.
 * 2. The Backend Policy Engine AUTHORIZES actions.
 * 3. The Controlled Gateway EXECUTES only authorized actions.
 * 
 * Authorization decisions (ALLOW/DENY/REQUIRE_APPROVAL) are strictly decoupled
 * from execution outcomes (NOT_EXECUTED/BLOCKED/EXECUTED_IN_SIMULATION/FAILED).
 */

export type AuthorizationDecision = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';

export type ExecutionStatus =
  | 'NOT_EXECUTED'
  | 'BLOCKED'
  | 'EXECUTED_IN_SIMULATION'
  | 'FAILED'
  | 'PENDING'
  | 'UNKNOWN';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export type DestinationType = 'INTERNAL' | 'EXTERNAL' | 'PARTNER' | 'QUARANTINE';

export interface TrustedDestination {
  id: string;
  name: string;
  type: DestinationType;
  approved: boolean;
  allowedClassifications: DataClassification[];
  allowedAgents: string[];
  requiresApprovalFor: DataClassification[];
}

export interface DataEnvelope {
  objectId: string;
  name: string;
  trustedClassification: DataClassification;
  sourceAgentId: string;
  currentAgentId: string;
  provenanceChain: string[];
  taintFlags: string[];
  payload: Record<string, any>;
  createdAt: string;
}

export interface ToolProposal {
  toolName: string;
  args: Record<string, any>;
  proposedByAgentId: string;
  targetObjectId?: string;
  targetDestinationId?: string;
  // Untrusted model-supplied claims that MUST NOT override backend context:
  untrustedModelClaims?: {
    claimedClassification?: string;
    claimedDestinationType?: string;
    claimedApprovalStatus?: boolean;
  };
}

export interface ScannerSignal {
  layer: 'lexical' | 'unicode_normalizer' | 'semantic_intent' | 'honey_tool' | 'dlp_output';
  detected: boolean;
  score: number; // 0.0 to 1.0
  reason: string;
  matchedPattern?: string;
}

export interface ScannerResult {
  isFlagged: boolean;
  compositeRiskScore: number; // 0.0 to 1.0
  signals: ScannerSignal[];
  sanitizedInput: string;
  normalizedInput: string;
}

export interface SecurityContext {
  traceId: string;
  timestamp: string;
  actorAgentId: string;
  targetAgentId?: string;
  proposal: ToolProposal;
  resolvedData?: DataEnvelope;
  resolvedDestination?: TrustedDestination;
  scannerResult?: ScannerResult;
  isPolicyServiceAvailable?: boolean;
}

export interface AuthorizationResult {
  decision: AuthorizationDecision;
  matchedRuleId: string;
  matchedRuleName: string;
  reason: string;
  isMandatoryDeny: boolean;
  riskScore: number;
  evaluatedAt: string;
}

export interface ExecutionResult {
  traceId: string;
  toolName: string;
  authorizationDecision: AuthorizationDecision;
  executionStatus: ExecutionStatus;
  output?: any;
  error?: string;
  executorInvocationEvidence: {
    executed: boolean;
    invocationIndex: number;
    timestamp: string;
  };
  matchedRuleId?: string;
  auditId: string;
}

export interface AuditRecord {
  id: string;
  traceId: string;
  timestamp: string;
  agentId: string;
  targetAgentId?: string;
  toolName: string;
  sanitizedArgs: Record<string, any>;
  dataClassification?: DataClassification;
  destinationId?: string;
  decision: AuthorizationDecision;
  matchedRuleId?: string;
  matchedRuleName?: string;
  riskScore: number;
  executionStatus: ExecutionStatus;
  executorInvocationCount: number;
  policyVersion: string;
  sha256Hash: string;
}
