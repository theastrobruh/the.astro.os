import React, { useEffect, useRef, useState } from 'react';
import { AstroLogoSvg } from './DesktopIconItem';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Initializing Astro Kernel...');
  const [isFading, setIsFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const stages = [
      { at: 15, text: 'Initializing Astro Kernel...' },
      { at: 35, text: 'Loading 2D Rigid-Body SAT Physics...' },
      { at: 60, text: 'Mounting Glassmorphic Compositor...' },
      { at: 85, text: 'Calibrating Celestial Coordinate Grid...' },
      { at: 100, text: 'the.astro.os Ready' },
    ];

    let cancelled = false;
    let current = 0;
    let fadeTimer: number | undefined;
    let doneTimer: number | undefined;

    const interval = window.setInterval(() => {
      if (cancelled) return;
      current += Math.floor(Math.random() * 8) + 6;
      if (current >= 100) {
        current = 100;
        window.clearInterval(interval);
        setProgress(100);
        setStageText('the.astro.os Ready');
        fadeTimer = window.setTimeout(() => {
          if (cancelled) return;
          setIsFading(true);
          doneTimer = window.setTimeout(() => {
            if (!cancelled) onCompleteRef.current();
          }, 380);
        }, 220);
      } else {
        setProgress(current);
        const match = stages.slice().reverse().find((s) => current >= s.at);
        if (match) setStageText(match.text);
      }
    }, 55);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060f] text-white select-none transition-all duration-500 ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-purple-600/20 to-pink-500/15 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-22 h-22 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-2xl shadow-pink-500/30 animate-bounce duration-1000">
            <div className="w-full h-full bg-[#0a0c1a] rounded-[22px] flex items-center justify-center">
              <AstroLogoSvg className="w-13 h-13 drop-shadow-[0_0_14px_rgba(0,240,255,0.45)]" />
            </div>
          </div>
          <div className="absolute -inset-2.5 rounded-full border border-cyan-400/25 border-dashed animate-spin duration-3000 pointer-events-none" />
        </div>

        <h1 className="text-2xl font-bold font-display tracking-widest uppercase cardgram-logo-text mb-1">
          the.astro.os
        </h1>
        <p className="text-[11px] font-mono text-slate-400 mb-8 tracking-wider">
          v.0.5.0 · COSMIC DESKTOP ENVIRONMENT
        </p>

        <div className="w-64 max-w-[85vw] flex flex-col items-center gap-2.5">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/10 p-[1px] shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-150 shadow-[0_0_10px_#00F0FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="truncate pr-2">{stageText}</span>
            <span className="text-cyan-300 font-bold tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
