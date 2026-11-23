import React, { useEffect, useState } from 'react';
import { AVAILABLE_TIMEZONES } from '../constants/defaults';
import { PhysicsMode, WindowId } from '../types/os';

interface MobileStatusBarProps {
  osTitle: string;
  primaryTimezone: string;
  physicsMode: PhysicsMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTimezoneModal: () => void;
  onRearrangeIcons: () => void;
  onOpenWindow: (id: WindowId) => void;
  onChangePhysicsMode: (mode: PhysicsMode) => void;
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

function renderPhysicsSvg(mode: PhysicsMode) {
  switch (mode) {
    case 'tactile':
      return (
        <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'earth':
      return (
        <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    case 'zero-g':
      return (
        <svg className="w-3.5 h-3.5 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="7" />
          <path d="M4 16C7 19 17 19 20 8" strokeLinecap="round" />
        </svg>
      );
    case 'static':
      return (
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      );
  }
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  osTitle,
  primaryTimezone,
  physicsMode,
  soundEnabled,
  onToggleSound,
  onOpenTimezoneModal,
  onRearrangeIcons,
  onOpenWindow,
  onChangePhysicsMode,
}) => {
  const [now, setNow] = useState(() => new Date());
  const [physicsPopoverOpen, setPhysicsPopoverOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = AVAILABLE_TIMEZONES.find((t) => t.id === primaryTimezone) || AVAILABLE_TIMEZONES[0];
  const countryCode = COUNTRY_CODE_MAP[tz.id] || tz.id.split('/')[1]?.slice(0, 2).toUpperCase() || 'GL';

  let timeStr = '--:--';
  try {
    timeStr = now.toLocaleTimeString('en-US', {
      timeZone: tz.id,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const cyclePhysics = () => {
    const modes: PhysicsMode[] = ['tactile', 'earth', 'zero-g', 'static'];
    const nextIdx = (modes.indexOf(physicsMode) + 1) % modes.length;
    onChangePhysicsMode(modes[nextIdx]);
  };

  return (
    <header className="w-full h-9 px-2 bg-slate-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-40 shrink-0 text-xs font-mono select-none relative">
      {/* Left: OS Title & Clocks */}
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          onClick={onOpenTimezoneModal}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/40 text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors"
          title="World Clocks"
        >
          <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-[9px] font-bold text-cyan-300 tracking-wider">
            {countryCode}
          </span>
          <span className="font-semibold tabular-nums text-[10.5px]">{timeStr}</span>
        </button>

        <span className="font-bold text-slate-300 tracking-tight text-[10.5px] hidden xs:inline truncate max-w-[80px]">
          {osTitle}
        </span>
      </div>

      {/* Center Aligned Toolbar: Realign, Physics (aligned directly in center), Theme */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5 shadow-sm">
        {/* Realign Icons Button */}
        <button
          onClick={onRearrangeIcons}
          title="Realign Icons"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-slate-200 transition-all"
        >
          <svg className="w-3.5 h-3.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        {/* Physics Button centered with Start button */}
        <div className="relative">
          <button
            onClick={() => setPhysicsPopoverOpen((v) => !v)}
            onDoubleClick={cyclePhysics}
            title={`Physics: ${MODE_LABEL[physicsMode]}`}
            className="h-7 px-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 flex items-center gap-1 text-[10px] font-bold text-slate-100 border border-white/15 transition-all"
          >
            {renderPhysicsSvg(physicsMode)}
            <span className="hidden sm:inline">{MODE_LABEL[physicsMode]}</span>
          </button>

          {/* Physics Quick Switch Popover */}
          {physicsPopoverOpen && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-36 glass-window border border-white/20 p-1.5 rounded-xl flex flex-col gap-1 z-50 shadow-2xl bg-slate-950/95 backdrop-blur-xl">
              {(['tactile', 'earth', 'zero-g', 'static'] as PhysicsMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onChangePhysicsMode(m);
                    setPhysicsPopoverOpen(false);
                  }}
                  className={`w-full px-2 py-1.5 rounded-lg text-left text-xs font-mono flex items-center gap-2 transition-colors ${
                    physicsMode === m
                      ? 'bg-cyan-500/25 text-cyan-200 font-bold border border-cyan-400/40'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {renderPhysicsSvg(m)}
                  <span>{MODE_LABEL[m]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Themes Button */}
        <button
          onClick={() => onOpenWindow('win-themes')}
          title="Themes"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-fuchsia-300 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4 4 4 0 01-4 4H7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6l-7 7-6-6 7-7z" />
          </svg>
        </button>
      </div>

      {/* Right: Sound Toggle */}
      <div className="flex items-center gap-1.5 text-slate-300">
        <button
          onClick={onToggleSound}
          className="p-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors"
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
