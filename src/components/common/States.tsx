import React from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';

interface StateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingState: React.FC<StateProps> = ({
  title = 'Loading Telemetry Stream...',
  description = 'Connecting to behavioral firewall telemetry engine.',
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl bg-surface-container-low border border-outline-variant/30',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
      <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
        {title}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
        {description}
      </p>
    </div>
  );
};

interface EmptyStateProps extends StateProps {
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Telemetry Records Found',
  description = 'No security events matched the current filter criteria.',
  icon = 'search_off',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl bg-surface-container-low border border-outline-variant/30',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-outline mb-4 border border-outline-variant/30">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
        {title}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

interface ErrorStateProps extends StateProps {
  error?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to Load Telemetry Stream',
  description = 'An error occurred while establishing connection to the engine.',
  error,
  onRetry,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl bg-surface-container-low border border-error/30',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-error-container/20 flex items-center justify-center text-error mb-4 border border-error/40">
        <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
      </div>
      <h4 className="font-headline-md text-headline-md text-error font-semibold mb-1">
        {title}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-2">
        {description}
      </p>
      {error && (
        <div className="p-2 rounded bg-surface-container-lowest font-mono-code text-[12px] text-error mb-4 max-w-md break-all">
          {error}
        </div>
      )}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon="refresh">
          Retry Connection
        </Button>
      )}
    </div>
  );
};
