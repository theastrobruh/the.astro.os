import React, { useEffect, useState } from 'react';
import { PhysicsMode, WindowId, WindowRuntimeState } from '../types/os';
import { AVAILABLE_TIMEZONES, WINDOW_META_MAP } from '../constants/defaults';
import { globalMusic } from '../engine/music';

interface TaskbarProps {
  windows: Record<WindowId, WindowRuntimeState>;
  activeWindowId: WindowId | null;
  startMenuOpen: boolean;
  desktopDrawActive: boolean;
  physicsMode: PhysicsMode;
  soundEnabled: boolean;
  selectedTimezones: string[];
  isMobile: boolean;
  musicClosedToTray: boolean;
  onToggleStartMenu: () => void;
  onRearrangeIcons: () => void;
  onToggleDesktopDraw: () => void;
  onOpenWindow: (id: WindowId) => void;
  onTaskbarWindowClick: (id: WindowId) => void;
  onChangePhysicsMode: (mode: PhysicsMode) => void;
  onImpulseBurst: () => void;
  onToggleSound: () => void;
  onOpenTimezoneModal: () => void;
  onRestoreMusic: () => void;
  onCloseMusicPermanently: () => void;
}

const PHYSICS_DESCRIPTIONS: Record<PhysicsMode, string> = {
  tactile: 'Tactile',
  earth: 'Gravity',
  'zero-g': 'Zero-G',
  static: 'Static',
};

// Clean vector SVG badge for each country instead of emojis
function renderCountryBadge(code: string) {
  return (
    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15">
      {code}
    </span>
  );
}

