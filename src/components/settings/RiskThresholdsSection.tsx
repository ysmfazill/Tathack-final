import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { getSettings, updateSettings } from '../../lib/api';

export const RiskThresholdsSection: React.FC = () => {
  const [config, setConfig] = useState({
    low_risk_max: 0.30,
    medium_risk_max: 0.70,
    high_risk_max: 0.85
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    getSettings('thresholds')
      .then(res => setConfig(res.data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await updateSettings('thresholds', config);
      setSuccessMsg('Thresholds saved successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      console.error(e);
      if (Array.isArray(e.response?.data?.detail)) {
        setError(e.response.data.detail[0]?.msg || 'Validation error');
      } else {
        setError(e.response?.data?.detail || e.message || 'Failed to save');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">tune</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Risk Thresholds
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Boundaries controlling advisory risk classification.
            </p>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> These risk thresholds are consumed strictly by the advisory Live Attack Analysis engine. They DO NOT override or weaken the deterministic execution gateway's mandatory block rules.
        </div>

        {error && (
          <div className="bg-error-container/10 p-3 rounded-xl border border-error/30 text-xs text-error mb-space-md">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-primary-container/10 p-3 rounded-xl border border-primary/30 text-xs text-primary mb-space-md">
            {successMsg}
          </div>
        )}

        {/* Threshold Definition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md">
          {/* Low */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-tertiary">
                Low Risk Max
              </span>
              <input 
                type="number" step="0.01" min="0" max="1"
                className="w-20 bg-surface-container-lowest py-1 px-2 rounded-lg text-xs text-on-surface text-right font-mono-code"
                value={config.low_risk_max}
                onChange={e => setConfig({...config, low_risk_max: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-secondary">
                Medium Risk Max
              </span>
              <input 
                type="number" step="0.01" min="0" max="1"
                className="w-20 bg-surface-container-lowest py-1 px-2 rounded-lg text-xs text-on-surface text-right font-mono-code"
                value={config.medium_risk_max}
                onChange={e => setConfig({...config, medium_risk_max: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* High */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-primary">
                High Risk Max
              </span>
              <input 
                type="number" step="0.01" min="0" max="1"
                className="w-20 bg-surface-container-lowest py-1 px-2 rounded-lg text-xs text-on-surface text-right font-mono-code"
                value={config.high_risk_max}
                onChange={e => setConfig({...config, high_risk_max: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* Critical */}
          <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20 opacity-75">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-error">
                Critical
              </span>
              <span className="font-mono-code text-[11px] text-error bg-error-container/20 px-1.5 py-0.5 rounded border border-error/30 font-bold">
                &gt; {config.high_risk_max}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-space-xs">
        <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Apply Configuration'}
        </Button>
      </div>
    </Card>
  );
};
