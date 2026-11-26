import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  COSMOS_WIDGET_IMG,
  DAHYUN_GIF_URL,
  DEFAULT_ADMIN_CONFIG,
  ICON_ORDER,
  THEME_PRESETS,
  WINDOW_META_LIST,
  WINDOW_META_MAP,
  createDefaultWidgets,
} from './constants/defaults';
import {
  AdminConfig,
  CollisionImpactEvent,
  MediaWidgetItem,
  PhysicsBody,
  PhysicsMode,
  PhysicsSettings,
  ThemeEffectsConfig,
  UserRole,
  WindowId,
  WindowRuntimeState,
} from './types/os';
import { DesktopBounds, computeRectInertia, stepPhysicsBodies } from './engine/physics';
import { astroSound } from './engine/sound';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { BootScreen } from './components/BootScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MobileStatusBar } from './components/MobileStatusBar';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { DesktopDrawCanvas } from './components/DesktopDrawCanvas';
import { DesktopIconItem, renderDefaultSvg } from './components/DesktopIconItem';
import { MediaWidgetItemView } from './components/MediaWidgetItemView';
import { WindowFrame } from './components/WindowFrame';
import { TimezoneModal } from './components/TimezoneModal';
import { AdminPinModal } from './components/AdminPinModal';
import { AstroVerseApp } from './components/apps/AstroVerseApp';
import { PaintApp } from './components/apps/PaintApp';
import { NotesApp } from './components/apps/NotesApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { ThemesApp } from './components/apps/ThemesApp';
import { MusicApp } from './components/apps/MusicApp';
import { MediaFlowApp } from './components/apps/MediaFlowApp';
import { PressmarkApp } from './components/apps/PressmarkApp';
import { AstroChessApp } from './components/apps/AstroChessApp';
import { AstroStudioApp } from './components/apps/AstroStudioApp';
import { AstroUpscalerApp } from './components/apps/AstroUpscalerApp';
import { BioHubApp } from './components/apps/BioHubApp';
import { CardGramApp } from './components/apps/CardGramApp';
import { InkraApp } from './components/apps/InkraApp';
import { IconManagerApp } from './components/apps/IconManagerApp';
import { YouTubeApp } from './components/apps/YouTubeApp';
import { AdminPanelApp } from './components/apps/AdminPanelApp';
import { globalMusic } from './engine/music';

