import React, { useState } from 'react';

export const CardGramApp: React.FC = () => {
  const [url, setUrl] = useState('https://theastrobruh.github.io/CardGram/#/home');
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0515] text-white overflow-hidden">
      {/* Top Browser Bar */}
      <div className="h-9 px-3 bg-black/60 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 flex-1 max-w-md truncate">
            <span className="text-cyan-400">🔒</span>
            <span className="truncate">{url}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            title="Reload frame"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs transition-colors"
          >
            ↻
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new browser tab"
            className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/35 border border-pink-400/40 text-pink-300 text-xs font-mono font-bold transition-colors"
          >
            ↗ External
          </a>
        </div>
      </div>

      {/* Responsive Full-Height Embedded CardGram Web App */}
      <div className="flex-1 w-full bg-black relative">
        <iframe
          key={reloadKey}
          src={url}
          title="CardGram Desktop"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
      </div>
    </div>
  );
};
