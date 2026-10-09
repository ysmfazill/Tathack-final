import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'lowest' | 'low' | 'default' | 'high';
  border?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  elevation = 'low',
  border = true,
  interactive = false,
  padding = 'lg',
  children,
  className,
  ...props
}) => {
  const elevationStyles = {
    lowest: 'bg-surface-container-lowest',
    low: 'bg-surface-container-low',
    default: 'bg-surface-container',
    high: 'bg-surface-container-high',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-space-sm',
    md: 'p-space-md',
    lg: 'p-space-lg',
    xl: 'p-6',
  };

  return (
    <div
      className={clsx(
        'rounded-xl transition-all',
        elevationStyles[elevation],
        paddingStyles[padding],
        border && 'border border-outline-variant/30',
        interactive &&
          'hover:border-primary/50 hover:bg-surface-container cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
