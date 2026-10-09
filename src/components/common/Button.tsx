import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 font-body-md font-medium transition-all focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs rounded',
    md: 'px-3.5 py-2 text-sm rounded-lg',
    lg: 'px-4 py-2.5 text-base rounded-lg',
  };

  const variantStyles = {
    primary:
      'bg-primary text-on-primary font-semibold hover:bg-primary-fixed-dim shadow-sm border border-transparent',
    secondary:
      'bg-surface-container-high text-on-surface hover:bg-surface-bright border border-outline-variant/40 shadow-sm',
    ghost:
      'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    danger:
      'bg-error-container/20 text-error hover:bg-error-container/40 border border-error/30',
    outline:
      'bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 shadow-sm',
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined text-[16px] animate-spin">
          progress_activity
        </span>
      ) : (
        icon &&
        iconPosition === 'left' && (
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        )
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
    </button>
  );
};
