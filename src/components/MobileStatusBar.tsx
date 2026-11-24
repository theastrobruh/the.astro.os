import React, { useEffect, useState } from 'react';
import { PhysicsMode, WindowId } from '../types/os';

interface MobileStatusBarProps {
  osTitle: string;
  physicsMode: PhysicsMode;
  soundEnabled: boolean;
  onChangePhysicsMode: (mode: PhysicsMode) => void;
  onRearrangeIcons: () => void;
  onOpenWindow: (id: WindowId) => void;
  onToggleSound: () => void;
}

const MODE_LABEL: Record<PhysicsMode, string> = {
  tactile: 'Tactile',
  earth: 'Gravity',
  'zero-g': 'Zero-G',
  static: 'Static',
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
  physicsMode,
  soundEnabled,
  onChangePhysicsMode,
  onRearrangeIcons,
  onOpenWindow,
  onToggleSound,
}) => {
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [physicsMenuOpen, setPhysicsMenuOpen] = useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!physicsMenuOpen) return;
    const onOut = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setPhysicsMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', onOut);
    return () => window.removeEventListener('pointerdown', onOut);
  }, [physicsMenuOpen]);

  return (
    <header
      ref={headerRef}
      onClick={(e) => e.stopPropagation()}
      className="w-full h-9 px-3 bg-black/50 backdrop-blur-xl border-b border-white/10 grid grid-cols-[1fr_auto_1fr] items-center text-[11px] font-mono text-white z-40 shrink-0 relative"
    >
      <div className="flex items-center gap-2 min-w-0 justify-self-start">
        <span className="font-bold tracking-wide text-slate-200 whitespace-nowrap">{timeStr}</span>
      </div>

      <div className="flex items-center gap-1.5 justify-self-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setPhysicsMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center transition-all"
            title={`Physics: ${MODE_LABEL[physicsMode]}`}
          >
            {renderPhysicsSvg(physicsMode)}
          </button>

          {physicsMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-9 left-1/2 -translate-x-1/2 w-36 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 space-y-1"
            >
              {(Object.keys(MODE_LABEL) as PhysicsMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onChangePhysicsMode(m);
                    setPhysicsMenuOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[11px] font-mono flex items-center gap-2 transition-colors ${
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

        <button
          type="button"
          onClick={onRearrangeIcons}
          title="Reset Icons"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-cyan-300 transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        <button
          type="button"
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

      <div className="flex items-center gap-1.5 text-slate-300 justify-self-end">
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
