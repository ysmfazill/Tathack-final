import React from 'react';
import { clsx } from 'clsx';

interface PageHeaderProps {
  title: string;
  tagline?: string;
  categoryBadge?: string;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  tagline,
  categoryBadge,
  statusBadge,
  actions,
  className,
}) => {
  return (
    <div
      className={clsx(
        'w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-space-md border-b border-outline-variant/20',
        className
      )}
    >
      <div className="flex flex-col min-w-0 flex-1">
        {categoryBadge && (
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest block mb-0.5">
            {categoryBadge}
          </span>
        )}
        <div className="flex items-center gap-space-sm flex-wrap">
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
            {title}
          </h1>
          {statusBadge}
        </div>
        {tagline && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            {tagline}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
};
