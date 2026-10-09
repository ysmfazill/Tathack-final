import type { DataClassification, DataEnvelope } from './types.ts';

/**
 * Taint & Provenance Tracker
 * 
 * Manages immutable data envelopes across multi-agent hops.
 * Agents cannot silently drop or tamper with classification tags or taint flags.
 */
class TaintTrackerImpl {
  public createEnvelope(
    objectId: string,
    name: string,
    classification: DataClassification,
    sourceAgentId: string,
    payload: Record<string, any>,
    initialTaintFlags: string[] = []
  ): DataEnvelope {
    return {
      objectId,
      name,
      trustedClassification: classification,
      sourceAgentId,
      currentAgentId: sourceAgentId,
      provenanceChain: [sourceAgentId],
      taintFlags: [...initialTaintFlags],
      payload: { ...payload },
      createdAt: new Date().toISOString(),
    };
  }

  public transferToAgent(
    envelope: DataEnvelope,
    receivingAgentId: string,
    untrustedInputMerged: boolean = false
  ): DataEnvelope {
    const updatedProvenance = [...envelope.provenanceChain, receivingAgentId];
    const updatedTaints = new Set(envelope.taintFlags);

    if (untrustedInputMerged) {
      updatedTaints.add('UNTRUSTED_CONTENT_MERGED');
    }

    return {
      ...envelope,
      currentAgentId: receivingAgentId,
      provenanceChain: updatedProvenance,
      taintFlags: Array.from(updatedTaints),
    };
  }

  public sanitizeWithPolicy(
    envelope: DataEnvelope,
    allowedDowngradeTo: DataClassification,
    removedTaints: string[],
    authorizingRuleId: string
  ): DataEnvelope {
    const updatedTaints = envelope.taintFlags.filter((t) => !removedTaints.includes(t));
    return {
      ...envelope,
      trustedClassification: allowedDowngradeTo,
      taintFlags: [...updatedTaints, `SANITIZED_VIA_${authorizingRuleId}`],
      provenanceChain: [...envelope.provenanceChain, `sanitized_by_${authorizingRuleId}`],
    };
  }

  public hasTaint(envelope: DataEnvelope, flag: string): boolean {
    return envelope.taintFlags.includes(flag);
  }
}

export const TaintTracker = new TaintTrackerImpl();
