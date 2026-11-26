import React, { useEffect, useRef, useState } from 'react';
import { ASTRO_AVATAR_IMG, RADIO_PRESETS } from '../../constants/defaults';
import { globalMusic } from '../../engine/music';

export const MusicApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setTick] = useState(0);
  const [tab, setTab] = useState<'radio' | 'local' | 'synth'>('radio');

  useEffect(() => {
    const unsubscribe = globalMusic.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const { isPlaying, currentTime, duration, mode, activeRadioIdx, localIdx, volume, statusNote } = globalMusic;
  const localTracks = globalMusic.localTracks;
  const currentTitle = globalMusic.getCurrentTitle();
  const currentSub = globalMusic.getCurrentSub();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bars = 28;
      const gap = 3;
      const barW = (w - gap * (bars - 1)) / bars;
      const t = performance.now() * 0.004;

      for (let i = 0; i < bars; i++) {
        let barH = 3;
        if (isPlaying) {
          const s1 = Math.sin(t * 1.9 + i * 0.45);
          const s2 = Math.cos(t * 2.5 - i * 0.35);
          barH = Math.max(3, Math.abs(s1 + s2) * (h * 0.44));
        }
        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, '#00F0FF');
        grad.addColorStop(0.5, '#A855F7');
        grad.addColorStop(1, '#FF007A');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(i * (barW + gap), h - barH, barW, barH, 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const mapped = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    globalMusic.playLocal(0, mapped);
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="p-3.5 flex-1 flex flex-col gap-3 overflow-y-auto bg-gradient-to-b from-slate-950/60 to-black/80">
      {/* Now Playing Card */}
      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={ASTRO_AVATAR_IMG}
              alt="Art"
              referrerPolicy="no-referrer"
              className={`w-12 h-12 rounded-xl object-cover border border-white/20 transition-all ${
                isPlaying ? 'ring-2 ring-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]' : ''
              }`}
            />
            {isPlaying && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-mono font-bold text-white truncate">{currentTitle}</h3>
            <p className="text-[11px] text-cyan-300/90 truncate">{currentSub}</p>
            <p className="text-[10px] font-mono text-slate-400 truncate">{statusNote}</p>
          </div>
        </div>

        {/* Visualizer */}
        <canvas ref={canvasRef} width={320} height={32} className="w-full h-8 rounded-lg bg-black/30" />

        {/* Progress (for local) */}
        {mode === 'local' && duration > 0 && (
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => globalMusic.seek(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Controls & Volume */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (mode === 'radio') {
                  globalMusic.playRadio((activeRadioIdx - 1 + RADIO_PRESETS.length) % RADIO_PRESETS.length);
                } else if (mode === 'local' && localTracks.length > 0) {
                  globalMusic.playLocal((localIdx - 1 + localTracks.length) % localTracks.length);
                }
              }}
              title="Previous"
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-200 transition-all active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => globalMusic.togglePlay()}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (mode === 'radio') {
                  globalMusic.playRadio((activeRadioIdx + 1) % RADIO_PRESETS.length);
                } else if (mode === 'local' && localTracks.length > 0) {
                  globalMusic.playLocal((localIdx + 1) % localTracks.length);
                }
              }}
              title="Next"
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-200 transition-all active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-1 max-w-[130px]">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(e) => globalMusic.setVolume(Number(e.target.value))}
              className="w-full accent-pink-400 h-1 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
        {(['radio', 'local', 'synth'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
              tab === t
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'radio' && (
        <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0 pr-0.5">
          {RADIO_PRESETS.map((station, idx) => {
            const active = mode === 'radio' && activeRadioIdx === idx && isPlaying;
            return (
              <button
                key={station.url}
                type="button"
                onClick={() => globalMusic.playRadio(idx)}
                className={`w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-white'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-mono font-semibold truncate">{station.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{station.genre}</div>
                </div>
                {active && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {tab === 'local' && (
        <div className="space-y-2 flex-1 min-h-0 flex flex-col">
          <label className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/25 text-center text-xs font-mono text-cyan-300 cursor-pointer transition-colors">
            + Load MP3 / WAV / OGG Files
            <input type="file" accept="audio/*" multiple onChange={handleFiles} className="hidden" />
          </label>
          <div className="space-y-1 overflow-y-auto flex-1">
            {localTracks.map((tr, i) => (
              <button
                key={tr.url}
                type="button"
                onClick={() => globalMusic.playLocal(i)}
                className={`w-full px-3 py-2 rounded-xl border text-left text-xs font-mono truncate transition-all ${
                  mode === 'local' && localIdx === i
                    ? 'bg-pink-500/20 border-pink-400/50 text-white'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300'
                }`}
              >
                {tr.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'synth' && (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-2.5 text-center flex-1">
          <p className="text-xs font-mono text-slate-300">
            Offline Generative Ambient Pad
          </p>
          <button
            type="button"
            onClick={() => globalMusic.startSynth()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-mono font-bold shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            {mode === 'synth' && isPlaying ? 'Synth Active' : 'Start Cosmic Synth'}
          </button>
        </div>
      )}
    </div>
  );
};
