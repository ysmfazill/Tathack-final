import React, { useState } from 'react';
import { clsx } from 'clsx';
import { EmptyState } from './States';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  renderExpandedRow?: (item: T) => React.ReactNode;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  renderExpandedRow,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  className,
}: DataTableProps<T>) {
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

  const toggleRowExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRowKey((prev) => (prev === key ? null : key));
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-on-surface-variant font-mono-code text-sm">
        <span className="material-symbols-outlined text-[24px] animate-spin mb-2">
          progress_activity
        </span>
        <p>Loading table telemetry...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={clsx('w-full overflow-x-auto', className)}>
      <table className="w-full text-left border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-outline-variant/30 bg-surface-container/60 text-outline font-label-caps text-[11px] uppercase tracking-wider select-none">
            {renderExpandedRow && <th className="py-2.5 px-3 w-8" />}
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'py-2.5 px-3.5 font-semibold text-outline-variant/90',
                  col.width,
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/15 font-mono-code text-[13px]">
          {data.map((item, index) => {
            const rowKey = keyExtractor(item);
            const isExpanded = expandedRowKey === rowKey;

            return (
              <React.Fragment key={rowKey}>
                <tr
                  onClick={() => onRowClick?.(item)}
                  className={clsx(
                    'transition-colors hover:bg-surface-container-high/60 group',
                    index % 2 === 0 ? 'bg-surface-container-low/40' : 'bg-surface-container-low/10',
                    onRowClick && 'cursor-pointer',
                    isExpanded && 'bg-surface-container-high/80'
                  )}
                >
                  {renderExpandedRow && (
                    <td className="py-2.5 px-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={(e) => toggleRowExpand(rowKey, e)}
                        className="p-0.5 text-outline hover:text-on-surface rounded transition-transform"
                        title={isExpanded ? 'Collapse row' : 'Expand payload'}
                      >
                        <span
                          className={clsx(
                            'material-symbols-outlined text-[16px] transition-transform duration-200 block',
                            isExpanded && 'rotate-90 text-primary'
                          )}
                        >
                          chevron_right
                        </span>
                      </button>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        'py-2.5 px-3.5 align-middle text-on-surface',
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      )}
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item as any)[col.key]?.toString() || '-'}
                    </td>
                  ))}
                </tr>

                {/* Expandable Drawer Row */}
                {renderExpandedRow && isExpanded && (
                  <tr className="bg-surface-container-lowest/80 border-b border-outline-variant/30">
                    <td colSpan={columns.length + 1} className="p-4">
                      {renderExpandedRow(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