const STORAGE_CONFIG_KEY = 'astro_os_v7_config';
const STORAGE_WIDGETS_KEY = 'astro_os_v6_widgets';
const STORAGE_TIMEZONES_KEY = 'astro_os_v4_timezones';

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
    const size = Math.min(92, Math.floor((vw - 44) / 3.6));
    const mainH = Math.max(460, vh - 84);
    const y = Math.max(388, mainH - size - 14);
    const centerX = Math.round(vw * 0.5);
    return [
      {
        id: 'media-widget-3',
        url: DAHYUN_GIF_URL,
        label: 'Dahyun.gif',
        width: size,
        height: size,
        defaultWidth: size,
        defaultHeight: size,
        x: Math.max(12, centerX - size - 10),
        y,
        visible: true,
        isGif: true,
        fallbackScene: 'pulse',
      },
      {
        id: 'media-widget-1',
        url: COSMOS_WIDGET_IMG,
        label: 'Cosmos.jpg',
        width: size,
        height: size,
        defaultWidth: size,
        defaultHeight: size,
        x: Math.min(vw - size - 12, centerX + 10),
        y,
        visible: true,
        isGif: false,
        fallbackScene: 'cosmos',
      },
    ];
  }
  if (tier === 'tablet') {
    return [
      {
        id: 'media-widget-3',
        url: DAHYUN_GIF_URL,
        label: 'Dahyun.gif',
        width: 132,
        height: 152,
        defaultWidth: 132,
        defaultHeight: 152,
        x: Math.max(240, vw - 332),
        y: 28,
        visible: true,
        isGif: true,
        fallbackScene: 'pulse',
      },
      {
        id: 'media-widget-1',
        url: COSMOS_WIDGET_IMG,
        label: 'Cosmos.jpg',
        width: 156,
        height: 156,
        defaultWidth: 156,
        defaultHeight: 156,
        x: Math.max(240, vw - 184),
        y: 28,
        visible: true,
        isGif: false,
        fallbackScene: 'cosmos',
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
    const isAstroVerse = meta.id === 'win-astroverse';
    const startsMaximized =
      meta.id === 'win-pressmark' || meta.id === 'win-astrochess' || meta.id === 'win-astrostudio' || meta.id === 'win-astroupscaler' || meta.id === 'win-biohub' || meta.id === 'win-cardgram' || meta.id === 'win-inkra';

    result[meta.id] = {
      id: meta.id,
      isOpen: isAstroVerse,
      isMinimized: false,
      isMaximized: startsMaximized,
      zIndex: isAstroVerse ? 50 : 30 + idx,
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
    const effectiveSize = Math.min(52, iconSize);
    const cellW = Math.max(98, Math.floor((vw - 16) / 3));
    const cellH = effectiveSize + 36;
    const cols = 3;
    const startX = Math.max(6, Math.round((vw - cellW * cols) / 2));
    const startY = 10;
    ICON_ORDER.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions[item.id] = {
        x: startX + col * cellW + Math.round((cellW - Math.max(92, effectiveSize + 30)) / 2),
        y: startY + row * (cellH + 4),
      };
    });
    return positions;
  }

  if (tier === 'tablet') {
    const cellW = Math.max(112, iconSize + 44);
    const cellH = iconSize + 44;
    const padTop = 18;
    const availH = Math.max(240, vh - 96);
    const rowsPerCol = Math.max(3, Math.floor(availH / (cellH + gap)));
    ICON_ORDER.forEach((item, index) => {
      const col = Math.floor(index / rowsPerCol);
      const row = index % rowsPerCol;
      positions[item.id] = {
        x: 18 + col * (cellW + 14),
        y: padTop + row * (cellH + gap),
      };
    });
    return positions;
  }

  const cellW = Math.max(114, iconSize + 44);
  const cellH = iconSize + 44;
  const padTop = 18;
  const padLeft = 18;
  const rowsPerCol = 5;

  ICON_ORDER.forEach((item, index) => {
    const col = Math.floor(index / rowsPerCol);
    const row = index % rowsPerCol;
    positions[item.id] = {
      x: padLeft + col * (cellW + 14),
      y: padTop + row * (cellH + gap),
    };
  });
  return positions;
}

