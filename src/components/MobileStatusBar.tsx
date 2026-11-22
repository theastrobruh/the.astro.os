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
    timeStr = now.toLocaleTimeString('es-ES', {
      timeZone: tz.id,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    dateStr = now.toLocaleDateString('es-ES', {
      timeZone: tz.id,
      day: '2-digit',
      month: 'short',
    });
  } catch {
    timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <header className="md:hidden w-full h-11 px-3.5 bg-slate-950/35 backdrop-blur-xl border-b border-white/15 flex items-center justify-between z-40 shrink-0">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
        <span>🪐</span>
        <span className="tracking-tight">{osTitle}</span>
      </div>

      <button
        onClick={onOpenTimezoneModal}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-xs font-mono text-slate-100"
      >
        <span>{tz.flag}</span>
        <span className="font-bold tabular-nums">{timeStr}</span>
        <span className="text-[10px] text-slate-400">{dateStr}</span>
      </button>

      <div className="flex items-center gap-2 text-xs font-mono">
        <span title="Modo físico activo">{MODE_BADGE[physicsMode]}</span>
        <button
          onClick={onToggleSound}
          aria-label="Sonido"
          className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
};
