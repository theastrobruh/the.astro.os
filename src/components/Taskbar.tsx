import React, { useEffect, useRef, useState } from 'react';
import { PhysicsMode, WindowId, WindowRuntimeState } from '../types/os';
import { AVAILABLE_TIMEZONES, WINDOW_META_MAP } from '../constants/defaults';
import { AstroLogoSvg } from './DesktopIconItem';

interface TaskbarProps {
  windows: Record<WindowId, WindowRuntimeState>;
  activeWindowId: WindowId | null;
  startMenuOpen: boolean;
  desktopDrawActive: boolean;
  physicsMode: PhysicsMode;
  windowCollisions: boolean;
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
  onToggleWindowCollisions: () => void;
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

function renderCountryBadge(code: string) {
  return (
    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15">
      {code}
    </span>
  );
}

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
  windowCollisions,
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
  onToggleWindowCollisions,
  onImpulseBurst,
  onToggleSound,
  onOpenTimezoneModal,
  onRestoreMusic,
  onCloseMusicPermanently,
}) => {
  const [physicsPopoverOpen, setPhysicsPopoverOpen] = useState(false);
  const [musicTrayMenuOpen, setMusicTrayMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [tzOffset, setTzOffset] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (selectedTimezones.length <= 2) return;
    const id = setInterval(() => {
      setTzOffset((prev) => (prev + 1) % selectedTimezones.length);
    }, 4500);
    return () => clearInterval(id);
  }, [selectedTimezones.length]);

  useEffect(() => {
    if (!physicsPopoverOpen && !musicTrayMenuOpen) return;
    const handleOutside = (e: PointerEvent) => {
      if (footerRef.current && !footerRef.current.contains(e.target as Node)) {
        setPhysicsPopoverOpen(false);
        setMusicTrayMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutside);
    return () => window.removeEventListener('pointerdown', handleOutside);
  }, [physicsPopoverOpen, musicTrayMenuOpen]);

  const openWindows = (Object.values(windows) as WindowRuntimeState[]).filter(
    (w) => w.isOpen && !(w.id === 'win-music' && musicClosedToTray)
  );

  if (isMobile) {
    const tzList = selectedTimezones.length > 0 ? selectedTimezones : ['America/Lima', 'America/New_York'];
    const firstTzId = tzList[tzOffset % tzList.length];
    const secondTzId = tzList.length > 1 ? tzList[(tzOffset + 1) % tzList.length] : null;

    const formatTzRow = (tzId: string) => {
      const meta = AVAILABLE_TIMEZONES.find((t) => t.id === tzId);
      const code = meta?.code || tzId.split('/')[1]?.slice(0, 2).toUpperCase() || 'GL';
      let tStr = '--:--';
      try {
        tStr = now.toLocaleTimeString('en-US', {
          timeZone: tzId,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } catch {
        tStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      return { code, tStr };
    };

    const row1 = formatTzRow(firstTzId);
    const row2 = secondTzId ? formatTzRow(secondTzId) : null;

    return (
      <footer
        ref={footerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-14 bg-slate-950/90 backdrop-blur-2xl border-t border-white/20 px-2.5 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 z-40 shrink-0 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] relative"
      >
        {/* Bottom-Left: Gravity, Realign, Themes, Volume, Music Tray */}
        <div className="flex items-center gap-1 justify-self-start relative">
          <button
            type="button"
            onClick={() => setPhysicsPopoverOpen((v) => !v)}
            title="Physics"
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/15 flex items-center justify-center transition-all"
          >
            {renderPhysicsIcon(physicsMode)}
          </button>

          <button
            type="button"
            onClick={onRearrangeIcons}
            title="Reset Icons"
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/15 flex items-center justify-center text-cyan-300 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onOpenWindow('win-themes')}
            title="Themes"
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/15 flex items-center justify-center text-fuchsia-300 transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4 4 4 0 01-4 4H7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6l-7 7-6-6 7-7z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/15 flex items-center justify-center text-slate-200 transition-all"
          >
            {soundEnabled ? (
              <svg className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          {musicClosedToTray && (
            <button
              type="button"
              onClick={onRestoreMusic}
              title="Astro.Radio Tray"
              className="w-8 h-8 rounded-xl bg-violet-600/40 border border-violet-400/60 flex items-center justify-center text-xs text-violet-200 shadow-md shadow-violet-500/20"
            >
              <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </button>
          )}

          {physicsPopoverOpen && (
            <div className="absolute bottom-12 left-0 w-40 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 space-y-1">
              {(Object.keys(PHYSICS_DESCRIPTIONS) as PhysicsMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    onChangePhysicsMode(m);
                    setPhysicsPopoverOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[11px] font-mono flex items-center gap-2 transition-colors ${
                    physicsMode === m
                      ? 'bg-cyan-500/25 text-cyan-200 font-bold border border-cyan-400/40'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {renderPhysicsIcon(m)}
                  <span>{PHYSICS_DESCRIPTIONS[m]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Home / Start Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPhysicsPopoverOpen(false);
            setMusicTrayMenuOpen(false);
            onToggleStartMenu();
          }}
          aria-label="Start"
          aria-expanded={startMenuOpen}
          className="xp-start-btn w-11 h-11 rounded-2xl flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-pink-500/30 border border-white/40 text-white justify-self-center"
        >
          <AstroLogoSvg className="w-6 h-6 shrink-0" />
        </button>

        {/* Bottom-Right: Dynamic Stacked Dual-Timezone Clock */}
        <button
          type="button"
          onClick={onOpenTimezoneModal}
          title="World Clocks"
          className="justify-self-end flex flex-col items-end justify-center gap-0.5 px-2 py-1 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
            <span className="px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[8.5px] tracking-wider">
              {row1.code}
            </span>
            <span className="text-slate-100 font-bold tabular-nums">{row1.tStr}</span>
          </div>
          {row2 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono leading-none opacity-80">
              <span className="px-1 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold text-[8.5px] tracking-wider">
                {row2.code}
              </span>
              <span className="text-slate-300 font-semibold tabular-nums">{row2.tStr}</span>
            </div>
          )}
        </button>
      </footer>
    );
  }

  return (
    <footer
      ref={footerRef}
      onClick={(e) => e.stopPropagation()}
      className="w-full h-12 xp-taskbar px-3 flex items-center justify-between gap-2 z-40 relative shrink-0"
    >
      {/* Left: Start + Quick Desktop Draw */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPhysicsPopoverOpen(false);
            setMusicTrayMenuOpen(false);
            onToggleStartMenu();
          }}
          aria-label="Start"
          aria-expanded={startMenuOpen}
          className={`xp-start-btn w-10 h-9 rounded-xl flex items-center justify-center transition-all ${
            startMenuOpen ? 'ring-2 ring-cyan-400/60' : ''
          }`}
        >
          <AstroLogoSvg className="w-6 h-6 shrink-0" />
        </button>

        <button
          type="button"
          onClick={onToggleDesktopDraw}
          title="Draw directly on desktop"
          className={`h-8 px-2.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            desktopDrawActive
              ? 'bg-yellow-400/25 border-yellow-400 text-yellow-200 font-bold'
              : 'bg-white/8 hover:bg-white/18 border-white/15 text-slate-200'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="hidden lg:inline">Draw</span>
        </button>
      </div>

      {/* Center: Open Windows Tabs */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto px-1">
        {openWindows.map((w) => {
          const meta = WINDOW_META_MAP[w.id];
          const isActive = activeWindowId === w.id && !w.isMinimized;
          return (
            <button
              type="button"
              key={w.id}
              onClick={() => onTaskbarWindowClick(w.id)}
              className={`h-8 px-3 rounded-xl flex items-center gap-2 text-xs font-mono whitespace-nowrap shrink-0 transition-all backdrop-blur-md ${
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
              <span className="whitespace-nowrap">{meta.shortTitle}</span>
              {w.isMinimized && <span className="text-[10px] text-cyan-300">_</span>}
            </button>
          );
        })}
      </div>

      {/* Right Tray: Reset, Theme, Physics, Music Tray, Sound, Clocks */}
      <div className="flex items-center gap-1.5 shrink-0 relative">
        <button
          type="button"
          onClick={onRearrangeIcons}
          title="Reset desktop icons to grid"
          className="h-8 w-8 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onOpenWindow('win-themes')}
          title="Theme Studio"
          className="h-8 w-8 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-fuchsia-300 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4 4 4 0 01-4 4H7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6l-7 7-6-6 7-7z" />
          </svg>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMusicTrayMenuOpen(false);
              setPhysicsPopoverOpen((v) => !v);
            }}
            title={`Physics: ${PHYSICS_DESCRIPTIONS[physicsMode]}`}
            className="h-8 w-8 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-cyan-200 transition-colors"
          >
            {renderPhysicsIcon(physicsMode)}
          </button>

          {physicsPopoverOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-11 right-0 w-60 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
            >
              <div className="px-2 py-1 text-[11px] font-mono font-bold text-cyan-300 border-b border-white/10">
                Rigid-Body Physics Kernel
              </div>
              {(Object.keys(PHYSICS_DESCRIPTIONS) as PhysicsMode[]).map((m) => (
                <button
                  type="button"
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
              <div className="pt-1 border-t border-white/10 space-y-1">
                <button
                  type="button"
                  onClick={onToggleWindowCollisions}
                  className={`w-full px-2 py-1.5 rounded-xl text-left text-[11px] font-mono flex items-center justify-between border transition-colors ${
                    windowCollisions
                      ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>Window Collisions</span>
                  <span className="font-bold">{windowCollisions ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
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

        {musicClosedToTray && (
          <div className="relative">
            <button
              type="button"
              onClick={onRestoreMusic}
              onContextMenu={(e) => {
                e.preventDefault();
                setPhysicsPopoverOpen(false);
                setMusicTrayMenuOpen((v) => !v);
              }}
              title="Astro.Radio Tray (Right-click to exit)"
              className="h-8 w-8 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/50 flex items-center justify-center text-violet-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </button>
            {musicTrayMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-11 right-0 w-44 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 space-y-1"
              >
                <button
                  type="button"
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
                  type="button"
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
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          className="h-8 w-8 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-xs text-slate-300 transition-colors"
        >
          {soundEnabled ? (
            <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        {/* World Clocks */}
        <button
          type="button"
          onClick={onOpenTimezoneModal}
          title="Configure World Clocks"
          className="h-8 px-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-2 text-xs font-mono text-slate-200 transition-colors"
        >
          {selectedTimezones.slice(0, 4).map((tzId, idx) => {
            const meta = AVAILABLE_TIMEZONES.find((t) => t.id === tzId);
            let timeStr = '--:--';
            try {
              timeStr = now.toLocaleTimeString([], {
                timeZone: tzId,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            } catch {
              timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            return (
              <span
                key={`${tzId}-${idx}`}
                className={`items-center gap-1 whitespace-nowrap ${
                  idx >= 2 ? 'hidden lg:flex' : 'flex'
                } ${idx > 0 ? 'border-l border-white/15 pl-2' : ''}`}
              >
                {renderCountryBadge(meta?.code || 'UTC')}
                <span className="tabular-nums text-[11px] font-semibold text-white">{timeStr}</span>
              </span>
            );
          })}
        </button>
      </div>
    </footer>
  );
};
