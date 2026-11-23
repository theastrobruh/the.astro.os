import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ASTRO_CITY_WIDGET_IMG,
  COSMOS_WIDGET_IMG,
  DAHYUN_GIF_URL,
  DEFAULT_ADMIN_CONFIG,
  ICON_ORDER,
  THEME_PRESETS,
  WINDOW_META_LIST,
  WINDOW_META_MAP,
  createDefaultWidgets,
} from './constants/defaults';
import { DesktopBounds, stepPhysicsBodies } from './engine/physics';
import { astroSound } from './engine/sound';
import {
  AdminConfig,
  CollisionImpactEvent,
  DesktopIconConfig,
  MediaWidgetItem,
  PhysicsBody,
  PhysicsMode,
  PhysicsSettings,
  ThemeEffectsConfig,
  UserRole,
  WindowId,
  WindowRuntimeState,
} from './types/os';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { DesktopDrawCanvas } from './components/DesktopDrawCanvas';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DesktopIconItem } from './components/DesktopIconItem';
import { MediaWidgetItemView } from './components/MediaWidgetItemView';
import { WindowFrame } from './components/WindowFrame';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { TimezoneModal } from './components/TimezoneModal';
import { MobileStatusBar } from './components/MobileStatusBar';
import { AdminPinModal } from './components/AdminPinModal';
import { AstroVerseApp } from './components/apps/AstroVerseApp';
import { PaintApp } from './components/apps/PaintApp';
import { NotesApp } from './components/apps/NotesApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { ThemesApp } from './components/apps/ThemesApp';
import { MusicApp } from './components/apps/MusicApp';
import { MediaFlowApp } from './components/apps/MediaFlowApp';
import { CardGramApp } from './components/apps/CardGramApp';
import { IconManagerApp } from './components/apps/IconManagerApp';
import { YouTubeApp } from './components/apps/YouTubeApp';
import { AdminPanelApp } from './components/apps/AdminPanelApp';
import { globalMusic } from './engine/music';

const STORAGE_CONFIG_KEY = 'astro_os_v3_config';
const STORAGE_WIDGETS_KEY = 'astro_os_v3_widgets';
const STORAGE_TIMEZONES_KEY = 'astro_os_v3_timezones';

type ViewportTier = 'mobile' | 'tablet' | 'desktop';

function getViewportTier(vw: number): ViewportTier {
  if (vw < 768) return 'mobile';
  if (vw <= 1180) return 'tablet';
  return 'desktop';
}

function loadInitialConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (!raw) return DEFAULT_ADMIN_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_CONFIG,
      ...parsed,
      security: { ...DEFAULT_ADMIN_CONFIG.security, ...parsed.security },
      desktop: {
        ...DEFAULT_ADMIN_CONFIG.desktop,
        ...parsed.desktop,
        icons: { ...DEFAULT_ADMIN_CONFIG.desktop.icons, ...(parsed.desktop?.icons || {}) },
      },
      windows: { ...DEFAULT_ADMIN_CONFIG.windows, ...(parsed.windows || {}) },
      effects: { ...DEFAULT_ADMIN_CONFIG.effects, ...(parsed.effects || {}) },
      physics: { ...DEFAULT_ADMIN_CONFIG.physics, ...(parsed.physics || {}) },
    };
  } catch {
    return DEFAULT_ADMIN_CONFIG;
  }
}

function createResponsiveDefaultWidgets(vw: number, vh: number): MediaWidgetItem[] {
  const tier = getViewportTier(vw);
  if (tier === 'mobile') {
    const size = Math.min(110, Math.floor((vw - 48) / 3));
    const y = Math.max(330, vh - 190);
    const gap = Math.max(8, Math.floor((vw - size * 3 - 24) / 2));
    return [
      {
        id: 'media-widget-1',
        url: COSMOS_WIDGET_IMG,
        label: 'Cosmos.jpg',
        width: size,
        height: size,
        defaultWidth: 176,
        defaultHeight: 176,
        x: 12,
        y,
        visible: true,
        isGif: false,
        fallbackScene: 'cosmos',
      },
      {
        id: 'media-widget-2',
        url: ASTRO_CITY_WIDGET_IMG,
        label: 'AstroCity.png',
        width: size,
        height: size,
        defaultWidth: 196,
        defaultHeight: 148,
        x: 12 + size + gap,
        y,
        visible: true,
        isGif: false,
        fallbackScene: 'city',
      },
      {
        id: 'media-widget-3',
        url: DAHYUN_GIF_URL,
        label: 'Dahyun.gif',
        width: size,
        height: size,
        defaultWidth: 164,
        defaultHeight: 164,
        x: 12 + (size + gap) * 2,
        y,
        visible: true,
        isGif: true,
        fallbackScene: 'pulse',
      },
    ];
  }

  if (tier === 'tablet') {
    return [
      {
        id: 'media-widget-1',
        url: COSMOS_WIDGET_IMG,
        label: 'Cosmos.jpg',
        width: 156,
        height: 156,
        defaultWidth: 176,
        defaultHeight: 176,
        x: Math.max(240, vw - 188),
        y: 28,
        visible: true,
        isGif: false,
        fallbackScene: 'cosmos',
      },
      {
        id: 'media-widget-2',
        url: ASTRO_CITY_WIDGET_IMG,
        label: 'AstroCity.png',
        width: 184,
        height: 138,
        defaultWidth: 196,
        defaultHeight: 148,
        x: Math.max(240, vw - 220),
        y: Math.max(220, vh - 245),
        visible: true,
        isGif: false,
        fallbackScene: 'city',
      },
      {
        id: 'media-widget-3',
        url: DAHYUN_GIF_URL,
        label: 'Dahyun.gif',
        width: 150,
        height: 150,
        defaultWidth: 164,
        defaultHeight: 164,
        x: Math.round(vw * 0.44),
        y: Math.round(vh * 0.36),
        visible: true,
        isGif: true,
        fallbackScene: 'pulse',
      },
    ];
  }

  return createDefaultWidgets(vw, vh);
}

