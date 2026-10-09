import React from 'react';

interface PolicyCategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchFilter: string;
  onSearchFilterChange: (filter: string) => void;
}

export const PolicyCategoryTabs: React.FC<PolicyCategoryTabsProps> = ({
  activeTab,
  onTabChange,
  searchFilter,
  onSearchFilterChange,
}) => {
  const tabs = [
    { id: 'classification', label: 'Data Classification' },
    { id: 'transfers', label: 'Agent-to-Agent Transfers', count: '4 Rules' },
    { id: 'destinations', label: 'Destination Restrictions' },
    { id: 'tools', label: 'Tool Permissions' },
    { id: 'approvals', label: 'Human Approval' },
    { id: 'output', label: 'Output Protection' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md p-space-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/30">
      <div className="flex items-center gap-space-xs overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-space-md py-1.5 rounded font-body-sm text-body-sm transition-colors whitespace-nowrap flex items-center gap-space-xs ${
                isActive
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
              type="button"
            >
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono-code ${
                    isActive
                      ? 'bg-surface-container-lowest text-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-space-sm self-end md:self-auto w-full md:w-auto">
        <div className="relative w-full md:w-56">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-outline">
            search
          </span>
          <input
            className="w-full bg-surface-container text-on-surface placeholder:text-outline text-body-sm font-body-sm pl-8 pr-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
            placeholder="Filter rules..."
            type="text"
            value={searchFilter}
            onChange={(e) => onSearchFilterChange(e.target.value)}
          />
        </div>
        <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container text-secondary font-label-caps text-label-caps tracking-wider whitespace-nowrap border border-outline-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          STRICT ENFORCEMENT
        </div>
      </div>
    </div>
  );
};
