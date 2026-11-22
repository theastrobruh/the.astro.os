import React, { useState } from 'react';
import { CURATED_GIF_WIDGET_PRESETS, ICON_ORDER, WINDOW_META_LIST } from '../../constants/defaults';
import { AdminConfig, MediaWidgetItem, PhysicsMode, PhysicsSettings, ThemeEffectsConfig, WindowId } from '../../types/os';

interface AdminPanelAppProps {
  config: AdminConfig;
  widgets: MediaWidgetItem[];
  onUpdateConfig: (updater: (prev: AdminConfig) => AdminConfig) => void;
  onUpdateEffects: (patch: Partial<ThemeEffectsConfig>) => void;
  onApplyThemePreset: (presetId: string) => void;
  onUpdatePhysics: (patch: Partial<PhysicsSettings>) => void;
  onImpulseBurst: () => void;
  onRearrangeIcons: () => void;
  onUpdateWidget: (id: string, patch: Partial<MediaWidgetItem>) => void;
  onDeleteWidget: (id: string) => void;
  onSpawnWidget: (opts: {
    url: string;
    label: string;
    isGif?: boolean;
    fallbackScene?: 'cosmos' | 'city' | 'pulse' | 'saturn' | 'prism';
  }) => void;
  onResetWidgets: () => void;
  onFactoryReset: () => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

type AdminTab = 'icons' | 'windows' | 'widgets' | 'effects' | 'system';

export const AdminPanelApp: React.FC<AdminPanelAppProps> = ({
  config,
  widgets,
  onUpdateConfig,
  onUpdateEffects,
  onApplyThemePreset,
  onUpdatePhysics,
  onImpulseBurst,
  onRearrangeIcons,
  onUpdateWidget,
  onDeleteWidget,
  onSpawnWidget,
  onResetWidgets,
  onFactoryReset,
  onLogout,
  onToast,
}) => {
  const [tab, setTab] = useState<AdminTab>('effects');
  const [pinInput, setPinInput] = useState('');

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify({ config, widgets }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astro_os_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Configuración exportada en JSON');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.config) {
          onUpdateConfig(() => parsed.config);
          onToast('Configuración importada correctamente');
        }
      } catch {
        onToast('Archivo JSON inválido');
      }
    };
    reader.readAsText(file);
  };

  const handleUpdatePin = () => {
    if (!/^\d{4}$/.test(pinInput)) {
      onToast('El PIN debe tener exactamente 4 dígitos numéricos');
      return;
    }
    onUpdateConfig((prev) => ({
      ...prev,
      security: { ...prev.security, adminPin: pinInput },
    }));
    setPinInput('');
    onToast(`Nuevo PIN de Administrador guardado`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tab Bar */}
      <div className="px-4 pt-2.5 bg-black/45 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto shrink-0">
        {[
          { id: 'effects', label: 'Efectos & Físicas' },
          { id: 'widgets', label: 'Widgets & GIFs' },
          { id: 'icons', label: 'Íconos' },
          { id: 'windows', label: 'Ventanas' },
          { id: 'system', label: 'Sistema & PIN' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as AdminTab)}
            className={`px-3.5 py-2 rounded-t-xl font-mono text-xs font-bold border-t border-x transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        {tab === 'icons' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Tamaño de Íconos</span>
                  <span className="text-cyan-300">{config.desktop.iconSize}px</span>
                </div>
                <input
                  type="range"
                  min={44}
                  max={84}
                  value={config.desktop.iconSize}
                  onChange={(e) =>
                    onUpdateConfig((p) => ({
                      ...p,
                      desktop: { ...p.desktop, iconSize: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Tamaño de Fuente</span>
                  <span className="text-pink-300">{config.desktop.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={9}
                  max={14}
                  value={config.desktop.fontSize}
                  onChange={(e) =>
                    onUpdateConfig((p) => ({
                      ...p,
                      desktop: { ...p.desktop, fontSize: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-pink-400"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onRearrangeIcons}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/35 text-emerald-200 font-mono text-xs font-bold"
              >
                Reordenar en Cuadrícula
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ICON_ORDER.map((item) => {
                const iconCfg = config.desktop.icons[item.id] || {
                  name: item.defaultName,
                  visible: true,
                };
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5"
                  >
                    <input
                      type="text"
                      value={iconCfg.name}
                      onChange={(e) =>
                        onUpdateConfig((p) => ({
                          ...p,
                          desktop: {
                            ...p.desktop,
                            icons: {
                              ...p.desktop.icons,
                              [item.id]: { ...iconCfg, name: e.target.value },
                            },
                          },
                        }))
                      }
                      className="flex-1 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                    <button
                      onClick={() =>
                        onUpdateConfig((p) => ({
                          ...p,
                          desktop: {
                            ...p.desktop,
                            icons: {
                              ...p.desktop.icons,
                              [item.id]: { ...iconCfg, visible: !iconCfg.visible },
                            },
                          },
                        }))
                      }
                      className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] border ${
                        iconCfg.visible
                          ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {iconCfg.visible ? 'Visible' : 'Oculto'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'windows' && (
          <div className="space-y-2.5">
            {WINDOW_META_LIST.map((meta) => {
              const winCfg = config.windows[meta.id] || {
                title: meta.title,
                width: meta.defaultWidth,
                height: meta.defaultHeight,
              };
              return (
                <div
                  key={meta.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center"
                >
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      {meta.id}
                    </label>
                    <input
                      type="text"
                      value={winCfg.title}
                      onChange={(e) =>
                        onUpdateConfig((p) => ({
                          ...p,
                          windows: {
                            ...p.windows,
                            [meta.id as WindowId]: { ...winCfg, title: e.target.value },
                          },
                        }))
                      }
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Ancho (px)
                    </label>
                    <input
                      type="number"
                      value={winCfg.width}
                      onChange={(e) =>
                        onUpdateConfig((p) => ({
                          ...p,
                          windows: {
                            ...p.windows,
                            [meta.id as WindowId]: { ...winCfg, width: Number(e.target.value) || 400 },
                          },
                        }))
                      }
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Alto (px)
                    </label>
                    <input
                      type="number"
                      value={winCfg.height}
                      onChange={(e) =>
                        onUpdateConfig((p) => ({
                          ...p,
                          windows: {
                            ...p.windows,
                            [meta.id as WindowId]: { ...winCfg, height: Number(e.target.value) || 400 },
                          },
                        }))
                      }
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'widgets' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-300">
                Edita URLs de GIFs/imágenes en vivo o agrega nuevos widgets al escritorio.
              </p>
              <button
                onClick={onResetWidgets}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/35 text-amber-200 font-mono text-xs font-bold"
              >
                Restaurar Widgets por Defecto
              </button>
            </div>

            <div className="space-y-2.5">
              {widgets.map((w) => (
                <div
                  key={w.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
                >
                  <input
                    type="text"
                    value={w.label}
                    onChange={(e) => onUpdateWidget(w.id, { label: e.target.value })}
                    className="bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={w.url}
                    onChange={(e) =>
                      onUpdateWidget(w.id, {
                        url: e.target.value,
                        isGif: e.target.value.toLowerCase().includes('.gif'),
                      })
                    }
                    placeholder="URL de imagen o .gif (vacío = animación canvas)"
                    className="md:col-span-3 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onUpdateWidget(w.id, { visible: !w.visible })}
                      className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] border ${
                        w.visible
                          ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {w.visible ? 'Activo' : 'Oculto'}
                    </button>
                    <button
                      onClick={() => onDeleteWidget(w.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-[11px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              <h4 className="text-xs font-mono font-bold text-pink-300 mb-2">
                Añadir Rápido (GIFs & Escenas)
              </h4>
              <div className="flex flex-wrap gap-2">
                {CURATED_GIF_WIDGET_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      onSpawnWidget({
                        url: p.url,
                        label: p.label,
                        isGif: p.isGif,
                        fallbackScene: p.fallbackScene,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-mono text-slate-200"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'effects' && (
          <div className="space-y-5">
            {/* Real-time 2D Physics Engine Controls */}
            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-400/25 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-mono font-bold text-cyan-300">
                    Motor de Físicas 2D (Inercia, Gravedad y Colisiones)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ajusta cómo reaccionan las ventanas, íconos y widgets GIF al lanzarlos o chocar.
                  </p>
                </div>
                <button
                  onClick={onImpulseBurst}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-500/25 hover:bg-pink-500/40 border border-pink-400/40 text-pink-200 font-mono text-xs font-bold"
                >
                  ⚡ Lanzar Todos
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'tactile', label: '💨 Inercia Táctil' },
                    { id: 'earth', label: '🍎 Gravedad ↓' },
                    { id: 'zero-g', label: '🪐 Zero-G' },
                    { id: 'static', label: '📌 Clásico Fijo' },
                  ] as Array<{ id: PhysicsMode; label: string }>
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onUpdatePhysics({ mode: m.id })}
                    className={`py-2 px-3 rounded-xl font-mono text-xs border transition-colors ${
                      config.physics.mode === m.id
                        ? 'bg-cyan-500/25 border-cyan-400 text-white font-bold'
                        : 'bg-black/35 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Gravedad (px/s²)</span>
                    <span className="text-cyan-300">{config.physics.gravity}</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={2600}
                    step={50}
                    value={config.physics.gravity}
                    onChange={(e) => onUpdatePhysics({ gravity: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Rebote (Restitución)</span>
                    <span className="text-pink-300">{config.physics.restitution.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={0.95}
                    step={0.05}
                    value={config.physics.restitution}
                    onChange={(e) => onUpdatePhysics({ restitution: Number(e.target.value) })}
                    className="w-full accent-pink-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Fricción Superficie</span>
                    <span className="text-amber-300">{config.physics.friction.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.86}
                    max={0.992}
                    step={0.004}
                    value={config.physics.friction}
                    onChange={(e) => onUpdatePhysics({ friction: Number(e.target.value) })}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  {
                    key: 'collisionsEnabled' as const,
                    label: 'Colisiones Elásticas',
                    val: config.physics.collisionsEnabled,
                  },
                  {
                    key: 'tiltEnabled' as const,
                    label: 'Inclinación por Resorte',
                    val: config.physics.tiltEnabled,
                  },
                  {
                    key: 'cursorRepel' as const,
                    label: 'Repulsión Cursor (Zero-G)',
                    val: config.physics.cursorRepel,
                  },
                ].map((tog) => (
                  <button
                    key={tog.key}
                    onClick={() => onUpdatePhysics({ [tog.key]: !tog.val })}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs border transition-colors ${
                      tog.val
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {tog.val ? '✓ ' : '○ '}
                    {tog.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Effects */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-mono font-bold text-purple-300">
                  Universo, Estrellas y Cristal
                </h4>
                <div className="flex gap-1.5">
                  {['cyber', 'sunset', 'matrix', 'synth'].map((id) => (
                    <button
                      key={id}
                      onClick={() => onApplyThemePreset(id)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono capitalize"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Top', key: 'bgTop' as const, val: config.effects.bgTop },
                  { label: 'Mid', key: 'bgMiddle' as const, val: config.effects.bgMiddle },
                  { label: 'Bot', key: 'bgBottom' as const, val: config.effects.bgBottom },
                ].map((c) => (
                  <label
                    key={c.key}
                    className="p-2 rounded-xl bg-black/35 border border-white/10 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-mono text-slate-300">{c.label}</span>
                    <input
                      type="color"
                      value={c.val}
                      onChange={(e) => onUpdateEffects({ [c.key]: e.target.value })}
                      className="w-7 h-7 bg-transparent border-0 cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Estrellas</span>
                    <span className="text-cyan-300">{config.effects.starCount}</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={600}
                    value={config.effects.starCount}
                    onChange={(e) => onUpdateEffects({ starCount: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Velocidad</span>
                    <span className="text-pink-300">{config.effects.starSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={4}
                    step={0.1}
                    value={config.effects.starSpeed}
                    onChange={(e) => onUpdateEffects({ starSpeed: Number(e.target.value) })}
                    className="w-full accent-pink-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Blur Cristal</span>
                    <span className="text-purple-300">{config.effects.glassBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={40}
                    value={config.effects.glassBlur}
                    onChange={(e) => onUpdateEffects({ glassBlur: Number(e.target.value) })}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'system' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-mono font-bold text-amber-300">
                Cambiar PIN de Administrador (Actual: {config.security.adminPin})
              </h4>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Nuevo PIN de 4 dígitos"
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono tracking-widest text-white"
                />
                <button
                  onClick={handleUpdatePin}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold"
                >
                  Guardar PIN
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleExportJson}
                className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/35 text-purple-200 font-mono text-xs font-bold"
              >
                📥 Exportar Config JSON
              </button>
              <label className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/35 text-emerald-200 font-mono text-xs font-bold text-center cursor-pointer">
                📤 Importar Config JSON
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
              <button
                onClick={onFactoryReset}
                className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/35 text-rose-200 font-mono text-xs font-bold"
              >
                ⚠️ Ajustes de Fábrica
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Sesión actual: <strong className="text-amber-300">Administrador</strong>
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/35 text-rose-200 font-mono text-xs font-bold"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
