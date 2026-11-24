import React, { useEffect, useRef, useState } from 'react';

type PaintTool = 'brush' | 'marker' | 'line' | 'rect' | 'circle' | 'fill' | 'picker' | 'eraser';

interface PaintAppProps {
  onPinToDesktop: (dataUrl: string, label: string) => void;
  onToast: (msg: string) => void;
}

const SWATCHES = [
  '#0F172A',
  '#475569',
  '#E11D48',
  '#FF007A',
  '#7C3AED',
  '#2563EB',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#FFFFFF',
];

function hexToRgba(hex: string, alpha = 255): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, alpha];
}

export const PaintApp: React.FC<PaintAppProps> = ({ onPinToDesktop, onToast }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tool, setTool] = useState<PaintTool>('brush');
  const [color, setColor] = useState('#0F172A');
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [bgColor, setBgColor] = useState<'#FFFFFF' | '#0F172A'>('#FFFFFF');

  const isDrawingRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const snapshotRef = useRef<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const initOrResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(280, Math.floor(rect.width - 16));
      const h = Math.max(200, Math.floor(rect.height - 16));
      if (canvas.width === w && canvas.height === h) return;

      let prevData: HTMLCanvasElement | null = null;
      if (initializedRef.current && canvas.width > 0 && canvas.height > 0) {
        prevData = document.createElement('canvas');
        prevData.width = canvas.width;
        prevData.height = canvas.height;
        prevData.getContext('2d')?.drawImage(canvas, 0, 0);
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
        if (prevData) {
          ctx.drawImage(prevData, 0, 0);
        }
        if (!initializedRef.current) {
          initializedRef.current = true;
          historyRef.current = [ctx.getImageData(0, 0, w, h)];
        }
      }
    };

    initOrResize();
    const ro = new ResizeObserver(initOrResize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [bgColor]);

  const pushHistory = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 30) historyRef.current.shift();
    redoRef.current = [];
  };

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const floodFill = (startX: number, startY: number, fillHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const x0 = Math.floor(startX);
    const y0 = Math.floor(startY);
    if (x0 < 0 || y0 < 0 || x0 >= canvas.width || y0 >= canvas.height) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;
    const idx0 = (y0 * w + x0) * 4;
    const targetR = data[idx0];
    const targetG = data[idx0 + 1];
    const targetB = data[idx0 + 2];
    const [fillR, fillG, fillB] = hexToRgba(fillHex);

    if (
      Math.abs(targetR - fillR) < 5 &&
      Math.abs(targetG - fillG) < 5 &&
      Math.abs(targetB - fillB) < 5
    ) {
      return;
    }

    const tol = 32;
    const match = (idx: number) =>
      Math.abs(data[idx] - targetR) <= tol &&
      Math.abs(data[idx + 1] - targetG) <= tol &&
      Math.abs(data[idx + 2] - targetB) <= tol;

    const stack: number[] = [x0, y0];
    const visited = new Uint8Array(w * h);

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      const pIdx = y * w + x;
      if (visited[pIdx]) continue;
      const dIdx = pIdx * 4;
      if (!match(dIdx)) continue;
      visited[pIdx] = 1;
      data[dIdx] = fillR;
      data[dIdx + 1] = fillG;
      data[dIdx + 2] = fillB;
      data[dIdx + 3] = 255;

      if (x > 0) stack.push(x - 1, y);
      if (x < w - 1) stack.push(x + 1, y);
      if (y > 0) stack.push(x, y - 1);
      if (y < h - 1) stack.push(x, y + 1);
    }

    ctx.putImageData(imgData, 0, 0);
    pushHistory(ctx, canvas);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getCoords(e);

    if (tool === 'picker') {
      const pixel = ctx.getImageData(Math.floor(pos.x), Math.floor(pos.y), 1, 1).data;
      const hex = `#${[pixel[0], pixel[1], pixel[2]]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')}`;
      setColor(hex);
      setTool('brush');
      onToast(`Color capturado: ${hex}`);
      return;
    }

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, color);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    startPosRef.current = pos;
    pointsRef.current = [pos];
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === 'brush' || tool === 'marker' || tool === 'eraser') {
      ctx.save();
      ctx.globalAlpha = tool === 'marker' ? Math.min(0.45, opacity) : opacity;
      ctx.fillStyle = tool === 'eraser' ? bgColor : color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, (tool === 'marker' ? brushSize * 1.5 : brushSize) / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getCoords(e);

    if (tool === 'brush' || tool === 'marker' || tool === 'eraser') {
      pointsRef.current.push(pos);
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      ctx.save();
      ctx.globalAlpha = tool === 'marker' ? Math.min(0.45, opacity) : opacity;
      ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
      ctx.lineWidth = tool === 'marker' ? brushSize * 1.6 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const pts = pointsRef.current;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const midX = (pts[i].x + pts[i + 1].x) / 2;
        const midY = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      if (pts.length > 1) {
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
      ctx.restore();
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const { x: sx, y: sy } = startPosRef.current;
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(sx, sy);
        ctx.lineTo(pos.x, pos.y);
      } else if (tool === 'rect') {
        ctx.strokeRect(sx, sy, pos.x - sx, pos.y - sy);
      } else if (tool === 'circle') {
        const radius = Math.hypot(pos.x - sx, pos.y - sy);
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    pointsRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    pushHistory(ctx, canvas);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || historyRef.current.length <= 1) return;
    const popped = historyRef.current.pop()!;
    redoRef.current.push(popped);
    ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || redoRef.current.length === 0) return;
    const next = redoRef.current.pop()!;
    historyRef.current.push(next);
    ctx.putImageData(next, 0, 0);
  };

  const handleClear = (targetBg = bgColor) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = targetBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory(ctx, canvas);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `astro_paint_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    onToast('Imagen PNG descargada');
  };

  const toolsList: Array<{ id: PaintTool; label: string }> = [
    { id: 'brush', label: 'Pincel' },
    { id: 'marker', label: 'Marcador' },
    { id: 'line', label: 'Línea' },
    { id: 'rect', label: 'Rect' },
    { id: 'circle', label: 'Círculo' },
    { id: 'fill', label: 'Relleno' },
    { id: 'picker', label: 'Gotero' },
    { id: 'eraser', label: 'Borrador' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-2.5 bg-black/50 border-b border-white/10 space-y-2 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {toolsList.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors ${
                  tool === t.id
                    ? 'bg-amber-400/25 border-amber-400 text-amber-200 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200"
              title="Deshacer"
            >
              ↶
            </button>
            <button
              onClick={handleRedo}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200"
              title="Rehacer"
            >
              ↷
            </button>
            <button
              onClick={() => {
                const nextBg = bgColor === '#FFFFFF' ? '#0F172A' : '#FFFFFF';
                setBgColor(nextBg);
                setColor(nextBg === '#FFFFFF' ? '#0F172A' : '#FFFFFF');
                handleClear(nextBg);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-cyan-200"
            >
              Fondo: {bgColor === '#FFFFFF' ? 'Claro' : 'Oscuro'}
            </button>
            <button
              onClick={() => handleClear()}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/35 text-[11px] font-mono text-rose-200"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            {SWATCHES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setColor(s);
                  if (tool === 'eraser') setTool('brush');
                }}
                aria-label={`Color ${s}`}
                style={{ backgroundColor: s }}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  color.toLowerCase() === s.toLowerCase()
                    ? 'border-cyan-400 scale-115 ring-2 ring-cyan-400/50'
                    : 'border-white/30'
                }`}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                if (tool === 'eraser') setTool('brush');
              }}
              className="w-6 h-6 bg-transparent border-0 cursor-pointer rounded ml-1"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 font-mono">Grosor:</span>
            <input
              type="range"
              min={1}
              max={48}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-pink-500 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-pink-300 w-8">{brushSize}px</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 font-mono">Opac:</span>
            <input
              type="range"
              min={0.15}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-cyan-300 w-8">
              {Math.round(opacity * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (canvas) onPinToDesktop(canvas.toDataURL('image/png'), 'AstroPaint.png');
              }}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 border border-cyan-400/35 font-mono text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Anclar Widget
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/35 font-mono text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Guardar PNG
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-slate-900/70 p-2 flex items-center justify-center min-h-0 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="border border-white/15 rounded-xl shadow-2xl cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
};
