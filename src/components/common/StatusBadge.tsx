import React from 'react';
import { clsx } from 'clsx';
import { StatusVariant } from '../../types';

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  dot?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  children,
  dot = false,
  pulse = false,
  size = 'md',
  className,
}) => {
  const variantStyles = {
    tertiary: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
    error: 'bg-error-container/20 text-error border-error/30',
    warning: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
    secondary: 'bg-secondary-container/20 text-secondary border-secondary/30',
    primary: 'bg-primary-container/20 text-primary border-primary/30',
    neutral: 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
  };

  const dotColors = {
    tertiary: 'bg-tertiary',
    error: 'bg-error',
    warning: 'bg-[#fbbf24]',
    secondary: 'bg-secondary',
    primary: 'bg-primary',
    neutral: 'bg-outline',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-label-caps px-2 py-0.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded font-label-caps font-medium uppercase tracking-wider border transition-colors',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};
