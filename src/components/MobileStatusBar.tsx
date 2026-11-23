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

const MODE_BADGE: Record<PhysicsMode, string> = {
  tactile: '💨',
  earth: '🍎',
  'zero-g': '🪐',
  static: '📌',
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
    <header className="w-full h-8 px-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-40 shrink-0 text-xs font-mono select-none">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-slate-200 tracking-tight text-[11px]">{osTitle}</span>
        <span className="text-[10px] text-slate-400">v.0.5.0</span>
      </div>

      <div className="flex items-center gap-2 text-slate-300">
        <button
          onClick={onOpenTimezoneModal}
          className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
          title="World Clocks"
        >
          <span>{tz.flag}</span>
          <span className="font-semibold tabular-nums">{timeStr}</span>
        </button>

        <span className="text-[10px] text-slate-400 hidden xs:inline">{dateStr}</span>

        <span className="text-xs" title={`Physics: ${physicsMode}`}>
          {MODE_BADGE[physicsMode]}
        </span>

        <button
          onClick={onToggleSound}
          className="text-xs text-slate-300 hover:text-white"
          title={soundEnabled ? 'Mute' : 'Sound'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
};
