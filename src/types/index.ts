export interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  exact?: boolean;
}

export type StatusVariant =
  | 'tertiary'      // emerald / pass / active
  | 'error'         // crimson / blocked / critical
  | 'warning'       // amber / review / suspicious
  | 'secondary'     // cyan / sandbox / stream
  | 'primary'       // blue / accent
  | 'neutral';      // gray / inactive / default

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'BENIGN' | 'INFO';

export type PolicyDecision = 'BLOCKED' | 'ALLOWED' | 'QUARANTINED' | 'ESCALATED' | 'REWRITTEN';

export interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  trendPositive?: boolean;
  tag?: string;
  icon?: string;
  variant?: 'default' | 'error' | 'tertiary' | 'secondary' | 'warning';
  className?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  targetAgent?: string;
  vector: string;
  severity: SeverityLevel;
  decision: PolicyDecision;
  riskScore: number;
  policyTriggered?: string;
  targetTool?: string;
  payloadFingerprint: string;
  details: {
    userPrompt: string;
    injectedContent?: string;
    taintedParameters?: string[];
    rawTelemetry: Record<string, any>;
    sha256Hash: string;
    latencyMs: number;
  };
}

export interface PolicyRule {
  id: string;
  name: string;
  category: 'tool' | 'dlp' | 'injection' | 'pii' | 'hitl';
  description: string;
  severity: SeverityLevel;
  action: PolicyDecision;
  enabled: boolean;
  targetAgents: string[];
  restrictedTools?: string[];
  enforcementMode: 'STRICT' | 'LOG_ONLY' | 'QUARANTINE';
  lastModified: string;
}

export interface TestScenario {
  id: string;
  title: string;
  category: string;
  severity: number;
  vector: string;
  description: string;
  badgeVariant: StatusVariant;
  defaultTask: string;
  defaultUntrusted: string;
  expectedDecision: PolicyDecision;
  expectedRule: string;
}

export interface BenchmarkCase {
  id: string;
  name: string;
  category: 'Direct Injection' | 'Indirect Injection' | 'Cross-Agent Leakage' | 'Jailbreak' | 'Benign Control';
  prompt: string;
  payload: string;
  expectedOutcome: 'BLOCK' | 'ALLOW' | 'QUARANTINE';
  actualOutcome: 'BLOCK' | 'ALLOW' | 'QUARANTINE';
  passed: boolean;
  defenseLayer: string;
  latencyMs: number;
}

export interface BenchmarkMetrics {
  attackSuccessRate: number; // e.g. 4.2%
  baselineAttackSuccessRate: number; // e.g. 88.0%
  attackBlockingRate: number; // e.g. 95.8%
  blockedCount: number;
  totalAttacks: number;
  falsePositiveRate: number; // e.g. 2.1%
  benignBlockedCount: number;
  totalBenign: number;
  taskAccuracyRate: number; // e.g. 97.9%
  avgLatencyMs: number;
  datasetName: string;
  totalCases: number;
  lastRunTimestamp: string;
}

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'ISOLATED' | 'QUARANTINED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  ipAddress?: string;
}
