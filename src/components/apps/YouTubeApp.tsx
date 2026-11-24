import React, { useState } from 'react';

const FEATURED_VIDEOS = [
  { id: '4xDzrJKXOOY', title: 'synthwave radio - chill synth / retro beats', channel: 'Lofi Girl', tag: 'Synth' },
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio - beats to relax/study to', channel: 'Lofi Girl', tag: 'Lofi' },
  { id: '5qap5aO4i9A', title: 'lofi hip hop radio - beats to study/relax to', channel: 'ChilledCow', tag: 'Lofi' },
  { id: 'DWcJFNfaw9c', title: 'Space Ambient Music LIVE 24/7', channel: 'Space Ambient', tag: 'Space' },
  { id: '36YnV9STBqc', title: 'Aesthetic Lofi Chill Beats for Coding / Studying', channel: 'Chillhop', tag: 'Coding' },
  { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody (Official Video)', channel: 'Queen Official', tag: 'Music' },
];

export const YouTubeApp: React.FC = () => {
  const [currentVideoId, setCurrentVideoId] = useState('4xDzrJKXOOY');
  const [searchInput, setSearchInput] = useState('');
  const [filterTag, setFilterTag] = useState<string>('All');

  const extractVideoId = (str: string): string | null => {
    const trimmed = str.trim();
    if (!trimmed) return null;
    const beMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (beMatch && beMatch[1]) return beMatch[1];
    const ytMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) return ytMatch[1];
    const embedMatch = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return null;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;
    const extractedId = extractVideoId(query);
    if (extractedId) {
      setCurrentVideoId(extractedId);
      return;
    }
    const found = FEATURED_VIDEOS.find(
      (v) =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.channel.toLowerCase().includes(query.toLowerCase()) ||
        v.tag.toLowerCase() === query.toLowerCase()
    );
    if (found) {
      setCurrentVideoId(found.id);
    }
  };

  const filteredVideos = FEATURED_VIDEOS.filter((v) => {
    if (filterTag !== 'All' && v.tag !== filterTag) return false;
    if (!searchInput.trim()) return true;
    const q = searchInput.toLowerCase();
    return v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q);
  });

  const tags = ['All', 'Lofi', 'Synth', 'Space', 'Music', 'Coding'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080812] text-white overflow-hidden">
      <div className="p-3 bg-black/50 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Paste YouTube link, video ID, or filter playlist..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors shadow-sm"
          >
            Play
          </button>
        </form>

        <a
          href={
            searchInput.trim() && !extractVideoId(searchInput)
              ? `https://www.youtube.com/results?search_query=${encodeURIComponent(searchInput)}`
              : `https://www.youtube.com/watch?v=${currentVideoId}`
          }
          target="_blank"
          rel="noopener noreferrer"
          title="Open in YouTube Web"
          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono font-bold px-2.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 shrink-0"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span className="hidden sm:inline">YouTube ↗</span>
        </a>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 bg-black flex flex-col items-center justify-center min-h-[240px] relative">
          <iframe
            key={currentVideoId}
            src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`}
            title="YouTube Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        <div className="w-full md:w-72 bg-black/60 border-t md:border-t-0 md:border-l border-white/10 flex flex-col shrink-0">
          <div className="p-2 border-b border-white/10 flex items-center gap-1 overflow-x-auto shrink-0">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilterTag(t)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono whitespace-nowrap transition-colors ${
                  filterTag === t
                    ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredVideos.map((v) => (
              <button
                key={v.id}
                onClick={() => setCurrentVideoId(v.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-all text-xs font-mono border flex items-center gap-2.5 ${
                  currentVideoId === v.id
                    ? 'bg-red-500/20 border-red-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="w-16 h-10 rounded-lg overflow-hidden bg-black shrink-0 relative border border-white/10">
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={v.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {currentVideoId === v.id && (
                    <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center text-white text-[10px]">
                      ▶
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 leading-tight font-medium text-[11px]">{v.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span className="truncate">{v.channel}</span>
                    <span className="text-red-400 text-[9px] font-bold">{v.tag}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
