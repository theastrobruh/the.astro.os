<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=220&section=header&text=the.astro.os&fontSize=70&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Cosmic%20Physics%20Web%20Operating%20System%20%7C%20v0.5.0&descAlignY=58&descSize=18" width="100%" alt="the.astro.os banner"/>

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-theastrobruh.github.io-7000FF?style=for-the-badge&logo=githubpages&logoColor=white)](https://theastrobruh.github.io/the.astro.os)
[![Repo](https://img.shields.io/badge/GitHub-the.astro.os-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/theastrobruh/the.astro.os)
[![Version](https://img.shields.io/badge/Version-v0.5.0-FFB800?style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/License-MIT-00E5FF?style=for-the-badge)](LICENSE)
[![Stack](https://img.shields.io/badge/React%2019%20%7C%20TypeScript%20%7C%20Vite%208%20%7C%20Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)](package.json)

<br/>

**the.astro.os** es un entorno de escritorio web interactivo y retro-futurista con estética *Glassmorphism + Space Cyberpunk*. Integra un motor propio de físicas rígidas 2D en tiempo real (SAT OBB, momento de inercia y fricción), síntesis sonora procedural con Web Audio API, widgets multimedia dinámicos y un ecosistema completo de aplicaciones funcionales para escritorio y móviles.

[✨ Probar Demo En Vivo](https://theastrobruh.github.io/the.astro.os) • [🚀 Comenzar](#-instalaci%C3%B3n-y-uso-local) • [🌌 Características](#-caracter%C3%ADsticas-destacadas) • [📦 Aplicaciones](#-aplicaciones-del-sistema)

</div>

---

## 🌌 Características Destacadas

### ⚛️ 1. Motor de Físicas Rígidas 2D en Tiempo Real
Un simulador de cuerpos rígidos integrado directamente sobre el DOM y el canvas:
- **4 Modos Dinámicos:**
  - `Tactile`: Arrastre elástico, inercia suave y amortiguación natural.
  - `Gravity`: Caída libre y rebote con sub-stepping (4x) y estabilización numérica Baumgarte.
  - `Zero-G`: Deriva inercial orbital sin fricción y repulsión radial activa ante el cursor del ratón.
  - `Static`: Disposición fija y ordenada tradicional de escritorio.
- **Detección y Respuesta Físicamente Precisa:**
  - Detección de colisiones OBB (Oriented Bounding Box) mediante el **Teorema de Ejes Separadores (SAT)**.
  - Dinámica rotacional con cálculo exacto de momento de inercia:
    $$I = \frac{1}{12}m(w^2 + h^2)$$
  - Fricción tangencial de Coulomb, coeficientes de restitución personalizables y torque de péndulo reactivo al cursor.
- **Aislamiento Inteligente:** Las ventanas abiertas operan en capas superiores desacopladas para evitar colisiones involuntarias con los elementos del escritorio.

---

### 🎨 2. Interfaz Glassmorphism & Experiencia Responsive
- **Diseño Adaptativo Dual (Desktop / Mobile):**
  - **Desktop:** Dock flotante translúcido, menú inicio de acceso rápido y gestión de ventanas con capas z-index dinámicas.
  - **Mobile:** Barra superior de estado simplificada (física, reseteo de iconos y temas) y dock simétrico optimizado para navegación táctil sin superposición de widgets.
- **Widgets Multimedia en el Escritorio:** Soporte para GIFs e imágenes interactivas (`Dahyun.gif`, `Cosmos.jpg`), redimensionamiento en tiempo real, menú contextual y clonación de cuerpos físicos.
- **Astro.Radio Tray:** Reproductor de audio procedural y sintetizado en segundo plano minimizable directamente a la barra de tareas.
- **Fondo Estelar Dinámico:** Lienzo interactivo `StarfieldCanvas` que reacciona a la velocidad del ratón y modo de navegación.

---

## 📦 Aplicaciones del Sistema

| Aplicación | Icono / Rol | Descripción |
| :--- | :--- | :--- |
| **Astro.Verse** | 🪐 Explorador | Mapa estelar y simulador orbital del universo the.astro. |
| **CardGram** | 🃏 Coleccionable | Galería y showcase de cartas interactivas y cromos holográficos. |
| **Pressmark** | 📰 Publicación | Lector y gestor de artículos, blogs y notas de prensa espacial. |
| **Inkra** | ✍️ Editor Creativo | Entorno de redacción y maquetación visual libre de distracciones. |
| **Notes** | 📝 Utilidad | Libreta de notas rápidas con persistencia local. |
| **Paint** | 🎨 Creatividad | Lienzo de dibujo con pinceles, paletas de colores y exportación. |
| **Terminal** | 💻 Sistema | Interfaz de línea de comandos con scripts y utilidades de the.astro.os. |
| **Music (Astro.Radio)**| 📻 Audio | Sintetizador procedural Web Audio y sintonizador de pistas ambientales. |
| **YouTube** | 📺 Streaming | Reproductor integrado de contenidos multimedia. |
| **MediaFlow Studio** | 🎬 Multimedia | Panel de gestión y previsualización de assets, GIFs e imágenes dinámicas. |
| **Theme Studio** | 🎛️ Personalización| Selector y creador de temas de color, gradientes y opacidad glass. |
| **Icon Manager** | 📂 Personalización| Reordenamiento, visibilidad y configuración de iconos del escritorio. |
| **Control Panel** | ⚙️ Seguridad | Centro de administración del sistema protegido por PIN maestro (`0412`). |

---

## 🛠️ Stack Tecnológico

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite 8](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones:** [Motion](https://motion.dev/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API (síntesis procedural nativa)
- **AI Integración:** `@google/genai`

---

## 🚀 Instalación y Uso Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- `npm` o gestor de paquetes de tu preferencia (`pnpm`, `yarn`)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/theastrobruh/the.astro.os.git
   cd the.astro.os
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el sistema en ejecución.

4. **Verificación de tipos y build de producción:**
   ```bash
   # Comprobar tipos TypeScript
   npm run lint

   # Generar paquete optimizado para producción
   npm run build

   # Previsualizar el build localmente
   npm run preview
   ```

---

## 🌐 Despliegue en GitHub Pages

El proyecto cuenta con un workflow automatizado de CI/CD en `.github/workflows/deploy.yml`.

Al hacer `push` a la rama `main`, GitHub Actions compila automáticamente los archivos estáticos en `dist/` usando la ruta base `/the.astro.os/` y los publica en GitHub Pages.

Para configurarlo en tu propio fork:
1. Ve a **Settings → Pages** en tu repositorio de GitHub.
2. En **Build and deployment > Source**, selecciona **GitHub Actions**.
3. Realiza cualquier commit a `main` para activar el despliegue automático.

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` o el repositorio para más detalles.
