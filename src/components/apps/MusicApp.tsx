import React, { useEffect, useRef, useState } from 'react';
import { ASTRO_AVATAR_IMG, RADIO_PRESETS } from '../../constants/defaults';
import { globalMusic } from '../../engine/music';

export const MusicApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setTick] = useState(0);

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

      const bars = 32;
      const barW = w / bars - 2;
      const t = performance.now() * 0.003;

      for (let i = 0; i < bars; i++) {
        let barH = 4;
        if (isPlaying) {
          const s1 = Math.sin(t * 1.8 + i * 0.4);
          const s2 = Math.cos(t * 2.4 - i * 0.3);
          barH = Math.max(4, Math.abs(s1 + s2) * (h * 0.42));
        }
        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, '#7C3AED');
        grad.addColorStop(1, '#EC4899');
        ctx.fillStyle = grad;
        ctx.fillRect(i * (barW + 2), h - barH, barW, barH);
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
    <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto space-y-3">
      <div className="p-3 rounded-2xl bg-black/45 border border-white/15 space-y-2.5">
        <div className="flex items-center gap-3">
          <img
            src={ASTRO_AVATAR_IMG}
            alt="Art"
            referrerPolicy="no-referrer"
            className={`w-12 h-12 rounded-xl object-cover border border-violet-400/40 shrink-0 ${
              isPlaying ? 'ring-2 ring-pink-500/50' : ''
            }`}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-mono font-bold text-white truncate">{currentTitle}</h3>
            <p className="text-[11px] text-violet-300 truncate">{currentSub}</p>
            <p className="text-[10px] font-mono text-slate-400">{statusNote}</p>
          </div>
          <button
            onClick={() => {
              if (mode === 'synth' && isPlaying) {
                globalMusic.stopSynth();
                globalMusic.isPlaying = false;
                globalMusic.statusNote = 'Paused';
                setTick((t) => t + 1);
              } else {
                globalMusic.mode = 'synth';
                globalMusic.startSynth();
              }
            }}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono border transition-colors shrink-0 ${
              mode === 'synth'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            Synth
          </button>
        </div>

        <canvas ref={canvasRef} width={480} height={44} className="w-full h-11 rounded-xl bg-slate-950/70" />
      </div>

      <div className="bg-black/45 p-3 rounded-2xl border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-9">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={duration ? currentTime : 0}
            onChange={(e) => globalMusic.seek(Number(e.target.value))}
            className="flex-1 accent-violet-400 h-1.5 cursor-pointer"
          />
          <span className="w-9 text-right">{duration ? formatTime(duration) : 'LIVE'}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (mode === 'local' && localTracks.length > 0) {
                  globalMusic.playLocal((localIdx - 1 + localTracks.length) % localTracks.length);
                } else {
                  globalMusic.playRadio((activeRadioIdx - 1 + RADIO_PRESETS.length) % RADIO_PRESETS.length);
                }
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs"
              title="Previous"
            >
              ⏮
            </button>
            <button
              onClick={() => globalMusic.togglePlay()}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold shadow-md shadow-violet-600/35 transition-colors"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={() => {
                if (mode === 'local' && localTracks.length > 0) {
                  globalMusic.playLocal((localIdx + 1) % localTracks.length);
                } else {
                  globalMusic.playRadio((activeRadioIdx + 1) % RADIO_PRESETS.length);
                }
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs"
              title="Next"
            >
              ⏭
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => globalMusic.setVolume(Number(e.target.value))}
              className="w-16 accent-pink-400 cursor-pointer"
            />
          </div>

          <label className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-mono text-violet-300 rounded-xl cursor-pointer transition-colors">
            + File
            <input type="file" multiple accept="audio/*" onChange={handleFiles} className="hidden" />
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-[11px] font-mono font-bold text-slate-400">Live Cosmic Stations</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {RADIO_PRESETS.map((r, i) => {
            const active = mode === 'radio' && activeRadioIdx === i && isPlaying;
            return (
              <button
                key={r.name}
                onClick={() => globalMusic.playRadio(i)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-violet-600/25 border-violet-400 text-white'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="text-[11px] font-mono font-bold flex items-center justify-between">
                  <span className="truncate">{r.name}</span>
                  {active && <span className="text-[9px] text-cyan-300">LIVE</span>}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{r.genre}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
