import React, { useEffect, useRef } from 'react';
import { CollisionImpactEvent, ThemeEffectsConfig } from '../types/os';

interface StarfieldCanvasProps {
  effects: ThemeEffectsConfig;
  impactsRef: React.MutableRefObject<CollisionImpactEvent[]>;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
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

interface ImpactSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({ effects, impactsRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const settingsRef = useRef(effects);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    settingsRef.current = effects;
  }, [effects]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (window.innerWidth > 0 && window.innerHeight > 0) {
        pointerRef.current.x = e.clientX / window.innerWidth;
        pointerRef.current.y = e.clientY / window.innerHeight;
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const createStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.3 + Math.random() * 0.9,
      size: 0.7 + Math.random() * 1.9,
      alpha: 0.25 + Math.random() * 0.75,
      twinkleSpeed: 0.015 + Math.random() * 0.035,
      twinklePhase: Math.random() * Math.PI * 2,
    });

    const stars: Star[] = Array.from({ length: settingsRef.current.starCount }, createStar);
    const shootingStars: ShootingStar[] = [];
    const shockwaves: Shockwave[] = [];
    const sparks: ImpactSpark[] = [];

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let rafId = 0;
    let lastTime = performance.now();
    let shootTimer = 0;
    let nextShootDelay = 2800 + Math.random() * 4500;

    const render = (now: number) => {
      const dtMs = Math.min(50, now - lastTime);
      const dt = dtMs / 16.667;
      lastTime = now;

      const desiredCount = Math.max(40, Math.min(700, settingsRef.current.starCount));
      while (stars.length < desiredCount) stars.push(createStar());
      while (stars.length > desiredCount) stars.pop();

      if (impactsRef.current.length > 0) {
        const pending = impactsRef.current.splice(0, impactsRef.current.length);
        for (const imp of pending) {
          shockwaves.push({
            x: imp.x,
            y: imp.y,
            radius: 4,
            maxRadius: 26 + imp.intensity * 52,
            alpha: 0.42 + imp.intensity * 0.45,
            color: imp.color,
          });
          const sparkCount = Math.min(10, Math.max(3, Math.round(imp.intensity * 9)));
          const baseAngle = Math.atan2(imp.ny, imp.nx);
          for (let k = 0; k < sparkCount; k++) {
            const spread = baseAngle + (Math.random() - 0.5) * 2.2;
            const spd = (1.5 + Math.random() * 4.5) * (0.6 + imp.intensity);
            sparks.push({
              x: imp.x,
              y: imp.y,
              vx: Math.cos(spread) * spd,
              vy: Math.sin(spread) * spd,
              alpha: 0.85,
              size: 1.2 + Math.random() * 1.6,
              color: imp.color,
            });
          }
        }
      }

      ctx.clearRect(0, 0, width, height);

      const speedMult = settingsRef.current.starSpeed;
      const parallaxX = (pointerRef.current.x - 0.5) * 18;
      const parallaxY = (pointerRef.current.y - 0.5) * 18;

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

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vx *= Math.pow(0.92, dt);
        sp.vy *= Math.pow(0.92, dt);
        sp.alpha -= 0.045 * dt;
        if (sp.alpha <= 0.03) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
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
