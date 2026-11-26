import React, { useState } from 'react';

export const AstroUpscalerApp: React.FC = () => {
  const realUrl = 'https://theastrobruh.github.io/Astro.Upscale/';
  const displayDomain = 'astroupscaler.app';
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0515] text-white overflow-hidden">
      <div className="h-10 px-3.5 bg-slate-950/75 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-mono text-slate-200 max-w-xs w-full">
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="whitespace-nowrap">{displayDomain}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            title="Reload app"
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <a
            href={realUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new browser tab"
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-bold transition-colors whitespace-nowrap"
          >
            ↗ External
          </a>
        </div>
      </div>

      <div className="flex-1 w-full bg-black relative">
        <iframe
          key={reloadKey}
          src={realUrl}
          title="Astro.Upscaler"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
      </div>
    </div>
  );
};
