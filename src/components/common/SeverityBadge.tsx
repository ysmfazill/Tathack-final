import React from 'react';
import { clsx } from 'clsx';
import { SeverityLevel } from '../../types';

interface SeverityBadgeProps {
  level: SeverityLevel;
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  level,
  size = 'md',
  className,
  showDot = true,
}) => {
  const styles: Record<SeverityLevel, { container: string; dot: string; text: string }> = {
    CRITICAL: {
      container: 'bg-error-container/30 text-error border-error/40',
      dot: 'bg-error',
      text: 'CRITICAL',
    },
    HIGH: {
      container: 'bg-error-container/20 text-[#f87171] border-error/30',
      dot: 'bg-[#f87171]',
      text: 'HIGH',
    },
    MEDIUM: {
      container: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
      dot: 'bg-[#fbbf24]',
      text: 'MEDIUM',
    },
    LOW: {
      container: 'bg-secondary-container/20 text-secondary border-secondary/30',
      dot: 'bg-secondary',
      text: 'LOW',
    },
    BENIGN: {
      container: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
      dot: 'bg-tertiary',
      text: 'BENIGN',
    },
    INFO: {
      container: 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
      dot: 'bg-outline',
      text: 'INFO',
    },
  };

  const current = styles[level] || styles.INFO;
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-label-caps px-2 py-0.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded font-label-caps font-semibold uppercase tracking-wider border select-none',
        sizeStyles[size],
        current.container,
        className
      )}
    >
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', current.dot)} />}
      {current.text}
    </span>
  );
};
