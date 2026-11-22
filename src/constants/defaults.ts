import cosmosWidgetImg from '../assets/images/cosmos_nebula_widget_1795341419701.jpg';
import astroCityWidgetImg from '../assets/images/astro_city_widget_1795341419967.jpg';
import astroAvatarImg from '../assets/images/astro_creator_avatar_1795341420746.jpg';
import { AdminConfig, GlossaryItem, MediaWidgetItem, TimezoneOption, WindowId, WindowMeta } from '../types/os';

export const COSMOS_WIDGET_IMG = cosmosWidgetImg;
export const ASTRO_CITY_WIDGET_IMG = astroCityWidgetImg;
export const ASTRO_AVATAR_IMG = astroAvatarImg;
export const DAHYUN_GIF_URL = 'https://media.tenor.com/hWEGQvJ2ntsAAAAM/haishatp-dahyun.gif';

export const WINDOW_META_LIST: WindowMeta[] = [
  { id: 'win-astroverse', title: 'theAstroBruh — Links', shortTitle: 'Astro.Verse', accentColor: '#FF007A', defaultWidth: 410, defaultHeight: 490 },
  { id: 'win-draw', title: 'Pintura Studio • Astro.Paint', shortTitle: 'Pintura', accentColor: '#FACC15', defaultWidth: 740, defaultHeight: 540, resizable: true },
  { id: 'win-notes', title: 'Astro.Notes • Cuaderno & Glosario', shortTitle: 'Cuaderno', accentColor: '#818CF8', defaultWidth: 760, defaultHeight: 530, resizable: true },
  { id: 'win-terminal', title: 'Astro Console - bash v2.5', shortTitle: 'Terminal', accentColor: '#34D399', defaultWidth: 600, defaultHeight: 420, resizable: true },
  { id: 'win-themes', title: 'Theme Studio • Personalización', shortTitle: 'Theme.XP', accentColor: '#E879F9', defaultWidth: 540, defaultHeight: 480, resizable: true },
  { id: 'win-music', title: 'Astro.Radio • Cyber Beats', shortTitle: 'Música', accentColor: '#A78BFA', defaultWidth: 600, defaultHeight: 510, resizable: true },
  { id: 'win-mediaflow', title: 'MediaFlow Studio — Imágenes & GIFs', shortTitle: 'MediaFlow', accentColor: '#22D3EE', defaultWidth: 880, defaultHeight: 600, resizable: true },
  { id: 'win-cardgram', title: 'CardGram — Social Cards', shortTitle: 'CardGram', accentColor: '#F472B6', defaultWidth: 760, defaultHeight: 540, resizable: true },
  { id: 'win-icon-manager', title: 'Personalizar Íconos', shortTitle: 'Íconos', accentColor: '#38BDF8', defaultWidth: 580, defaultHeight: 480, resizable: true },
  { id: 'win-admin', title: 'the.astro.os • Panel de Control Admin', shortTitle: 'Panel Admin', accentColor: '#FBBF24', defaultWidth: 840, defaultHeight: 580, resizable: true },
];

export const WINDOW_META_MAP: Record<WindowId, WindowMeta> = WINDOW_META_LIST.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {} as Record<WindowId, WindowMeta>);

