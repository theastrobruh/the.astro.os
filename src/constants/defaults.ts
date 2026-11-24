import cosmosWidgetImg from '../assets/images/cosmos_nebula_widget_1795492720446.jpg';
import astroAvatarImg from '../assets/images/astro_creator_avatar_1795341420746.jpg';
import { AdminConfig, GlossaryItem, MediaWidgetItem, TimezoneOption, WindowId, WindowMeta } from '../types/os';

export const COSMOS_WIDGET_IMG = cosmosWidgetImg;
export const ASTRO_AVATAR_IMG = astroAvatarImg;
export const DAHYUN_GIF_URL = 'https://media.tenor.com/hWEGQvJ2ntsAAAAM/haishatp-dahyun.gif';

export const WINDOW_META_LIST: WindowMeta[] = [
  { id: 'win-astroverse', title: 'theAstroBruh — Links', shortTitle: 'Astro.Verse', accentColor: '#FF007A', defaultWidth: 460, defaultHeight: 520 },
  { id: 'win-cardgram', title: 'CardGram • Web Identity', shortTitle: 'CardGram', accentColor: '#F472B6', defaultWidth: 880, defaultHeight: 580, resizable: true },
  { id: 'win-pressmark', title: 'Pressmark • Watermark & Media Multi-Tool', shortTitle: 'Pressmark', accentColor: '#06B6D4', defaultWidth: 880, defaultHeight: 600, resizable: true },
  { id: 'win-inkra', title: 'Inkra • Creative Digital Studio', shortTitle: 'Inkra', accentColor: '#D946EF', defaultWidth: 880, defaultHeight: 600, resizable: true },
  { id: 'win-notes', title: 'Astro.Notes • Notebook & Glossary', shortTitle: 'Notes', accentColor: '#818CF8', defaultWidth: 780, defaultHeight: 540, resizable: true },
  { id: 'win-draw', title: 'Studio Paint • Astro.Paint', shortTitle: 'Paint', accentColor: '#FACC15', defaultWidth: 780, defaultHeight: 560, resizable: true },
  { id: 'win-terminal', title: 'Astro Console - bash v2.5', shortTitle: 'Terminal', accentColor: '#34D399', defaultWidth: 620, defaultHeight: 440, resizable: true },
  { id: 'win-music', title: 'Astro.Radio • Cyber Beats', shortTitle: 'Music', accentColor: '#A78BFA', defaultWidth: 640, defaultHeight: 580, resizable: true },
  { id: 'win-youtube', title: 'YouTube Player • Cosmic Stream', shortTitle: 'YouTube', accentColor: '#EF4444', defaultWidth: 760, defaultHeight: 540, resizable: true },
  { id: 'win-themes', title: 'Theme Studio • Personalization', shortTitle: 'Theme.XP', accentColor: '#E879F9', defaultWidth: 560, defaultHeight: 500, resizable: true },
  { id: 'win-mediaflow', title: 'MediaFlow Studio — Images & GIFs', shortTitle: 'MediaFlow', accentColor: '#22D3EE', defaultWidth: 900, defaultHeight: 620, resizable: true },
  { id: 'win-icon-manager', title: 'Customize Icons', shortTitle: 'Icons', accentColor: '#38BDF8', defaultWidth: 600, defaultHeight: 500, resizable: true },
  { id: 'win-admin', title: 'the.astro.os • Control Panel', shortTitle: 'Admin Panel', accentColor: '#FBBF24', defaultWidth: 860, defaultHeight: 600, resizable: true },
];

export const WINDOW_META_MAP: Record<WindowId, WindowMeta> = WINDOW_META_LIST.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {} as Record<WindowId, WindowMeta>);

