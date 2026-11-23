import React, { useRef } from 'react';
import { DesktopIconConfig, PhysicsBody, WindowId } from '../types/os';
import { PointerVelocityTracker } from '../engine/physics';
import { astroSound } from '../engine/sound';

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
  onDragStartBody: (id: string) => void;
  onDragMoveBody: (id: string, x: number, y: number, vx: number) => void;
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
    startClientX: 0,
    startClientY: 0,
    startBodyX: 0,
    startBodyY: 0,
    lastClientX: 0,
  });

  if (!icon.visible) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const body = getBody(icon.id);
    const sx = body ? body.x : initialX;
    const sy = body ? body.y : initialY;

    dragRef.current = {
      down: true,
      moved: false,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startBodyX: sx,
      startBodyY: sy,
      lastClientX: e.clientX,
    };
    trackerRef.current.reset(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.down) return;
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 6) {
      dragRef.current.moved = true;
      onDragStartBody(icon.id);
    }

    if (dragRef.current.moved) {
      const instVx = (e.clientX - dragRef.current.lastClientX) * 60;
      dragRef.current.lastClientX = e.clientX;
      trackerRef.current.push(e.clientX, e.clientY);
      onDragMoveBody(icon.id, dragRef.current.startBodyX + dx, dragRef.current.startBodyY + dy, instVx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.down) return;
    const wasMoved = dragRef.current.moved;
    dragRef.current.down = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
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

  const boxStyle: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
  };

  const theme = getIconTheme(icon.winId);

  return (
    <div
      ref={(el) => registerElement(icon.id, el)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: Math.max(96, iconSize + 34),
        transform: `translate3d(${initialX}px, ${initialY}px, 0)`,
        willChange: 'transform',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenWindow(icon.winId);
        }
      }}
      className="group flex flex-col items-center justify-center p-1 rounded-2xl cursor-grab active:cursor-grabbing touch-none select-none z-10 focus-visible:outline-2 focus-visible:outline-cyan-400"
    >
      {/* Premium Squircle Glass Icon Container */}
      <div
        style={{
          ...boxStyle,
          boxShadow: `0 10px 24px -6px rgba(0,0,0,0.7), 0 0 18px -4px ${theme.glow}`,
        }}
        className={`relative rounded-[18px] bg-gradient-to-br ${theme.borderGrad} p-[1.5px] transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5 flex items-center justify-center overflow-hidden`}
      >
        <div
          className={`w-full h-full rounded-[16.5px] bg-gradient-to-b ${theme.surfaceGrad} backdrop-blur-md flex items-center justify-center relative overflow-hidden`}
        >
          {/* Top specular glass highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-[16px]" />
          {/* Ambient inner glow orb */}
          <div
            className="pointer-events-none absolute -bottom-3 -right-3 w-10 h-10 rounded-full blur-md opacity-55 group-hover:opacity-85 transition-opacity"
            style={{ backgroundColor: theme.orb }}
          />

          {icon.customImage ? (
            <img
              src={icon.customImage}
              alt={icon.name}
              className="w-full h-full object-cover rounded-[16px] relative z-10"
              draggable={false}
            />
          ) : (
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              {renderDefaultSvg(icon.winId)}
            </div>
          )}

          {isLockedAdmin && (
            <span
              title="Requiere PIN de Administrador"
              className="absolute top-1 right-1 z-20 text-[9px] bg-black/70 backdrop-blur-sm border border-amber-400/40 rounded-md px-1 py-0.5 leading-none"
            >
              🔒
            </span>
          )}
        </div>
      </div>

      <span
        style={{ fontSize }}
        className="mt-1 font-semibold font-mono tracking-tight text-center text-slate-100 group-hover:text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] select-none leading-tight whitespace-normal break-words max-w-[110px] px-1 py-0.5 rounded-md group-hover:bg-white/10 transition-colors"
      >
        {icon.name}
      </span>
    </div>
  );
};

