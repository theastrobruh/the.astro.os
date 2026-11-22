import React from 'react';
import { UserRole, WindowId } from '../types/os';

interface StartMenuProps {
  open: boolean;
  osTitle: string;
  userRole: UserRole;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
  onToggleDesktopDraw: () => void;
  onNewImageWidget: () => void;
  onRearrangeIcons: () => void;
  onImpulseBurst: () => void;
  onLogout: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  open,
  osTitle,
  userRole,
  onClose,
  onOpenWindow,
  onToggleDesktopDraw,
  onNewImageWidget,
  onRearrangeIcons,
  onImpulseBurst,
  onLogout,
}) => {
  if (!open) return null;

  const launch = (fn: () => void) => {
    fn();
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] max-w-sm md:translate-x-0 md:bottom-14 md:left-2 md:w-96 bg-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 p-4"
    >
      {/* Creator Branding Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
              🪐
            </div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-display cardgram-logo-text">{osTitle}</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              by <span className="text-pink-400 font-semibold">theAstroBruh</span>
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-mono font-semibold ${
            userRole === 'admin' ? 'text-amber-300' : 'text-cyan-300'
          }`}
        >
          {userRole === 'admin' ? '👑 Admin' : '🚀 Invitado'}
        </span>
      </div>

      {/* Menu Items */}
      <div className="py-2.5 space-y-1 max-h-[60vh] overflow-y-auto">
        <button
          onClick={() => launch(() => onOpenWindow('win-admin'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-amber-300 transition-colors"
        >
          <span>👑</span>
          <span>Panel de Control Admin</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-astroverse'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-pink-300 transition-colors"
        >
          <span>🪐</span>
          <span>theAstroBruh & Links</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-music'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-violet-300 transition-colors"
        >
          <span>📻</span>
          <span>Música & Radio Player</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-mediaflow'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-cyan-300 transition-colors"
        >
          <span>🖼️</span>
          <span>MediaFlow Studio & GIFs</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-cardgram'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-pink-300 transition-colors"
        >
          <span>💳</span>
          <span>CardGram Showcase</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-draw'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-yellow-300 transition-colors"
        >
          <span>🎨</span>
          <span>Pintura Studio</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-notes'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-indigo-300 transition-colors"
        >
          <span>📓</span>
          <span>Cuaderno & Glosario</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-terminal'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-emerald-300 transition-colors"
        >
          <span>💻</span>
          <span>Astro Console (Terminal)</span>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-themes'))}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-fuchsia-300 transition-colors"
        >
          <span>🌈</span>
          <span>Theme Studio & Efectos</span>
        </button>

        <div className="border-t border-white/10 my-1.5 pt-1.5 space-y-1">
          <button
            onClick={() => launch(onToggleDesktopDraw)}
            className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-cyan-300 transition-colors"
          >
            <span>✏️</span>
            <span>Dibujar en Escritorio</span>
          </button>

          <button
            onClick={() => launch(onNewImageWidget)}
            className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-fuchsia-300 transition-colors"
          >
            <span>🖼️</span>
            <span>Nuevo Widget de Imagen / GIF</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-icon-manager'))}
            className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-sky-300 transition-colors"
          >
            <span>🧩</span>
            <span>Personalizar Íconos</span>
          </button>

          <button
            onClick={() => launch(onImpulseBurst)}
            className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-amber-300 transition-colors"
          >
            <span>⚡</span>
            <span>Impulso de Físicas 2D</span>
          </button>

          <button
            onClick={() => launch(onRearrangeIcons)}
            className="w-full px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left text-xs font-semibold text-emerald-300 transition-colors"
          >
            <span>🔄</span>
            <span>Reordenar Íconos</span>
          </button>
        </div>

        <button
          onClick={() => launch(onLogout)}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-rose-500/20 flex items-center gap-3 text-left text-xs font-semibold text-rose-300 border-t border-white/10 mt-1 pt-2.5 transition-colors"
        >
          <span>🚪</span>
          <span>Cerrar Sesión / Cambiar Usuario</span>
        </button>
      </div>
    </div>
  );
};
