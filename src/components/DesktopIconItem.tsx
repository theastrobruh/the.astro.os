import React, { useId, useRef } from 'react';
import { DesktopIconConfig, PhysicsBody, WindowId } from '../types/os';
import { PointerVelocityTracker } from '../engine/physics';
import { astroSound } from '../engine/sound';

export const AstroLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');
  const coreGradId = `astroCore-${uid}`;
  const ringGradId = `astroRing-${uid}`;
  const glowGradId = `astroGlow-${uid}`;

  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={coreGradId} cx="36%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="28%" stopColor="#38BDF8" />
          <stop offset="68%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#FF007A" />
        </radialGradient>
        <linearGradient id={ringGradId} x1="4" y1="32" x2="44" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#E879F9" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
        <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient cosmic halo */}
      <circle cx="24" cy="24" r="20" fill={`url(#${glowGradId})`} />

      {/* Back half of tilted orbital ring */}
      <path
        d="M8.5 30.8C5.4 26.8 10.6 19.3 20.1 14.9C29.6 10.5 39.2 10.8 41.8 15.2"
        stroke={`url(#${ringGradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Secondary fine orbital track */}
      <ellipse
        cx="24"
        cy="24"
        rx="20.5"
        ry="7.4"
        transform="rotate(18 24 24)"
        stroke="#00F0FF"
        strokeWidth="0.9"
        strokeDasharray="2.5 3.5"
        opacity="0.45"
      />

      {/* Planet core */}
      <circle cx="24" cy="24" r="10.2" fill={`url(#${coreGradId})`} />

      {/* Specular atmospheric crescent */}
      <path
        d="M17.2 19.6C18.8 16.7 22.1 15.1 25.4 15.5"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Equatorial cyber band */}
      <path
        d="M14.3 25.4C17.4 27.6 22.8 27.9 28.4 25.3C31 24.1 32.8 22.4 33.9 20.8"
        stroke="#070A1A"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Front half of main ring crossing over planet */}
      <path
        d="M41.8 15.2C44.5 19.7 38.9 27.2 29.1 31.7C19.3 36.2 10.8 34.7 8.5 30.8"
        stroke={`url(#${ringGradId})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* North-East 4-point star flare / moon node */}
      <path
        d="M38.5 9.2L39.4 11.6L41.8 12.5L39.4 13.4L38.5 15.8L37.6 13.4L35.2 12.5L37.6 11.6L38.5 9.2Z"
        fill="#FFFFFF"
      />
      <circle cx="11.5" cy="34.5" r="1.7" fill="#00F0FF" />
    </svg>
  );
};

interface DesktopIconItemProps {
  icon: DesktopIconConfig;
  iconSize: number;
  fontSize: number;
  isLockedAdmin: boolean;
  initialX: number;
  initialY: number;
  registerElement: (id: string, el: HTMLElement | null) => void;
  getBody: (id: string) => PhysicsBody | undefined;
  onOpenWindow: (winId: WindowId) => void;
  onDragStartBody: (id: string, grabOffsetX: number, grabOffsetY: number) => void;
  onDragMoveBody: (id: string, x: number, y: number, instVx: number, instVy: number) => void;
  onDragEndBody: (id: string, vx: number, vy: number) => void;
}

export const DesktopIconItem: React.FC<DesktopIconItemProps> = ({
  icon,
  iconSize,
  fontSize,
  isLockedAdmin,
  initialX,
  initialY,
  registerElement,
  getBody,
  onOpenWindow,
  onDragStartBody,
  onDragMoveBody,
  onDragEndBody,
}) => {
  const trackerRef = useRef(new PointerVelocityTracker());
  const dragRef = useRef({
    down: false,
    moved: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    startBodyX: 0,
    startBodyY: 0,
    lastClientX: 0,
    lastClientY: 0,
    lastTime: 0,
    grabOffsetX: 0,
    grabOffsetY: 0,
  });

  if (!icon.visible) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    const body = getBody(icon.id);
    const sx = body ? body.x : initialX;
    const sy = body ? body.y : initialY;
    const rect = e.currentTarget.getBoundingClientRect();

    dragRef.current = {
      down: true,
      moved: false,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startBodyX: sx,
      startBodyY: sy,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      lastTime: performance.now(),
      grabOffsetX: e.clientX - (rect.left + rect.width * 0.5),
      grabOffsetY: e.clientY - (rect.top + rect.height * 0.5),
    };
    trackerRef.current.reset(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.down || e.pointerId !== dragRef.current.pointerId) return;
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 8) {
      dragRef.current.moved = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore if unsupported
      }
      onDragStartBody(icon.id, dragRef.current.grabOffsetX, dragRef.current.grabOffsetY);
    }

    if (dragRef.current.moved) {
      const now = performance.now();
      const dt = Math.max(0.004, (now - dragRef.current.lastTime) / 1000);
      const instVx = (e.clientX - dragRef.current.lastClientX) / dt;
      const instVy = (e.clientY - dragRef.current.lastClientY) / dt;
      dragRef.current.lastClientX = e.clientX;
      dragRef.current.lastClientY = e.clientY;
      dragRef.current.lastTime = now;
      trackerRef.current.push(e.clientX, e.clientY);
      onDragMoveBody(
        icon.id,
        dragRef.current.startBodyX + dx,
        dragRef.current.startBodyY + dy,
        instVx,
        instVy
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.down || e.pointerId !== dragRef.current.pointerId) return;
    const wasMoved = dragRef.current.moved;
    dragRef.current.down = false;
    dragRef.current.pointerId = -1;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    if (wasMoved) {
      const { vx, vy } = trackerRef.current.getVelocity();
      onDragEndBody(icon.id, vx, vy);
    } else {
      astroSound.playWindowPop(true);
      onOpenWindow(icon.winId);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.down) return;
    const wasMoved = dragRef.current.moved;
    dragRef.current.down = false;
    dragRef.current.pointerId = -1;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    if (wasMoved) {
      const { vx, vy } = trackerRef.current.getVelocity();
      onDragEndBody(icon.id, vx, vy);
    }
  };

  return (
    <div
      ref={(el) => registerElement(icon.id, el)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          astroSound.playWindowPop(true);
          onOpenWindow(icon.winId);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={icon.name}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: Math.max(92, iconSize + 30),
        transform: `translate3d(${initialX}px, ${initialY}px, 0)`,
        willChange: 'transform',
      }}
      className="group flex flex-col items-center gap-1.5 p-1.5 rounded-2xl hover:bg-white/10 active:scale-95 transition-colors cursor-pointer active:cursor-grabbing touch-none select-none z-[5] focus-visible:outline-2 focus-visible:outline-cyan-400"
    >
      <div
        style={{ width: iconSize, height: iconSize }}
        className="relative rounded-2xl flex items-center justify-center bg-slate-900/55 border border-white/15 backdrop-blur-md shadow-lg group-hover:border-cyan-400/55 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.22)] transition-all overflow-hidden pointer-events-none"
      >
        {icon.customImage ? (
          <img
            src={icon.customImage}
            alt={icon.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          renderDefaultSvg(icon.winId)
        )}
        {isLockedAdmin && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[9px] text-slate-950 font-bold flex items-center justify-center shadow">
            !
          </span>
        )}
      </div>

      <span
        style={{ fontSize: `${fontSize}px` }}
        className="font-mono font-semibold text-white text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 py-0.5 rounded bg-black/35 whitespace-nowrap pointer-events-none"
      >
        {icon.name}
      </span>
    </div>
  );
};

export function renderDefaultSvg(winId: WindowId) {
  switch (winId) {
    case 'win-astroverse':
      return <AstroLogoSvg className="w-[70%] h-[70%] group-hover:scale-110 transition-transform duration-300" />;
    case 'win-draw':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoBrush" x1="8" y1="32" x2="32" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
          <path d="M27.5 7.5L32.5 12.5L15.5 29.5L10.5 24.5L27.5 7.5Z" fill="url(#icoBrush)" />
          <path d="M10.5 24.5L15.5 29.5C13.5 32.5 9.2 33 7.5 32.5C8 30.8 8.5 26.5 10.5 24.5Z" fill="#FF007A" />
          <circle cx="30" cy="10" r="2.5" fill="#FFFBEB" />
        </svg>
      );
    case 'win-notes':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoBook" x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          <rect x="8" y="6" width="24" height="28" rx="4.5" fill="url(#icoBook)" />
          <rect x="8" y="6" width="5.5" height="28" rx="2.5" fill="#312E81" />
          <path d="M23 6V16L25.5 14L28 16V6H23Z" fill="#F472B6" />
          <rect x="16.5" y="19" width="11.5" height="2.2" rx="1.1" fill="#E0E7FF" />
          <rect x="16.5" y="24" width="8.5" height="2.2" rx="1.1" fill="#C7D2FE" opacity="0.8" />
        </svg>
      );
    case 'win-terminal':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-105 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <rect x="5" y="8" width="30" height="24" rx="5" fill="#062820" stroke="#34D399" strokeWidth="2" />
          <path d="M12 16L17.5 20.5L12 25" stroke="#34D399" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="20" y="23.5" width="8" height="2.6" rx="1.3" fill="#00F0FF" />
          <circle cx="10.5" cy="12" r="1.2" fill="#F43F5E" />
          <circle cx="14.5" cy="12" r="1.2" fill="#FBBF24" />
          <circle cx="18.5" cy="12" r="1.2" fill="#34D399" />
        </svg>
      );
    case 'win-themes':
      return (
        <svg className="w-[58%] h-[58%] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoPalette" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>
          <path
            d="M20 6C12.27 6 6 12.27 6 20C6 27.73 12.27 34 20 34C22 34 23.5 32.5 23.5 30.6C23.5 29.7 23.1 28.9 22.6 28.2C22.1 27.6 21.8 26.8 21.8 26C21.8 24.1 23.3 22.6 25.2 22.6H28.5C31.5 22.6 34 20.1 34 17.1C34 10.7 27.7 6 20 6Z"
            fill="url(#icoPalette)"
          />
          <circle cx="13.5" cy="16.5" r="2.2" fill="#FACC15" />
          <circle cx="19" cy="12.5" r="2.2" fill="#FFFFFF" />
          <circle cx="25.5" cy="14" r="2.2" fill="#00F0FF" />
          <circle cx="13" cy="23.5" r="2.2" fill="#34D399" />
        </svg>
      );
    case 'win-music':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoMusic" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="55%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#FF007A" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="13.5" fill="#17102E" stroke="url(#icoMusic)" strokeWidth="2.4" />
          <path d="M17 24V13.5L27 11.5V22" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="14.5" cy="24.5" r="3" fill="#00F0FF" />
          <circle cx="24.5" cy="22.5" r="3" fill="#FF007A" />
        </svg>
      );
    case 'win-mediaflow':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoMedia" x1="6" y1="8" x2="34" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <rect x="6" y="9" width="28" height="22" rx="4.5" fill="url(#icoMedia)" />
          <path d="M8 28L15.5 19.5L21 25L25.5 20L32 28H8Z" fill="#0F172A" opacity="0.65" />
          <circle cx="14" cy="15.5" r="2.6" fill="#FDE047" />
          <rect x="24" y="12.5" width="7" height="4" rx="1.5" fill="#FF007A" />
        </svg>
      );
    case 'win-pressmark':
      return (
        <svg className="w-[60%] h-[60%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoPressmark" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <rect x="7" y="7" width="26" height="26" rx="6" fill="#071b2c" stroke="url(#icoPressmark)" strokeWidth="2.2" />
          <path
            d="M13 14H21C23.2 14 25 15.8 25 18C25 20.2 23.2 22 21 22H16V27"
            stroke="#00F0FF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="18" r="2" fill="#22D3EE" />
          <path d="M22 25L27 27" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="1.5 2.5" />
          <path d="M19 28L25 30" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeDasharray="1.5 2.5" />
          <rect x="23" y="10" width="7" height="4" rx="1.2" fill="#38BDF8" />
        </svg>
      );
    case 'win-youtube':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoYt" x1="6" y1="9" x2="34" y2="31" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <rect x="6" y="10" width="28" height="20" rx="6" fill="url(#icoYt)" />
          <path d="M17 15.5L25 20L17 24.5V15.5Z" fill="#FFFFFF" />
        </svg>
      );
    case 'win-cardgram':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoCard" x1="6" y1="9" x2="34" y2="31" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF007A" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>
          <rect x="6" y="10" width="28" height="20" rx="4.5" fill="url(#icoCard)" />
          <circle cx="14.5" cy="18.5" r="3.2" fill="#FFFFFF" />
          <path d="M10.5 25.5C11.5 22.8 17.5 22.8 18.5 25.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="21.5" y="16" width="8.5" height="2.4" rx="1.2" fill="#FFFFFF" opacity="0.9" />
          <rect x="21.5" y="21" width="6" height="2.4" rx="1.2" fill="#FFFFFF" opacity="0.7" />
        </svg>
      );
    case 'win-astrochess':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoChess" x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          {/* Chess Knight / King Crown Silhouette */}
          <path
            d="M13 31H27M14 27H26L24.5 21C26.8 18.5 27.5 14.5 25 11.5C23.5 9.7 21 9 19 9.5L17.5 7L15.5 10.5C13 12 12 15 13 18L17.5 16.5L15 21L14 27Z"
            fill="url(#icoChess)"
            stroke="#FEF08A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17.5" cy="13" r="1.2" fill="#1E1B4B" />
        </svg>
      );
    case 'win-astrostudio':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoStudio" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <rect x="6" y="8" width="28" height="24" rx="5" fill="#160f2e" stroke="url(#icoStudio)" strokeWidth="2.2" />
          <path d="M10 27L16.5 19.5L21.5 24.5L25.5 20L30 27H10Z" fill="url(#icoStudio)" opacity="0.85" />
          <circle cx="15" cy="15" r="2.2" fill="#FDE047" />
          <path d="M27 11L28 13.5L30.5 14.5L28 15.5L27 18L26 15.5L23.5 14.5L26 13.5L27 11Z" fill="#00F0FF" />
        </svg>
      );
    case 'win-inkra':
      return (
        <svg className="w-[60%] h-[60%] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoInkra" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F0ABFC" />
              <stop offset="50%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <rect x="7" y="7" width="26" height="26" rx="6" fill="#180828" stroke="url(#icoInkra)" strokeWidth="2.1" />
          <path
            d="M25.5 11.5L28.5 14.5L19.5 23.5L14 26L16.5 20.5L25.5 11.5Z"
            fill="url(#icoInkra)"
          />
          <path d="M12.5 28.5C15.5 28.5 18.5 27.5 27 27.5" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="16" r="1.4" fill="#FFFFFF" />
        </svg>
      );
    case 'win-admin':
      return (
        <svg className="w-[58%] h-[58%] group-hover:rotate-45 transition-transform duration-500" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoAdmin" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
          <path
            d="M20 7L23 10.8L27.8 9.8L28.2 14.7L32.8 16.5L30.8 20.9L32.8 25.3L28.2 27.1L27.8 32L23 31L20 34.8L17 31L12.2 32L11.8 27.1L7.2 25.3L9.2 20.9L7.2 16.5L11.8 14.7L12.2 9.8L17 10.8L20 7Z"
            fill="url(#icoAdmin)"
          />
          <circle cx="20" cy="20.9" r="5" fill="#180D12" />
          <circle cx="20" cy="20.9" r="2.2" fill="#FDE047" />
        </svg>
      );
    default:
      return null;
  }
}
