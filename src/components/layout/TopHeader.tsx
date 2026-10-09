import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
}

interface RouteMeta {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: 'Security Overview',
    description: 'Monitor threats, inspect agent behavior, and enforce tool permissions.',
  },
  '/overview': {
    title: 'Security Overview',
    description: 'Monitor threats, inspect agent behavior, and enforce tool permissions.',
  },
  '/attack-playground': {
    title: 'Attack Playground',
    description: 'Simulate adversarial attacks, prompt injections, and jailbreaks in real time.',
  },
  '/live-analysis': {
    title: 'Live Attack Analysis',
    description: 'Investigate attack signals, inspect agent behavior, and understand security decisions.',
  },
  '/policies': {
    title: 'Policy Center',
    description: 'Configure behavioral guardrails, heuristic firewall rules, and mitigation strategies.',
  },
  '/audit-logs': {
    title: 'Audit Logs',
    description: 'Immutable event telemetry, model interactions, and heuristic decision records.',
  },
  '/evaluation-lab': {
    title: 'Evaluation Lab',
    description: 'Automated benchmark suites, red-teaming test harness, and behavioral metrics.',
  },
  '/settings': {
    title: 'Settings',
    description: 'Configure model connectivity, runtime components, risk thresholds, and application health.',
  },
};

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const meta = ROUTE_META[location.pathname] || {
    title: 'PromptGuard AI',
    description: 'Behavioral Firewall for AI Agents',
  };

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 z-30 px-4 sm:px-gutter-lg flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Headings */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="flex flex-col min-w-0">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight leading-tight truncate">
            {meta.title}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate hidden md:block">
            {meta.description}
          </span>
        </div>
      </div>

      {/* Right: Telemetry Chips, Notification, User Profile */}
      <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
        {/* Protection Active Badge */}
        <div className="hidden sm:inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-tertiary-container/20 border border-tertiary/30 select-none">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="font-label-caps text-label-caps text-tertiary font-medium tracking-wide uppercase">
            Protection Active
          </span>
        </div>

        {/* Model Engine Pill */}
        <div className="hidden md:inline-flex items-center gap-space-xs px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span className="font-mono-code text-[11px] text-on-surface-variant tracking-wider uppercase">
            Model: <span className="text-secondary font-semibold">Ollama</span>
          </span>
        </div>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-container-high border border-outline-variant/40 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-2 border-b border-outline-variant/20 flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider font-semibold">
                  Recent Telemetry Alerts
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-code bg-error-container/20 text-error">
                  2 NEW
                </span>
              </div>
              <div className="divide-y divide-outline-variant/10 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-surface-bright/40 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    <span className="font-mono-code text-xs text-error font-semibold">
                      Unauthorized Tool Intercepted
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Attempt to execute export_sync() with tainted parameters blocked.
                  </p>
                  <span className="font-mono-code text-[10px] text-outline mt-1 block">
                    2 mins ago • SIG-2025-IND-7049
                  </span>
                </div>
                <div className="p-3 hover:bg-surface-bright/40 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-mono-code text-xs text-secondary font-semibold">
                      Cross-Agent Boundary Checked
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Report Agent payload sanitized through quarantine gateway.
                  </p>
                  <span className="font-mono-code text-[10px] text-outline mt-1 block">
                    8 mins ago • REQ-DEMO-884
                  </span>
                </div>
              </div>
              <div className="p-2 border-t border-outline-variant/20 text-center">
                <span className="font-mono-code text-[11px] text-secondary hover:underline cursor-pointer">
                  View All in Audit Logs →
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-space-sm pl-space-xs sm:border-l sm:border-outline-variant/30 text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center font-bold text-xs text-primary shrink-0">
              SA
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-body-sm text-body-sm text-on-surface font-medium leading-none">
                SecOps Admin
              </span>
              <span className="font-mono-code text-[11px] text-on-surface-variant leading-none mt-1">
                admin@promptguard.ai
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              expand_more
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-high border border-outline-variant/40 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <p className="font-body-md text-sm font-semibold text-on-surface">SecOps Admin</p>
                <p className="font-mono-code text-[11px] text-on-surface-variant truncate">
                  admin@promptguard.ai
                </p>
              </div>
              <div className="py-1">
                <div className="px-4 py-2 text-xs font-mono-code text-on-surface-variant flex items-center justify-between">
                  <span>Role:</span>
                  <span className="text-secondary font-medium">Security Director</span>
                </div>
                <div className="px-4 py-2 text-xs font-mono-code text-on-surface-variant flex items-center justify-between">
                  <span>Session:</span>
                  <span className="text-tertiary font-medium">Verified Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
