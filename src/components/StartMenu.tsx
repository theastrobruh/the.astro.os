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

const NEWS_ITEMS = [
  { title: 'James Webb spots water vapor in habitable zone disk', time: '1h ago', tag: 'Cosmos' },
  { title: 'Vite 8 & Tailwind v4 adopted across modern web apps', time: '3h ago', tag: 'Dev' },
];

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
      className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[calc(100vw-20px)] max-w-2xl md:translate-x-0 md:bottom-14 md:left-3 md:w-[680px] bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 p-4 md:p-5 flex flex-col md:flex-row gap-4 max-h-[85vh] overflow-hidden"
    >
      {/* Left Column: Apps & System Actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Creator Branding Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
                🪐
              </div>
            </div>
            <div>
              <h3 className="text-sm font-extrabold font-display cardgram-logo-text">{osTitle}</h3>
              <p className="text-[11px] text-slate-400 font-mono">v.0.5.0</p>
            </div>
          </div>
          <span
            className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg border ${
              userRole === 'admin'
                ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                : 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
            }`}
          >
            {userRole === 'admin' ? '👑 Admin' : '🚀 Guest'}
          </span>
        </div>

        {/* Apps Grid (Buttons Style) */}
        <div className="py-3 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[300px]">
          <button
            onClick={() => launch(() => onOpenWindow('win-astroverse'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">🧑‍🚀</span>
            <span className="text-xs font-mono font-bold text-white">Astro.Verse</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-youtube'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-red-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">▶</span>
            <span className="text-xs font-mono font-bold text-white">YouTube</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-music'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-violet-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">📻</span>
            <span className="text-xs font-mono font-bold text-white">Music</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-cardgram'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">🃏</span>
            <span className="text-xs font-mono font-bold text-white">CardGram</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-draw'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-yellow-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">🎨</span>
            <span className="text-xs font-mono font-bold text-white">Paint</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-notes'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">📝</span>
            <span className="text-xs font-mono font-bold text-white">Notes</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-terminal'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">💻</span>
            <span className="text-xs font-mono font-bold text-white">Terminal</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-mediaflow'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">🖼️</span>
            <span className="text-xs font-mono font-bold text-white">MediaFlow</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-themes'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-fuchsia-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xl">🌈</span>
            <span className="text-xs font-mono font-bold text-white">Themes</span>
          </button>
        </div>

        {/* Quick Tools Row */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 shrink-0">
          <button
            onClick={() => launch(onToggleDesktopDraw)}
            title="Draw on Desktop"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-mono text-cyan-300"
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => launch(onNewImageWidget)}
            title="Upload Widget"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-mono text-pink-300"
          >
            + Widget
          </button>
          <button
            onClick={() => launch(onRearrangeIcons)}
            title="Reset Icons"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-mono text-emerald-300"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => launch(onLogout)}
            title="Lock / Logout"
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/30 text-xs font-mono text-rose-300"
          >
            🚪 Exit
          </button>
        </div>
      </div>

      {/* Right Column: 4 Windows-Style Widgets */}
      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4 flex flex-col gap-2.5 shrink-0">
        <span className="text-[11px] font-mono font-bold text-slate-400">Windows Live Widgets</span>

        {/* Widget 1: Photo of the Day */}
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 hover:border-cyan-400/30 transition-colors">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
            <img
              src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=160&auto=format&fit=crop&q=60"
              alt="Deep Space"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-cyan-300 font-bold">Image of the Day</div>
            <div className="text-xs font-mono text-white truncate">Orion Nebula HD</div>
            <div className="text-[10px] text-slate-400">Deep Field Survey</div>
          </div>
        </div>

        {/* Widget 2: GIF of the Day */}
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 hover:border-pink-400/30 transition-colors">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
            <img
              src="https://media.tenor.com/hWEGQvJ2ntsAAAAM/haishatp-dahyun.gif"
              alt="GIF of the day"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-pink-300 font-bold">GIF of the Day</div>
            <div className="text-xs font-mono text-white truncate">Dahyun Pulse</div>
            <div className="text-[10px] text-slate-400">120 BPM Looped</div>
          </div>
        </div>

        {/* Widget 3: Cosmos News */}
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/30 transition-colors">
          <div className="text-[10px] font-mono text-indigo-300 font-bold flex items-center justify-between">
            <span>Cosmos News</span>
            <span className="text-slate-500">Live</span>
          </div>
          <p className="text-xs font-mono text-white mt-1 leading-snug line-clamp-2">
            {NEWS_ITEMS[0].title}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{NEWS_ITEMS[0].time}</span>
        </div>

        {/* Widget 4: Tech News */}
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/30 transition-colors">
          <div className="text-[10px] font-mono text-emerald-300 font-bold flex items-center justify-between">
            <span>Tech Wire</span>
            <span className="text-slate-500">Feed</span>
          </div>
          <p className="text-xs font-mono text-white mt-1 leading-snug line-clamp-2">
            {NEWS_ITEMS[1].title}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{NEWS_ITEMS[1].time}</span>
        </div>
      </div>
    </div>
  );
};
