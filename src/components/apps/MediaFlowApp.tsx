import React, { useEffect, useRef, useState } from 'react';
import {
  ASTRO_CITY_WIDGET_IMG,
  COSMOS_WIDGET_IMG,
  CURATED_GIF_WIDGET_PRESETS,
} from '../../constants/defaults';
import { AnimatedWidgetVisual } from '../AnimatedWidgetVisual';

interface MediaFlowAppProps {
  onSpawnWidget: (opts: {
    url: string;
    label: string;
    isGif?: boolean;
    fallbackScene?: 'cosmos' | 'city' | 'pulse' | 'saturn' | 'prism';
  }) => void;
  onToast: (msg: string) => void;
}

type StudioTab = 'edit' | 'watermark' | 'gif-widgets';

export const MediaFlowApp: React.FC<MediaFlowAppProps> = ({ onSpawnWidget, onToast }) => {
  const [tab, setTab] = useState<StudioTab>('edit');
  const [sourceUrl, setSourceUrl] = useState<string>(ASTRO_CITY_WIDGET_IMG);
  const [fileName, setFileName] = useState<string>('AstroCity.png');

  // Transform state
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [filterMode, setFilterMode] = useState<'none' | 'cyber' | 'mono' | 'vivid'>('none');
  const [targetW, setTargetW] = useState(1080);
  const [targetH, setTargetH] = useState(1080);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/webp'>('image/webp');

  // Watermark state
  const [wmText, setWmText] = useState('the.astro.os');
  const [wmOpacity, setWmOpacity] = useState(0.65);
  const [wmPosition, setWmPosition] = useState<'top-left' | 'center' | 'bottom-right'>('bottom-right');

  // Custom GIF URL input
  const [customGifUrl, setCustomGifUrl] = useState('');
  const [customGifLabel, setCustomGifLabel] = useState('Custom.gif');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const cw = 420;
      const ch = 260;
      canvas.width = cw;
      canvas.height = ch;
      ctx.clearRect(0, 0, cw, ch);

      ctx.save();
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

      if (filterMode === 'cyber') ctx.filter = 'contrast(1.18) saturate(1.45) hue-rotate(-12deg)';
      else if (filterMode === 'mono') ctx.filter = 'grayscale(1) contrast(1.2)';
      else if (filterMode === 'vivid') ctx.filter = 'saturate(1.6) brightness(1.06)';
      else ctx.filter = 'none';

      const scale = Math.min(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();

      if (wmText.trim()) {
        ctx.save();
        ctx.globalAlpha = wmOpacity;
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 6;
        let wx = cw - 16;
        let wy = ch - 16;
        ctx.textAlign = 'right';
        if (wmPosition === 'top-left') {
          wx = 16;
          wy = 28;
          ctx.textAlign = 'left';
        } else if (wmPosition === 'center') {
          wx = cw / 2;
          wy = ch / 2;
          ctx.textAlign = 'center';
        }
        ctx.fillText(wmText, wx, wy);
        ctx.restore();
      }
    };
    img.src = sourceUrl;
  }, [sourceUrl, rotation, flipX, flipY, filterMode, wmText, wmOpacity, wmPosition, tab]);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
          onSpawnWidget({ url: reader.result, label: file.name, isGif: true });
          onToast(`GIF "${file.name}" añadido al escritorio`);
        } else {
          setSourceUrl(reader.result);
          onToast(`Cargado: ${file.name}`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadProcessed = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ext = exportFormat === 'image/webp' ? 'webp' : 'png';
    const link = document.createElement('a');
    link.download = `mediaflow_${targetW}x${targetH}.${ext}`;
    link.href = canvas.toDataURL(exportFormat, 0.92);
    link.click();
    onToast(`Imagen exportada (${ext.toUpperCase()})`);
  };

  const handlePinEdited = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    onSpawnWidget({
      url: canvas.toDataURL('image/png'),
      label: fileName,
      isGif: false,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Navigation Header */}
      <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'edit', label: 'Recorte & Filtros' },
            { id: 'watermark', label: 'Marca de Agua & WebP' },
            { id: 'gif-widgets', label: 'Widgets GIF Escritorio' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as StudioTab)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                tab === t.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold cursor-pointer transition-colors">
          Subir Imagen / GIF
          <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab !== 'gif-widgets' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* Live Canvas Preview */}
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-950 border border-white/15 p-3 flex items-center justify-center">
                <canvas ref={previewCanvasRef} className="max-w-full rounded-xl" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSourceUrl(COSMOS_WIDGET_IMG);
                    setFileName('Cosmos.jpg');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300"
                >
                  Usar Cosmos.jpg
                </button>
                <button
                  onClick={() => {
                    setSourceUrl(ASTRO_CITY_WIDGET_IMG);
                    setFileName('AstroCity.png');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300"
                >
                  Usar AstroCity.png
                </button>
              </div>
            </div>

            {/* Tool Controls */}
            {tab === 'edit' ? (
              <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <h4 className="text-xs font-mono font-bold text-cyan-300 mb-2">
                    Orientación y Volteo
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setRotation((r) => r - 90)}
                      className="py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono"
                    >
                      ↺ -90°
                    </button>
                    <button
                      onClick={() => setRotation((r) => r + 90)}
                      className="py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono"
                    >
                      ↻ +90°
                    </button>
                    <button
                      onClick={() => setFlipX((v) => !v)}
                      className="py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono"
                    >
                      ⇄ Espejo X
                    </button>
                    <button
                      onClick={() => setFlipY((v) => !v)}
                      className="py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono"
                    >
                      ⇅ Espejo Y
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-pink-300 mb-2">
                    Filtros de Color
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'none', label: 'Original' },
                        { id: 'cyber', label: 'Cyber' },
                        { id: 'vivid', label: 'Vívido' },
                        { id: 'mono', label: 'Noir' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilterMode(f.id)}
                        className={`py-2 rounded-lg border text-xs font-mono ${
                          filterMode === f.id
                            ? 'bg-pink-500/25 border-pink-400 text-white'
                            : 'bg-black/40 border-white/10 text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={handlePinEdited}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors"
                  >
                    Anclar al Escritorio
                  </button>
                  <button
                    onClick={handleDownloadProcessed}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors"
                  >
                    Descargar Imagen
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Texto de Marca de Agua
                  </label>
                  <input
                    type="text"
                    value={wmText}
                    onChange={(e) => setWmText(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Opacidad</span>
                    <span>{Math.round(wmOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={wmOpacity}
                    onChange={(e) => setWmOpacity(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Posición</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'top-left', label: 'Sup. Izq' },
                        { id: 'center', label: 'Centro' },
                        { id: 'bottom-right', label: 'Inf. Der' },
                      ] as const
                    ).map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setWmPosition(pos.id)}
                        className={`py-1.5 rounded-lg border text-xs font-mono ${
                          wmPosition === pos.id
                            ? 'bg-cyan-500/25 border-cyan-400 text-white'
                            : 'bg-black/40 border-white/10 text-slate-300'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Presets de Tamaño & Formato
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      { label: '1080×1080', w: 1080, h: 1080 },
                      { label: '1080×1920', w: 1080, h: 1920 },
                      { label: '1920×1080', w: 1920, h: 1080 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => {
                          setTargetW(p.w);
                          setTargetH(p.h);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono ${
                          targetW === p.w && targetH === p.h
                            ? 'bg-indigo-500/30 border-indigo-400 text-white'
                            : 'bg-black/40 border-white/10 text-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExportFormat('image/webp')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono ${
                        exportFormat === 'image/webp'
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                          : 'bg-black/40 border-white/10 text-slate-300'
                      }`}
                    >
                      WebP
                    </button>
                    <button
                      onClick={() => setExportFormat('image/png')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono ${
                        exportFormat === 'image/png'
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                          : 'bg-black/40 border-white/10 text-slate-300'
                      }`}
                    >
                      PNG
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDownloadProcessed}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors"
                >
                  Exportar ({targetW}×{targetH})
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Custom GIF URL Spawner */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-mono font-bold text-pink-300">
                Añadir GIF por URL o Archivo Local al Escritorio
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="url"
                  value={customGifUrl}
                  onChange={(e) => setCustomGifUrl(e.target.value)}
                  placeholder="https://.../animacion.gif"
                  className="sm:col-span-2 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
                <input
                  type="text"
                  value={customGifLabel}
                  onChange={(e) => setCustomGifLabel(e.target.value)}
                  placeholder="Etiqueta.gif"
                  className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
              <button
                onClick={() => {
                  if (!customGifUrl.trim()) return;
                  onSpawnWidget({
                    url: customGifUrl.trim(),
                    label: customGifLabel.trim() || 'MiGif.gif',
                    isGif: true,
                    fallbackScene: 'pulse',
                  });
                  setCustomGifUrl('');
                }}
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-mono text-xs font-bold transition-colors"
              >
                + Crear Widget GIF en Escritorio
              </button>
            </div>

            {/* Curated Animated Presets */}
            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-300 mb-3">
                Galería de Widgets & GIFs Cósmicos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CURATED_GIF_WIDGET_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3"
                  >
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                      <AnimatedWidgetVisual
                        url={preset.url}
                        label={preset.label}
                        fallbackScene={preset.fallbackScene}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                        <span>{preset.label}</span>
                        {preset.isGif && (
                          <span className="text-[10px] text-pink-300">GIF</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{preset.description}</p>
                    </div>
                    <button
                      onClick={() =>
                        onSpawnWidget({
                          url: preset.url,
                          label: preset.label,
                          isGif: preset.isGif,
                          fallbackScene: preset.fallbackScene,
                        })
                      }
                      className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/35 text-cyan-200 font-mono text-xs font-semibold transition-colors"
                    >
                      Añadir al Escritorio
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