// Clean physics SVG icon
function renderPhysicsIcon(mode: PhysicsMode) {
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

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  startMenuOpen,
  desktopDrawActive,
  physicsMode,
  soundEnabled,
  selectedTimezones,
  isMobile,
  musicClosedToTray,
  onToggleStartMenu,
  onRearrangeIcons,
  onToggleDesktopDraw,
  onOpenWindow,
  onTaskbarWindowClick,
  onChangePhysicsMode,
  onImpulseBurst,
  onToggleSound,
  onOpenTimezoneModal,
  onRestoreMusic,
  onCloseMusicPermanently,
}) => {
  const [physicsPopoverOpen, setPhysicsPopoverOpen] = useState(false);
  const [musicTrayMenuOpen, setMusicTrayMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // When music is closed to tray, hide it from the center taskbar buttons
  const openWindows = (Object.values(windows) as WindowRuntimeState[]).filter(
    (w) => w.isOpen && !(w.id === 'win-music' && musicClosedToTray)
  );

  const StartPlanetSvg = (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" fill="rgba(255,255,255,0.15)" />
      <path d="M4.5 15.5C7.5 19 16.5 19 19.5 8.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );

  if (isMobile) {
    return (
      <footer className="w-full h-12 xp-taskbar px-4 flex items-center justify-between z-40 relative shrink-0">
        {/* Left spacer / Tray placeholder */}
        <div className="w-10 flex items-center">
          {musicClosedToTray && (
            <button
              onClick={onRestoreMusic}
              title="Astro.Radio Tray"
              className="w-8 h-8 rounded-xl bg-violet-600/35 border border-violet-400/50 flex items-center justify-center text-xs animate-pulse text-violet-200"
            >
              <svg className="w-4 h-4 text-cyan-300 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
            </button>
          )}
        </div>

        {/* Perfectly Centered Start Button */}
        <button
          onClick={onToggleStartMenu}
          aria-label="Start"
          className="xp-start-btn w-12 h-9 rounded-2xl flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-pink-500/20"
        >
          {StartPlanetSvg}
        </button>

        {/* Right balance spacer */}
        <div className="w-10" />
      </footer>
    );
  }

  // Desktop View
  return (
    <footer className="w-full h-12 xp-taskbar px-3 flex items-center justify-between gap-2 z-40 relative shrink-0">
      {/* Left: Start + Quick Desktop Draw */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleStartMenu}
          title="Start"
          aria-label="Start Menu"
          aria-expanded={startMenuOpen}
          className="xp-start-btn w-10 h-8 rounded-xl flex items-center justify-center transition-transform active:scale-95"
        >
          {StartPlanetSvg}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleDesktopDraw}
            title="Draw on Desktop"
            className={`p-1.5 rounded-xl border transition-colors ${
              desktopDrawActive
                ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                : 'bg-white/8 hover:bg-white/18 border-white/10 text-yellow-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center: Open Windows (if minimized to taskbar or focused) */}
      <div className="flex-1 flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto px-2 min-w-0">
        {openWindows.map((w) => {
          const meta = WINDOW_META_MAP[w.id];
          if (!meta) return null;
          const isActive = activeWindowId === w.id && !w.isMinimized;
          return (
            <button
              key={w.id}
              onClick={() => onTaskbarWindowClick(w.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all backdrop-blur-md ${
                isActive
                  ? 'bg-pink-500/30 border border-pink-400/70 text-white font-semibold shadow-md shadow-pink-500/20'
                  : w.isMinimized
                  ? 'bg-white/5 border border-dashed border-white/25 text-slate-400 hover:text-pink-300'
                  : 'bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: meta.accentColor }}
              />
              <span className="max-w-[96px] truncate">{meta.shortTitle}</span>
              {w.isMinimized && <span className="text-[10px] text-cyan-300">_</span>}
            </button>
          );
        })}
      </div>

      {/* Right Tray: Reset, Theme, Physics, Music Tray, Clocks */}
      <div className="flex items-center gap-1.5 shrink-0 relative">
        {/* Reset Icons Button */}
        <button
          onClick={onRearrangeIcons}
          title="Reset desktop icons to grid"
          className="h-8 px-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1.5 text-xs font-mono text-slate-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="hidden xl:inline">Reset</span>
        </button>

        {/* Theme Button with clean design palette SVG */}
        <button
          onClick={() => onOpenWindow('win-themes')}
          title="Theme Studio"
          className="h-8 px-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1.5 text-xs font-mono text-fuchsia-300 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4 4 4 0 01-4 4H7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6l-7 7-6-6 7-7z" />
          </svg>
          <span className="hidden xl:inline">Theme</span>
        </button>

        {/* Physics Button with clean SVG */}
        <div className="relative">
          <button
            onClick={() => setPhysicsPopoverOpen((v) => !v)}
            title="Physics Engine"
            className="h-8 px-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1.5 text-xs font-mono text-cyan-200 transition-colors"
          >
            {renderPhysicsIcon(physicsMode)}
            <span className="hidden xl:inline">{PHYSICS_DESCRIPTIONS[physicsMode]}</span>
          </button>

          {physicsPopoverOpen && (
            <div className="absolute bottom-11 right-0 w-56 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono font-bold text-cyan-300 border-b border-white/10">
                Physics Kernel
              </div>
              {(Object.keys(PHYSICS_DESCRIPTIONS) as PhysicsMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onChangePhysicsMode(m);
                    setPhysicsPopoverOpen(false);
                  }}
                  className={`w-full px-2 py-1.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-colors ${
                    physicsMode === m
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {renderPhysicsIcon(m)}
                    <span>{PHYSICS_DESCRIPTIONS[m]}</span>
                  </span>
                  {physicsMode === m && <span className="text-[10px] text-cyan-300 font-bold">Active</span>}
                </button>
              ))}
              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    onImpulseBurst();
                    setPhysicsPopoverOpen(false);
                  }}
                  className="w-full px-2 py-1.5 rounded-xl text-xs font-mono font-semibold bg-pink-500/20 hover:bg-pink-500/35 text-pink-200 border border-pink-500/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Cosmic Impulse</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Music Ares-Style System Tray Icon (Next to Clocks) */}
        {musicClosedToTray && (
          <div className="relative">
            <button
              onClick={onRestoreMusic}
              onContextMenu={(e) => {
                e.preventDefault();
                setMusicTrayMenuOpen((v) => !v);
              }}
              title="Astro.Radio Tray (Right-click to exit)"
              className="h-8 px-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/50 flex items-center gap-1.5 text-xs font-mono text-violet-200 transition-colors animate-pulse"
            >
              <svg className="w-3.5 h-3.5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
              <span className="text-[10px] text-cyan-300 font-bold hidden sm:inline">Playing</span>
            </button>

            {musicTrayMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-11 right-0 w-44 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 space-y-1"
              >
                <button
                  onClick={() => {
                    setMusicTrayMenuOpen(false);
                    onRestoreMusic();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono text-white hover:bg-white/10"
                >
                  Open Music Player
                </button>
                <div className="h-px bg-white/10 my-0.5" />
                <button
                  onClick={() => {
                    setMusicTrayMenuOpen(false);
                    onCloseMusicPermanently();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono text-rose-400 hover:bg-rose-500/20"
                >
                  Close & Stop Music
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          className="h-8 w-8 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-xs text-slate-300 transition-colors"
        >
          {soundEnabled ? (
            <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        {/* Multi-Timezone Clocks Pill with Country Badges (NO EMOJIS) */}
        <button
          onClick={onOpenTimezoneModal}
          title="Configure timezones"
          className="flex items-center bg-white/8 hover:bg-white/18 border border-white/15 hover:border-pink-400/50 rounded-xl px-2 h-8 transition-colors"
        >
          {selectedTimezones.slice(0, 4).map((tzId, idx) => {
            const tz = AVAILABLE_TIMEZONES.find((t) => t.id === tzId) || AVAILABLE_TIMEZONES[0];
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
            return (
              <span
                key={`${tzId}-${idx}`}
                className={`items-center gap-1.5 px-2 text-xs font-mono text-slate-100 ${
                  idx >= 2 ? 'hidden lg:flex' : 'flex'
                } ${idx > 0 ? 'border-l border-white/15' : ''}`}
              >
                {renderCountryBadge(tz.code)}
                <span className="tabular-nums font-semibold">{timeStr}</span>
              </span>
            );
          })}
        </button>
      </div>
    </footer>
  );
};
