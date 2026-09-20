import React, { useState, useEffect } from 'react';

function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  return midnight.getTime() - now.getTime();
}

function format(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s) };
}

interface Props {
  className?: string;
  compact?: boolean;
}

export const CountdownTimer: React.FC<Props> = ({ className = '', compact = false }) => {
  const [remaining, setRemaining] = useState(getMsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getMsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { h, m, s } = format(remaining);

  if (compact) {
    return (
      <span className={`font-mono font-extrabold tabular-nums ${className}`}>
        {h}:{m}:{s}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[
        { label: 'घंटे', value: h },
        { label: 'मिनट', value: m },
        { label: 'सेकंड', value: s },
      ].map((unit, idx) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center bg-white/15 rounded-lg px-2 py-1 min-w-[42px]">
            <span className="font-mono font-black text-sm sm:text-base tabular-nums leading-none">
              {unit.value}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide opacity-80 leading-none mt-0.5">
              {unit.label}
            </span>
          </div>
          {idx < 2 && <span className="font-black opacity-60">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
