import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Initializing Astro Kernel...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const stages = [
      { at: 15, text: 'Initializing Astro Kernel...' },
      { at: 35, text: 'Loading 2D Cosmic Physics Engine...' },
      { at: 60, text: 'Mounting Glassmorphic Compositor...' },
      { at: 85, text: 'Calibrating Celestial Coordinate Grid...' },
      { at: 100, text: 'the.astro.os Ready' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setStageText('the.astro.os Ready');
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onComplete();
          }, 450);
        }, 300);
      } else {
        setProgress(current);
        const match = stages.slice().reverse().find((s) => current >= s.at);
        if (match) setStageText(match.text);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060f] text-white select-none transition-all duration-500 ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient cosmic glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-purple-600/20 to-pink-500/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Central Cyber Saturn Emblem */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-2xl shadow-pink-500/30 animate-bounce duration-1000">
            <div className="w-full h-full bg-[#0a0c1a] rounded-[22px] flex items-center justify-center">
              {/* Saturn Vector Icon */}
              <svg className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_12px_#00F0FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M4.5 14.5C2.5 13.5 2.5 11 5 9.5C9.5 7 17 6 20.5 8C22.5 9 22 11.5 19.5 13" />
                <path d="M7 16C9 17.5 14 18 17.5 16.5" />
              </svg>
            </div>
          </div>
          {/* Subtle spinning planetary ring effect */}
          <div className="absolute -inset-2 rounded-full border border-cyan-400/25 border-dashed animate-spin duration-3000 pointer-events-none" />
        </div>

        <h1 className="text-2xl font-bold font-display tracking-widest uppercase cardgram-logo-text mb-1">
          the.astro.os
        </h1>
        <p className="text-[11px] font-mono text-slate-400 mb-8 tracking-wider">
          v.0.5.0 · COSMIC DESKTOP ENVIRONMENT
        </p>

        {/* Progress Bar Container */}
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