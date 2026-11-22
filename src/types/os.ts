export type WindowId =
  | 'win-astroverse'
  | 'win-draw'
  | 'win-notes'
  | 'win-terminal'
  | 'win-themes'
  | 'win-music'
  | 'win-mediaflow'
  | 'win-cardgram'
  | 'win-icon-manager'
  | 'win-admin';

export type UserRole = 'admin' | 'guest' | null;

export type PhysicsMode = 'tactile' | 'earth' | 'zero-g' | 'static';

export interface PhysicsSettings {
  mode: PhysicsMode;
  gravity: number;       // px/s^2 for earth mode (default 1350)
  restitution: number;   // 0.1 - 0.92 bounce elasticity
  friction: number;      // 0.90 - 0.995 surface drag
  collisionsEnabled: boolean;
  tiltEnabled: boolean;
  cursorRepel: boolean;
  soundEnabled: boolean;
}

export interface PhysicsBody {
  id: string;
  kind: 'icon' | 'widget' | 'window';
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  angle: number;
  angularVel: number;
  targetAngle: number;
  isDragging: boolean;
  scale: number;
  mass: number;
}

export interface WindowMeta {
  id: WindowId;
  title: string;
  shortTitle: string;
  accentColor: string;
  defaultWidth: number;
  defaultHeight: number;
  resizable?: boolean;
}

export interface WindowRuntimeState {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesktopIconConfig {
  id: string;
  winId: WindowId;
  name: string;
  visible: boolean;
  customImage?: string;
}

export interface MediaWidgetItem {
  id: string;
  url: string;
  label: string;
  width: number;
  height: number;
  defaultWidth: number;
  defaultHeight: number;
  x: number;
  y: number;
  visible: boolean;
  isGif?: boolean;
  fallbackScene?: 'cosmos' | 'city' | 'pulse' | 'saturn' | 'prism';
}

export interface ThemeEffectsConfig {
  bgTop: string;
  bgMiddle: string;
  bgBottom: string;
  primaryAccent: string;
  secondaryAccent: string;
  starCount: number;
  starSpeed: number;
  glassBlur: number;
}

export interface AdminConfig {
  version: string;
  security: {
    adminPin: string;
    osTitle: string;
  };
  desktop: {
    iconSize: number;
    fontSize: number;
    gridGap: number;
    icons: Record<string, { name: string; visible: boolean; customImage?: string }>;
  };
  windows: Record<WindowId, { title: string; width: number; height: number }>;
  effects: ThemeEffectsConfig;
  physics: PhysicsSettings;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface GlossaryItem {
  id: string;
  term: string;
  category: string;
  definition: string;
}

export interface TimezoneOption {
  id: string;
  label: string;
  flag: string;
  code: string;
}

export interface CollisionImpactEvent {
  x: number;
  y: number;
  intensity: number; // 0..1
  color: string;
}
