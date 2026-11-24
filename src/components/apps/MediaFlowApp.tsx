import React, { useEffect, useRef, useState } from 'react';
import {
  COSMOS_WIDGET_IMG,
  CURATED_GIF_WIDGET_PRESETS,
  DAHYUN_GIF_URL,
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

const POPULAR_GIFS = [
  { label: 'Dahyun Wave', url: DAHYUN_GIF_URL, tags: 'dance dahyun kpop wave' },
  { label: 'Pixel Cosmos', url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif', tags: 'space pixel stars cosmos galaxy' },
  { label: 'Cyberpunk City', url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif', tags: 'cyberpunk neon synthwave city rain' },
  { label: 'Retro Computer', url: 'https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif', tags: 'pc retro windows computer 90s' },
  { label: 'Anime Sunset', url: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif', tags: 'anime sunset clouds sky chill' },
  { label: 'Cat Bop Jam', url: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif', tags: 'cat dance music vibing bop' },
];

export const MediaFlowApp: React.FC<MediaFlowAppProps> = ({ onSpawnWidget, onToast }) => {
  const [tab, setTab] = useState<StudioTab>('gif-widgets');
  const [sourceUrl, setSourceUrl] = useState<string>(COSMOS_WIDGET_IMG);
  const [fileName, setFileName] = useState<string>('Cosmos.jpg');

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [filterMode, setFilterMode] = useState<'none' | 'cyber' | 'mono' | 'vivid'>('none');

  const [wmText, setWmText] = useState('the.astro.os');
  const [wmOpacity, setWmOpacity] = useState(0.65);
  const [wmPosition, setWmPosition] = useState<'top-left' | 'center' | 'bottom-right'>('bottom-right');

  const [customGifUrl, setCustomGifUrl] = useState('');
  const [customGifLabel, setCustomGifLabel] = useState('');
  const [gifSearchQuery, setGifSearchQuery] = useState('');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceUrl;
    img.onload = () => {
      canvas.width = 480;
      canvas.height = 320;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipX ? -1 : 1, 1);

      if (filterMode === 'cyber') {
        ctx.filter = 'contrast(1.4) saturate(1.8) hue-rotate(290deg)';
      } else if (filterMode === 'mono') {
        ctx.filter = 'grayscale(1) contrast(1.2)';
      } else if (filterMode === 'vivid') {
        ctx.filter = 'saturate(2) contrast(1.1)';
      } else {
        ctx.filter = 'none';
      }

      const aspect = img.width / img.height;
      let drawW = canvas.width * 0.85;
      let drawH = drawW / aspect;
      if (drawH > canvas.height * 0.85) {
        drawH = canvas.height * 0.85;
        drawW = drawH * aspect;
      }
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      if (tab === 'watermark' && wmText.trim()) {
        ctx.save();
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(255, 255, 255, ${wmOpacity})`;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        let wx = 24;
        let wy = canvas.height - 24;
        if (wmPosition === 'top-left') {
          wx = 24;
          wy = 36;
        } else if (wmPosition === 'center') {
          wx = canvas.width / 2 - ctx.measureText(wmText).width / 2;
          wy = canvas.height / 2;
        }
        ctx.fillText(wmText, wx, wy);
        ctx.restore();
      }
    };
  }, [sourceUrl, rotation, flipX, filterMode, tab, wmText, wmOpacity, wmPosition]);

  const handleDownloadProcessed = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `mediaflow_${fileName.replace(/\.[^/.]+$/, '')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    onToast('Imagen exportada desde MediaFlow');
  };

  const handleUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSourceUrl(reader.result);
        setFileName(file.name);
        if (file.type === 'image/gif') {
          onSpawnWidget({
            url: reader.result,
            label: file.name,
            isGif: true,
            fallbackScene: 'pulse',
          });
          onToast(`GIF ${file.name} anclado al escritorio`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredGifs = POPULAR_GIFS.filter((g) => {
    const q = gifSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return g.label.toLowerCase().includes(q) || g.tags.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2.5 bg-black/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTab('gif-widgets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
              tab === 'gif-widgets'
                ? 'bg-pink-500/30 border border-pink-400 text-pink-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GIF Widgets
          </button>
          <button
            onClick={() => setTab('edit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
              tab === 'edit'
                ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Transform
          </button>
          <button
            onClick={() => setTab('watermark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
              tab === 'watermark'
                ? 'bg-violet-500/30 border border-violet-400 text-violet-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Watermark
          </button>
        </div>

        <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-cyan-200 cursor-pointer transition-colors">
          + Subir Imagen / GIF
          <input type="file" accept="image/*" onChange={handleUploadLocal} className="hidden" />
        </label>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {tab === 'gif-widgets' ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-pink-300">
                + Add Custom GIF to Desktop
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="url"
                  value={customGifUrl}
                  onChange={(e) => setCustomGifUrl(e.target.value)}
                  placeholder="https://.../animation.gif"
                  className="sm:col-span-2 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  value={customGifLabel}
                  onChange={(e) => setCustomGifLabel(e.target.value)}
                  placeholder="Label.gif"
                  className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!customGifUrl.trim()) return;
                    onSpawnWidget({
                      url: customGifUrl.trim(),
                      label: customGifLabel.trim() || 'Custom.gif',
                      isGif: true,
                      fallbackScene: 'pulse',
                    });
                    setCustomGifUrl('');
                    setCustomGifLabel('');
                    onToast('GIF Widget created');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-mono text-xs font-bold transition-colors"
                >
                  Create Widget
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={gifSearchQuery}
                onChange={(e) => setGifSearchQuery(e.target.value)}
                placeholder="Search GIFs (cyberpunk, space, anime, cat, pixel)..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white placeholder-slate-500"
              />
              {gifSearchQuery && (
                <button
                  onClick={() => setGifSearchQuery('')}
                  className="text-xs font-mono text-slate-400 hover:text-white px-2"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredGifs.map((g) => (
                <div
                  key={g.label}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-2 hover:border-pink-500/40 transition-colors"
                >
                  <div className="h-24 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
                    <AnimatedWidgetVisual
                      url={g.url}
                      label={g.label}
                      fallbackScene="pulse"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-bold leading-tight text-white">{g.label}</span>
                    <button
                      onClick={() => {
                        onSpawnWidget({
                          url: g.url,
                          label: `${g.label}.gif`,
                          isGif: true,
                          fallbackScene: 'pulse',
                        });
                        onToast(`Added ${g.label} to desktop`);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 text-[10px] font-mono font-bold shrink-0"
                    >
                      + Pin
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              <h4 className="text-xs font-mono font-bold text-cyan-300 mb-2">
                Cosmic Canvas Scenes (60fps Offline Animated)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CURATED_GIF_WIDGET_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSpawnWidget({
                        url: p.url,
                        label: p.label,
                        isGif: p.isGif,
                        fallbackScene: p.fallbackScene,
                      });
                      onToast(`Pinned ${p.label}`);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                  >
                    <div className="h-20 rounded-lg overflow-hidden bg-black mb-1.5">
                      <AnimatedWidgetVisual url={p.url} label={p.label} fallbackScene={p.fallbackScene} />
                    </div>
                    <div className="text-xs font-mono font-bold text-white leading-tight">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center bg-black/40 rounded-2xl p-2 border border-white/10">
              <canvas ref={previewCanvasRef} className="max-w-full rounded-xl" />
            </div>

            {tab === 'watermark' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                <input
                  type="text"
                  value={wmText}
                  onChange={(e) => setWmText(e.target.value)}
                  placeholder="Marca de agua..."
                  className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                />
                <select
                  value={wmPosition}
                  onChange={(e) => setWmPosition(e.target.value as typeof wmPosition)}
                  className="bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                >
                  <option value="bottom-right">Abajo Derecha</option>
                  <option value="center">Centro</option>
                  <option value="top-left">Arriba Izquierda</option>
                </select>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Opac</span>
                  <input
                    type="range"
                    min={0.15}
                    max={1}
                    step={0.05}
                    value={wmOpacity}
                    onChange={(e) => setWmOpacity(Number(e.target.value))}
                    className="flex-1 accent-violet-400"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-200 border border-white/10"
              >
                Rotate 90°
              </button>
              <button
                onClick={() => setFlipX((f) => !f)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-200 border border-white/10"
              >
                Flip H
              </button>
              <button
                onClick={() => setFilterMode((f) => (f === 'cyber' ? 'none' : 'cyber'))}
                className={`p-2 rounded-xl text-xs font-mono border ${
                  filterMode === 'cyber' ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-slate-200'
                }`}
              >
                Cyber Filter
              </button>
              <button
                onClick={() => {
                  const canvas = previewCanvasRef.current;
                  if (canvas) {
                    onSpawnWidget({
                      url: canvas.toDataURL('image/png'),
                      label: `Edited_${fileName}`,
                      isGif: false,
                      fallbackScene: 'cosmos',
                    });
                    onToast('Imagen editada anclada al escritorio');
                  }
                }}
                className="p-2 rounded-xl bg-pink-500/25 hover:bg-pink-500/40 text-xs font-mono text-pink-200 border border-pink-400/35"
              >
                Pin Widget
              </button>
              <button
                onClick={handleDownloadProcessed}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono text-white font-bold"
              >
                Export PNG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
