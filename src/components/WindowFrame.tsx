import React, { useEffect, useRef, useState } from 'react';
import { PhysicsBody, WindowId, WindowRuntimeState } from '../types/os';
import { PointerVelocityTracker } from '../engine/physics';
import { astroSound } from '../engine/sound';

interface WindowFrameProps {
  win: WindowRuntimeState;
  title: string;
  mobileTitle?: string;
  accentColor: string;
  isActive: boolean;
  isMobile: boolean;
  isTablet: boolean;
  resizable?: boolean;
  registerElement: (id: string, el: HTMLElement | null) => void;
  getBody: (id: string) => PhysicsBody | undefined;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onToggleMaximize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onResize: (id: WindowId, width: number, height: number) => void;
  onDragStartBody: (id: string, grabOffsetX: number, grabOffsetY: number) => void;
  onDragMoveBody: (id: string, x: number, y: number, instVx: number, instVy: number) => void;
  onDragEndBody: (id: string, vx: number, vy: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  win,
  title,
  mobileTitle,
  accentColor,
  isActive,
  isMobile,
  isTablet,
  resizable = false,
  registerElement,
  getBody,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onClose,
  onResize,
  onDragStartBody,
  onDragMoveBody,
  onDragEndBody,
  children,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const closingTimeoutRef = useRef<number | null>(null);
  const trackerRef = useRef(new PointerVelocityTracker());
  const dragStateRef = useRef({
    active: false,
    startClientX: 0,
    startClientY: 0,
    startWinX: 0,
    startWinY: 0,
    lastClientX: 0,
    lastClientY: 0,
    lastTime: 0,
  });

  useEffect(() => {
    if (win.isOpen) {
      setIsClosing(false);
    }
    return () => {
      if (closingTimeoutRef.current) {
        window.clearTimeout(closingTimeoutRef.current);
      }
    };
  }, [win.isOpen]);

  if (!win.isOpen || win.isMinimized) return null;

  const handleClose = () => {
    astroSound.playWindowPop(false);
    setIsClosing(true);
    closingTimeoutRef.current = window.setTimeout(() => {
      onClose(win.id);
      setIsClosing(false);
    }, 180);
  };

  const isMaximized = win.isMaximized || isMobile;

  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    onFocus(win.id);
    if (isMaximized) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const body = getBody(win.id);
    const startX = body ? body.x : win.x;
    const startY = body ? body.y : win.y;
    const rect = e.currentTarget.getBoundingClientRect();
    const grabOffsetX = e.clientX - (rect.left + rect.width * 0.5);

    dragStateRef.current = {
      active: true,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startWinX: startX,
      startWinY: startY,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      lastTime: performance.now(),
    };
    trackerRef.current.reset(e.clientX, e.clientY);
    onDragStartBody(win.id, grabOffsetX, -win.height * 0.45);
  };

  const handleTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    const now = performance.now();
    const dt = Math.max(0.004, (now - dragStateRef.current.lastTime) / 1000);
    const dx = e.clientX - dragStateRef.current.startClientX;
    const dy = e.clientY - dragStateRef.current.startClientY;
    const instVx = (e.clientX - dragStateRef.current.lastClientX) / dt;
    const instVy = (e.clientY - dragStateRef.current.lastClientY) / dt;

    dragStateRef.current.lastClientX = e.clientX;
    dragStateRef.current.lastClientY = e.clientY;
    dragStateRef.current.lastTime = now;
    trackerRef.current.push(e.clientX, e.clientY);

    const nextX = dragStateRef.current.startWinX + dx;
    const nextY = Math.max(4, dragStateRef.current.startWinY + dy);
    onDragMoveBody(win.id, nextX, nextY, instVx, instVy);
  };

  const handleTitlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    const { vx, vy } = trackerRef.current.getVelocity();
    onDragEndBody(win.id, vx, vy);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus(win.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.width;
    const startH = win.height;

    const onMove = (ev: PointerEvent) => {
      const nextW = Math.max(320, Math.min(window.innerWidth - 20, startW + (ev.clientX - startX)));
      const nextH = Math.max(260, Math.min(window.innerHeight - 72, startH + (ev.clientY - startY)));
      onResize(win.id, nextW, nextH);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const isAstroVerse = win.id === 'win-astroverse';

  const style: React.CSSProperties = isMobile
    ? isAstroVerse
      ? {
          position: 'fixed',
          left: 14,
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          maxHeight: 'min(580px, calc(100vh - 104px))',
          zIndex: win.zIndex,
        }
      : {
          position: 'fixed',
          left: 8,
          right: 8,
          top: 8,
          bottom: 62,
          zIndex: win.zIndex,
          transform: 'none',
          maxHeight: 'calc(100dvh - 70px)',
        }
    : isMaximized
    ? {
        position: 'absolute',
        left: 10,
        top: 10,
        width: 'calc(100% - 20px)',
        height: 'calc(100% - 20px)',
        zIndex: win.zIndex,
        transform: 'none',
      }
    : {
        position: 'absolute',
        left: 0,
        top: 0,
        width: isTablet ? Math.min(win.width, window.innerWidth - 28) : win.width,
        height: isTablet ? Math.min(win.height, window.innerHeight - 86) : win.height,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100vh - 70px)',
        zIndex: win.zIndex,
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        transformOrigin: '50% 24px',
        willChange: 'transform',
      };

  return (
    <section
      ref={(el) => {
        if (!isMaximized) registerElement(win.id, el);
        else registerElement(win.id, null);
      }}
      onPointerDown={() => onFocus(win.id)}
      style={style}
      aria-label={title}
      className={`glass-window flex flex-col overflow-hidden ${
        isActive ? 'active-window' : ''
      } ${isClosing ? 'window-anim-close' : 'window-anim-open'}`}
    >
      {/* Glassmorphic Titlebar */}
      <div
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onPointerCancel={handleTitlePointerUp}
        onDoubleClick={() => {
          if (!isMobile && resizable) onToggleMaximize(win.id);
        }}
        className="xp-titlebar px-3.5 py-2.5 flex items-center justify-between cursor-move select-none touch-none shrink-0"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
          <span className="font-mono text-xs font-bold tracking-wide text-slate-100 whitespace-nowrap">
            {isMobile && mobileTitle ? mobileTitle : title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              astroSound.playWindowPop(false);
              onMinimize(win.id);
            }}
            title="Minimize"
            className={`${
              isMobile ? 'px-2.5 h-7 text-[11px]' : 'w-7 h-7 text-xs'
            } rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center text-slate-200 font-mono transition-colors`}
          >
            {isMobile ? 'Hide' : '_'}
          </button>
          {resizable && !isMobile && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                astroSound.playKeyTap(600);
                onToggleMaximize(win.id);
              }}
              title={win.isMaximized ? 'Restore' : 'Maximize'}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center text-xs text-slate-200 transition-colors"
            >
              {win.isMaximized ? '❐' : '□'}
            </button>
          )}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            title="Close"
            className="w-7 h-7 rounded-lg bg-rose-500/35 hover:bg-rose-500/75 text-rose-100 flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-950/65">
        {children}
      </div>

      {/* Resize Handle */}
      {resizable && !isMaximized && (
        <div
          onPointerDown={handleResizePointerDown}
          title="Redimensionar ventana"
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-20 flex items-end justify-end p-1 text-white/40 hover:text-cyan-300"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 5L5 11M11 9L9 11" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </section>
  );
};