export const ICON_ORDER: Array<{ id: string; winId: WindowId; defaultName: string }> = [
  { id: 'icon-win-astroverse', winId: 'win-astroverse', defaultName: 'Astro.Verse' },
  { id: 'icon-win-draw', winId: 'win-draw', defaultName: 'Pintura' },
  { id: 'icon-win-notes', winId: 'win-notes', defaultName: 'Cuaderno' },
  { id: 'icon-win-terminal', winId: 'win-terminal', defaultName: 'Terminal' },
  { id: 'icon-win-themes', winId: 'win-themes', defaultName: 'Theme' },
  { id: 'icon-win-music', winId: 'win-music', defaultName: 'Música & Radio' },
  { id: 'icon-win-mediaflow', winId: 'win-mediaflow', defaultName: 'MediaFlow' },
  { id: 'icon-win-cardgram', winId: 'win-cardgram', defaultName: 'CardGram' },
  { id: 'icon-win-admin', winId: 'win-admin', defaultName: 'Panel Admin' },
];

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  version: '3.0',
  security: {
    adminPin: '0412',
    osTitle: 'the.astro.os',
  },
  desktop: {
    iconSize: 62,
    fontSize: 11,
    gridGap: 16,
    icons: {
      'icon-win-astroverse': { name: 'Astro.Verse', visible: true },
      'icon-win-draw': { name: 'Pintura', visible: true },
      'icon-win-notes': { name: 'Cuaderno', visible: true },
      'icon-win-terminal': { name: 'Terminal', visible: true },
      'icon-win-themes': { name: 'Theme', visible: true },
      'icon-win-music': { name: 'Música & Radio', visible: true },
      'icon-win-mediaflow': { name: 'MediaFlow', visible: true },
      'icon-win-cardgram': { name: 'CardGram', visible: true },
      'icon-win-admin': { name: 'Panel Admin', visible: true },
    },
  },
  windows: {
    'win-astroverse': { title: 'theAstroBruh — Links', width: 410, height: 490 },
    'win-draw': { title: 'Pintura Studio • Astro.Paint', width: 740, height: 540 },
    'win-notes': { title: 'Astro.Notes • Cuaderno & Glosario', width: 760, height: 530 },
    'win-terminal': { title: 'Astro Console - bash v2.5', width: 600, height: 420 },
    'win-themes': { title: 'Theme Studio • Personalización', width: 540, height: 480 },
    'win-music': { title: 'Astro.Radio • Cyber Beats', width: 600, height: 510 },
    'win-mediaflow': { title: 'MediaFlow Studio — Imágenes & GIFs', width: 880, height: 600 },
    'win-cardgram': { title: 'CardGram — Social Cards', width: 760, height: 540 },
    'win-icon-manager': { title: 'Personalizar Íconos', width: 580, height: 480 },
    'win-admin': { title: 'the.astro.os • Panel de Control Admin', width: 840, height: 580 },
  },
  effects: {
    bgTop: '#050510',
    bgMiddle: '#160c28',
    bgBottom: '#3b1c3c',
    primaryAccent: '#FF007A',
    secondaryAccent: '#00F0FF',
    starCount: 280,
    starSpeed: 1.0,
    glassBlur: 24,
  },
  physics: {
    mode: 'tactile',
    gravity: 1350,
    restitution: 0.48,
    friction: 0.94,
    collisionsEnabled: true,
    tiltEnabled: true,
    cursorRepel: true,
    soundEnabled: true,
  },
};

export function createDefaultWidgets(viewportW: number, viewportH: number): MediaWidgetItem[] {
  const safeW = Math.max(360, viewportW);
  const safeH = Math.max(480, viewportH);
  const isMobile = safeW < 768;

  return [
    {
      id: 'media-widget-1',
      url: COSMOS_WIDGET_IMG,
      label: 'Cosmos.jpg',
      width: isMobile ? 128 : 176,
      height: isMobile ? 128 : 176,
      defaultWidth: 176,
      defaultHeight: 176,
      x: Math.max(20, safeW - (isMobile ? 150 : 240)),
      y: isMobile ? 64 : Math.round(safeH * 0.11),
      visible: true,
      isGif: false,
      fallbackScene: 'cosmos',
    },
    {
      id: 'media-widget-2',
      url: ASTRO_CITY_WIDGET_IMG,
      label: 'AstroCity.png',
      width: isMobile ? 148 : 196,
      height: isMobile ? 112 : 148,
      defaultWidth: 196,
      defaultHeight: 148,
      x: Math.max(20, safeW - (isMobile ? 172 : 380)),
      y: Math.max(180, safeH - (isMobile ? 210 : 250)),
      visible: true,
      isGif: false,
      fallbackScene: 'city',
    },
    {
      id: 'media-widget-3',
      url: DAHYUN_GIF_URL,
      label: 'Dahyun.gif',
      width: isMobile ? 120 : 164,
      height: isMobile ? 120 : 164,
      defaultWidth: 164,
      defaultHeight: 164,
      x: isMobile ? 20 : Math.round(safeW * 0.22),
      y: isMobile ? Math.round(safeH * 0.56) : Math.round(safeH * 0.48),
      visible: true,
      isGif: true,
      fallbackScene: 'pulse',
    },
  ];
}

