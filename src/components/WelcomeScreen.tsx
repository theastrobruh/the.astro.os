import React, { useEffect, useState } from 'react';
import { UserRole } from '../types/os';
import { astroSound } from '../engine/sound';

interface WelcomeScreenProps {
  osTitle: string;
  adminPin: string;
  onEnter: (role: Exclude<UserRole, null>) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ osTitle, adminPin, onEnter }) => {
  const [view, setView] = useState<'select' | 'pin'>('select');
  const [pinBuffer, setPinBuffer] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleSuccessEnter = (role: Exclude<UserRole, null>) => {
    astroSound.playStartupChime();
    setIsLeaving(true);
    setTimeout(() => {
      onEnter(role);
    }, 520);
  };

  const handleDigit = (digit: string) => {
    if (pinBuffer.length >= 4 || isLeaving) return;
    astroSound.playKeyTap(620 + Number(digit) * 28);
    const next = pinBuffer + digit;
    setPinBuffer(next);
    setPinError(false);

    if (next.length === 4) {
      if (next === adminPin) {
        setTimeout(() => handleSuccessEnter('admin'), 160);
      } else {
        astroSound.playErrorBuzz();
        setPinError(true);
        setTimeout(() => {
          setPinBuffer('');
        }, 550);
      }
    }
  };

  const handleBackspace = () => {
    astroSound.playKeyTap(420);
    setPinBuffer((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClear = () => {
    astroSound.playKeyTap(340);
    setPinBuffer('');
    setPinError(false);
  };

  useEffect(() => {
    if (view !== 'pin') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        setView('select');
        setPinBuffer('');
        setPinError(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-2xl transition-all duration-500 ${
        isLeaving ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="w-full max-w-md glass-window border border-white/20 p-6 md:p-8 flex flex-col items-center text-center shadow-2xl">
        {/* Saturn OS Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-xl shadow-pink-500/25 mb-3">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
            🪐
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight cardgram-logo-text">
          {osTitle}
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1 mb-6">
          v.0.5.0 · Cosmic Physics OS
        </p>

        {view === 'select' ? (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {/* Admin Card */}
              <button
                onClick={() => {
                  astroSound.playKeyTap(700);
                  setView('pin');
                }}
                className="group relative p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-pink-500/60 transition-all duration-200 text-left flex flex-col justify-between overflow-hidden shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-xl">
                    👑
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-pink-300">
                    PIN Required
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-bold font-mono text-white group-hover:text-pink-300 transition-colors">
                    Administrator
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    Full access: physics tuning, widgets, themes & system settings.
                  </p>
                </div>
              </button>

              {/* Guest Card */}
              <button
                onClick={() => handleSuccessEnter('guest')}
                className="group relative p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-400/60 transition-all duration-200 text-left flex flex-col justify-between overflow-hidden shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-xl">
                    🚀
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-emerald-300">
                    Direct Access
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                    Guest User
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    Explore interactive apps, physics canvas, paint & live radio.
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <button
                onClick={() => {
                  setView('select');
                  setPinBuffer('');
                  setPinError(false);
                }}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>
              <span className="text-xs font-mono font-bold text-pink-300">
                Enter Admin PIN
              </span>
            </div>

            {/* PIN Dots */}
            <div className="flex items-center justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pinBuffer.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                      pinError
                        ? 'border-rose-500 bg-rose-500 shadow-lg shadow-rose-500/50'
                        : filled
                        ? 'border-pink-400 bg-pink-500 shadow-lg shadow-pink-500/40 scale-110'
                        : 'border-white/30 bg-white/5'
                    }`}
                  />
                );
              })}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[240px] mt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/15 active:scale-95 text-base font-mono font-bold text-white transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 active:scale-95 text-xs font-mono text-slate-400 hover:text-white transition-all"
              >
                C
              </button>
              <button
                onClick={() => handleDigit('0')}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/15 active:scale-95 text-base font-mono font-bold text-white transition-all"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 active:scale-95 text-xs font-mono text-slate-400 hover:text-white transition-all"
              >
                ⌫
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
