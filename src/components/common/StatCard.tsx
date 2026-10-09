import React from 'react';
import { clsx } from 'clsx';
import { MetricCardProps } from '../../types';

export const StatCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  trend,
  trendPositive = true,
  tag = 'DEMO DATA',
  icon,
  variant = 'default',
  className,
}) => {
  const valueColorStyles: Record<'default' | 'error' | 'tertiary' | 'secondary' | 'warning', string> = {
    default: 'text-on-surface',
    error: 'text-error',
    tertiary: 'text-tertiary',
    secondary: 'text-secondary',
    warning: 'text-[#fbbf24]',
  };

  const iconStyles: Record<'default' | 'error' | 'tertiary' | 'secondary' | 'warning', string> = {
    default: 'text-primary bg-surface-container border-outline-variant/30',
    error: 'text-error bg-error-container/20 border-error/30',
    tertiary: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
    secondary: 'text-secondary bg-secondary-container/20 border-secondary/30',
    warning: 'text-[#fbbf24] bg-[#f59e0b]/20 border-[#f59e0b]/30',
  };

  return (
    <div
      className={clsx(
        'bg-surface-container-low p-5 sm:p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors',
        className
      )}
    >
      {/* Top row: Label & Tag */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-col min-w-0">
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            {label}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={clsx(
                'font-headline-xl text-[32px] sm:text-[36px] leading-tight font-bold tracking-tight',
                valueColorStyles[variant]
              )}
            >
              {value}
            </span>
            {trend && (
              <span
                className={clsx(
                  'font-label-caps text-[11px] font-semibold flex items-center',
                  trendPositive ? 'text-tertiary' : 'text-error'
                )}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {trendPositive ? 'trending_up' : 'trending_down'}
                </span>
                {trend}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={clsx(
              'w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105',
              iconStyles[variant]
            )}
          >
            <span className="material-symbols-outlined text-[24px]">{icon}</span>
          </div>
        )}
      </div>

      {/* Bottom row: Sublabel & Tag */}
      {(sublabel || tag) && (
        <div className="flex items-center justify-between pt-2.5 border-t border-outline-variant/20 text-[12px] gap-2">
          {sublabel && (
            <span className="text-on-surface-variant font-body-sm truncate">
              {sublabel}
            </span>
          )}
          {tag && (
            <span className="px-1.5 py-0.5 rounded bg-surface-container font-mono-code text-[10px] text-outline font-medium shrink-0">
              {tag}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