export const CURATED_GIF_WIDGET_PRESETS: Array<{
  id: string;
  label: string;
  url: string;
  isGif: boolean;
  fallbackScene: 'cosmos' | 'city' | 'pulse' | 'saturn' | 'prism';
  description: string;
}> = [
  {
    id: 'preset-dahyun',
    label: 'Dahyun.gif',
    url: DAHYUN_GIF_URL,
    isGif: true,
    fallbackScene: 'pulse',
    description: 'GIF clásico del escritorio original de the.astro.os',
  },
  {
    id: 'preset-saturn',
    label: 'SaturnLoop.gif',
    url: '',
    isGif: true,
    fallbackScene: 'saturn',
    description: 'Animación orbital 60fps de planeta anillado',
  },
  {
    id: 'preset-pulse',
    label: 'SynthGrid.gif',
    url: '',
    isGif: true,
    fallbackScene: 'pulse',
    description: 'Horizonte synthwave animado en tiempo real',
  },
  {
    id: 'preset-prism',
    label: 'CyberPrism.gif',
    url: '',
    isGif: true,
    fallbackScene: 'prism',
    description: 'Prisma 3D giratorio con estela espectral',
  },
  {
    id: 'preset-cosmos',
    label: 'Cosmos.jpg',
    url: COSMOS_WIDGET_IMG,
    isGif: false,
    fallbackScene: 'cosmos',
    description: 'Nebulosa violeta y planeta anillado HD',
  },
  {
    id: 'preset-city',
    label: 'AstroCity.png',
    url: ASTRO_CITY_WIDGET_IMG,
    isGif: false,
    fallbackScene: 'city',
    description: 'Horizonte nocturno cyberpunk sobre cristal',
  },
];

export const THEME_PRESETS = [
  {
    id: 'cyber',
    name: 'Cyberpunk',
    top: '#050510',
    mid: '#160c28',
    bot: '#3b1c3c',
    primary: '#FF007A',
    secondary: '#00F0FF',
  },
  {
    id: 'sunset',
    name: 'Sunset Drive',
    top: '#0b0416',
    mid: '#2d0c35',
    bot: '#781f38',
    primary: '#F97316',
    secondary: '#FACC15',
  },
  {
    id: 'matrix',
    name: 'Matrix Grid',
    top: '#020b06',
    mid: '#062115',
    bot: '#0b3b24',
    primary: '#10B981',
    secondary: '#22D3EE',
  },
  {
    id: 'synth',
    name: 'Deep Space',
    top: '#030712',
    mid: '#0f172a',
    bot: '#1e1b4b',
    primary: '#A855F7',
    secondary: '#38BDF8',
  },
];

export const RADIO_PRESETS = [
  { name: 'Lofi Chill Radio', genre: 'Chillhop', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { name: 'Synthwave / Cyberpunk', genre: 'Synthwave', url: 'https://stream.zeno.fm/05v134k4738uv' },
  { name: 'Classic Retro Radio', genre: '80s Hits', url: 'https://stream.zeno.fm/916w0659838uv' },
  { name: 'Space Ambient Chill', genre: 'Ambient', url: 'https://stream.zeno.fm/0r0xa792kwzuv' },
];

export const AVAILABLE_TIMEZONES: TimezoneOption[] = [
  { id: 'America/Lima', label: 'Lima, Perú', flag: '🇵🇪', code: 'LIM' },
  { id: 'America/Mexico_City', label: 'Ciudad de México', flag: '🇲🇽', code: 'MEX' },
  { id: 'America/New_York', label: 'New York, USA', flag: '🇺🇸', code: 'NYC' },
  { id: 'Europe/Madrid', label: 'Madrid, España', flag: '🇪🇸', code: 'MAD' },
  { id: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, AR', flag: '🇦🇷', code: 'BUE' },
  { id: 'America/Bogota', label: 'Bogotá, Colombia', flag: '🇨🇴', code: 'BOG' },
  { id: 'Europe/London', label: 'Londres, UK', flag: '🇬🇧', code: 'LON' },
  { id: 'Asia/Tokyo', label: 'Tokio, Japón', flag: '🇯🇵', code: 'TYO' },
];

export const DEFAULT_GLOSSARY: GlossaryItem[] = [
  {
    id: 'g-1',
    term: 'Restitución (e)',
    category: 'Física 2D',
    definition: 'Coeficiente entre 0 y 1 que determina cuánta energía cinética conserva un widget o ventana al rebotar contra los bordes o entre sí.',
  },
  {
    id: 'g-2',
    term: 'Amortiguador de Resorte',
    category: 'Física 2D',
    definition: 'Sistema masa-resorte-amortiguador que genera la inclinación natural de ventanas y widgets al arrastrarlos rápido.',
  },
  {
    id: 'g-3',
    term: 'Glassmorphism',
    category: 'Diseño UI',
    definition: 'Estilo visual translúcido con desenfoque de fondo (backdrop-filter), bordes finos y profundidad por capas.',
  },
  {
    id: 'g-4',
    term: 'MediaFlow Studio',
    category: 'Astro Ecosystem',
    definition: 'Suite integrada para recortar, redimensionar, aplicar marcas de agua y anclar imágenes o GIFs al escritorio.',
  },
];
