import React from 'react';
import { clsx } from 'clsx';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md mb-space-md border-b border-outline-variant/20',
        className
      )}
    >
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {icon && (
            <span className="material-symbols-outlined text-[20px] text-secondary">
              {icon}
            </span>
          )}
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: 'lowest' | 'low' | 'default' | 'high';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  elevation = 'low',
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
    <section
      className={clsx(
        'rounded-xl border border-outline-variant/30 shadow-sm flex flex-col',
        elevationStyles[elevation],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <PanelHeader
          title={title || ''}
          subtitle={subtitle}
          icon={icon}
          badge={badge}
          actions={actions}
        />
      )}
      <div className="w-full">{children}</div>
    </section>
  );
};
