import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { getDetectionComponentsStatus } from '../../lib/api';

interface DetectionComponentItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'IMPLEMENTED' | 'UNSUPPORTED' | 'ERROR';
  health: string;
  latency: string;
  lastRun: string;
  inspectionDetails: string;
  is_registered: boolean;
  runtime_hook_active: boolean;
}

export const DetectionComponentsSection: React.FC = () => {
  const [components, setComponents] = useState<DetectionComponentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await getDetectionComponentsStatus();
        setComponents(res.data);
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.detail || e.message || 'Failed to load detection components');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComponents();
  }, []);

  return (
    <Card elevation="low" className="p-space-lg shadow-md border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-lowest/40 p-space-md rounded-xl border border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[22px]">security</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Detection Components
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              Modular behavioral inspection layers running in local pipeline.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-error-container/10 p-4 rounded-xl border border-error/30 text-xs text-error mb-space-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant mb-space-md">
          <strong>Notice:</strong> These components are deterministic heuristics that operate alongside the execution gateway. They cannot independently authorize execution but their findings are recorded in the audit trail.
        </div>

        {/* Component Table/Rows */}
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="p-4 text-center text-on-surface-variant text-sm font-mono-code">Loading components...</div>
          ) : (
            components.map((comp) => {
              const isActive = comp.status === 'IMPLEMENTED' && comp.runtime_hook_active;
              const statusDisplay = isActive ? 'ENABLED' : comp.status;
              const statusColor = isActive ? 'text-secondary bg-secondary-container/20 border-secondary/30' : 'text-outline bg-surface-container-high border-outline-variant/20';

              return (
                <div
                  key={comp.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container gap-space-sm transition-colors border border-outline-variant/20 ${!isActive ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[18px]">{comp.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-body-md text-xs sm:text-sm text-on-surface font-semibold truncate">
                          {comp.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono-code border font-bold ${statusColor}`}>
                          {statusDisplay}
                        </span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                        {comp.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-space-md shrink-0">
                    <div className="flex items-center gap-3 font-mono-code text-[11px] text-outline">
                      {isActive ? (
                        <>
                          <span title="Health"><span className="material-symbols-outlined text-[12px] mr-1">monitor_heart</span>{comp.health}</span>
                          <span title="Latency"><span className="material-symbols-outlined text-[12px] mr-1">timer</span>{comp.latency}</span>
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
};
