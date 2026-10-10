import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SecurityEvent } from '../../types';
import { EventInspectModal } from './EventInspectModal';
import { getAuditLogs } from '../../lib/api';

export const RecentEventsTable: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAuditLogs({ page: 1, page_size: 5 });
        if (res.data && res.data.items) {
          const mapped = res.data.items.map((item: any) => ({
            id: item.event_id,
            timestamp: item.timestamp_utc,
            eventType: item.event_type,
            severity: item.data_classification === 'SENSITIVE' ? 'CRITICAL' : 'LOW',
            vector: item.source_agent ? `Agent: ${item.source_agent}` : 'System',
            decision: item.firewall_verdict === 'BLOCK' ? 'BLOCKED' : 'PERMITTED',
            agentName: item.target_agent_id || 'System',
            targetTool: item.tool_name,
            reason: item.reason_code,
            action: item.action,
            target: item.tool_name,
            context: item.safe_metadata
          }));
          setEvents(mapped);
        }
      } catch (err) {
        console.error('Failed to load recent events', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm flex flex-col w-full overflow-hidden">
        {/* Table Header */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20">
          <div className="flex flex-col min-w-0">
            <h2 className="font-headline-md text-xl text-white font-semibold tracking-tight">
              Recent Security Events
            </h2>
            <span className="font-body-md text-sm text-[#94a3b8] mt-1">
              Real-time agent tool invocations, inter-agent flows, and firewall decisions
            </span>
          </div>
          <Link
            to="/audit-logs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-sm text-primary hover:text-white transition-colors font-medium shrink-0 self-start sm:self-auto"
          >
            <span>View All Events</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body-md text-sm min-w-[700px]">
            <thead className="bg-surface-container text-[#94a3b8] font-label-caps text-xs uppercase tracking-wider border-b border-outline-variant/30">
              <tr>
                <th className="py-3.5 px-6 font-semibold" scope="col">
                  Event Descriptor
                </th>
                <th className="py-3.5 px-4 font-semibold" scope="col">
                  Vector / Source
                </th>
                <th className="py-3.5 px-4 font-semibold" scope="col">
                  Risk Level
                </th>
                <th className="py-3.5 px-4 font-semibold" scope="col">
                  Firewall Decision
                </th>
                <th className="py-3.5 px-4 font-semibold" scope="col">
                  Timestamp
                </th>
                <th className="py-3.5 px-6 text-right font-semibold" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-sm">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#94a3b8] font-body-sm">
                    No recent events found.
                  </td>
                </tr>
              ) : (
                events.map((event, idx) => {
                  const isCrossAgent = event.vector.includes('Cross-Agent') || event.vector.includes('Inter-Agent');
                  const isBlocked = event.decision === 'BLOCKED';
                  const isEscalated = event.decision === 'ESCALATED';

                  return (
                  <tr
                    key={event.id}
                    className={`hover:bg-surface-container-high/60 transition-colors ${
                      idx % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container/20'
                    }`}
                  >
                    {/* Event Descriptor */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            event.severity === 'CRITICAL' || event.severity === 'HIGH'
                              ? 'bg-error'
                              : event.severity === 'MEDIUM'
                              ? 'bg-amber-400'
                              : 'bg-tertiary'
                          }`}
                        />
                        <span className="font-medium text-white truncate">
                          {event.vector}
                        </span>
                        {isCrossAgent && (
                          <span className="px-1.5 py-0.2 rounded bg-error/20 text-error font-mono-code text-[10px] uppercase font-bold">
                            Inter-Agent
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Vector / Source */}
                    <td className="py-4 px-4 font-mono-code text-[13px] text-[#94a3b8]">
                      {event.agentName} ({event.targetTool || 'bus_transfer'})
                    </td>

                    {/* Risk Level */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded font-mono-code text-xs font-semibold border ${
                          event.severity === 'CRITICAL'
                            ? 'bg-error-container/30 text-error border-error/20'
                            : event.severity === 'HIGH'
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                            : event.severity === 'MEDIUM'
                            ? 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30'
                            : 'bg-tertiary-container/30 text-tertiary border-tertiary/20'
                        }`}
                      >
                        {event.severity === 'CRITICAL' ? 'Critical' : event.severity === 'HIGH' ? 'High' : event.severity === 'MEDIUM' ? 'Medium' : 'Low'}
                      </span>
                    </td>

                    {/* Firewall Decision */}
                    <td className="py-4 px-4">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/40 text-error font-label-caps text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error" />
                          Blocked
                        </span>
                      ) : isEscalated ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-amber-300 font-label-caps text-xs font-semibold border border-amber-400/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Needs Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/40 text-tertiary font-label-caps text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                          Allowed
                        </span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-4 font-mono-code text-[13px] text-[#94a3b8]">
                      {idx === 0 ? '2m ago' : idx === 1 ? '14m ago' : idx === 2 ? '28m ago' : idx === 3 ? '42m ago' : '1h ago'}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-highest text-primary font-medium text-xs border border-outline-variant/30 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Inspection Modal */}
      <EventInspectModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
};
