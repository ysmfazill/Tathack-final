import React from 'react';
import { Button } from '../common/Button';

interface SettingsHeaderProps {
  lastUpdated: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  lastUpdated,
  isSaving,
  hasUnsavedChanges,
  onDiscard,
  onSave,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-outline-variant/30">
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-space-sm mb-1.5 flex-wrap">
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Settings
          </h1>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-secondary-container/20 text-secondary border border-secondary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
              LOCAL DEVELOPMENT
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary border border-tertiary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
              CONFIG: PERSISTED (v1.4.2)
            </span>
          </div>
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-warning/20 text-warning font-mono-code text-[11px] border border-warning/40 animate-pulse">
              ● Unsaved Changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-space-sm text-on-surface-variant flex-wrap font-body-sm text-xs sm:text-sm">
          <p className="text-on-surface-variant">
            Configure model connectivity, runtime components, risk thresholds, and application health.
          </p>
          <span className="text-outline">/</span>
          <span className="font-mono-code text-[11px] text-outline">
            LAST UPDATED: {lastUpdated}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-space-sm shrink-0">
        <Button
          variant="secondary"
          icon="undo"
          onClick={onDiscard}
          disabled={!hasUnsavedChanges || isSaving}
        >
          Discard Unsaved
        </Button>
        <Button
          variant="primary"
          icon={isSaving ? 'sync' : 'save'}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