function loadInitialWidgets(): MediaWidgetItem[] {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 760;
  try {
    const raw = localStorage.getItem(STORAGE_WIDGETS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return createResponsiveDefaultWidgets(vw, vh);
}

function createInitialWindows(): Record<WindowId, WindowRuntimeState> {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 760;
  const result = {} as Record<WindowId, WindowRuntimeState>;

  WINDOW_META_LIST.forEach((meta, idx) => {
    const w = Math.min(meta.defaultWidth, Math.max(320, vw - 32));
    const h = Math.min(meta.defaultHeight, Math.max(280, vh - 96));
    const x = Math.max(14, Math.round((vw - w) / 2) + (idx % 3) * 16 - 16);
    const y = Math.max(14, Math.round((vh - 56 - h) / 2) + (idx % 3) * 14 - 14);
    result[meta.id] = {
      id: meta.id,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 30 + idx,
      x,
      y,
      width: w,
      height: h,
    };
  });

  return result;
}

function computeGridIconPositions(
  iconSize: number,
  gap: number,
  vw: number,
  vh: number
): Record<string, { x: number; y: number }> {
  const tier = getViewportTier(vw);
  const positions: Record<string, { x: number; y: number }> = {};

  if (tier === 'mobile') {
    // Clean centered 3-column smartphone app launcher grid
    const effectiveSize = Math.min(58, iconSize);
    const cellW = Math.max(88, Math.floor((vw - 24) / 3));
    const cellH = effectiveSize + 38;
    const cols = 3;
    const startX = Math.max(8, Math.round((vw - cellW * cols) / 2));
    const startY = 14;

    ICON_ORDER.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions[item.id] = {
        x: startX + col * cellW + Math.round((cellW - (effectiveSize + 24)) / 2),
        y: startY + row * (cellH + 8),
      };
    });
    return positions;
  }

  if (tier === 'tablet') {
    // Clean 2-column vertical left layout tailored for iPad / Tablets
    const cellW = Math.max(92, iconSize + 28);
    const cellH = iconSize + 38;
    const padTop = 20;
    const availH = Math.max(240, vh - 96);
    const rowsPerCol = Math.max(3, Math.floor(availH / (cellH + gap)));

    ICON_ORDER.forEach((item, index) => {
      const col = Math.floor(index / rowsPerCol);
      const row = index % rowsPerCol;
      positions[item.id] = {
        x: 20 + col * (cellW + 14),
        y: padTop + row * (cellH + gap),
      };
    });
    return positions;
  }

  // Desktop 2-column layout matching reference screenshot (5 rows per column)
  const cellW = Math.max(92, iconSize + 28);
  const cellH = iconSize + 38;
  const padTop = 18;
  const padLeft = 18;
  const rowsPerCol = 5;

  ICON_ORDER.forEach((item, index) => {
    const col = Math.floor(index / rowsPerCol);
    const row = index % rowsPerCol;
    const x = padLeft + col * (cellW + 12);
    const y = padTop + row * (cellH + gap);
    positions[item.id] = { x, y };
  });
  return positions;
}