export const ICON_ORDER: Array<{ id: string; winId: WindowId; defaultName: string }> = [
  { id: 'icon-win-astroverse', winId: 'win-astroverse', defaultName: 'Astro.Verse' },
  { id: 'icon-win-cardgram', winId: 'win-cardgram', defaultName: 'CardGram' },
  { id: 'icon-win-pressmark', winId: 'win-pressmark', defaultName: 'Pressmark' },
  { id: 'icon-win-inkra', winId: 'win-inkra', defaultName: 'Inkra' },
  { id: 'icon-win-notes', winId: 'win-notes', defaultName: 'Notes' },
  { id: 'icon-win-draw', winId: 'win-draw', defaultName: 'Paint' },
  { id: 'icon-win-terminal', winId: 'win-terminal', defaultName: 'Terminal' },
  { id: 'icon-win-music', winId: 'win-music', defaultName: 'Music' },
  { id: 'icon-win-youtube', winId: 'win-youtube', defaultName: 'YouTube' },
];

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  version: 'v.0.5.0',
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
      'icon-win-cardgram': { name: 'CardGram', visible: true },
      'icon-win-pressmark': { name: 'Pressmark', visible: true },
      'icon-win-inkra': { name: 'Inkra', visible: true },
      'icon-win-notes': { name: 'Notes', visible: true },
      'icon-win-draw': { name: 'Paint', visible: true },
      'icon-win-terminal': { name: 'Terminal', visible: true },
      'icon-win-music': { name: 'Music', visible: true },
      'icon-win-youtube': { name: 'YouTube', visible: true },
    },
  },
  windows: {
    'win-astroverse': { title: 'theAstroBruh — Links', width: 460, height: 520 },
    'win-cardgram': { title: 'CardGram • Web Identity', width: 880, height: 580 },
    'win-pressmark': { title: 'Pressmark • Watermark & Media Multi-Tool', width: 880, height: 600 },
    'win-inkra': { title: 'Inkra • Creative Digital Studio', width: 880, height: 600 },
    'win-notes': { title: 'Astro.Notes • Notebook & Glossary', width: 780, height: 540 },
    'win-draw': { title: 'Studio Paint • Astro.Paint', width: 780, height: 560 },
    'win-terminal': { title: 'Astro Console - bash v2.5', width: 620, height: 440 },
    'win-music': { title: 'Astro.Radio • Cyber Beats', width: 640, height: 580 },
    'win-youtube': { title: 'YouTube Player • Cosmic Stream', width: 760, height: 540 },
    'win-themes': { title: 'Theme Studio • Personalization', width: 560, height: 500 },
    'win-mediaflow': { title: 'MediaFlow Studio — Images & GIFs', width: 900, height: 620 },
    'win-icon-manager': { title: 'Customize Icons', width: 600, height: 500 },
    'win-admin': { title: 'the.astro.os • Control Panel', width: 860, height: 600 },
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
    restitution: 0.52,
    friction: 0.94,
    collisionsEnabled: true,
    windowCollisions: false,
    tiltEnabled: true,
    cursorRepel: true,
    soundEnabled: true,
  },
};

