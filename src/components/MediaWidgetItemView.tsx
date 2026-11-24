import React, { useRef } from 'react';
import { MediaWidgetItem, PhysicsBody } from '../types/os';
import { PointerVelocityTracker } from '../engine/physics';
import { AnimatedWidgetVisual } from './AnimatedWidgetVisual';

interface MediaWidgetItemViewProps {
  widget: MediaWidgetItem;
  isSelected: boolean;
  registerElement: (id: string, el: HTMLElement | null) => void;
  getBody: (id: string) => PhysicsBody | undefined;
  onSelect: (id: string) => void;
  onContextMenu: (id: string, clientX: number, clientY: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDragStartBody: (id: string, grabOffsetX: number, grabOffsetY: number) => void;
  onDragMoveBody: (id: string, x: number, y: number, instVx: number, instVy: number) => void;
  onDragEndBody: (id: string, vx: number, vy: number) => void;
}

export const MediaWidgetItemView: React.FC<MediaWidgetItemViewProps> = ({
  widget,
  isSelected,
  registerElement,
  getBody,
  onSelect,
  onContextMenu,
  onResize,
  onDragStartBody,
  onDragMoveBody,
  onDragEndBody,
}) => {
  const trackerRef = useRef(new PointerVelocityTracker());
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    startBodyX: 0,
    startBodyY: 0,
    lastClientX: 0,
    lastClientY: 0,
    lastTime: 0,
  });

  if (!widget.visible) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) return;
    if ((e.target as HTMLElement).dataset.resizeHandle === 'true') return;
    e.stopPropagation();
    onSelect(widget.id);

    const body = getBody(widget.id);
    const sx = body ? body.x : widget.x;
    const sy = body ? body.y : widget.y;

    const rect = e.currentTarget.getBoundingClientRect();
    const grabOffsetX = e.clientX - (rect.left + rect.width * 0.5);
    const grabOffsetY = e.clientY - (rect.top + rect.height * 0.5);

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startBodyX: sx,
      startBodyY: sy,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      lastTime: performance.now(),
    };
    trackerRef.current.reset(e.clientX, e.clientY);
    onDragStartBody(widget.id, grabOffsetX, grabOffsetY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return;
    const now = performance.now();
    const dt = Math.max(0.004, (now - dragRef.current.lastTime) / 1000);
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 4) {
      dragRef.current.moved = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    const instVx = (e.clientX - dragRef.current.lastClientX) / dt;
    const instVy = (e.clientY - dragRef.current.lastClientY) / dt;

    dragRef.current.lastClientX = e.clientX;
    dragRef.current.lastClientY = e.clientY;
    dragRef.current.lastTime = now;
    trackerRef.current.push(e.clientX, e.clientY);

    onDragMoveBody(
      widget.id,
      dragRef.current.startBodyX + dx,
      dragRef.current.startBodyY + dy,
      instVx,
      instVy
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return;
    dragRef.current.active = false;
    dragRef.current.pointerId = -1;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    const { vx, vy } = trackerRef.current.getVelocity();
    onDragEndBody(widget.id, vx, vy);
  };

  const handleResizeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(widget.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = widget.width;
    const startH = widget.height;
    const aspect = startW / Math.max(1, startH);

    const onMove = (ev: PointerEvent) => {
      const nextW = Math.max(84, Math.min(460, startW + (ev.clientX - startX)));
      let nextH = Math.max(84, Math.min(460, startH + (ev.clientY - startY)));
      if (ev.shiftKey) {
        nextH = Math.round(nextW / aspect);
      }
      onResize(widget.id, Math.round(nextW), Math.round(nextH));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={(el) => registerElement(widget.id, el)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(widget.id);
        onContextMenu(widget.id, e.clientX, e.clientY);
      }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: widget.width,
        height: widget.height,
        transform: `translate3d(${widget.x}px, ${widget.y}px, 0)`,
        willChange: 'transform',
      }}
      className={`group rounded-2xl p-1 bg-black/45 border backdrop-blur-md shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none z-[8] transition-colors ${
        widget.id.includes('clone') ? 'animate-clone-spawn' : ''
      } ${
        isSelected
          ? 'border-cyan-400/80 shadow-[0_0_0_1px_rgba(0,240,255,0.45),0_18px_40px_rgba(0,0,0,0.65)]'
          : 'border-white/20 hover:border-pink-400/50'
      }`}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden pointer-events-none">
        <AnimatedWidgetVisual
          url={widget.url}
          label={widget.label}
          fallbackScene={widget.fallbackScene}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] opacity-60 pointer-events-none" />
        {(widget.isGif || widget.url.toLowerCase().includes('.gif')) && (
          <span className="absolute top-1.5 right-1.5 text-[8px] sm:text-[9px] font-mono font-bold text-pink-300 bg-black/80 px-1.5 py-0.5 rounded shrink-0">
            GIF
          </span>
        )}
        <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-center sm:justify-start">
          <span className="text-[9px] sm:text-[10px] font-mono text-cyan-200 bg-black/75 px-1.5 py-0.5 rounded whitespace-nowrap leading-tight">
            {widget.label}
          </span>
        </div>
      </div>

      {/* Bottom-right resize grip */}
      <div
        data-resize-handle="true"
        onPointerDown={handleResizeDown}
        title="Arrastrar para cambiar tamaño (Shift mantiene proporción)"
        className="absolute bottom-1 right-1 w-4 h-4 rounded-tl-md bg-black/60 text-white/60 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-nwse-resize"
      >
        <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 4L4 10M10 8L8 10" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
