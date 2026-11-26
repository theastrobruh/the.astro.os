import React from 'react';
import { ASTRO_AVATAR_IMG } from '../../constants/defaults';
import { WindowId } from '../../types/os';
import { renderDefaultSvg } from '../DesktopIconItem';

interface AstroVerseAppProps {
  onOpenWindow: (id: WindowId) => void;
}

export const AstroVerseApp: React.FC<AstroVerseAppProps> = ({ onOpenWindow }) => {
  const links: Array<{
    code: string;
    title: string;
    subtitle: string;
    url: string;
    accent: string;
    internalWin?: WindowId;
  }> = [
    {
      code: 'CG',
      title: 'CardGram',
      subtitle: 'Digital cards & web identity platform',
      url: 'https://theastrobruh.github.io/CardGram/#/home',
      accent: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/35',
      internalWin: 'win-cardgram',
    },
    {
      code: 'IK',
      title: 'Inkra',
      subtitle: 'Creative illustration & digital studio',
      url: 'https://theastrobruh.github.io/Inkra/inkra.html',
      accent: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-400/35',
      internalWin: 'win-inkra',
    },
    {
      code: 'BH',
      title: 'BioHub',
      subtitle: 'Personal bio & centralized links',
      url: 'https://theastrobruh.github.io/BioHub/',
      accent: 'text-pink-300 bg-pink-500/15 border-pink-400/35',
      internalWin: 'win-biohub',
    },
    {
      code: 'PM',
      title: 'Pressmark',
      subtitle: 'Watermark & Media Multi-Tool',
      url: 'https://theastrobruh.github.io/Pressmark/',
      accent: 'text-sky-300 bg-sky-500/15 border-sky-400/35',
      internalWin: 'win-pressmark',
    },
    {
      code: 'AC',
      title: 'Astro Chess',
      subtitle: 'Cosmic interactive chess game',
      url: 'https://theastrobruh.github.io/Astro-Chess/',
      accent: 'text-amber-300 bg-amber-500/15 border-amber-400/35',
      internalWin: 'win-astrochess',
    },
    {
      code: 'AS',
      title: 'Astro.Studio',
      subtitle: 'Cosmic image editor & studio',
      url: 'https://theastrobruh.github.io/Astro.Studio/',
      accent: 'text-violet-300 bg-violet-500/15 border-violet-400/35',
      internalWin: 'win-astrostudio',
    },
    {
      code: 'AU',
      title: 'Astro.Upscaler',
      subtitle: 'AI image upscaler & enhancer',
      url: 'https://theastrobruh.github.io/Astro.Upscale/',
      accent: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/35',
      internalWin: 'win-astroupscaler',
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
      <div className="flex flex-col items-center text-center">
        <a
          href="https://github.com/theastrobruh"
          target="_blank"
          rel="noopener noreferrer"
          title="Open theAstroBruh on GitHub"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform cursor-pointer"
        >
          <img
            src="https://github.com/theastrobruh.png"
            alt="theAstroBruh"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== ASTRO_AVATAR_IMG) {
                img.src = ASTRO_AVATAR_IMG;
              }
            }}
            className="w-full h-full rounded-full object-cover bg-slate-950"
          />
        </a>
        <h2 className="mt-1.5 text-xs sm:text-sm font-bold text-white font-display tracking-wide">
          theAstroBruh
        </h2>
        <p className="text-[10px] sm:text-[11px] font-mono text-cyan-300/90">
          Creative Developer · Cosmic Web OS
        </p>
      </div>

      <div className="pt-2 border-t border-white/10 space-y-1.5">
        {links.map((item) => (
          <div
            key={item.code}
            className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden">
                {item.internalWin ? (
                  renderDefaultSvg(item.internalWin)
                ) : (
                  <svg className="w-4 h-4 text-slate-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-mono font-semibold text-slate-100 leading-tight">
                  {item.title}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight break-all">{item.subtitle}</div>
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
