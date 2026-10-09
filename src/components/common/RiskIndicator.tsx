import React from 'react';
import { clsx } from 'clsx';

interface RiskIndicatorProps {
  score: number; // 0.00 to 1.00
  label?: string;
  showBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  score,
  label,
  showBar = true,
  size = 'md',
  className,
}) => {
  const percentage = Math.min(Math.max(score * 100, 0), 100);

  let color = 'text-tertiary';
  let barColor = 'bg-tertiary';
  let riskText = 'LOW';
  let badgeBg = 'bg-tertiary-container/20 border-tertiary/30';

  if (score >= 0.85) {
    color = 'text-error';
    barColor = 'bg-error';
    riskText = 'CRITICAL';
    badgeBg = 'bg-error-container/30 border-error/40 text-error';
  } else if (score >= 0.6) {
    color = 'text-[#f87171]';
    barColor = 'bg-[#f87171]';
    riskText = 'HIGH';
    badgeBg = 'bg-error-container/20 border-error/30 text-[#f87171]';
  } else if (score >= 0.35) {
    color = 'text-[#fbbf24]';
    barColor = 'bg-[#fbbf24]';
    riskText = 'MEDIUM';
    badgeBg = 'bg-[#f59e0b]/20 border-[#f59e0b]/30 text-[#fbbf24]';
  }

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {label && (
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              {label}
            </span>
          )}
          <span
            className={clsx(
              'px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase border',
              badgeBg
            )}
          >
            {riskText}
          </span>
        </div>
        <span
          className={clsx(
            'font-mono-metric font-semibold',
            size === 'lg' ? 'text-headline-md' : 'text-sm',
            color
          )}
        >
          {score.toFixed(2)} / 1.00
        </span>
      </div>

      {showBar && (
        <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-outline-variant/20">
          <div
            className={clsx('h-full transition-all duration-500', barColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
