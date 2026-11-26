import React from 'react';
import { UserRole, WindowId } from '../types/os';
import { COSMOS_WIDGET_IMG, DAHYUN_GIF_URL } from '../constants/defaults';
import { AstroLogoSvg } from './DesktopIconItem';

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
  { title: 'SAT OBB 2D Rigid-Body Kernel active at 60fps', time: 'Live', tag: 'Physics' },
  { title: 'MediaFlow GIF & Canvas Widget Studio ready', time: 'System', tag: 'Widgets' },
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
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[calc(100vw-20px)] max-w-2xl md:translate-x-0 md:bottom-14 md:left-3 md:w-[680px] bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 p-4 md:p-5 flex flex-col md:flex-row gap-4 max-h-[85vh] overflow-hidden"
    >
      {/* Left Column: Apps & System Actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-0.5 shadow-md shadow-pink-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <AstroLogoSvg className="w-7 h-7" />
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

        {/* Apps Grid */}
        <div className="py-3 grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto max-h-[320px]">
          <button
            onClick={() => launch(() => onOpenWindow('win-astroverse'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="6" />
                <path d="M4 16C7 19 17 19 20 8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Astro.Verse</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-cardgram'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-pink-400/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500/25 to-cyan-500/25 text-pink-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <circle cx="9" cy="11" r="2" />
                <path d="M14 10h4M14 14h3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">CardGram</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-pressmark'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M9 15V9h4a2 2 0 010 4H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Pressmark</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-astrochess'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-amber-400/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M8 19h8M9 16h6l-1-4c1.5-1.5 2-4 .5-6-1-1.2-2.5-1.5-4-1.2L9.5 3 8 5.5C6.5 6.5 6 8.5 7 10l2.5-1L8 12l1 4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Astro Chess</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-astrostudio'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-violet-400/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M7 16l4-4 3 3 2-2 3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Astro.Studio</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-inkra'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-fuchsia-400/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 4l5 5-9 9H6v-5l9-9z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Inkra</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-notes'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Notes</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-draw'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-yellow-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l7-7 3 3-7 7-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Paint</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-terminal'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Terminal</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-music'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-violet-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">Music</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-youtube'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-rose-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">YouTube</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-mediaflow'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8.5" cy="9.5" r="1.5" />
                <path d="M21 15l-5-5L5 19" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">MediaFlow</span>
          </button>

          <button
            onClick={() => launch(() => onOpenWindow('win-admin'))}
            className="p-2 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-amber-500/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-200 whitespace-nowrap">Admin Panel</span>
          </button>
        </div>

        {/* Quick Tools Row */}
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

      {/* Right Column: Live Widgets (Desktop & Tablet only) */}
      <div className="hidden md:flex w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4 flex-col gap-2.5 shrink-0">
        <span className="text-[11px] font-mono font-bold text-slate-400">Desktop Live Widgets</span>

        <button
          onClick={() => launch(() => onOpenWindow('win-mediaflow'))}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 hover:border-cyan-400/30 transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
            <img
              src={COSMOS_WIDGET_IMG}
              alt="Deep Space"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-cyan-300 font-bold">Image of the Day</div>
            <div className="text-xs font-mono text-white leading-tight">Cosmos Nebula HD</div>
            <div className="text-[10px] text-slate-400">Deep Field Survey</div>
          </div>
        </button>

        <button
          onClick={() => launch(() => onOpenWindow('win-mediaflow'))}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 hover:border-pink-400/30 transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
            <img
              src={DAHYUN_GIF_URL}
              alt="GIF of the day"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-pink-300 font-bold">GIF of the Day</div>
            <div className="text-xs font-mono text-white leading-tight">Dahyun Pulse</div>
            <div className="text-[10px] text-slate-400">120 BPM Looped</div>
          </div>
        </button>

        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/30 transition-colors">
          <div className="text-[10px] font-mono text-indigo-300 font-bold flex items-center justify-between">
            <span>Physics Kernel</span>
            <span className="text-slate-500">{NEWS_ITEMS[0].time}</span>
          </div>
          <p className="text-xs font-mono text-white mt-1 leading-snug line-clamp-2">
            {NEWS_ITEMS[0].title}
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/30 transition-colors">
          <div className="text-[10px] font-mono text-emerald-300 font-bold flex items-center justify-between">
            <span>System Studio</span>
            <span className="text-slate-500">{NEWS_ITEMS[1].time}</span>
          </div>
          <p className="text-xs font-mono text-white mt-1 leading-snug line-clamp-2">
            {NEWS_ITEMS[1].title}
          </p>
        </div>
      </div>
    </div>
  );
};
