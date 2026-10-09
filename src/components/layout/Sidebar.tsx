import React from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import { NavItem } from '../../types';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', path: '/overview', icon: 'grid_view', exact: true },
  { name: 'Attack Playground', path: '/attack-playground', icon: 'security' },
  { name: 'Live Attack Analysis', path: '/live-analysis', icon: 'biotech' },
  { name: 'Policy Center', path: '/policies', icon: 'policy' },
  { name: 'Audit Logs', path: '/audit-logs', icon: 'terminal' },
  { name: 'Evaluation Lab', path: '/evaluation-lab', icon: 'science' },
  { name: 'Settings', path: '/settings', icon: 'tune' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded bg-primary-container/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  shield_lock
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none truncate font-semibold">
                  PromptGuard AI
                </span>
                <span className="font-label-caps text-label-caps text-secondary tracking-widest mt-0.5 uppercase">
                  Behavioral Firewall
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface"
                aria-label="Close Sidebar"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs p-space-md" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.path} item={item} onClick={onClose} />
            ))}
          </nav>
        </div>

        {/* Footer System Status Widget */}
        <div className="p-space-md border-t border-outline-variant/20 flex flex-col gap-space-sm bg-surface-container-lowest/50">
          <div className="flex items-center justify-between px-space-sm py-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-mono-code text-mono-code text-on-surface-variant">
                Engine:
              </span>
            </div>
            <span className="font-mono-code text-mono-code text-tertiary font-semibold">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container border border-outline-variant/30">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                LOCAL DEV
              </span>
            </div>
            <span className="font-mono-code text-[11px] text-outline">v0.1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
