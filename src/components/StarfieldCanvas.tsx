import React, { useEffect, useRef } from 'react';
import { CollisionImpactEvent } from '../types/os';

interface StarfieldCanvasProps {
  starCount: number;
  starSpeed: number;
  impactsRef: React.MutableRefObject<CollisionImpactEvent[]>;
}

interface Star {
  x: number;
  y: number;
  z: number; // depth layer 0.2..1.0
  size: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({
  starCount,
  starSpeed,
  impactsRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const settingsRef = useRef({ starCount, starSpeed });

  useEffect(() => {
    settingsRef.current = { starCount, starSpeed };
  }, [starCount, starSpeed]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (window.innerWidth > 0 && window.innerHeight > 0) {
        pointerRef.current.x = e.clientX / window.innerWidth;
        pointerRef.current.y = e.clientY / window.innerHeight;
      }
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const makeStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.25 + Math.random() * 0.75,
      size: 0.6 + Math.random() * 1.9,
      alpha: 0.35 + Math.random() * 0.65,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.015 + Math.random() * 0.04,
    });

    let stars: Star[] = Array.from({ length: settingsRef.current.starCount }, makeStar);
    const shootingStars: ShootingStar[] = [];
    const shockwaves: Shockwave[] = [];

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let rafId = 0;
    let lastTime = performance.now();
    let nextShootDelay = 2500 + Math.random() * 4000;
    let shootTimer = 0;

    const render = (now: number) => {
      const dtMs = Math.min(50, now - lastTime);
      lastTime = now;
      const dt = dtMs / 16.6667;

      const targetCount = settingsRef.current.starCount;
      if (stars.length < targetCount) {
        while (stars.length < targetCount) stars.push(makeStar());
      } else if (stars.length > targetCount) {
        stars = stars.slice(0, targetCount);
      }

      // Consume physics collision shockwaves
      if (impactsRef.current.length > 0) {
        const pending = impactsRef.current.splice(0, impactsRef.current.length);
        for (const imp of pending) {
          shockwaves.push({
            x: imp.x,
            y: imp.y,
            radius: 4,
            maxRadius: 28 + imp.intensity * 48,
            alpha: 0.45 + imp.intensity * 0.4,
            color: imp.color,
          });
        }
      }

      ctx.clearRect(0, 0, width, height);

      const speedMult = settingsRef.current.starSpeed;
      const parallaxX = (pointerRef.current.x - 0.5) * 18;
      const parallaxY = (pointerRef.current.y - 0.5) * 18;

      // Draw stars with depth parallax
      for (const s of stars) {
        s.y -= 0.16 * s.z * speedMult * dt;
        s.x += 0.04 * s.z * speedMult * dt;
        s.twinklePhase += s.twinkleSpeed * dt;

        if (s.y < -4) {
          s.y = height + 4;
          s.x = Math.random() * width;
        }
        if (s.x > width + 4) s.x = -4;

        const drawX = s.x - parallaxX * s.z;
        const drawY = s.y - parallaxY * s.z;
        const twinkle = 0.65 + 0.35 * Math.sin(s.twinklePhase);
        const finalAlpha = Math.max(0.15, Math.min(1, s.alpha * twinkle));

        ctx.fillStyle = `rgba(236, 244, 255, ${finalAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      shootTimer += dtMs;
      if (shootTimer >= nextShootDelay) {
        shootTimer = 0;
        nextShootDelay = 3000 + Math.random() * 5500;
        const startX = Math.random() * width * 0.85;
        const startY = Math.random() * height * 0.35;
        shootingStars.push({
          x: startX,
          y: startY,
          vx: 11 + Math.random() * 7,
          vy: 5.5 + Math.random() * 4.5,
          life: 0,
          maxLife: 34 + Math.random() * 18,
          length: 90 + Math.random() * 65,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        st.x += st.vx * dt;
        st.y += st.vy * dt;
        st.life += dt;

        const progress = st.life / st.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);

        const norm = Math.hypot(st.vx, st.vy) || 1;
        const tailX = st.x - (st.vx / norm) * st.length;
        const tailY = st.y - (st.vy / norm) * st.length;

        const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.35, `rgba(0, 240, 255, ${alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(255, 0, 122, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (st.life >= st.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      // Collision impact shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.2 * dt;
        sw.alpha -= 0.032 * dt;
        if (sw.alpha <= 0.02) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [impactsRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
