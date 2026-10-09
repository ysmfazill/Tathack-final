import React from 'react';
import { clsx } from 'clsx';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tag?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  tag,
  onClear,
  value,
  onChange,
  className,
  placeholder = 'Search telemetry, logs, or signals...',
  ...props
}) => {
  return (
    <div className={clsx('relative flex items-center', className)}>
      <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline pointer-events-none">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-8 pr-24 py-1.5 bg-surface-container border border-outline-variant/30 text-on-surface font-mono-code text-mono-code rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60 shadow-sm transition-colors"
        {...props}
      />
      <div className="absolute right-2 flex items-center gap-1">
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-0.5 text-outline hover:text-on-surface transition-colors"
            title="Clear search"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}
        {tag && (
          <span className="px-1.5 py-0.5 bg-surface-container-high rounded text-[10px] font-label-caps text-outline uppercase tracking-wider select-none">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
};