export default function App() {
  const [config, setConfig] = useState<AdminConfig>(loadInitialConfig);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [widgets, setWidgets] = useState<MediaWidgetItem[]>(loadInitialWidgets);
  const [windows, setWindows] = useState<Record<WindowId, WindowRuntimeState>>(createInitialWindows);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const zCounterRef = useRef(40);

  const [viewportTier, setViewportTier] = useState<ViewportTier>(() =>
    typeof window !== 'undefined' ? getViewportTier(window.innerWidth) : 'desktop'
  );
  const isMobile = viewportTier === 'mobile';
  const isTablet = viewportTier === 'tablet';

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [desktopDrawActive, setDesktopDrawActive] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [timezoneModalOpen, setTimezoneModalOpen] = useState(false);
  const [adminPinModalOpen, setAdminPinModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TIMEZONES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return ['America/Lima', 'America/New_York', 'Europe/Madrid'];
  });

  const [ctxMenu, setCtxMenu] = useState<{
    open: boolean;
    widgetId: string;
    x: number;
    y: number;
  } | null>(null);
  const replaceWidgetImgRef = useRef<HTMLInputElement | null>(null);
  const newWidgetInputRef = useRef<HTMLInputElement | null>(null);
  const widgetToReplaceRef = useRef<string | null>(null);

  const desktopRef = useRef<HTMLElement | null>(null);
  const domMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const bodiesRef = useRef<Map<string, PhysicsBody>>(new Map());
  const impactsRef = useRef<CollisionImpactEvent[]>([]);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const physicsSettingsRef = useRef<PhysicsSettings>(config.physics);

  const effectiveIconSize = isMobile
    ? Math.min(58, config.desktop.iconSize)
    : isTablet
    ? Math.min(64, config.desktop.iconSize)
    : config.desktop.iconSize;

  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    computeGridIconPositions(
      config.desktop.iconSize,
      config.desktop.gridGap,
      typeof window !== 'undefined' ? window.innerWidth : 1280,
      typeof window !== 'undefined' ? window.innerHeight : 760
    )
  );

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2800);
    return () => clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    physicsSettingsRef.current = config.physics;
    astroSound.setEnabled(config.physics.soundEnabled);
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
    const root = document.documentElement.style;
    root.setProperty('--bg-top', config.effects.bgTop);
    root.setProperty('--bg-middle', config.effects.bgMiddle);
    root.setProperty('--bg-bottom', config.effects.bgBottom);
    root.setProperty('--primary-accent', config.effects.primaryAccent);
    root.setProperty('--secondary-accent', config.effects.secondaryAccent);
    root.setProperty('--glass-blur', `${config.effects.glassBlur}px`);
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WIDGETS_KEY, JSON.stringify(widgets));
    } catch {
      // ignore
    }
  }, [widgets]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent browser default context menu, inspect element, etc.
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_TIMEZONES_KEY, JSON.stringify(selectedTimezones));
  }, [selectedTimezones]);

  // Reflow icons and clamp widgets gracefully when crossing Mobile / Tablet / Desktop breakpoints
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nextTier = getViewportTier(vw);

      setViewportTier((prevTier) => {
        if (prevTier !== nextTier) {
          const nextIcons = computeGridIconPositions(
            config.desktop.iconSize,
            config.desktop.gridGap,
            vw,
            vh
          );
          setIconPositions(nextIcons);
          Object.entries(nextIcons).forEach(([id, pos]) => {
            const b = bodiesRef.current.get(id);
            if (b) {
              b.x = pos.x;
              b.y = pos.y;
              b.vx = 0;
              b.vy = 0;
              b.angle = 0;
            }
          });
        }
        return nextTier;
      });

      // Clamp widget bodies inside visible desktop bounds
      const maxRight = Math.max(240, vw - 16);
      const maxBottom = Math.max(240, vh - (nextTier === 'mobile' ? 115 : 70));
      setWidgets((prev) =>
        prev.map((w) => {
          const nx = Math.max(8, Math.min(w.x, maxRight - w.width));
          const ny = Math.max(8, Math.min(w.y, maxBottom - w.height));
          const b = bodiesRef.current.get(w.id);
          if (b) {
            b.x = Math.max(8, Math.min(b.x, maxRight - b.width));
            b.y = Math.max(8, Math.min(b.y, maxBottom - b.height));
          }
          return nx === w.x && ny === w.y ? w : { ...w, x: nx, y: ny };
        })
      );
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [config.desktop.iconSize, config.desktop.gridGap]);

  const registerElement = useCallback((id: string, el: HTMLElement | null) => {
    if (el) domMapRef.current.set(id, el);
    else domMapRef.current.delete(id);
  }, []);

  const getBody = useCallback((id: string) => bodiesRef.current.get(id), []);

  useEffect(() => {
    const bodies = bodiesRef.current;
    const activeIds = new Set<string>();

    ICON_ORDER.forEach((item) => {
      const cfg = config.desktop.icons[item.id];
      if (cfg && !cfg.visible) return;
      activeIds.add(item.id);
      const pos = iconPositions[item.id] || { x: 20, y: 20 };
      const w = Math.max(84, effectiveIconSize + 24);
      const h = effectiveIconSize + 34;
      const existing = bodies.get(item.id);
      if (existing) {
        existing.width = w;
        existing.height = h;
        existing.mass = w * h;
      } else {
        bodies.set(item.id, {
          id: item.id,
          kind: 'icon',
          x: pos.x,
          y: pos.y,
          width: w,
          height: h,
          vx: 0,
          vy: 0,
          angle: 0,
          angularVel: 0,
          targetAngle: 0,
          isDragging: false,
          scale: 1,
          mass: w * h,
        });
      }
    });

    widgets.forEach((widget) => {
      if (!widget.visible) return;
      activeIds.add(widget.id);
      const existing = bodies.get(widget.id);
      if (existing) {
        existing.width = widget.width;
        existing.height = widget.height;
        existing.mass = widget.width * widget.height * 1.4;
      } else {
        bodies.set(widget.id, {
          id: widget.id,
          kind: 'widget',
          x: widget.x,
          y: widget.y,
          width: widget.width,
          height: widget.height,
          vx: 0,
          vy: 0,
          angle: 0,
          angularVel: 0,
          targetAngle: 0,
          isDragging: false,
          scale: 1,
          mass: widget.width * widget.height * 1.4,
        });
      }
    });

    (Object.values(windows) as WindowRuntimeState[]).forEach((win) => {
      if (!win.isOpen || win.isMinimized || win.isMaximized || isMobile) return;
      activeIds.add(win.id);
      const existing = bodies.get(win.id);
      if (existing) {
        existing.width = win.width;
        existing.height = win.height;
        existing.mass = win.width * win.height * 3;
      } else {
        bodies.set(win.id, {
          id: win.id,
          kind: 'window',
          x: win.x,
          y: win.y,
          width: win.width,
          height: win.height,
          vx: 0,
          vy: 0,
          angle: 0,
          angularVel: 0,
          targetAngle: 0,
          isDragging: false,
          scale: 1,
          mass: win.width * win.height * 3,
        });
      }
    });

    Array.from(bodies.keys()).forEach((k) => {
      if (!activeIds.has(k)) bodies.delete(k);
    });
  }, [effectiveIconSize, config.desktop.icons, iconPositions, widgets, windows, isMobile]);

  useEffect(() => {
    const onPointerMoveGlobal = (e: PointerEvent) => {
      const desk = desktopRef.current;
      if (!desk) return;
      const rect = desk.getBoundingClientRect();
      cursorRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const desk = desktopRef.current;
      if (desk) {
        const bounds: DesktopBounds = {
          left: 6,
          top: 6,
          right: Math.max(260, desk.clientWidth - 6),
          bottom: Math.max(240, desk.clientHeight - 6),
        };

        const { impacts } = stepPhysicsBodies(
          bodiesRef.current,
          bounds,
          physicsSettingsRef.current,
          cursorRef.current,
          dt
        );

        if (impacts.length > 0) {
          const rect = desk.getBoundingClientRect();
          for (const imp of impacts) {
            impactsRef.current.push({
              ...imp,
              x: imp.x + rect.left,
              y: imp.y + rect.top,
            });
            astroSound.playImpact(imp.intensity * 1000);
          }
        }

        bodiesRef.current.forEach((b, id) => {
          const el = domMapRef.current.get(id);
          if (!el) return;
          el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${b.angle.toFixed(2)}deg) scale(${b.scale.toFixed(3)})`;
        });
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMoveGlobal);
    };
  }, []);

  const handleDragStartBody = useCallback((id: string) => {
    const b = bodiesRef.current.get(id);
    if (b) {
      b.isDragging = true;
      b.vx = 0;
      b.vy = 0;
    }
  }, []);

  const handleDragMoveBody = useCallback((id: string, x: number, y: number, instVx: number) => {
    const b = bodiesRef.current.get(id);
    if (b) {
      b.x = x;
      b.y = y;
      b.targetAngle = Math.max(-12, Math.min(12, instVx * 0.01));
    }
  }, []);

  const handleDragEndBody = useCallback((id: string, vx: number, vy: number) => {
    const b = bodiesRef.current.get(id);
    if (b) {
      b.isDragging = false;
      b.vx = vx;
      b.vy = vy;
      if (b.kind === 'window') {
        setWindows((prev) => {
          const w = prev[id as WindowId];
          if (!w) return prev;
          return { ...prev, [id]: { ...w, x: b.x, y: b.y } };
        });
      } else if (b.kind === 'widget') {
        setWidgets((prev) =>
          prev.map((w) => (w.id === id ? { ...w, x: Math.round(b.x), y: Math.round(b.y) } : w))
        );
      }
    }
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    zCounterRef.current += 1;
    const nextZ = zCounterRef.current;
    setActiveWindowId(id);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: nextZ, isMinimized: false },
    }));
  }, []);

  const openWindow = useCallback(
    (id: WindowId) => {
      if (id === 'win-admin' && userRole !== 'admin') {
        setAdminPinModalOpen(true);
        return;
      }
      zCounterRef.current += 1;
      const nextZ = zCounterRef.current;
      setActiveWindowId(id);
      setWindows((prev) => {
        const cur = prev[id];
        const cfg = config.windows[id];
        const w = cfg ? Math.min(cfg.width, window.innerWidth - 28) : cur.width;
        const h = cfg ? Math.min(cfg.height, window.innerHeight - 86) : cur.height;
        const x = cur.isOpen ? cur.x : Math.max(14, Math.round((window.innerWidth - w) / 2));
        const y = cur.isOpen ? cur.y : Math.max(12, Math.round((window.innerHeight - 58 - h) / 2));
        return {
          ...prev,
          [id]: {
            ...cur,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
            width: w,
            height: h,
            x,
            y,
          },
        };
      });
    },
    [userRole, config.windows]
  );

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const toggleMaximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const [musicInTray, setMusicInTray] = useState(false);

  const closeWindow = useCallback((id: WindowId) => {
    if (id === 'win-music') {
      // Ares-style minimize to system tray instead of closing
      setMusicInTray(true);
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isMinimized: true },
      }));
      setActiveWindowId((cur) => (cur === id ? null : cur));
      showToast('Music minimized to system tray (Ares style)');
      return;
    }
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false },
    }));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, [showToast]);

  const restoreMusicFromTray = useCallback(() => {
    setMusicInTray(false);
    focusWindow('win-music');
  }, [focusWindow]);

  const closeMusicPermanently = useCallback(() => {
    setMusicInTray(false);
    globalMusic.stopCompletely();
    setWindows((prev) => ({
      ...prev,
      ['win-music']: { ...prev['win-music'], isOpen: false, isMinimized: false },
    }));
    setActiveWindowId((cur) => (cur === 'win-music' ? null : cur));
    showToast('Music closed and stopped');
  }, [showToast]);

  const handleTaskbarWindowClick = useCallback(
    (id: WindowId) => {
      const w = windows[id];
      if (!w) return;
      if (w.isMinimized || activeWindowId !== id) {
        focusWindow(id);
      } else {
        minimizeWindow(id);
      }
    },
    [windows, activeWindowId, focusWindow, minimizeWindow]
  );

  const handleResizeWindow = useCallback((id: WindowId, width: number, height: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], width, height },
    }));
  }, []);

  const rearrangeIcons = useCallback(() => {
    const next = computeGridIconPositions(
      config.desktop.iconSize,
      config.desktop.gridGap,
      window.innerWidth,
      window.innerHeight
    );
    setIconPositions(next);
    Object.entries(next).forEach(([id, pos]) => {
      const b = bodiesRef.current.get(id);
      if (b) {
        b.x = pos.x;
        b.y = pos.y;
        b.vx = 0;
        b.vy = 0;
        b.angle = 0;
      }
    });
    showToast('Íconos reordenados en cuadrícula');
  }, [config.desktop.iconSize, config.desktop.gridGap, showToast]);

  const triggerImpulseBurst = useCallback(() => {
    astroSound.playImpact(950);
    bodiesRef.current.forEach((b) => {
      if (b.kind === 'window') return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 420 + Math.random() * 580;
      b.vx += Math.cos(angle) * speed;
      b.vy += Math.sin(angle) * speed - (physicsSettingsRef.current.mode === 'earth' ? 420 : 0);
      b.angularVel += (Math.random() - 0.5) * 40;
    });
    showToast('¡Impulso cósmico aplicado!');
  }, [showToast]);

  const changePhysicsMode = useCallback(
    (mode: PhysicsMode) => {
      setConfig((prev) => ({
        ...prev,
        physics: { ...prev.physics, mode },
      }));
      if (mode === 'zero-g') {
        bodiesRef.current.forEach((b) => {
          if (b.kind !== 'window') {
            b.vx += (Math.random() - 0.5) * 90;
            b.vy += (Math.random() - 0.5) * 90;
          }
        });
      }
      const names: Record<PhysicsMode, string> = {
        tactile: 'Inercia Táctil + Colisiones',
        earth: 'Gravedad Terrestre (9.8 m/s²)',
        'zero-g': 'Gravedad Zero-G Orbital',
        static: 'Modo Clásico Fijo',
      };
      showToast(`Física: ${names[mode]}`);
    },
    [showToast]
  );

  const spawnWidget = useCallback(
    (opts: {
      url: string;
      label: string;
      isGif?: boolean;
      fallbackScene?: 'cosmos' | 'city' | 'pulse' | 'saturn' | 'prism';
    }) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const id = `media-widget-${Date.now()}-${Math.floor(Math.random() * 999)}`;
      const size = isMobile ? 124 : 172;
      const newWidget: MediaWidgetItem = {
        id,
        url: opts.url,
        label: opts.label,
        width: size,
        height: size,
        defaultWidth: size,
        defaultHeight: size,
        x: Math.round(Math.max(16, vw * 0.45 + (Math.random() - 0.5) * 100 - size / 2)),
        y: Math.round(Math.max(24, vh * 0.35 + (Math.random() - 0.5) * 90 - size / 2)),
        visible: true,
        isGif: opts.isGif || opts.url.toLowerCase().includes('.gif'),
        fallbackScene: opts.fallbackScene || 'pulse',
      };
      setWidgets((prev) => [...prev, newWidget]);
      showToast(`Widget "${opts.label}" añadido al escritorio`);
    },
    [isMobile, showToast]
  );

  const handleNewWidgetFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          spawnWidget({
            url: reader.result,
            label: file.name,
            isGif: file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif'),
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleReplaceWidgetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = widgetToReplaceRef.current;
    if (!file || !targetId) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setWidgets((prev) =>
          prev.map((w) =>
            w.id === targetId
              ? {
                  ...w,
                  url: reader.result as string,
                  label: file.name,
                  isGif: file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif'),
                }
              : w
          )
        );
        showToast('Imagen del widget actualizada');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const applyThemePreset = useCallback(
    (presetId: string) => {
      const found = THEME_PRESETS.find((p) => p.id === presetId);
      if (!found) return;
      setConfig((prev) => ({
        ...prev,
        effects: {
          ...prev.effects,
          bgTop: found.top,
          bgMiddle: found.mid,
          bgBottom: found.bot,
          primaryAccent: found.primary,
          secondaryAccent: found.secondary,
        },
      }));
      showToast(`Tema "${found.name}" aplicado`);
    },
    [showToast]
  );

  const desktopIcons: DesktopIconConfig[] = useMemo(() => {
    return ICON_ORDER.map((item) => {
      const cfg = config.desktop.icons[item.id];
      return {
        id: item.id,
        winId: item.winId,
        name: cfg?.name || item.defaultName,
        visible: cfg ? cfg.visible : true,
        customImage: cfg?.customImage,
      };
    });
  }, [config.desktop.icons]);

  const getWindowTitle = (id: WindowId) =>
    config.windows[id]?.title || WINDOW_META_MAP[id].title;

  return (
    <div
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
        if (ctxMenu) setCtxMenu(null);
      }}
      className="astro-wallpaper relative w-full h-full flex flex-col overflow-hidden"
    >
      <StarfieldCanvas
        starCount={config.effects.starCount}
        starSpeed={config.effects.starSpeed}
        impactsRef={impactsRef}
      />

      <div className="astro-vignette fixed inset-0 z-0" />

      {userRole === null && (
        <WelcomeScreen
          osTitle={config.security.osTitle}
          adminPin={config.security.adminPin}
          onEnter={(role) => {
            setUserRole(role);
            showToast(
              role === 'admin'
                ? 'Sesión de Administrador iniciada'
                : 'Bienvenido a the.astro.os (Invitado)'
            );
          }}
        />
      )}

      {isMobile && (
        <MobileStatusBar
          osTitle={config.security.osTitle}
          primaryTimezone={selectedTimezones[0] || 'America/Lima'}
          physicsMode={config.physics.mode}
          soundEnabled={config.physics.soundEnabled}
          onToggleSound={() =>
            setConfig((p) => ({
              ...p,
              physics: { ...p.physics, soundEnabled: !p.physics.soundEnabled },
            }))
          }
          onOpenTimezoneModal={() => setTimezoneModalOpen(true)}
        />
      )}

      <DesktopDrawCanvas
        active={desktopDrawActive}
        onExit={() => setDesktopDrawActive(false)}
      />

      <main
        ref={desktopRef}
        onPointerDown={() => setSelectedWidgetId(null)}
        className="relative flex-1 w-full min-h-0 overflow-hidden z-10"
      >
        {desktopIcons.map((icon) => {
          const pos = iconPositions[icon.id] || { x: 20, y: 20 };
          return (
            <DesktopIconItem
              key={icon.id}
              icon={icon}
              iconSize={effectiveIconSize}
              fontSize={config.desktop.fontSize}
              isLockedAdmin={icon.winId === 'win-admin' && userRole !== 'admin'}
              initialX={pos.x}
              initialY={pos.y}
              registerElement={registerElement}
              getBody={getBody}
              onOpenWindow={openWindow}
              onDragStartBody={handleDragStartBody}
              onDragMoveBody={handleDragMoveBody}
              onDragEndBody={handleDragEndBody}
            />
          );
        })}

        {widgets.map((widget) => (
          <MediaWidgetItemView
            key={widget.id}
            widget={widget}
            isSelected={selectedWidgetId === widget.id}
            registerElement={registerElement}
            getBody={getBody}
            onSelect={(id) => setSelectedWidgetId(id)}
            onContextMenu={(id, clientX, clientY) =>
              setCtxMenu({
                open: true,
                widgetId: id,
                x: Math.min(window.innerWidth - 190, clientX),
                y: Math.min(window.innerHeight - 170, clientY),
              })
            }
            onResize={(id, width, height) =>
              setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)))
            }
            onDragStartBody={handleDragStartBody}
            onDragMoveBody={handleDragMoveBody}
            onDragEndBody={handleDragEndBody}
          />
        ))}

        {WINDOW_META_LIST.map((meta) => {
          const win = windows[meta.id];
          return (
            <WindowFrame
              key={meta.id}
              win={win}
              title={getWindowTitle(meta.id)}
              accentColor={meta.accentColor}
              isActive={activeWindowId === meta.id}
              isMobile={isMobile}
              isTablet={isTablet}
              resizable={meta.resizable}
              registerElement={registerElement}
              getBody={getBody}
              onFocus={focusWindow}
              onMinimize={minimizeWindow}
              onToggleMaximize={toggleMaximizeWindow}
              onClose={closeWindow}
              onResize={handleResizeWindow}
              onDragStartBody={handleDragStartBody}
              onDragMoveBody={handleDragMoveBody}
              onDragEndBody={handleDragEndBody}
            >
              {meta.id === 'win-astroverse' && <AstroVerseApp onOpenWindow={openWindow} />}
              {meta.id === 'win-draw' && (
                <PaintApp
                  onPinToDesktop={(url, label) => spawnWidget({ url, label, isGif: false })}
                  onToast={showToast}
                />
              )}
              {meta.id === 'win-notes' && <NotesApp />}
              {meta.id === 'win-terminal' && (
                <TerminalApp
                  userRole={userRole}
                  physicsMode={config.physics.mode}
                  onOpenWindow={openWindow}
                  onToggleDesktopDraw={() => setDesktopDrawActive((v) => !v)}
                  onChangePhysicsMode={changePhysicsMode}
                  onImpulseBurst={triggerImpulseBurst}
                  onApplyThemePreset={applyThemePreset}
                />
              )}
              {meta.id === 'win-themes' && (
                <ThemesApp
                  effects={config.effects}
                  physics={config.physics}
                  onUpdateEffects={(patch: Partial<ThemeEffectsConfig>) =>
                    setConfig((p) => ({ ...p, effects: { ...p.effects, ...patch } }))
                  }
                  onApplyPreset={applyThemePreset}
                  onUpdatePhysics={(patch: Partial<PhysicsSettings>) =>
                    setConfig((p) => ({ ...p, physics: { ...p.physics, ...patch } }))
                  }
                />
              )}
              {meta.id === 'win-music' && <MusicApp />}
              {meta.id === 'win-mediaflow' && (
                <MediaFlowApp onSpawnWidget={spawnWidget} onToast={showToast} />
              )}
              {meta.id === 'win-cardgram' && <CardGramApp />}
              {meta.id === 'win-youtube' && <YouTubeApp />}
              {meta.id === 'win-icon-manager' && (
                <IconManagerApp
                  icons={desktopIcons}
                  onSetCustomImage={(iconId, customImage) =>
                    setConfig((p) => ({
                      ...p,
                      desktop: {
                        ...p.desktop,
                        icons: {
                          ...p.desktop.icons,
                          [iconId]: {
                            ...(p.desktop.icons[iconId] || { name: iconId, visible: true }),
                            customImage,
                          },
                        },
                      },
                    }))
                  }
                  onResetAll={() => {
                    setConfig((p) => {
                      const nextIcons = { ...p.desktop.icons };
                      Object.keys(nextIcons).forEach((k) => {
                        nextIcons[k] = { ...nextIcons[k], customImage: undefined };
                      });
                      return { ...p, desktop: { ...p.desktop, icons: nextIcons } };
                    });
                    showToast('Íconos restaurados a su diseño original');
                  }}
                />
              )}
              {meta.id === 'win-admin' && (
                <AdminPanelApp
                  config={config}
                  widgets={widgets}
                  onUpdateConfig={setConfig}
                  onUpdateEffects={(patch) =>
                    setConfig((p) => ({ ...p, effects: { ...p.effects, ...patch } }))
                  }
                  onApplyThemePreset={applyThemePreset}
                  onUpdatePhysics={(patch) =>
                    setConfig((p) => ({ ...p, physics: { ...p.physics, ...patch } }))
                  }
                  onImpulseBurst={triggerImpulseBurst}
                  onRearrangeIcons={rearrangeIcons}
                  onUpdateWidget={(id, patch) =>
                    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
                  }
                  onDeleteWidget={(id) =>
                    setWidgets((prev) => prev.filter((w) => w.id !== id))
                  }
                  onSpawnWidget={spawnWidget}
                  onResetWidgets={() => {
                    setWidgets(createResponsiveDefaultWidgets(window.innerWidth, window.innerHeight));
                    showToast('Widgets restaurados');
                  }}
                  onFactoryReset={() => {
                    localStorage.removeItem(STORAGE_CONFIG_KEY);
                    localStorage.removeItem(STORAGE_WIDGETS_KEY);
                    setConfig(DEFAULT_ADMIN_CONFIG);
                    setWidgets(createResponsiveDefaultWidgets(window.innerWidth, window.innerHeight));
                    showToast('Sistema restaurado a valores de fábrica');
                  }}
                  onLogout={() => {
                    closeWindow('win-admin');
                    setUserRole(null);
                  }}
                  onToast={showToast}
                />
              )}
            </WindowFrame>
          );
        })}
      </main>

      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        startMenuOpen={startMenuOpen}
        desktopDrawActive={desktopDrawActive}
        physicsMode={config.physics.mode}
        soundEnabled={config.physics.soundEnabled}
        selectedTimezones={selectedTimezones}
        isMobile={isMobile}
        musicClosedToTray={musicInTray}
        onToggleStartMenu={() => setStartMenuOpen((v) => !v)}
        onRearrangeIcons={rearrangeIcons}
        onToggleDesktopDraw={() => setDesktopDrawActive((v) => !v)}
        onOpenWindow={openWindow}
        onTaskbarWindowClick={handleTaskbarWindowClick}
        onChangePhysicsMode={changePhysicsMode}
        onImpulseBurst={triggerImpulseBurst}
        onToggleSound={() =>
          setConfig((p) => ({
            ...p,
            physics: { ...p.physics, soundEnabled: !p.physics.soundEnabled },
          }))
        }
        onOpenTimezoneModal={() => setTimezoneModalOpen(true)}
        onRestoreMusic={restoreMusicFromTray}
        onCloseMusicPermanently={closeMusicPermanently}
      />

      <StartMenu
        open={startMenuOpen}
        osTitle={config.security.osTitle}
        userRole={userRole}
        onClose={() => setStartMenuOpen(false)}
        onOpenWindow={openWindow}
        onToggleDesktopDraw={() => setDesktopDrawActive((v) => !v)}
        onNewImageWidget={() => newWidgetInputRef.current?.click()}
        onRearrangeIcons={rearrangeIcons}
        onImpulseBurst={triggerImpulseBurst}
        onLogout={() => setUserRole(null)}
      />

      {ctxMenu?.open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ left: ctxMenu.x, top: ctxMenu.y }}
          className="fixed z-50 w-52 bg-slate-950/95 backdrop-blur-xl border border-white/20 rounded-xl p-1.5 shadow-2xl space-y-0.5"
        >
          <button
            onClick={() => {
              const src = widgets.find((w) => w.id === ctxMenu.widgetId);
              if (src) {
                const currentBody = bodiesRef.current.get(src.id);
                const baseX = currentBody ? currentBody.x : src.x;
                const baseY = currentBody ? currentBody.y : src.y;

                const newId = `widget-clone-${Date.now()}`;
                const offset = 36;
                const newX = Math.max(16, Math.min(window.innerWidth - src.width - 24, baseX + offset));
                const newY = Math.max(16, Math.min(window.innerHeight - src.height - 76, baseY + offset));

                const cloned: MediaWidgetItem = {
                  ...src,
                  id: newId,
                  label: `${src.label} (Copy)`,
                  x: Math.round(newX),
                  y: Math.round(newY),
                };

                // Initialize physics body immediately at exact spawn location
                bodiesRef.current.set(newId, {
                  id: newId,
                  kind: 'widget',
                  x: newX,
                  y: newY,
                  width: src.width,
                  height: src.height,
                  vx: (Math.random() - 0.5) * 450,
                  vy: -280,
                  angle: (Math.random() - 0.5) * 12,
                  angularVel: (Math.random() - 0.5) * 18,
                  targetAngle: 0,
                  isDragging: false,
                  scale: 1,
                  mass: src.width * src.height * 1.4,
                });

                setWidgets((prev) => [...prev, cloned]);
                astroSound.playStartupChime();
                showToast(`Widget cloned: ${src.label}`);
              }
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-cyan-500/20 text-left text-xs font-mono text-cyan-300 font-bold transition-colors flex items-center justify-between"
          >
            <span>✨ Duplicate / Clone</span>
            <span className="text-[10px] text-cyan-400">Clone</span>
          </button>
          <div className="h-px bg-white/10 my-0.5" />
          <button
            onClick={() => {
              widgetToReplaceRef.current = ctxMenu.widgetId;
              replaceWidgetImgRef.current?.click();
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-left text-xs font-mono text-slate-200 transition-colors"
          >
            Change Image / GIF
          </button>
          <button
            onClick={() => {
              setWidgets((prev) =>
                prev.map((w) =>
                  w.id === ctxMenu.widgetId
                    ? { ...w, width: w.defaultWidth, height: w.defaultHeight }
                    : w
                )
              );
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-left text-xs font-mono text-slate-200 transition-colors"
          >
            Reset Size
          </button>
          <button
            onClick={() => {
              const b = bodiesRef.current.get(ctxMenu.widgetId);
              if (b) {
                b.vx += (Math.random() - 0.5) * 900;
                b.vy -= 550;
                b.angularVel += (Math.random() - 0.5) * 45;
              }
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-left text-xs font-mono text-pink-300 transition-colors"
          >
            ⚡ Throw Widget
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => {
              setWidgets((prev) => prev.filter((w) => w.id !== ctxMenu.widgetId));
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-rose-500/20 text-left text-xs font-mono text-rose-400 transition-colors"
          >
            Delete Widget
          </button>
        </div>
      )}

      <input
        ref={newWidgetInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleNewWidgetFiles}
        className="hidden"
      />
      <input
        ref={replaceWidgetImgRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceWidgetImage}
        className="hidden"
      />

      <TimezoneModal
        open={timezoneModalOpen}
        selected={selectedTimezones}
        onClose={() => setTimezoneModalOpen(false)}
        onSave={(next) => {
          setSelectedTimezones(next);
          showToast('Zonas horarias actualizadas');
        }}
      />

      <AdminPinModal
        open={adminPinModalOpen}
        adminPin={config.security.adminPin}
        onClose={() => setAdminPinModalOpen(false)}
        onSuccess={() => {
          setUserRole('admin');
          setAdminPinModalOpen(false);
          zCounterRef.current += 1;
          setActiveWindowId('win-admin');
          setWindows((prev) => ({
            ...prev,
            'win-admin': {
              ...prev['win-admin'],
              isOpen: true,
              isMinimized: false,
              zIndex: zCounterRef.current,
            },
          }));
          showToast('Acceso de Administrador concedido');
        }}
      />

      {toastMsg && (
        <div className="fixed bottom-16 right-5 z-50 bg-slate-950/90 border border-pink-400/45 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
          <span className="text-xs font-mono text-slate-100">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
