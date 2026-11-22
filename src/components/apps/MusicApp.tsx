import React, { useEffect, useRef, useState } from 'react';
import { ASTRO_AVATAR_IMG, RADIO_PRESETS } from '../../constants/defaults';

interface LocalTrack {
  name: string;
  url: string;
}

export const MusicApp: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);

  const [mode, setMode] = useState<'radio' | 'local' | 'synth'>('radio');
  const [activeRadioIdx, setActiveRadioIdx] = useState<number>(0);
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  const [localIdx, setLocalIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [statusNote, setStatusNote] = useState('Listo para reproducir');

  const currentTitle =
    mode === 'synth'
      ? 'Astro Ambient Synth (Generador Local)'
      : mode === 'local' && localTracks[localIdx]
      ? localTracks[localIdx].name
      : RADIO_PRESETS[activeRadioIdx].name;

  const currentSub =
    mode === 'synth'
      ? 'Sintetizador Web Audio · Offline Ready'
      : mode === 'local'
      ? 'Archivo local cargado'
      : `${RADIO_PRESETS[activeRadioIdx].genre} · Radio Online`;

  const stopSynth = () => {
    if (synthTimerRef.current !== null) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const startSynth = () => {
    stopSynth();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!synthCtxRef.current) synthCtxRef.current = new AudioCtx();
    const ctx = synthCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const chords = [
      [220, 261.63, 329.63, 392.0],
      [174.61, 220, 261.63, 349.23],
      [196.0, 246.94, 293.66, 392.0],
      [164.81, 196.0, 246.94, 329.63],
    ];
    let step = 0;

    const playChord = () => {
      if (!synthCtxRef.current) return;
      const now = ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.03 * volume, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.7);
      });
    };

    playChord();
    synthTimerRef.current = window.setInterval(playChord, 2600);
  };

  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Spectrum Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const bars = 28;
    const heights = new Array(bars).fill(6);

    const draw = (timeMs: number) => {
      const t = timeMs * 0.004;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barW = w / bars;
      for (let i = 0; i < bars; i++) {
        const target = isPlaying
          ? 10 + Math.abs(Math.sin(t + i * 0.45) * Math.cos(t * 0.6 - i * 0.2)) * (h - 14)
          : 5;
        heights[i] += (target - heights[i]) * 0.18;

        const grad = ctx.createLinearGradient(0, h, 0, h - heights[i]);
        grad.addColorStop(0, '#7C3AED');
        grad.addColorStop(0.5, '#FF007A');
        grad.addColorStop(1, '#00F0FF');

        ctx.fillStyle = grad;
        ctx.fillRect(i * barW + 2, h - heights[i], Math.max(2, barW - 4), heights[i]);
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const playRadio = (idx: number) => {
    stopSynth();
    setMode('radio');
    setActiveRadioIdx(idx);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = RADIO_PRESETS[idx].url;
    setStatusNote('Conectando a radio...');
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setStatusNote('En vivo');
      })
      .catch(() => {
        // Auto-switch to procedural synth if external stream blocked in sandbox
        setMode('synth');
        setIsPlaying(true);
        setStatusNote('Stream bloqueado por red: Sintetizador Cósmico activo');
        startSynth();
      });
  };

  const playLocal = (idx: number, tracksList = localTracks) => {
    stopSynth();
    const track = tracksList[idx];
    if (!track || !audioRef.current) return;
    setMode('local');
    setLocalIdx(idx);
    audioRef.current.src = track.url;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setStatusNote('Reproduciendo archivo local');
      })
      .catch(() => {
        setIsPlaying(false);
        setStatusNote('No se pudo reproducir el archivo');
      });
  };

  const togglePlay = () => {
    if (mode === 'synth') {
      if (isPlaying) {
        stopSynth();
        setIsPlaying(false);
        setStatusNote('Pausado');
      } else {
        startSynth();
        setIsPlaying(true);
        setStatusNote('Sintetizador activo');
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src) {
      playRadio(activeRadioIdx);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setStatusNote('Pausado');
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setStatusNote(mode === 'radio' ? 'En vivo' : 'Reproduciendo');
        })
        .catch(() => {
          setMode('synth');
          setIsPlaying(true);
          setStatusNote('Sintetizador Cósmico activo');
          startSynth();
        });
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const mapped = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setLocalTracks(mapped);
    playLocal(0, mapped);
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-4">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          if (mode === 'local' && localTracks.length > 0) {
            playLocal((localIdx + 1) % localTracks.length);
          }
        }}
        className="hidden"
      />

      {/* Now Playing & Visualizer */}
      <div className="p-4 rounded-2xl bg-black/45 border border-white/15 space-y-3">
        <div className="flex items-center gap-3.5">
          <img
            src={ASTRO_AVATAR_IMG}
            alt="Album Art"
            referrerPolicy="no-referrer"
            className={`w-14 h-14 rounded-xl object-cover border border-violet-400/40 shrink-0 ${
              isPlaying ? 'ring-2 ring-pink-500/50' : ''
            }`}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-mono font-bold text-white truncate">{currentTitle}</h3>
            <p className="text-xs text-violet-300 truncate">{currentSub}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{statusNote}</p>
          </div>
          <button
            onClick={() => {
              if (mode === 'synth' && isPlaying) {
                stopSynth();
                setIsPlaying(false);
              } else {
                audioRef.current?.pause();
                setMode('synth');
                setIsPlaying(true);
                setStatusNote('Sintetizador Cósmico activo');
                startSynth();
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono border transition-colors shrink-0 ${
              mode === 'synth'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            Synth Local
          </button>
        </div>

        <canvas ref={canvasRef} width={480} height={64} className="w-full h-16 rounded-xl bg-slate-950/70" />
      </div>

      {/* Controls */}
      <div className="bg-black/45 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="w-11">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={duration ? currentTime : 0}
            onChange={(e) => {
              if (audioRef.current && duration) {
                audioRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="flex-1 accent-violet-400 h-1.5 cursor-pointer"
          />
          <span className="w-11 text-right">{duration ? formatTime(duration) : 'LIVE'}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (mode === 'local' && localTracks.length > 0) {
                  playLocal((localIdx - 1 + localTracks.length) % localTracks.length);
                } else {
                  playRadio((activeRadioIdx - 1 + RADIO_PRESETS.length) % RADIO_PRESETS.length);
                }
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 transition-colors"
              title="Anterior"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold shadow-lg shadow-violet-600/35 transition-colors"
            >
              {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
            </button>
            <button
              onClick={() => {
                if (mode === 'local' && localTracks.length > 0) {
                  playLocal((localIdx + 1) % localTracks.length);
                } else {
                  playRadio((activeRadioIdx + 1) % RADIO_PRESETS.length);
                }
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 transition-colors"
              title="Siguiente"
            >
              ⏭
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-pink-400 cursor-pointer"
            />
          </div>

          <label className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-violet-300 rounded-xl cursor-pointer transition-colors">
            Cargar Audio Local
            <input type="file" multiple accept="audio/*" onChange={handleFiles} className="hidden" />
          </label>
        </div>
      </div>

      {/* Online Radio Presets */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-slate-400">Radios Online Gratuitas</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RADIO_PRESETS.map((r, i) => {
            const active = mode === 'radio' && activeRadioIdx === i && isPlaying;
            return (
              <button
                key={r.name}
                onClick={() => playRadio(i)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-violet-600/25 border-violet-400 text-white'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="text-xs font-mono font-bold flex items-center justify-between">
                  <span className="truncate">{r.name}</span>
                  {active && <span className="text-[10px] text-cyan-300">LIVE</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{r.genre}</div>
              </button>
            );
          })}
        </div>
      </div>

      {localTracks.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-mono font-bold text-slate-400">Pistas Locales</h4>
          {localTracks.map((t, idx) => (
            <button
              key={t.url}
              onClick={() => playLocal(idx)}
              className={`w-full px-3 py-2 rounded-xl border text-left text-xs font-mono truncate ${
                mode === 'local' && localIdx === idx
                  ? 'bg-pink-500/20 border-pink-400 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {idx + 1}. {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
