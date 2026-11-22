import React from 'react';
import { THEME_PRESETS } from '../../constants/defaults';
import { PhysicsMode, PhysicsSettings, ThemeEffectsConfig } from '../../types/os';

interface ThemesAppProps {
  effects: ThemeEffectsConfig;
  physics: PhysicsSettings;
  onUpdateEffects: (patch: Partial<ThemeEffectsConfig>) => void;
  onApplyPreset: (presetId: string) => void;
  onUpdatePhysics: (patch: Partial<PhysicsSettings>) => void;
}

export const ThemesApp: React.FC<ThemesAppProps> = ({
  effects,
  physics,
  onUpdateEffects,
  onApplyPreset,
  onUpdatePhysics,
}) => {
  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-5">
      <div>
        <h3 className="text-xs font-mono font-bold text-fuchsia-300 mb-2.5">
          Presets Cósmicos
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onApplyPreset(p.id)}
              style={{
                background: `linear-gradient(135deg, ${p.top} 0%, ${p.mid} 55%, ${p.bot} 100%)`,
              }}
              className="p-3 rounded-xl border border-white/20 hover:border-pink-400 text-left transition-all active:scale-95"
            >
              <div className="text-xs font-mono font-bold text-white">{p.name}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.secondary }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Gradient Colors */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <h3 className="text-xs font-mono font-bold text-cyan-300">
          Colores Personalizados del Universo
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Cielo Top', key: 'bgTop' as const, val: effects.bgTop },
            { label: 'Nebulosa Mid', key: 'bgMiddle' as const, val: effects.bgMiddle },
            { label: 'Horizonte Bot', key: 'bgBottom' as const, val: effects.bgBottom },
          ].map((c) => (
            <label
              key={c.key}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer"
            >
              <span className="text-[11px] font-mono text-slate-300">{c.label}</span>
              <input
                type="color"
                value={c.val}
                onChange={(e) => onUpdateEffects({ [c.key]: e.target.value })}
                className="w-7 h-7 bg-transparent border-0 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Starfield & Glass Sliders */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Cantidad de Estrellas</span>
            <span className="text-cyan-300">{effects.starCount}</span>
          </div>
          <input
            type="range"
            min={60}
            max={600}
            value={effects.starCount}
            onChange={(e) => onUpdateEffects({ starCount: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Velocidad Estelar</span>
            <span className="text-pink-300">{effects.starSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={4}
            step={0.1}
            value={effects.starSpeed}
            onChange={(e) => onUpdateEffects({ starSpeed: Number(e.target.value) })}
            className="w-full accent-pink-400 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Desenfoque Cristal (Blur)</span>
            <span className="text-purple-300">{effects.glassBlur}px</span>
          </div>
          <input
            type="range"
            min={6}
            max={40}
            value={effects.glassBlur}
            onChange={(e) => onUpdateEffects({ glassBlur: Number(e.target.value) })}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Physics Quick Tuning */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <h3 className="text-xs font-mono font-bold text-amber-300">
          Comportamiento Físico de Escritorio
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'tactile', label: 'Inercia' },
              { id: 'earth', label: 'Gravedad ↓' },
              { id: 'zero-g', label: 'Zero-G 🪐' },
              { id: 'static', label: 'Clásico' },
            ] as Array<{ id: PhysicsMode; label: string }>
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => onUpdatePhysics({ mode: m.id })}
              className={`py-2 px-2.5 rounded-xl font-mono text-xs border transition-colors ${
                physics.mode === m.id
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
