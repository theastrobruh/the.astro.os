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
        if (prev.length === 1) return prev; // Keep at least 1
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-window w-full max-w-md p-5 space-y-4 border border-pink-500/40">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono font-bold text-pink-400">
            Configurar Zonas Horarias (Hasta 4)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-mono">
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Selecciona las zonas horarias activas en la barra de tareas ({draft.length}/4):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AVAILABLE_TIMEZONES.map((tz) => {
            const active = draft.includes(tz.id);
            return (
              <button
                key={tz.id}
                onClick={() => toggleTz(tz.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition-colors ${
                  active
                    ? 'bg-pink-500/20 border-pink-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span>{tz.flag}</span>
                  <span className="truncate">{tz.label}</span>
                </span>
                {active && <span className="text-pink-300 text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            className="px-5 py-2 bg-pink-500 hover:bg-pink-400 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
