import React from 'react';
import { ASTRO_AVATAR_IMG } from '../../constants/defaults';
import { WindowId } from '../../types/os';

interface AstroVerseAppProps {
  onOpenWindow: (id: WindowId) => void;
}

export const AstroVerseApp: React.FC<AstroVerseAppProps> = ({ onOpenWindow }) => {
  const links = [
    {
      code: 'CG',
      title: 'CardGram',
      subtitle: 'Digital cards & web identity platform',
      url: 'https://theastrobruh.github.io/CardGram/#/home',
      accent: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/30',
      internalWin: 'win-cardgram' as WindowId,
    },
    {
      code: 'IK',
      title: 'Inkra',
      subtitle: 'Creative illustration & digital studio',
      url: 'https://theastrobruh.github.io/Inkra/inkra.html',
      accent: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-400/30',
    },
    {
      code: 'BH',
      title: 'BioHub',
      subtitle: 'Personal bio & centralized links',
      url: 'https://theastrobruh.github.io/BioHub/',
      accent: 'text-pink-300 bg-pink-500/15 border-pink-400/30',
    },
    {
      code: 'GH',
      title: 'GitHub Repo',
      subtitle: 'github.com/theastrobruh/the.astro.os',
      url: 'https://github.com/theastrobruh/the.astro.os',
      accent: 'text-slate-200 bg-white/10 border-white/25',
    },
  ];

  return (
    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-start overflow-y-auto space-y-2.5">
      {/* Creator Profile */}
      <div className="flex flex-col items-center text-center">
        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-pink-500/25">
          <img
            src={ASTRO_AVATAR_IMG}
            alt="theAstroBruh"
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover bg-slate-950"
          />
        </div>
        <h2 className="mt-1.5 text-xs sm:text-sm font-bold text-white font-display tracking-wide">
          theAstroBruh
        </h2>
        <p className="text-[10px] sm:text-[11px] font-mono text-cyan-300/90">
          Creative Developer · Cosmic Web OS
        </p>
      </div>

      {/* Links Grid / List */}
      <div className="pt-2 border-t border-white/10 space-y-1.5">
        {links.map((item) => (
          <div
            key={item.code}
            className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border font-mono text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 ${item.accent}`}
              >
                {item.code}
              </span>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-mono font-semibold text-slate-100 truncate">
                  {item.title}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">{item.subtitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {item.internalWin && (
                <button
                  onClick={() => onOpenWindow(item.internalWin!)}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 border border-cyan-400/30 text-[9px] sm:text-[10px] font-mono transition-colors"
                >
                  Open
                </button>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${item.title}`}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
