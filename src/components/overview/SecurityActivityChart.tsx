import React, { useState } from 'react';

export const SecurityActivityChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1H' | '24H' | '7D'>('24H');

  return (
    <div className="bg-surface-container-low p-5 sm:p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="font-headline-md text-xl text-white font-semibold tracking-tight">
              Security Activity
            </h2>
            <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-xs text-secondary uppercase font-medium">
              Sample Data
            </span>
          </div>
          <span className="font-body-md text-sm text-[#94a3b8] mt-1">
            Attack attempts and enforcement decisions over time.
          </span>
        </div>

        {/* Time Range Selector */}
        <div className="inline-flex p-1 bg-surface-container rounded-lg self-start sm:self-auto shrink-0 border border-outline-variant/20">
          {(['1H', '24H', '7D'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1 font-mono-code text-xs rounded transition-colors ${
                timeRange === range
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center flex-wrap gap-5 py-2 font-mono-code text-xs text-[#dae2fd]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error ring-2 ring-error/20" />
          <span className="text-white font-medium">Blocked Actions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-secondary/20" />
          <span className="text-[#94a3b8]">Flagged / Approval</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-tertiary/20" />
          <span className="text-[#94a3b8]">Allowed Actions</span>
        </div>
      </div>

      {/* Minimalist High Precision SVG Graph */}
      <div className="w-full relative mt-3 pt-4">
        <div className="w-full h-56 relative">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 760 200"
          >
            <defs>
              <linearGradient id="blockedGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="allowedGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Crisp Horizontal Grid Lines */}
            <line stroke="#2d3449" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="760" y1="20" y2="20" />
            <line stroke="#2d3449" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="760" y1="70" y2="70" />
            <line stroke="#2d3449" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="760" y1="120" y2="120" />
            <line stroke="#424754" strokeWidth="1" x1="0" x2="760" y1="170" y2="170" />

            {/* Blocked Path & Fill (Crimson) */}
            <path
              d="M 0 160 Q 76 150 152 140 T 304 95 T 456 45 T 608 120 T 760 110 L 760 170 L 0 170 Z"
              fill="url(#blockedGrad)"
            />
            <path
              d="M 0 160 Q 76 150 152 140 T 304 95 T 456 45 T 608 120 T 760 110"
              fill="none"
              stroke="#ffb4ab"
              strokeLinecap="round"
              strokeWidth="2.4"
            />

            {/* Allowed Actions Path (Emerald) */}
            <path
              d="M 0 135 Q 76 125 152 110 T 304 130 T 456 125 T 608 100 T 760 85 L 760 170 L 0 170 Z"
              fill="url(#allowedGrad)"
            />
            <path
              d="M 0 135 Q 76 125 152 110 T 304 130 T 456 125 T 608 100 T 760 85"
              fill="none"
              stroke="#4edea3"
              strokeLinecap="round"
              strokeWidth="2"
            />

            {/* Flagged / Approval Path (Secondary Cyan Accent) */}
            <path
              d="M 0 165 Q 76 160 152 155 T 304 148 T 456 140 T 608 145 T 760 150"
              fill="none"
              stroke="#4cd7f6"
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeWidth="1.8"
            />

            {/* Peak Marker Dot at 14:20 */}
            <circle cx="456" cy="45" fill="#0b1326" r="4.5" stroke="#ffb4ab" strokeWidth="2.5" />
            <line
              opacity="0.7"
              stroke="#ffb4ab"
              strokeDasharray="2 2"
              strokeWidth="1.5"
              x1="456"
              x2="456"
              y1="45"
              y2="170"
            />
          </svg>

          {/* Peak Callout Badge Pin */}
          <div className="absolute left-[60%] top-2 -translate-x-1/2 bg-surface-container-high border border-outline-variant/40 px-2.5 py-1 rounded shadow-md font-mono-code text-xs text-error flex items-center gap-1.5 pointer-events-none">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="font-medium">18 attempts @ 14:20</span>
          </div>
        </div>

        {/* X-Axis Timestamps */}
        <div className="flex justify-between items-center text-[#94a3b8] font-mono-code text-xs pt-3 px-1">
          <span>02:00</span>
          <span>06:00</span>
          <span>10:00</span>
          <span className="text-secondary font-semibold">14:00</span>
          <span>18:00</span>
          <span>22:00</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#94a3b8] font-mono-code text-xs">
        <span>Populated from backend audit records. 24h peak: 18 attack attempts at 14:20.</span>
        <span className="text-tertiary font-medium flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          Real-time Stream: OK
        </span>
      </div>
    </div>
  );
};
