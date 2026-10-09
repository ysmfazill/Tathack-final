import React from 'react';

interface Stage {
  step: string;
  name: string;
  status: 'passed' | 'intercepted' | 'bypassed' | 'quarantined';
  latency: string;
  detail: string;
}

interface TimelineStepperProps {
  stages: Stage[];
}

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ stages }) => {
  return (
    <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#222a3d]/80 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#adc6ff]/10 border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff]">
            <span className="material-symbols-outlined text-[18px]">timeline</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#e0e2ec] font-headline tracking-wide">
              Firewall Pipeline Execution Timeline
            </h3>
            <p className="text-[11px] text-[#8e9099]">
              Turn-by-turn verification cycle and latency breakdown across firewall stages
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[#4edea3] bg-[#0b1326] px-2.5 py-1 rounded border border-[#222a3d]">
          Total Latency: 4.82ms
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {stages.map((stage, idx) => {
          const isIntercepted = stage.status === 'intercepted' || stage.status === 'quarantined';
          const isPassed = stage.status === 'passed';

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex flex-col justify-between min-h-[110px] transition-all ${
                isIntercepted
                  ? 'bg-[#93000a]/15 border-[#ffb4ab]/40 shadow-sm shadow-[#93000a]/20'
                  : isPassed
                  ? 'bg-[#0b1326] border-[#222a3d] hover:border-[#adc6ff]/40'
                  : 'bg-[#0b1326]/40 border-[#222a3d]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] text-[#8e9099] uppercase">
                    {stage.step}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isIntercepted
                        ? 'bg-[#ffb4ab] animate-ping'
                        : isPassed
                        ? 'bg-[#4edea3]'
                        : 'bg-[#8e9099]'
                    }`}
                  />
                </div>
                <div
                  className={`text-[11px] font-semibold font-headline mb-1 ${
                    isIntercepted ? 'text-[#ffb4ab]' : 'text-[#e0e2ec]'
                  }`}
                >
                  {stage.name}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#8e9099] line-clamp-2 leading-tight mb-2">
                  {stage.detail}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#222a3d]/60 font-mono text-[9px]">
                  <span
                    className={
                      isIntercepted
                        ? 'text-[#ffb4ab]'
                        : isPassed
                        ? 'text-[#4edea3]'
                        : 'text-[#8e9099]'
                    }
                  >
                    {stage.status.toUpperCase()}
                  </span>
                  <span className="text-[#8e9099]">{stage.latency}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
