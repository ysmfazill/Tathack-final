import React from 'react';
import { clsx } from 'clsx';

interface FormFieldProps {
  label?: string;
  sublabel?: string;
  badge?: string;
  badgeVariant?: 'error' | 'secondary' | 'tertiary' | 'primary' | 'neutral';
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  sublabel,
  badge,
  badgeVariant = 'neutral',
  error,
  children,
  className,
}) => {
  const badgeStyles = {
    error: 'bg-error-container/20 text-error border-error/30',
    secondary: 'bg-secondary-container/20 text-secondary border-secondary/30',
    tertiary: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
    primary: 'bg-primary-container/20 text-primary border-primary/30',
    neutral: 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
  };

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {(label || badge) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {label && (
              <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider font-semibold">
                {label}
              </label>
            )}
            {badge && (
              <span
                className={clsx(
                  'px-1.5 py-0.2 border text-[10px] font-mono-code rounded uppercase tracking-wider',
                  badgeStyles[badgeVariant]
                )}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
      {children}
      {sublabel && (
        <span className="font-body-sm text-[12px] text-outline">{sublabel}</span>
      )}
      {error && (
        <span className="font-mono-code text-[12px] text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </span>
      )}
    </div>
  );
};