function getIconTheme(winId: WindowId) {
  switch (winId) {
    case 'win-astroverse':
      return {
        borderGrad: 'from-pink-400/80 via-purple-400/60 to-cyan-300/80',
        surfaceGrad: 'from-[#281238]/95 to-[#10091e]/95',
        orb: '#FF007A',
        glow: 'rgba(255, 0, 122, 0.45)',
      };
    case 'win-draw':
      return {
        borderGrad: 'from-amber-300/85 via-rose-400/70 to-pink-500/80',
        surfaceGrad: 'from-[#2c1522]/95 to-[#150c19]/95',
        orb: '#FACC15',
        glow: 'rgba(250, 204, 21, 0.4)',
      };
    case 'win-notes':
      return {
        borderGrad: 'from-indigo-300/80 via-blue-400/65 to-violet-400/80',
        surfaceGrad: 'from-[#141a3c]/95 to-[#0b0e24]/95',
        orb: '#818CF8',
        glow: 'rgba(129, 140, 248, 0.45)',
      };
    case 'win-terminal':
      return {
        borderGrad: 'from-emerald-300/80 via-teal-400/65 to-cyan-400/75',
        surfaceGrad: 'from-[#09241e]/95 to-[#051214]/95',
        orb: '#10B981',
        glow: 'rgba(16, 185, 129, 0.42)',
      };
    case 'win-themes':
      return {
        borderGrad: 'from-fuchsia-400/85 via-pink-400/70 to-cyan-300/85',
        surfaceGrad: 'from-[#2b103a]/95 to-[#130b24]/95',
        orb: '#E879F9',
        glow: 'rgba(232, 121, 249, 0.45)',
      };
    case 'win-music':
      return {
        borderGrad: 'from-violet-400/85 via-fuchsia-400/70 to-pink-400/85',
        surfaceGrad: 'from-[#22123c]/95 to-[#100a24]/95',
        orb: '#A855F7',
        glow: 'rgba(168, 85, 247, 0.48)',
      };
    case 'win-mediaflow':
      return {
        borderGrad: 'from-cyan-300/85 via-sky-400/70 to-indigo-400/85',
        surfaceGrad: 'from-[#0b233a]/95 to-[#081224]/95',
        orb: '#00F0FF',
        glow: 'rgba(0, 240, 255, 0.45)',
      };
    case 'win-pressmark':
      return {
        borderGrad: 'from-cyan-400/85 via-teal-400/70 to-blue-500/85',
        surfaceGrad: 'from-[#082333]/95 to-[#061524]/95',
        orb: '#06B6D4',
        glow: 'rgba(6, 182, 212, 0.45)',
      };
    case 'win-youtube':
      return {
        borderGrad: 'from-red-400/85 via-rose-500/75 to-red-600/85',
        surfaceGrad: 'from-[#2e0d13]/95 to-[#160609]/95',
        orb: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.45)',
      };
    case 'win-cardgram':
      return {
        borderGrad: 'from-rose-300/85 via-pink-400/70 to-cyan-300/80',
        surfaceGrad: 'from-[#2f1128]/95 to-[#140b1d]/95',
        orb: '#F472B6',
        glow: 'rgba(244, 114, 182, 0.45)',
      };
    case 'win-admin':
      return {
        borderGrad: 'from-amber-300/90 via-orange-400/70 to-rose-400/85',
        surfaceGrad: 'from-[#2c190e]/95 to-[#160b10]/95',
        orb: '#FBBF24',
        glow: 'rgba(251, 191, 36, 0.45)',
      };
    default:
      return {
        borderGrad: 'from-cyan-400/80 to-blue-500/80',
        surfaceGrad: 'from-slate-800/95 to-slate-950/95',
        orb: '#38BDF8',
        glow: 'rgba(56, 189, 248, 0.4)',
      };
  }
}

export function renderDefaultSvg(winId: WindowId) {
  switch (winId) {
    case 'win-astroverse':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoPlanet" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#FF007A" />
            </linearGradient>
            <linearGradient id="icoRing" x1="4" y1="26" x2="36" y2="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF007A" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>
          <path d="M5 24C9 16.5 31 12 35 17.5" stroke="url(#icoRing)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
          <circle cx="20" cy="20" r="9.5" fill="url(#icoPlanet)" />
          <circle cx="17" cy="17" r="3" fill="white" opacity="0.28" />
          <path d="M35 17.5C37 22 11 29.5 5 24" stroke="url(#icoRing)" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="32" cy="8.5" r="1.5" fill="#FDE047" />
        </svg>
      );
    case 'win-draw':
      return (
        <svg className="w-[58%] h-[58%] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="icoBrush" x1="8" y1="32" x2="33" y2="7" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF007A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <path d="M9 28.5C9 25 12 22.5 15 24C18 25.5 16.5 31 12.5 32.5C10 33.4 7.5 32 7 30C8 29.8 9 29.3 9 28.5Z" fill="#FF007A" />
          <path d="M16 22L29.5 8.5C30.8 7.2 32.8 7.2 34 8.5C35.2 9.7 35.2 11.7 34 13L20.5 26.5L16 22Z" fill="url(#icoBrush)" />
          <path d="M14.5 23.5L19 28L16.8 30.2L12.3 25.7L14.5 23.5Z" fill="#CBD5E1" />
          <circle cx="10" cy="11" r="2.2" fill="#00F0FF" />
          <circle cx="29" cy="30" r="2.4" fill="#FACC15" />
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
          {/* Document / Media Stamp Frame */}
          <rect x="7" y="7" width="26" height="26" rx="6" fill="#071b2c" stroke="url(#icoPressmark)" strokeWidth="2.2" />
          
          {/* Stamp / Watermark Badge (P & Check / Stamp Mark) */}
          <path
            d="M13 14H21C23.2 14 25 15.8 25 18C25 20.2 23.2 22 21 22H16V27"
            stroke="#00F0FF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Watermark Diagonal Waves / Multi-tool Layers */}
          <circle cx="21" cy="18" r="2" fill="#22D3EE" />
          <path d="M22 25L27 27" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="1.5 2.5" />
          <path d="M19 28L25 30" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeDasharray="1.5 2.5" />
          {/* Verification / Conversion Pip */}
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
