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
  onToggleStartMenu: () => void;
  onRearrangeIcons: () => void;
  onToggleDesktopDraw: () => void;
  onOpenWindow: (id: WindowId) => void;
  onTaskbarWindowClick: (id: WindowId) => void;
  onChangePhysicsMode: (mode: PhysicsMode) => void;
  onImpulseBurst: () => void;
  onToggleSound: () => void;
  onOpenTimezoneModal: () => void;
}

const PHYSICS_LABELS: Record<PhysicsMode, { icon: string; name: string }> = {
  tactile: { icon: '💨', name: 'Inercia Táctil' },
  earth: { icon: '🍎', name: 'Gravedad 9.8m/s²' },
  'zero-g': { icon: '🪐', name: 'Gravedad Zero-G' },
  static: { icon: '📌', name: 'Clásico Fijo' },
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
  onToggleStartMenu,
  onRearrangeIcons,
  onToggleDesktopDraw,
  onOpenWindow,
  onTaskbarWindowClick,
  onChangePhysicsMode,
  onImpulseBurst,
  onToggleSound,
  onOpenTimezoneModal,
}) => {
  const [now, setNow] = useState(() => new Date());
  const [physicsPopoverOpen, setPhysicsPopoverOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindows = (Object.values(windows) as WindowRuntimeState[]).filter((w) => w.isOpen);

  const StartPlanetSvg = (
    <svg className="w-7 h-7 drop-shadow-[0_0_8px_rgba(0,240,255,0.65)]" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="tbPlanet" x1="14" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="55%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
        <linearGradient id="tbRing" x1="4" y1="28" x2="44" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF007A" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M6 27C10 20 38 15 42 21" stroke="url(#tbRing)" strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
      <circle cx="24" cy="24" r="10.5" fill="url(#tbPlanet)" />
      <path d="M42 21C44 25 14 34 6 27" stroke="url(#tbRing)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );

  // Mobile Smartphone Dock Layout (< 768px)
  if (isMobile) {
    return (
      <>
        {/* Floating Open App Switcher Bar on Mobile */}
        {openWindows.length > 0 && (
          <div className="fixed bottom-[62px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-slate-950/55 backdrop-blur-xl border border-white/15 shadow-xl max-w-[calc(100vw-20px)] overflow-x-auto">
            {openWindows.map((w) => {
              const meta = WINDOW_META_MAP[w.id];
              const isActive = activeWindowId === w.id && !w.isMinimized;
              return (
                <button
                  key={w.id}
                  onClick={() => onTaskbarWindowClick(w.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-pink-500/35 border border-pink-400 text-white font-semibold'
                      : 'bg-white/10 border border-white/15 text-slate-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
                  <span>{meta.shortTitle}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Transparent Mobile Bottom Dock with Centered Start Planet */}
        <footer className="w-full h-14 xp-taskbar px-3 flex items-center justify-between z-40 relative shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onRearrangeIcons}
              title="Reordenar íconos"
              className="w-10 h-10 rounded-xl bg-white/10 active:scale-95 flex items-center justify-center text-slate-100 border border-white/15"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={onToggleDesktopDraw}
              title="Dibujar en Pantalla"
              className={`w-10 h-10 rounded-xl active:scale-95 flex items-center justify-center border ${
                desktopDrawActive
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-white/10 text-yellow-300 border-white/15'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <button
            onClick={onToggleStartMenu}
            aria-label="Inicio"
            className="xp-start-btn w-12 h-11 rounded-2xl flex items-center justify-center transition-transform active:scale-95 -mt-2"
          >
            {StartPlanetSvg}
          </button>

          <div className="flex items-center gap-1.5 relative">
            <button
              onClick={() => setPhysicsPopoverOpen((v) => !v)}
              title="Físicas 2D"
              className="w-10 h-10 rounded-xl bg-white/10 active:scale-95 flex items-center justify-center text-sm border border-white/15"
            >
              {PHYSICS_LABELS[physicsMode].icon}
            </button>
            <button
              onClick={() => onOpenWindow('win-music')}
              title="Música & Radio"
              className="w-10 h-10 rounded-xl bg-white/10 active:scale-95 flex items-center justify-center text-violet-300 border border-white/15"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </button>

            {physicsPopoverOpen && (
              <div className="absolute bottom-14 right-0 w-56 bg-slate-950/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                <div className="px-2 py-1 text-[11px] font-mono font-bold text-cyan-300 border-b border-white/10">
                  Motor de Físicas 2D
                </div>
                {(Object.keys(PHYSICS_LABELS) as PhysicsMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      onChangePhysicsMode(m);
                      setPhysicsPopoverOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-mono flex items-center justify-between ${
                      physicsMode === m
                        ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>
                      {PHYSICS_LABELS[m].icon} {PHYSICS_LABELS[m].name}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    onImpulseBurst();
                    setPhysicsPopoverOpen(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-xs font-mono font-semibold bg-pink-500/20 text-pink-200 border border-pink-500/30"
                >
                  ⚡ Impulso Cósmico
                </button>
              </div>
            )}
          </div>
        </footer>
      </>
    );
  }

  // Desktop & Tablet/iPad Transparent Glass Taskbar
  return (
    <footer className="w-full h-13 xp-taskbar px-3 flex items-center justify-between gap-2 z-40 relative shrink-0">
      {/* Left: Start + Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleStartMenu}
          title="Inicio"
          aria-label="Menú Inicio"
          aria-expanded={startMenuOpen}
          className="xp-start-btn w-11 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-95"
        >
          {StartPlanetSvg}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRearrangeIcons}
            title="Reordenar íconos del escritorio"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/18 border border-white/10 text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          <button
            onClick={onToggleDesktopDraw}
            title="Dibujar en Escritorio"
            className={`p-2 rounded-xl border transition-colors ${
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
            onClick={() => onOpenWindow('win-music')}
            title="Reproductor de Música & Radio"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/18 border border-white/10 text-violet-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </button>

          <button
            onClick={() => onOpenWindow('win-icon-manager')}
            title="Personalizar íconos"
            className="hidden lg:flex p-2 rounded-xl bg-white/8 hover:bg-white/18 border border-white/10 text-cyan-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center: Open Windows */}
      <div className="flex-1 flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto px-2 min-w-0">
        {openWindows.map((w) => {
          const meta = WINDOW_META_MAP[w.id];
          const isActive = activeWindowId === w.id && !w.isMinimized;
          return (
            <button
              key={w.id}
              onClick={() => onTaskbarWindowClick(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all backdrop-blur-md ${
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

      {/* Right Tray: Physics Switcher, Sound & Multi-Timezone Clock */}
      <div className="flex items-center gap-1.5 shrink-0 relative">
        <div className="relative">
          <button
            onClick={() => setPhysicsPopoverOpen((v) => !v)}
            title="Motor de Físicas 2D"
            className="h-9 px-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center gap-1.5 text-xs font-mono text-cyan-200 transition-colors whitespace-nowrap"
          >
            <span>{PHYSICS_LABELS[physicsMode].icon}</span>
            <span className="hidden xl:inline">{PHYSICS_LABELS[physicsMode].name}</span>
          </button>

          {physicsPopoverOpen && (
            <div className="absolute bottom-12 right-0 w-60 bg-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono font-bold text-cyan-300 border-b border-white/10">
                Motor de Físicas 2D
              </div>
              {(Object.keys(PHYSICS_LABELS) as PhysicsMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onChangePhysicsMode(m);
                    setPhysicsPopoverOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-colors ${
                    physicsMode === m
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{PHYSICS_LABELS[m].icon}</span>
                    <span>{PHYSICS_LABELS[m].name}</span>
                  </span>
                  {physicsMode === m && <span className="text-[10px] text-cyan-300">Activo</span>}
                </button>
              ))}
              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    onImpulseBurst();
                    setPhysicsPopoverOpen(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-xs font-mono font-semibold bg-pink-500/20 hover:bg-pink-500/35 text-pink-200 border border-pink-500/30 transition-colors"
                >
                  ⚡ Impulso Cósmico (Lanzar)
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar efectos de física/UI' : 'Activar efectos de sonido'}
          className="h-9 w-9 rounded-xl bg-white/8 hover:bg-white/18 border border-white/15 flex items-center justify-center text-xs transition-colors"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Multi-Timezone Clock Pill (adapts count on Tablet vs Desktop) */}
        <button
          onClick={onOpenTimezoneModal}
          title="Configurar zonas horarias"
          className="flex items-center bg-white/8 hover:bg-white/18 border border-white/15 hover:border-pink-400/50 rounded-xl px-2.5 h-9 transition-colors"
        >
          {selectedTimezones.slice(0, 4).map((tzId, idx) => {
            const tz = AVAILABLE_TIMEZONES.find((t) => t.id === tzId) || AVAILABLE_TIMEZONES[0];
            let timeStr = '--:--';
            try {
              timeStr = now.toLocaleTimeString('es-ES', {
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
