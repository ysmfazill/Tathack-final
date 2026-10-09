import React from 'react';
import { Link } from 'react-router-dom';

interface SimulationFooterBarProps {
  simulationId: string;
  scenarioTitle: string;
  timestamp: string;
  verdict: string;
}

export const SimulationFooterBar: React.FC<SimulationFooterBarProps> = ({
  simulationId,
  scenarioTitle,
  timestamp,
  verdict,
}) => {
  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-[#4edea3] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
          SESSION LOGGED
        </span>
        <span className="text-[#8e9099]">|</span>
        <span className="font-mono text-[#adc6ff]">SIM-ID: {simulationId}</span>
        <span className="text-[#8e9099]">|</span>
        <span className="text-[#c4c6d0] truncate max-w-xs">{scenarioTitle}</span>
        <span className="text-[#8e9099]">|</span>
        <span className="font-mono text-[#8e9099]">{timestamp}</span>
        <span className="text-[#8e9099]">|</span>
        <span className="font-mono text-xs font-semibold text-[#4edea3]">{verdict}</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/logs"
          className="text-xs font-mono text-[#4cd7f6] hover:text-[#adc6ff] flex items-center gap-1 transition-colors"
        >
          <span>View In Audit Logs</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};
