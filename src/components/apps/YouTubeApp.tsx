import React, { useState } from 'react';

const SUGGESTED_VIDEOS = [
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to', channel: 'Lofi Girl' },
  { id: '4xDzrJKXOOY', title: 'synthwave radio 🌌 - chill synth / retro beats', channel: 'Lofi Girl' },
  { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', channel: 'Luis Fonsi' },
  { id: 'fJ9rUzIMcZQ', title: 'Queen – Bohemian Rhapsody (Official Video)', channel: 'Queen Official' },
  { id: '5qap5aO4i9A', title: 'lofi hip hop radio - beats to sleep/chill to', channel: 'Lofi Girl' },
];

export const YouTubeApp: React.FC = () => {
  const [currentVideoId, setCurrentVideoId] = useState('4xDzrJKXOOY');
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    // Check if input is a direct YouTube link or ID
    const urlMatch = query.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (urlMatch && urlMatch[1]) {
      setCurrentVideoId(urlMatch[1]);
    } else if (/^[\w-]{11}$/.test(query)) {
      setCurrentVideoId(query);
    } else {
      // Open search in embed or search query
      const found = SUGGESTED_VIDEOS.find((v) =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.channel.toLowerCase().includes(query.toLowerCase())
      );
      if (found) {
        setCurrentVideoId(found.id);
      } else {
        // Fallback default or keep current
        setCurrentVideoId('jfKfPfyJRdk');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/90 text-white overflow-hidden">
      {/* Search / Nav bar */}
      <div className="p-3 bg-black/40 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search or paste YouTube URL / video ID..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-mono text-xs font-semibold transition-colors"
          >
            Play
          </button>
        </form>

        <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono font-bold shrink-0">
          <span>▶</span>
          <span>YouTube</span>
        </div>
      </div>

      {/* Main Video View & Presets */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Embed Frame */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[220px]">
          <iframe
            key={currentVideoId}
            src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`}
            title="YouTube Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Suggested Playlist sidebar */}
        <div className="w-full md:w-64 bg-black/60 border-t md:border-t-0 md:border-l border-white/10 flex flex-col shrink-0">
          <div className="p-2.5 border-b border-white/10 text-[11px] font-mono font-bold text-slate-300">
            Suggested Streams
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {SUGGESTED_VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => setCurrentVideoId(v.id)}
                className={`w-full p-2 rounded-xl text-left transition-all text-xs font-mono border ${
                  currentVideoId === v.id
                    ? 'bg-red-500/20 border-red-500/40 text-red-200'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="line-clamp-2 leading-tight">{v.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{v.channel}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
