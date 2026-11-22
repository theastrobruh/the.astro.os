import React, { useState } from 'react';
import { astroSound } from '../engine/sound';

interface AdminPinModalProps {
  open: boolean;
  adminPin: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  open,
  adminPin,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!open) return null;

  const submit = () => {
    if (pin === adminPin) {
      astroSound.playStartupChime();
      setPin('');
      setError(false);
      onSuccess();
    } else {
      astroSound.playErrorBuzz();
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className={`glass-window w-full max-w-xs p-5 space-y-4 border border-amber-500/40 ${error ? 'animate-shake' : ''}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <h3 className="text-xs font-mono font-bold text-amber-300">
            👑 Acceso Panel Admin
          </h3>
          <button
            onClick={() => {
              setPin('');
              setError(false);
              onClose();
            }}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Ingresa el PIN de 4 dígitos para elevar privilegios (PIN por defecto: <strong className="text-amber-300">{adminPin}</strong>):
        </p>

        <input
          type="password"
          maxLength={4}
          autoFocus
          value={pin}
          onChange={(e) => {
            setError(false);
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="••••"
          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-[0.5em] text-white focus:outline-none focus:border-amber-400"
        />

        {error && (
          <p className="text-[11px] font-mono text-rose-400 text-center">
            PIN incorrecto. Intenta nuevamente.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold"
          >
            Desbloquear
          </button>
        </div>
      </div>
    </div>
  );
};
