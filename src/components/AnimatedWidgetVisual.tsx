import React, { useEffect, useRef, useState } from 'react';

interface AnimatedWidgetVisualProps {
  url: string;
  label: string;
  fallbackScene?: 'cosmos' | 'city' | 'pulse' | 'saturn' | 'prism';
  className?: string;
}

/**
 * Renders an image or animated GIF URL with a zero-broken-image procedural
 * 60fps canvas animation fallback (and native animated scene mode when url is empty).
 */
export const AnimatedWidgetVisual: React.FC<AnimatedWidgetVisualProps> = ({
  url,
  label,
  fallbackScene = 'pulse',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setImgError(false);
  }, [url]);

  const showCanvas = !url || imgError;

  useEffect(() => {
    if (!showCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const w = (canvas.width = 240);
    const h = (canvas.height = 240);

    const draw = (timeMs: number) => {
      const t = timeMs * 0.001;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#07061a');
      bg.addColorStop(0.55, '#190c33');
      bg.addColorStop(1, '#30103a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (fallbackScene === 'saturn' || fallbackScene === 'cosmos') {
        for (let i = 0; i < 24; i++) {
          const sx = (i * 73) % w;
          const sy = (i * 137) % h;
          const a = 0.3 + 0.6 * Math.abs(Math.sin(t * 2 + i));
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fillRect(sx, sy, 2, 2);
        }

        ctx.save();
        ctx.translate(w / 2, h / 2 + Math.sin(t * 1.6) * 5);

        ctx.save();
        ctx.rotate(-0.32 + Math.sin(t * 0.7) * 0.08);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, 0, 82, 22, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        const pGrad = ctx.createRadialGradient(-16, -16, 6, 0, 0, 44);
        pGrad.addColorStop(0, '#F472B6');
        pGrad.addColorStop(0.6, '#7C3AED');
        pGrad.addColorStop(1, '#1E1B4B');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 44, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.rotate(-0.32 + Math.sin(t * 0.7) * 0.08);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(0, 0, 82, 22, 0, 0, Math.PI);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      } else if (fallbackScene === 'prism') {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        for (let k = 0; k < 3; k++) {
          ctx.save();
          ctx.rotate(t * (0.9 + k * 0.25) + k * 0.6);
          const r = 64 - k * 14;
          ctx.strokeStyle = k === 0 ? '#00F0FF' : k === 1 ? '#FF007A' : '#A855F7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (i * Math.PI) / 3;
            const px = Math.cos(ang) * r;
            const py = Math.sin(ang) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      } else if (fallbackScene === 'city') {
        const moonY = h * 0.24;
        ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(w * 0.72, moonY, 18, 0, Math.PI * 2);
        ctx.fill();

        const heights = [76, 112, 64, 134, 92, 118, 82, 104];
        const bw = w / heights.length;
        heights.forEach((bh, idx) => {
          const x = idx * bw + 2;
          const y = h - bh;
          ctx.fillStyle = idx % 2 === 0 ? '#111633' : '#1b1138';
          ctx.fillRect(x, y, bw - 4, bh);
          ctx.fillStyle = idx % 2 === 0 ? '#00F0FF' : '#FF007A';
          ctx.fillRect(x, y, bw - 4, 2.5);
          for (let wy = y + 10; wy < h - 10; wy += 12) {
            if (((idx + wy + Math.floor(t * 2)) % 3) === 0) {
              ctx.fillStyle = 'rgba(255,255,255,0.35)';
              ctx.fillRect(x + 4, wy, bw - 12, 3);
            }
          }
        });
      } else {
        const sunY = h * 0.44 + Math.sin(t * 1.5) * 3;
        const sunGrad = ctx.createLinearGradient(0, sunY - 46, 0, sunY + 46);
        sunGrad.addColorStop(0, '#FACC15');
        sunGrad.addColorStop(0.55, '#FF007A');
        sunGrad.addColorStop(1, '#7C3AED');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(w / 2, sunY, 46, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#190c33';
        for (let y = sunY + 6; y < sunY + 46; y += 9) {
          ctx.fillRect(w / 2 - 50, y, 100, 3);
        }

        const horizon = h * 0.58;
        ctx.fillStyle = '#090617';
        ctx.fillRect(0, horizon, w, h - horizon);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
        ctx.lineWidth = 1.2;

        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(w / 2 + i * 10, horizon);
          ctx.lineTo(w / 2 + i * 44, h);
          ctx.stroke();
        }

        const scroll = (t * 45) % 20;
        for (let y = 0; y < h - horizon; y += 16) {
          const py = horizon + Math.pow((y + scroll) / (h - horizon), 1.6) * (h - horizon);
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(w, py);
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [showCanvas, fallbackScene]);

  if (!showCanvas) {
    return (
      <img
        src={url}
        alt={label}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`w-full h-full object-cover select-none ${className}`}
        draggable={false}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label={label}
      className={`w-full h-full object-cover select-none ${className}`}
    />
  );
};
