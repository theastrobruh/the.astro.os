import React, { useEffect, useState } from 'react';
import { AVAILABLE_TIMEZONES } from '../constants/defaults';
import { PhysicsMode } from '../types/os';

interface MobileStatusBarProps {
  osTitle: string;
  primaryTimezone: string;
  physicsMode: PhysicsMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTimezoneModal: () => void;
}

const COUNTRY_CODE_MAP: Record<string, string> = {
  'America/Lima': 'PE',
  'America/Bogota': 'CO',
  'Europe/Madrid': 'ES',
  'Asia/Tokyo': 'JP',
  'America/New_York': 'US',
  'America/Buenos_Aires': 'AR',
  'America/Mexico_City': 'MX',
  'America/Santiago': 'CL',
  'Europe/London': 'GB',
  'Asia/Seoul': 'KR',
};

const MODE_LABEL: Record<PhysicsMode, string> = {
  tactile: 'Tactile',
  earth: 'Gravity',
  'zero-g': 'Zero-G',
  static: 'Fixed',
};

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  osTitle,
  primaryTimezone,
  physicsMode,
  soundEnabled,
  onToggleSound,
  onOpenTimezoneModal,
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = AVAILABLE_TIMEZONES.find((t) => t.id === primaryTimezone) || AVAILABLE_TIMEZONES[0];
  const countryCode = COUNTRY_CODE_MAP[tz.id] || tz.id.split('/')[1]?.slice(0, 2).toUpperCase() || 'GL';

  let timeStr = '--:--';
  let dateStr = '--';
  try {
    timeStr = now.toLocaleTimeString('en-US', {
      timeZone: tz.id,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    dateStr = now.toLocaleDateString('en-US', {
      timeZone: tz.id,
      day: '2-digit',
      month: 'short',
    });
  } catch {
    timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <header className="w-full h-8 px-3 bg-slate-950/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-40 shrink-0 text-xs font-mono select-none">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-slate-200 tracking-tight text-[11px]">{osTitle}</span>
        <span className="text-[10px] text-slate-400">v.0.5.0</span>
      </div>

      <div className="flex items-center gap-2 text-slate-300">
        <button
          onClick={onOpenTimezoneModal}
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hover:border-cyan-400/40 text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors"
          title="World Clocks"
        >
          <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-[9px] font-bold text-cyan-300 tracking-wider">
            {countryCode}
          </span>
          <span className="font-semibold tabular-nums">{timeStr}</span>
        </button>

        <span className="text-[10px] text-slate-400 hidden xs:inline">{dateStr}</span>

        <span
          className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] uppercase tracking-wide text-slate-300 font-bold"
          title={`Physics: ${physicsMode}`}
        >
          {MODE_LABEL[physicsMode]}
        </span>

        <button
          onClick={onToggleSound}
          className="p-1 rounded bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors"
          title={soundEnabled ? 'Mute' : 'Unmute'}
        >
          {soundEnabled ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
