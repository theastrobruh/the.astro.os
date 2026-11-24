import React, { useState } from 'react';
import { AVAILABLE_TIMEZONES } from '../constants/defaults';

interface TimezoneModalProps {
  open: boolean;
  selected: string[];
  onClose: () => void;
  onSave: (next: string[]) => void;
}

export const TimezoneModal: React.FC<TimezoneModalProps> = ({ open, selected, onClose, onSave }) => {
  const [draft, setDraft] = useState<string[]>(selected);

  if (!open) return null;

  const toggleTz = (id: string) => {
    setDraft((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-window w-full max-w-lg p-5 space-y-4 border border-pink-500/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono font-bold text-pink-400">
            World Clocks (Select up to 4)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-mono">
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300 font-mono">
          Active taskbar timezones ({draft.length}/4):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
          {AVAILABLE_TIMEZONES.map((tz) => {
            const active = draft.includes(tz.id);
            return (
              <button
                key={tz.id}
                onClick={() => toggleTz(tz.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition-colors ${
                  active
                    ? 'bg-pink-500/25 border-pink-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15">
                    {tz.code}
                  </span>
                  <span className="truncate">{tz.label}</span>
                </div>
                {active && <span className="text-[11px] text-pink-300 font-bold shrink-0">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-xs text-white font-bold transition-colors"
          >
            Apply Clocks
          </button>
        </div>
      </div>
    </div>
  );
};
