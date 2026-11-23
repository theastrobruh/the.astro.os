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
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="7" stroke="currentColor" fill="rgba(0,240,255,0.15)" />
                  <path d="M4.5 15.5C7.5 19 16.5 19 19.5 8.5" stroke="currentColor" strokeLinecap="round" />
                </svg>
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
            {userRole === 'admin' ? 'Admin' : 'Guest'}
          </span>
        </div>

        {/* Apps Grid (Clean SVG Buttons Style, Zero Emojis) */}
        <div className="py-3 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[300px]">
          {/* Astro.Verse */}
          <button
            onClick={() => launch(() => onOpenWindow('win-astroverse'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="7" />
                <path d="M4 16C7 19 17 19 20 8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">Astro.Verse</span>
          </button>

          {/* YouTube */}
          <button
            onClick={() => launch(() => onOpenWindow('win-youtube'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-red-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">YouTube</span>
          </button>

          {/* Music */}
          <button
            onClick={() => launch(() => onOpenWindow('win-music'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-violet-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">Music</span>
          </button>

          {/* CardGram */}
          <button
            onClick={() => launch(() => onOpenWindow('win-cardgram'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M7 8h10M7 12h6M7 16h8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">CardGram</span>
          </button>

          {/* Paint */}
          <button
            onClick={() => launch(() => onOpenWindow('win-draw'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-yellow-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">Paint</span>
          </button>

          {/* Notes */}
          <button
            onClick={() => launch(() => onOpenWindow('win-notes'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">Notes</span>
          </button>

          {/* Terminal */}
          <button
            onClick={() => launch(() => onOpenWindow('win-terminal'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">Terminal</span>
          </button>

          {/* MediaFlow */}
          <button
            onClick={() => launch(() => onOpenWindow('win-mediaflow'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">MediaFlow</span>
          </button>

          {/* Themes */}
          <button
            onClick={() => launch(() => onOpenWindow('win-themes'))}
            className="p-2.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-fuchsia-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4 4 4 0 01-4 4H7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6l-7 7-6-6 7-7z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-white">Themes</span>
          </button>
        </div>

        {/* Quick Tools Row (Clean SVG Icons) */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 shrink-0">
          <button
            onClick={() => launch(onToggleDesktopDraw)}
            title="Draw on Desktop"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Draw</span>
          </button>
          <button
            onClick={() => launch(onNewImageWidget)}
            title="Upload Widget"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-mono text-pink-300 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Widget</span>
          </button>
          <button
            onClick={() => launch(onRearrangeIcons)}
            title="Reset Icons"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Reset</span>
          </button>
          <button
            onClick={() => launch(onLogout)}
            title="Lock / Logout"
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Exit</span>
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
