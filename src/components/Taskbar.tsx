import React, { useEffect, useState } from 'react';
import { PhysicsMode, WindowId, WindowRuntimeState } from '../types/os';
import { AVAILABLE_TIMEZONES, WINDOW_META_MAP } from '../constants/defaults';

interface TaskbarProps {
  windows: Record<WindowId, WindowRuntimeState>;
  activeWindowId: WindowId | null;
  startMenuOpen: boolean;
  desktopDrawActive: boolean;
  physicsMode: PhysicsMode;
  soundEnabled: boolean;
  selectedTimezones: string[];
  isMobile: boolean;
  musicMinimizedToTray?: boolean;
  onToggleStartMenu: () => void;
  onRearrangeIcons: () => void;
  onToggleDesktopDraw: () => void;
  onOpenWindow: (id: WindowId) => void;
  onTaskbarWindowClick: (id: WindowId) => void;
  onChangePhysicsMode: (mode: PhysicsMode) => void;
  onImpulseBurst: () => void;
  onToggleSound: () => void;
  onOpenTimezoneModal: () => void;
  onRestoreMusic?: () => void;
  onCloseMusicPermanently?: () => void;
}

const PHYSICS_LABELS: Record<PhysicsMode, { icon: string; name: string }> = {
  tactile: { icon: '💨', name: 'Tactile' },
  earth: { icon: '🍎', name: 'Gravity' },
  'zero-g': { icon: '🪐', name: 'Zero-G' },
  static: { icon: '📌', name: 'Static' },
};

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  startMenuOpen,
  desktopDrawActive,
  physicsMode,
  soundEnabled,
  selectedTimezones,
  isMobile,
  musicMinimizedToTray = false,
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

  const openWindows = (Object.values(windows) as WindowRuntimeState[]).filter(
    (w) => w.isOpen && !(w.id === 'win-music' && musicMinimizedToTray)
  );

  const StartPlanetSvg = (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" fill="rgba(255,255,255,0.15)" />
      <path d="M4.5 15.5C7.5 19 16.5 19 19.5 8.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );

  if (isMobile) {
    return (
      <footer className="w-full h-12 xp-taskbar px-3 flex items-center justify-between z-40 relative shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRearrangeIcons}
            title="Reset Icons"
            className="w-9 h-9 rounded-xl bg-white/10 active:scale-95 flex items-center justify-center text-slate-100 border border-white/15"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onOpenWindow('win-themes')}
            title="Theme Studio"
            className="w-9 h-9 rounded-xl bg-white/10 active:scale-95 flex items-center justify-center text-fuchsia-300 border border-white/15"
          >
            🌈
          </button>
        </div>

        <button
          onClick={onToggleStartMenu}
          aria-label="Start"
          className="xp-start-btn w-11 h-10 rounded-2xl flex items-center justify-center transition-transform active:scale-95"
        >
          {StartPlanetSvg}
        </button>

        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setPhysicsPopoverOpen((v) => !v)}
            title="Physics"
            className="w-9 h-9 rounded-xl bg-white/10 active:scale-95 flex items-center justify-center text-sm border border-white/15"
          >
            {PHYSICS_LABELS[physicsMode].icon}
          </button>

          {musicMinimizedToTray && (
            <button
              onClick={onRestoreMusic}
              title="Music Tray"
              className="w-9 h-9 rounded-xl bg-violet-600/35 border border-violet-400/50 flex items-center justify-center text-xs animate-pulse"
            >
              📻
            </button>
          )}
        </div>
      </footer>
    );
  }

  // Desktop & Tablet View
  return (
    <footer className="w-full h-12 xp-taskbar px-3 flex items-center justify-between gap-2 z-40 relative shrink-0">
      {/* Left: Start + Quick Actions */}
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

          <button
            onClick={() => onOpenWindow('win-youtube')}
            title="YouTube Player"
            className="p-1.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/10 text-red-400 transition-colors"
          >
            <span className="text-xs">▶</span>
          </button>
        </div>
      </div>

      {/* Center: Open Windows */}
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

      {/* Right Tray: Reset Icons, Themes, Physics, Ares Music Tray, Sound, Clocks */}
      <div className="flex items-center gap-1.5 shrink-0 relative">
        {/* Reset Icons Button right next to Physics & Themes */}
        <button
          onClick={onRearrangeIcons}
          title="Reset desktop icons to grid"
          className="h-8 px-2 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1 text-xs font-mono text-slate-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="hidden xl:inline">Reset</span>
        </button>

        {/* Quick Themes Button */}
        <button
          onClick={() => onOpenWindow('win-themes')}
          title="Theme Studio"
          className="h-8 px-2 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1 text-xs font-mono text-fuchsia-300 transition-colors"
        >
          <span>🌈</span>
          <span className="hidden xl:inline">Theme</span>
        </button>

        {/* Physics Switcher */}
        <div className="relative">
          <button
            onClick={() => setPhysicsPopoverOpen((v) => !v)}
            title="Physics Engine"
            className="h-8 px-2 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1 text-xs font-mono text-cyan-200 transition-colors"
          >
            <span>{PHYSICS_LABELS[physicsMode].icon}</span>
            <span className="hidden xl:inline">{PHYSICS_LABELS[physicsMode].name}</span>
          </button>

          {physicsPopoverOpen && (
            <div className="absolute bottom-11 right-0 w-56 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono font-bold text-cyan-300 border-b border-white/10">
                Physics Kernel
              </div>
              {(Object.keys(PHYSICS_LABELS) as PhysicsMode[]).map((m) => (
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
                    <span>{PHYSICS_LABELS[m].icon}</span>
                    <span>{PHYSICS_LABELS[m].name}</span>
                  </span>
                  {physicsMode === m && <span className="text-[10px] text-cyan-300">Active</span>}
                </button>
              ))}
              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    onImpulseBurst();
                    setPhysicsPopoverOpen(false);
                  }}
                  className="w-full px-2 py-1.5 rounded-xl text-xs font-mono font-semibold bg-pink-500/20 hover:bg-pink-500/35 text-pink-200 border border-pink-500/30 transition-colors"
                >
                  ⚡ Cosmic Impulse
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Music Ares-Style System Tray Icon */}
        {musicMinimizedToTray && (
          <div className="relative">
            <button
              onClick={onRestoreMusic}
              onContextMenu={(e) => {
                e.preventDefault();
                setMusicTrayMenuOpen((v) => !v);
              }}
              title="Astro.Radio Tray (Right click for menu)"
              className="h-8 px-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/50 flex items-center gap-1 text-xs font-mono text-violet-200 transition-colors animate-pulse"
            >
              <span>📻</span>
              <span className="text-[10px] text-cyan-300">Playing</span>
            </button>

            {musicTrayMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-11 right-0 w-44 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 space-y-1"
              >
                <button
                  onClick={() => {
                    setMusicTrayMenuOpen(false);
                    onRestoreMusic?.();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono text-white hover:bg-white/10"
                >
                  Open Music Player
                </button>
                <div className="h-px bg-white/10 my-0.5" />
                <button
                  onClick={() => {
                    setMusicTrayMenuOpen(false);
                    onCloseMusicPermanently?.();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono text-rose-400 hover:bg-rose-500/20"
                >
                  Quit Music (Close)
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          className="h-8 w-8 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-xs transition-colors"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Multi-Timezone Clock Pill */}
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
                className={`items-center gap-1.5 px-1.5 text-xs font-mono text-slate-100 ${
                  idx >= 2 ? 'hidden lg:flex' : 'flex'
                } ${idx > 0 ? 'border-l border-white/15' : ''}`}
              >
                <span>{tz.flag}</span>
                <span className="tabular-nums">{timeStr}</span>
              </span>
            );
          })}
        </button>
      </div>
    </footer>
  );
};
