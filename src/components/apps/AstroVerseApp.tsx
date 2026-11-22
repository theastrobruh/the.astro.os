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
      subtitle: 'Creative digital design & illustration tool',
      url: 'https://theastrobruh.github.io/Inkra/inkra.html',
      accent: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-400/30',
    },
    {
      code: 'BH',
      title: 'BioHub',
      subtitle: 'Personal bio hub & centralized links',
      url: 'https://theastrobruh.github.io/BioHub/',
      accent: 'text-pink-300 bg-pink-500/15 border-pink-400/30',
    },
    {
      code: 'GH',
      title: 'GitHub · theastrobruh',
      subtitle: 'github.com/theastrobruh/the.astro.os',
      url: 'https://github.com/theastrobruh/the.astro.os',
      accent: 'text-slate-200 bg-white/10 border-white/25',
    },
  ];

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-5">
      {/* Creator Profile */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2.5px] shadow-xl shadow-pink-500/25">
          <img
            src={ASTRO_AVATAR_IMG}
            alt="theAstroBruh Avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover bg-slate-950"
          />
        </div>
        <h2 className="mt-3 text-base font-bold text-white font-display tracking-wide">
          theAstroBruh
        </h2>
        <p className="text-[11px] font-mono text-cyan-300/90 tracking-wider mt-0.5">
          Creative Developer · Content Creator
        </p>
        <p className="text-xs text-slate-300 leading-relaxed mt-2.5 max-w-[310px]">
          Creative developer & content creator blending design, video editing and interactive physics into cosmic web experiences.
        </p>
      </div>

      {/* Links */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <p className="text-[11px] font-mono font-semibold text-pink-300 mb-2">
          Desarrollado por theAstroBruh
        </p>

        {links.map((item) => (
          <div
            key={item.code}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-8 h-8 rounded-lg border font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${item.accent}`}
              >
                {item.code}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-mono font-semibold text-slate-100 truncate">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {item.internalWin && (
                <button
                  onClick={() => onOpenWindow(item.internalWin!)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 border border-cyan-400/30 text-[11px] font-mono transition-colors"
                >
                  Abrir
                </button>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visitar ${item.title}`}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
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
