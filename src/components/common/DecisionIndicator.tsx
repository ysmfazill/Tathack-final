import React from 'react';
import { clsx } from 'clsx';
import { PolicyDecision } from '../../types';

interface DecisionIndicatorProps {
  decision: PolicyDecision;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const DecisionIndicator: React.FC<DecisionIndicatorProps> = ({
  decision,
  size = 'md',
  className,
  showIcon = true,
}) => {
  const config: Record<
    PolicyDecision,
    { container: string; icon: string; text: string; label: string }
  > = {
    BLOCKED: {
      container: 'bg-error-container/30 text-error border-error/40',
      icon: 'gpp_bad',
      text: 'text-error',
      label: 'ACTION BLOCKED',
    },
    QUARANTINED: {
      container: 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/40',
      icon: 'sync_problem',
      text: 'text-[#fbbf24]',
      label: 'QUARANTINED',
    },
    ESCALATED: {
      container: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
      icon: 'shield_person',
      text: 'text-[#fbbf24]',
      label: 'APPROVAL ESCALATED',
    },
    ALLOWED: {
      container: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
      icon: 'verified_user',
      text: 'text-tertiary',
      label: 'ALLOWED & CLEAN',
    },
    REWRITTEN: {
      container: 'bg-secondary-container/20 text-secondary border-secondary/30',
      icon: 'auto_fix_high',
      text: 'text-secondary',
      label: 'TAINT SANITIZED',
    },
  };

  const current = config[decision] || config.BLOCKED;

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 text-[11px]',
    md: 'text-label-caps px-2.5 py-1',
    lg: 'text-body-md px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-lg border font-mono-code font-semibold tracking-wider uppercase select-none shadow-sm',
        sizeStyles[size],
        current.container,
        className
      )}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-[16px]">{current.icon}</span>
      )}
      <span>{current.label}</span>
    </span>
  );
};
