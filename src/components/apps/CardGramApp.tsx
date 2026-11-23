import React, { useState } from 'react';

export const CardGramApp: React.FC = () => {
  const [url, setUrl] = useState('https://theastrobruh.github.io/CardGram/#/home');
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0515] text-white overflow-hidden items-center justify-center p-2 sm:p-4">
      {/* Phone container mockup */}
      <div className="w-full max-w-[360px] h-full max-h-[640px] bg-slate-950 rounded-[36px] border-[3px] border-slate-700/60 shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10">
        {/* Dynamic Island / Notch */}
        <div className="h-6 w-full bg-slate-950 flex items-center justify-between px-5 text-[10px] font-mono text-slate-400 shrink-0 select-none">
          <span>9:41</span>
          <div className="w-16 h-3 bg-black rounded-full" />
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Embedded CardGram Live App */}
        <div className="flex-1 w-full bg-black relative">
          <iframe
            key={reloadKey}
            src={url}
            title="CardGram Mobile"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          />
        </div>

        {/* Phone Bottom Home Indicator */}
        <div className="h-7 w-full bg-slate-950 flex items-center justify-between px-3 shrink-0 border-t border-white/5">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            title="Reload"
            className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded font-mono"
          >
            ↻ Reload
          </button>
          <div className="w-24 h-1 bg-white/30 rounded-full" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in external browser"
            className="text-[11px] text-pink-400 hover:text-pink-300 px-2 py-0.5 rounded font-mono"
          >
            ↗ External
          </a>
        </div>
      </div>
    </div>
  );
};
