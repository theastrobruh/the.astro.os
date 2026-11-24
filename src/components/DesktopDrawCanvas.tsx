import React, { useEffect, useRef, useState } from 'react';

interface DesktopDrawCanvasProps {
  active: boolean;
  onExit: () => void;
}

export const DesktopDrawCanvas: React.FC<DesktopDrawCanvasProps> = ({ active, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#00F0FF');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const prev = document.createElement('canvas');
      prev.width = canvas.width;
      prev.height = canvas.height;
      const pCtx = prev.getContext('2d');
      if (pCtx && canvas.width > 0 && canvas.height > 0) {
        pCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (ctx && prev.width > 0 && prev.height > 0) {
        ctx.drawImage(prev, 0, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    drawingRef.current = true;
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || !drawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    lastPointRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`fixed inset-0 w-full h-full z-20 ${
          active ? 'pointer-events-auto cursor-crosshair touch-none' : 'pointer-events-none'
        }`}
      />
      {active && (
        <div className="fixed top-14 md:top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-950/90 backdrop-blur-xl border border-yellow-400/50 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 flex-wrap justify-center">
          <span className="text-xs font-mono font-bold text-yellow-300 whitespace-nowrap">
            Dibujo en Escritorio Activo
          </span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Color de pincel"
            className="w-7 h-7 bg-transparent border-0 cursor-pointer rounded"
          />
          <input
            type="range"
            min={2}
            max={28}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            aria-label="Grosor de pincel"
            className="w-20 accent-yellow-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-300 w-7">{brushSize}px</span>
          <button
            onClick={clearCanvas}
            className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/35 font-mono text-xs rounded-lg hover:bg-rose-500/35 transition-colors whitespace-nowrap"
          >
            Borrar Todo
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-yellow-400 text-slate-950 font-mono text-xs font-bold rounded-lg hover:bg-yellow-300 transition-colors whitespace-nowrap"
          >
            Salir de Dibujo
          </button>
        </div>
      )}
    </>
  );
};
