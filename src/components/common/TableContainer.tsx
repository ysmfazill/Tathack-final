import React from 'react';
import { clsx } from 'clsx';

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string;
  headerAction?: React.ReactNode;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className,
  headerTitle,
  headerAction,
}) => {
  return (
    <div
      className={clsx(
        'w-full bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm',
        className
      )}
    >
      {(headerTitle || headerAction) && (
        <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant/20 bg-surface-container/50">
          {headerTitle && (
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              {headerTitle}
            </h3>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