export default function App() {
  const [config, setConfig] = useState<AdminConfig>(loadInitialConfig);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isBooting, setIsBooting] = useState(true);
  const [widgets, setWidgets] = useState<MediaWidgetItem[]>(loadInitialWidgets);
  const [windows, setWindows] = useState<Record<WindowId, WindowRuntimeState>>(createInitialWindows);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('win-astroverse');
  const zCounterRef = useRef(52);

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
  const [openFolder, setOpenFolder] = useState<{
    id: string;
    name: string;
    x: number;
    y: number;
    apps: Array<{ winId: WindowId; name: string }>;
  } | null>(null);
  const [musicInTray, setMusicInTray] = useState(false);

  const [ctxMenu, setCtxMenu] = useState<{ open: boolean; widgetId: string; x: number; y: number } | null>(null);

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
    return ['America/Lima', 'America/New_York'];
  });

  const effectiveIconSize = isMobile ? Math.min(52, config.desktop.iconSize) : config.desktop.iconSize;

  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    computeGridIconPositions(
      config.desktop.iconSize,
      config.desktop.gridGap,
      typeof window !== 'undefined' ? window.innerWidth : 1280,
      typeof window !== 'undefined' ? window.innerHeight : 760
    )
  );

  const desktopRef = useRef<HTMLDivElement | null>(null);
  const domMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const bodiesRef = useRef<Map<string, PhysicsBody>>(new Map());
  const cursorRef = useRef({ x: -999, y: -999, active: false });
  const impactsRef = useRef<CollisionImpactEvent[]>([]);
  const physicsSettingsRef = useRef(config.physics);
  const newWidgetInputRef = useRef<HTMLInputElement | null>(null);
  const replaceWidgetImgRef = useRef<HTMLInputElement | null>(null);
  const widgetToReplaceRef = useRef<string | null>(null);

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
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_TIMEZONES_KEY, JSON.stringify(selectedTimezones));
  }, [selectedTimezones]);

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
              b.angularVel = 0;
            }
          });
        }
        return nextTier;
      });

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

  // Synchronize React items into rigid-body physics map
  useEffect(() => {
    const bodies = bodiesRef.current;
    const activeIds = new Set<string>();

    ICON_ORDER.forEach((item) => {
      const cfg = config.desktop.icons[item.id];
      if (cfg && !cfg.visible) return;
      activeIds.add(item.id);
      const pos = iconPositions[item.id] || { x: 20, y: 20 };
      const w = Math.max(92, effectiveIconSize + 30);
      const h = effectiveIconSize + 34;
      const mass = w * h;
      const inertia = computeRectInertia(mass, w, h);
      const existing = bodies.get(item.id);
      if (existing) {
        existing.width = w;
        existing.height = h;
        existing.mass = mass;
        existing.inertia = inertia;
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
          grabOffsetX: 0,
          grabOffsetY: 0,
          isDragging: false,
          isSleeping: false,
          scale: 1,
          mass,
          inertia,
        });
      }
    });

    widgets.forEach((widget) => {
      if (!widget.visible) return;
      activeIds.add(widget.id);
      const mass = widget.width * widget.height * 1.4;
      const inertia = computeRectInertia(mass, widget.width, widget.height);
      const existing = bodies.get(widget.id);
      if (existing) {
        existing.width = widget.width;
        existing.height = widget.height;
        existing.mass = mass;
        existing.inertia = inertia;
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
          grabOffsetX: 0,
          grabOffsetY: 0,
          isDragging: false,
          isSleeping: false,
          scale: 1,
          mass,
          inertia,
        });
      }
    });

    (Object.values(windows) as WindowRuntimeState[]).forEach((win) => {
      if (!win.isOpen || win.isMinimized || win.isMaximized || isMobile) return;
      activeIds.add(win.id);
      const mass = win.width * win.height * 3.2;
      const inertia = computeRectInertia(mass, win.width, win.height);
      const existing = bodies.get(win.id);
      if (existing) {
        existing.width = win.width;
        existing.height = win.height;
        existing.mass = mass;
        existing.inertia = inertia;
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
          grabOffsetX: 0,
          grabOffsetY: 0,
          isDragging: false,
          isSleeping: false,
          scale: 1,
          mass,
          inertia,
        });
      }
    });

    Array.from(bodies.keys()).forEach((k) => {
      if (!activeIds.has(k)) bodies.delete(k);
    });
  }, [effectiveIconSize, config.desktop.icons, iconPositions, widgets, windows, isMobile]);

  // 60fps Rigid-Body Physics Loop
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
            astroSound.playImpact(imp.intensity * 1000, 1.0);
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

  const handleDragStartBody = useCallback((id: string, grabOffsetX: number, grabOffsetY: number) => {
    const b = bodiesRef.current.get(id);
    if (b) {
      b.isDragging = true;
      b.isSleeping = false;
      b.vx = 0;
      b.vy = 0;
      b.grabOffsetX = grabOffsetX;
      b.grabOffsetY = grabOffsetY;
    }
  }, []);

  const handleDragMoveBody = useCallback(
    (id: string, x: number, y: number, instVx: number, instVy: number) => {
      const b = bodiesRef.current.get(id);
      if (b) {
        b.x = x;
        b.y = y;
        // Expose live drag velocity so colliding bodies get physically shoved aside!
        b.vx = Math.max(-1800, Math.min(1800, instVx * 0.6));
        b.vy = Math.max(-1800, Math.min(1800, instVy * 0.6));
        // Realistic lever-arm pendulum target angle from drag acceleration & grab point
        const torqueTilt = (instVx * 0.011) - (b.grabOffsetY * instVx * 0.00018);
        b.targetAngle = Math.max(-22, Math.min(22, torqueTilt));
      }
    },
    []
  );

  const handleDragEndBody = useCallback((id: string, vx: number, vy: number) => {
    const b = bodiesRef.current.get(id);
    if (b) {
      b.isDragging = false;
      b.vx = vx;
      b.vy = vy;
      // Impart realistic rotational spin from off-center grab lever arm on release
      const releaseSpin = (b.grabOffsetX * vy - b.grabOffsetY * vx) * 0.00028;
      b.angularVel += Math.max(-180, Math.min(180, releaseSpin));

      if (b.kind === 'window') {
        setWindows((prev) => {
          const w = prev[id as WindowId];
          if (!w) return prev;
          return { ...prev, [id]: { ...w, x: Math.round(b.x), y: Math.round(b.y) } };
        });
      } else if (b.kind === 'widget') {
        setWidgets((prev) =>
          prev.map((w) => (w.id === id ? { ...w, x: Math.round(b.x), y: Math.round(b.y) } : w))
        );
      }
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
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
        b.angularVel = 0;
      }
    });
    astroSound.playKeyTap(740);
    showToast('Íconos ordenados en cuadrícula');
  }, [config.desktop.iconSize, config.desktop.gridGap, showToast]);

  const focusWindow = useCallback(
    (id: WindowId) => {
      if (activeWindowId === id && !windows[id]?.isMinimized) return;
      zCounterRef.current += 1;
      const z = zCounterRef.current;
      setActiveWindowId(id);
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isMinimized: false, zIndex: z },
      }));
    },
    [activeWindowId, windows]
  );

  const openWindow = useCallback(
    (id: WindowId) => {
      setStartMenuOpen(false);
      setCtxMenu(null);
      if (id === 'win-admin' && userRole !== 'admin') {
        setAdminPinModalOpen(true);
        return;
      }
      if (id === 'win-music') {
        setMusicInTray(false);
      }
      astroSound.playWindowPop(true);
      zCounterRef.current += 1;
      const z = zCounterRef.current;
      setActiveWindowId(id);
      setWindows((prev) => {
        const cur = prev[id];
        return {
          ...prev,
          [id]: {
            ...cur,
            isOpen: true,
            isMinimized: false,
            zIndex: z,
          },
        };
      });
    },
    [userRole]
  );

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    setActiveWindowId((curr) => (curr === id ? null : curr));
  }, []);

  const toggleMaximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    if (id === 'win-music' && globalMusic.isPlaying) {
      setMusicInTray(true);
    }
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false },
    }));
    setActiveWindowId((curr) => (curr === id ? null : curr));
  }, []);

  const restoreMusicFromTray = useCallback(() => {
    setMusicInTray(false);
    openWindow('win-music');
  }, [openWindow]);

  const closeMusicPermanently = useCallback(() => {
    globalMusic.stopCompletely();
    setMusicInTray(false);
    setWindows((prev) => ({
      ...prev,
      'win-music': { ...prev['win-music'], isOpen: false, isMinimized: false },
    }));
    showToast('Music stopped & closed');
  }, [showToast]);

  const handleTaskbarWindowClick = useCallback(
    (id: WindowId) => {
      const win = windows[id];
      if (!win.isOpen || win.isMinimized) {
        openWindow(id);
      } else if (activeWindowId === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [windows, activeWindowId, openWindow, minimizeWindow, focusWindow]
  );

  const resizeWindow = useCallback((id: WindowId, width: number, height: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], width, height },
    }));
  }, []);

  const triggerImpulseBurst = useCallback(() => {
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.48;
    bodiesRef.current.forEach((b) => {
      if (b.kind === 'window') return;
      const bx = b.x + b.width * 0.5;
      const by = b.y + b.height * 0.5;
      const dx = bx - cx;
      const dy = by - cy;
      const dist = Math.max(40, Math.hypot(dx, dy));
      const force = 780 + Math.random() * 480;
      b.vx += (dx / dist) * force;
      b.vy += (dy / dist) * force - 240;
      b.angularVel += (Math.random() - 0.5) * 260;
      b.isSleeping = false;
    });
    astroSound.playImpact(850, 0.9);
    showToast('Impulso cósmico radial aplicado');
  }, [showToast]);

  const changePhysicsMode = useCallback(
    (mode: PhysicsMode) => {
      setConfig((prev) => ({ ...prev, physics: { ...prev.physics, mode } }));
      if (mode === 'zero-g') {
        bodiesRef.current.forEach((b) => {
          if (b.kind !== 'window') {
            b.vx += (Math.random() - 0.5) * 180;
            b.vy += (Math.random() - 0.5) * 180;
            b.angularVel += (Math.random() - 0.5) * 40;
          }
        });
      }
      astroSound.playKeyTap(680);
      showToast(`Física: ${mode}`);
    },
    [showToast]
  );

  const toggleWindowCollisions = useCallback(() => {
    setConfig((prev) => {
      const next = !prev.physics.windowCollisions;
      showToast(next ? 'Colisiones con ventanas activadas' : 'Colisiones con ventanas desactivadas');
      return {
        ...prev,
        physics: { ...prev.physics, windowCollisions: next },
      };
    });
  }, [showToast]);

  const updateEffects = useCallback((patch: Partial<ThemeEffectsConfig>) => {
    setConfig((prev) => ({
      ...prev,
      effects: { ...prev.effects, ...patch },
    }));
  }, []);

  const updatePhysics = useCallback((patch: Partial<PhysicsSettings>) => {
    setConfig((prev) => ({
      ...prev,
      physics: { ...prev.physics, ...patch },
    }));
  }, []);

  const applyThemePreset = useCallback(
    (presetId: string) => {
      const p = THEME_PRESETS.find((t) => t.id === presetId);
      if (!p) return;
      updateEffects({
        bgTop: p.top,
        bgMiddle: p.mid,
        bgBottom: p.bot,
        primaryAccent: p.primary,
        secondaryAccent: p.secondary,
      });
      showToast(`Tema aplicado: ${p.name}`);
    },
    [updateEffects, showToast]
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
      const size = isMobile ? 84 : 176;
      const x = isMobile
        ? Math.round(Math.max(12, Math.min(vw - size - 12, vw * 0.5 - size * 0.5)))
        : Math.round(Math.max(24, Math.min(vw - size - 24, vw * 0.55 + (Math.random() - 0.5) * 140)));
      const y = isMobile
        ? Math.max(388, vh - 84 - size - 16)
        : Math.round(Math.max(24, Math.min(vh - size - 80, vh * 0.28 + (Math.random() - 0.5) * 120)));
      const id = `widget-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const item: MediaWidgetItem = {
        id,
        url: opts.url,
        label: opts.label,
        width: size,
        height: size,
        defaultWidth: size,
        defaultHeight: size,
        x,
        y,
        visible: true,
        isGif: opts.isGif,
        fallbackScene: opts.fallbackScene || 'pulse',
      };
      setWidgets((prev) => [...prev, item]);
      setSelectedWidgetId(id);
      astroSound.playWindowPop(true);
    },
    [isMobile]
  );

  const handleNewWidgetFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          spawnWidget({
            url: reader.result,
            label: f.name,
            isGif: f.type === 'image/gif',
            fallbackScene: 'pulse',
          });
        }
      };
      reader.readAsDataURL(f);
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
              ? { ...w, url: reader.result as string, label: file.name, isGif: file.type === 'image/gif' }
              : w
          )
        );
        showToast('Imagen del widget actualizada');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const iconList = ICON_ORDER.map((item) => {
    const cfg = config.desktop.icons[item.id] || { name: item.defaultName, visible: true };
    return {
      id: item.id,
      winId: item.winId,
      name: cfg.name,
      visible: cfg.visible,
      customImage: cfg.customImage,
      isFolder: item.isFolder,
      folderApps: item.folderApps,
    };
  });

  return (
    <div
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
        if (selectedWidgetId) setSelectedWidgetId(null);
        if (ctxMenu) setCtxMenu(null);
        if (openFolder) setOpenFolder(null);
      }}
      className="relative w-full h-full h-[100dvh] max-h-[100dvh] overflow-hidden astro-wallpaper flex flex-col select-none"
    >
      <StarfieldCanvas effects={config.effects} impactsRef={impactsRef} />
      <div className="fixed inset-0 astro-vignette z-[1]" />

      <DesktopDrawCanvas
        active={desktopDrawActive}
        onExit={() => setDesktopDrawActive(false)}
      />

      {isBooting && <BootScreen onComplete={handleBootComplete} />}

      {!isBooting && userRole === null && (
        <WelcomeScreen
          osTitle={config.security.osTitle}
          adminPin={config.security.adminPin}
          onEnterDesktop={(role) => setUserRole(role)}
        />
      )}

      <main
        ref={desktopRef}
        className="relative flex-1 min-h-0 overflow-hidden z-10"
      >
        {iconList.map((icon) => {
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
              onOpenFolder={(ico, rect) => {
                if (!ico.folderApps) return;
                setOpenFolder((prev) =>
                  prev?.id === ico.id
                    ? null
                    : {
                        id: ico.id,
                        name: ico.name,
                        x: Math.min(window.innerWidth - 220, Math.max(12, rect.left)),
                        y: Math.min(window.innerHeight - 190, Math.max(12, rect.bottom + 8)),
                        apps: ico.folderApps!,
                      }
                );
              }}
              onDragStartBody={handleDragStartBody}
              onDragMoveBody={handleDragMoveBody}
              onDragEndBody={handleDragEndBody}
            />
          );
        })}

        {openFolder && (
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              left: isMobile ? '50%' : openFolder.x,
              top: isMobile ? '50%' : openFolder.y,
              transform: isMobile ? 'translate(-50%, -50%)' : 'none',
            }}
            className="fixed z-50 w-56 glass-window border border-white/25 rounded-2xl p-3 shadow-2xl bg-slate-950/90 backdrop-blur-2xl window-anim-open"
          >
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-slate-200 truncate">
                {openFolder.name}
              </span>
              <button
                type="button"
                onClick={() => setOpenFolder(null)}
                className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {openFolder.apps.map((app) => (
                <button
                  key={app.winId}
                  type="button"
                  onClick={() => {
                    openWindow(app.winId);
                    setOpenFolder(null);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center">
                    {renderDefaultSvg(app.winId)}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-white truncate max-w-full">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {widgets.map((widget) => (
          <MediaWidgetItemView
            key={widget.id}
            widget={widget}
            isSelected={selectedWidgetId === widget.id}
            registerElement={registerElement}
            getBody={getBody}
            onSelect={(id) => setSelectedWidgetId(id)}
            onContextMenu={(id, clientX, clientY) => {
              setCtxMenu({
                open: true,
                widgetId: id,
                x: Math.min(clientX, window.innerWidth - 220),
                y: Math.min(clientY, window.innerHeight - 230),
              });
            }}
            onResize={(id, width, height) => {
              setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
            }}
            onDragStartBody={handleDragStartBody}
            onDragMoveBody={handleDragMoveBody}
            onDragEndBody={handleDragEndBody}
          />
        ))}

        {WINDOW_META_LIST.map((meta) => {
          const win = windows[meta.id];
          if (!win || !win.isOpen || win.isMinimized) return null;
          const title = config.windows[win.id]?.title || meta.title;
          return (
            <WindowFrame
              key={win.id}
              win={win}
              title={title}
              mobileTitle={meta.shortTitle}
              accentColor={meta.accentColor}
              isActive={activeWindowId === win.id}
              isMobile={isMobile}
              isTablet={isTablet}
              resizable={meta.resizable}
              registerElement={registerElement}
              getBody={getBody}
              onFocus={focusWindow}
              onMinimize={minimizeWindow}
              onToggleMaximize={toggleMaximizeWindow}
              onClose={closeWindow}
              onResize={resizeWindow}
              onDragStartBody={handleDragStartBody}
              onDragMoveBody={handleDragMoveBody}
              onDragEndBody={handleDragEndBody}
            >
              {win.id === 'win-astroverse' && <AstroVerseApp onOpenWindow={openWindow} />}
              {win.id === 'win-draw' && (
                <PaintApp
                  onPinToDesktop={(dataUrl, label) => {
                    spawnWidget({ url: dataUrl, label, isGif: false, fallbackScene: 'prism' });
                    showToast('Pintura anclada al escritorio');
                  }}
                  onToast={showToast}
                />
              )}
              {win.id === 'win-notes' && <NotesApp />}
              {win.id === 'win-terminal' && (
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
              {win.id === 'win-themes' && (
                <ThemesApp
                  effects={config.effects}
                  physics={config.physics}
                  onUpdateEffects={updateEffects}
                  onApplyPreset={applyThemePreset}
                  onUpdatePhysics={updatePhysics}
                />
              )}
              {win.id === 'win-music' && <MusicApp />}
              {win.id === 'win-mediaflow' && (
                <MediaFlowApp onSpawnWidget={spawnWidget} onToast={showToast} />
              )}
              {win.id === 'win-pressmark' && <PressmarkApp />}
              {win.id === 'win-astrochess' && <AstroChessApp />}
              {win.id === 'win-astrostudio' && <AstroStudioApp />}
              {win.id === 'win-astroupscaler' && <AstroUpscalerApp />}
              {win.id === 'win-biohub' && <BioHubApp />}
              {win.id === 'win-cardgram' && <CardGramApp />}
              {win.id === 'win-inkra' && <InkraApp />}
              {win.id === 'win-youtube' && <YouTubeApp />}
              {win.id === 'win-icon-manager' && (
                <IconManagerApp
                  icons={iconList}
                  onSetCustomImage={(iconId, dataUrl) => {
                    setConfig((p) => ({
                      ...p,
                      desktop: {
                        ...p.desktop,
                        icons: {
                          ...p.desktop.icons,
                          [iconId]: {
                            ...(p.desktop.icons[iconId] || { name: iconId, visible: true }),
                            customImage: dataUrl,
                          },
                        },
                      },
                    }));
                    showToast('Ícono actualizado');
                  }}
                  onResetAll={() => {
                    setConfig((p) => {
                      const nextIcons = { ...p.desktop.icons };
                      Object.keys(nextIcons).forEach((k) => {
                        nextIcons[k] = { ...nextIcons[k], customImage: undefined };
                      });
                      return { ...p, desktop: { ...p.desktop, icons: nextIcons } };
                    });
                    showToast('Íconos restaurados a diseño original');
                  }}
                />
              )}
              {win.id === 'win-admin' && (
                <AdminPanelApp
                  config={config}
                  widgets={widgets}
                  onUpdateConfig={(updater) => setConfig(updater)}
                  onUpdateEffects={updateEffects}
                  onApplyThemePreset={applyThemePreset}
                  onUpdatePhysics={updatePhysics}
                  onImpulseBurst={triggerImpulseBurst}
                  onRearrangeIcons={rearrangeIcons}
                  onUpdateWidget={(id, patch) =>
                    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
                  }
                  onDeleteWidget={(id) => setWidgets((prev) => prev.filter((w) => w.id !== id))}
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
        windowCollisions={config.physics.windowCollisions}
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
        onToggleWindowCollisions={toggleWindowCollisions}
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

                const mass = src.width * src.height * 1.4;
                bodiesRef.current.set(newId, {
                  id: newId,
                  kind: 'widget',
                  x: newX,
                  y: newY,
                  width: src.width,
                  height: src.height,
                  vx: (Math.random() - 0.5) * 450,
                  vy: -280,
                  angle: (Math.random() - 0.5) * 14,
                  angularVel: (Math.random() - 0.5) * 120,
                  targetAngle: 0,
                  grabOffsetX: 0,
                  grabOffsetY: 0,
                  isDragging: false,
                  isSleeping: false,
                  scale: 1,
                  mass,
                  inertia: computeRectInertia(mass, src.width, src.height),
                });

                setWidgets((prev) => [...prev, cloned]);
                astroSound.playStartupChime();
                showToast(`Widget cloned: ${src.label}`);
              }
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-cyan-500/20 text-left text-xs font-mono text-cyan-300 font-bold transition-colors flex items-center justify-between"
          >
            <span>Duplicate / Clone</span>
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
                b.angularVel += (Math.random() - 0.5) * 240;
                b.isSleeping = false;
              }
              setCtxMenu(null);
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-left text-xs font-mono text-pink-300 transition-colors"
          >
            Throw Widget
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
          <span className="text-xs font-mono text-slate-100">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