export function createDefaultWidgets(viewportW: number, viewportH: number): MediaWidgetItem[] {
  const safeW = Math.max(360, viewportW);
  const safeH = Math.max(480, viewportH);
  const isMobile = safeW < 768;

  if (isMobile) {
    const size = Math.min(92, Math.floor((safeW - 44) / 3.6));
    const mainH = Math.max(460, safeH - 84);
    const y = Math.max(388, mainH - size - 14);
    const centerX = Math.round(safeW * 0.5);
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
        x: Math.min(safeW - size - 12, centerX + 10),
        y,
        visible: true,
        isGif: false,
        fallbackScene: 'cosmos',
      },
    ];
  }

  const cosmosW = 168;
  const cosmosH = 168;
  const cosmosX = Math.max(300, safeW - cosmosW - 24);
  const cosmosY = 24;

  const dahyunW = 128;
  const dahyunH = 168;
  const dahyunX = cosmosX - dahyunW - 16;
  const dahyunY = 24;

  return [
    {
      id: 'media-widget-3',
      url: DAHYUN_GIF_URL,
      label: 'Dahyun.gif',
      width: dahyunW,
      height: dahyunH,
      defaultWidth: dahyunW,
      defaultHeight: dahyunH,
      x: dahyunX,
      y: dahyunY,
      visible: true,
      isGif: true,
      fallbackScene: 'pulse',
    },
    {
      id: 'media-widget-1',
      url: COSMOS_WIDGET_IMG,
      label: 'Cosmos.jpg',
      width: cosmosW,
      height: cosmosH,
      defaultWidth: cosmosW,
      defaultHeight: cosmosH,
      x: cosmosX,
      y: cosmosY,
      visible: true,
      isGif: false,
      fallbackScene: 'cosmos',
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
  { id: 'America/New_York', label: 'New York, USA', flag: '🇺🇸', code: 'NYC' },
  { id: 'America/Los_Angeles', label: 'Los Angeles, USA', flag: '🇺🇸', code: 'LAX' },
  { id: 'America/Lima', label: 'Lima, Peru', flag: '🇵🇪', code: 'LIM' },
  { id: 'America/Mexico_City', label: 'Mexico City', flag: '🇲🇽', code: 'MEX' },
  { id: 'America/Bogota', label: 'Bogota, Colombia', flag: '🇨🇴', code: 'BOG' },
  { id: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, Argentina', flag: '🇦🇷', code: 'BUE' },
  { id: 'America/Sao_Paulo', label: 'Sao Paulo, Brazil', flag: '🇧🇷', code: 'SAO' },
  { id: 'America/Santiago', label: 'Santiago, Chile', flag: '🇨🇱', code: 'SCL' },
  { id: 'Europe/London', label: 'London, UK', flag: '🇬🇧', code: 'LON' },
  { id: 'Europe/Madrid', label: 'Madrid, Spain', flag: '🇪🇸', code: 'MAD' },
  { id: 'Europe/Paris', label: 'Paris, France', flag: '🇫🇷', code: 'PAR' },
  { id: 'Europe/Berlin', label: 'Berlin, Germany', flag: '🇩🇪', code: 'BER' },
  { id: 'Asia/Tokyo', label: 'Tokyo, Japan', flag: '🇯🇵', code: 'TYO' },
  { id: 'Asia/Seoul', label: 'Seoul, South Korea', flag: '🇰🇷', code: 'SEL' },
  { id: 'Asia/Singapore', label: 'Singapore', flag: '🇸🇬', code: 'SIN' },
  { id: 'Asia/Dubai', label: 'Dubai, UAE', flag: '🇦🇪', code: 'DXB' },
  { id: 'Australia/Sydney', label: 'Sydney, Australia', flag: '🇦🇺', code: 'SYD' },
  { id: 'Pacific/Auckland', label: 'Auckland, NZ', flag: '🇳🇿', code: 'AKL' },
];

export const DEFAULT_GLOSSARY: GlossaryItem[] = [
  {
    id: 'g-1',
    term: 'Momento de Inercia (I)',
    category: 'Física 2D',
    definition: 'Resistencia rotacional de un cuerpo rectangular dada por I = (1/12)·m·(w² + h²), determinando cuánto gira un widget al recibir un golpe en su esquina.',
  },
  {
    id: 'g-2',
    term: 'Separating Axis Theorem (SAT)',
    category: 'Física 2D',
    definition: 'Algoritmo geométrico que detecta colisiones exactas entre cajas orientadas (OBB) rotadas y calcula el vector de penetración mínima y punto de contacto.',
  },
  {
    id: 'g-3',
    term: 'Fricción de Coulomb',
    category: 'Física 2D',
    definition: 'Impulso tangencial en el punto de contacto limitado por μ·|Jn| que provoca giros realistas al rozar bordes o rodar sobre la barra de tareas.',
  },
  {
    id: 'g-4',
    term: 'Restitución (e)',
    category: 'Física 2D',
    definition: 'Coeficiente entre 0 y 1 que determina cuánta energía cinética conserva un widget o ícono al rebotar contra los límites o entre sí.',
  },
  {
    id: 'g-5',
    term: 'Glassmorphism',
    category: 'Diseño UI',
    definition: 'Estilo visual translúcido con desenfoque de fondo (backdrop-filter), bordes finos y profundidad por capas.',
  },
  {
    id: 'g-6',
    term: 'MediaFlow Studio',
    category: 'Astro Ecosystem',
    definition: 'Suite integrada para recortar, redimensionar, aplicar marcas de agua y anclar imágenes o GIFs con física rígida al escritorio.',
  },
];
