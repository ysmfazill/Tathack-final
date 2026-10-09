import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { getSettings, updateSettings } from '../../lib/api';

export const RuntimeSecurityControls: React.FC = () => {
  const [config, setConfig] = useState({
    enforce_mandatory_deny: true,
    require_approval_for_destructive: true,
    log_level: 'INFO'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getSettings('security').then(res => setConfig(res.data)).catch(console.error);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('security', config);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">shield_lock</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Runtime Security Controls
            </h2>
          </div>
          <span className="font-label-caps text-label-caps text-primary px-2.5 py-1 rounded bg-primary-container/20 border border-primary/30 font-semibold">
            BACKEND GATE
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-body-md text-xs sm:text-sm text-on-surface font-semibold">Enforce Mandatory Deny</span>
              <span className="font-body-sm text-[11px] text-outline">Deterministic policy precedence over heuristic scores</span>
            </div>
            <input 
              type="checkbox" 
              checked={config.enforce_mandatory_deny}
              onChange={e => setConfig({...config, enforce_mandatory_deny: e.target.checked})}
              className="accent-primary w-4 h-4"
            />
          </div>
          
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-body-md text-xs sm:text-sm text-on-surface font-semibold">Require Approval for Destructive Actions</span>
              <span className="font-body-sm text-[11px] text-outline">Intercepts and requests token for sensitive tools</span>
            </div>
            <input 
              type="checkbox" 
              checked={config.require_approval_for_destructive}
              onChange={e => setConfig({...config, require_approval_for_destructive: e.target.checked})}
              className="accent-primary w-4 h-4"
            />
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-space-xs mt-space-md">
        <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Apply Configuration'}
        </Button>
      </div>
    </Card>
  );
};
