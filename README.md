<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=200&section=header&text=the.astro.os&fontSize=72&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Cosmic%20Physics%20Web%20Operating%20System%20v3.0&descAlignY=58&descSize=18" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-theastrobruh.github.io-7000FF?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/the.astro.os)
[![Deploy](https://img.shields.io/badge/CI-GitHub%20Actions-00F0FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/theastrobruh/the.astro.os/actions/workflows/deploy.yml)
[![Repo](https://img.shields.io/badge/GitHub-the.astro.os-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/theastrobruh/the.astro.os)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Vite%208%20%7C%20Tailwind%20v4-00F0FF?style=for-the-badge&logo=react&logoColor=white)](package.json)
[![License](https://img.shields.io/badge/License-MIT-FFB800?style=for-the-badge)](LICENSE)

<br/>

> **the.astro.os v3.0** — Un sistema operativo web interactivo y de alto rendimiento que combina una estética visual retro-futurista *Glassmorphism + Space Cyberpunk* con un motor de físicas 2D en tiempo real, efectos sonoros sintetizados y una suite completa de aplicaciones de productividad y creatividad.

</div>

---

## ✨ ¿Qué es the.astro.os?

**the.astro.os** es una plataforma de escritorio simulada construida sobre **React 19**, **TypeScript** y **Vite 8** con **Tailwind CSS v4**. Todo el sistema corre directamente en el navegador con aceleración por hardware, soporte para gestos táctiles, ratón y lápiz, persistencia en `localStorage`, y un motor de físicas con inercia, colisiones elásticas y ondas expansivas en el fondo cósmico.

---

## 🚀 Características Principales

### 🌌 1. Motor de Físicas 2D & Interactividad Háptica
- **4 Modos de Física:**
  - 💨 **Inercia Táctil (`tactile`):** Fricción natural en superficie y amortiguamiento elástico al arrastrar y soltar íconos y widgets.
  - 🍎 **Gravedad Terrestre (`earth`):** Caída libre simulada a 9.8m/s² con colisiones y rebotes.
  - 🪐 **Zero-G (`zero-g`):** Ingravidez espacial con flotación continua y repulsión reactiva al puntero del mouse.
  - 📌 **Clásico Fijo (`static`):** Organización estática sin traslación física.
- **Colisiones AABB:** Rebotes elásticos entre íconos y widgets con cálculo de masa e impulso.
- **Retroalimentación Visual & Sonora:** Cada impacto genera ondas de choque en el lienzo de estrellas (`StarfieldCanvas`) y sonidos sintetizados en tiempo real mediante **Web Audio API**.

### 📱 2. Diseño Totalmente Responsivo & Modo Móvil
- **Layout Adaptativo:** Detección de dispositivos (Móvil `< 768px`, Tablet `768px - 1180px`, Escritorio `> 1180px`).
- **Barra de Estado Móvil (`MobileStatusBar`):** En smartphones, el reloj y estado del sistema se trasladan a una barra superior pulida con acceso rápido a zonas horarias y sonido.
- **Dock Flotante:** Acceso simétrico al menú de inicio y herramientas rápidas.

### 🖼️ 3. Widgets Multimedia & Generación Procedural
- **Widgets de Imágenes y GIFs:** Soporte para arrastrar, reposicionar y redimensionar con bloqueo de aspect ratio (usando `Shift`).
- **Motor Procedural 60 FPS (`AnimatedWidgetVisual`):** Si una imagen remota falla o se carga sin URL, el sistema renderiza automáticamente animaciones en canvas en tiempo real con 5 escenas espaciales (`cosmos`, `city`, `pulse`, `saturn`, `prism`).
- **Menú contextual:** Clic secundario para redimensionar a tamaños predefinidos o eliminar widgets del escritorio.

---

## 🖥️ Suite de Aplicaciones Integradas

| Aplicación | Acceso | Descripción |
| :--- | :---: | :--- |
| **Astro.Verse** | 🧑‍🚀 | Perfil del creador (*theAstroBruh*) y hub central de proyectos (CardGram, Inkra, BioHub, GitHub). |
| **Pintura Studio (`Astro.Paint`)** | 🎨 | Lienzo de dibujo con pinceles, marcador, figuras geométricas, bote de pintura, selector de color, historial Deshacer/Rehacer y opción de **fijar creaciones directamente como widgets en el escritorio**. |
| **Astro.Notes** | 📝 | Suite 3-en-1: Editor de notas Markdown con pestañas múltiples y previsualización, gestor de tareas To-Do con prioridades (alta/media/baja) y glosario interactivo. |
| **Astro Console (`Terminal`)** | 💻 | Terminal interactiva simulada (`bash v2.5`) con historial y comandos (`help`, `open`, `physics`, `theme`, `burst`, `draw`, `clear`). |
| **Theme Studio (`Theme.XP`)** | 🌈 | Personalizador en vivo de gradientes, fondos cósmicos, intensidad de desenfoque de cristal (*glass blur*), velocidad y cantidad de estrellas. |
| **Astro.Radio (`Música`)** | 🎵 | Reproductor triple: transmisiones de radio online (Synthwave, Lofi, Cyberpunk), reproductor de pistas locales de audio y sintetizador analógico procedural offline con visualizador de espectro en canvas. |
| **MediaFlow Studio** | 🎬 | Estudio de edición gráfica: recorte, rotación, espejado, filtros cyberpunk/vivid, marcas de agua personalizadas y generador de widgets GIF. |
| **CardGram** | 🃏 | Creador de tarjetas de presentación digital e identidades web interactivas con estética glassmorphism. |
| **Icon Manager** | 🖼️ | Personalización de cada ícono del sistema mediante subida de imágenes locales o GIFs animados. |
| **Panel de Control Admin** | 👑 | Centro de administración global protegido por PIN (`0412` por defecto). Permite alternar físicas, disparar ráfagas de impulsos, configurar seguridad, resetear widgets y exportar/importar estados del sistema en formato JSON. |

---

## 🛠️ Herramientas de Escritorio Extras

- **Lienzo de Dibujo sobre el Escritorio:** Activa una capa de dibujo directo sobre la pantalla para bocetar o tomar notas rápidas sin abrir ventanas.
- **Reloj Mundial Multi-Zona:** Monitorea simultáneamente hasta 4 husos horarios configurables (Tokio, Nueva York, Londres, Seúl, etc.).
- **Pantalla de Bienvenida:** Autenticación con selección de perfil de Invitado o Administrador mediante teclado numérico háptico.

---

## 📦 Instalación y Desarrollo Local

### Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- `npm` o gestor de paquetes de tu preferencia

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/theastrobruh/the.astro.os.git
cd the.astro.os

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo en http://localhost:3000
npm run dev
```

### Scripts Disponibles

```bash
npm run dev      # Inicia el entorno de desarrollo local con Vite
npm run build    # Compila el proyecto para producción en dist/
npm run preview  # Previsualiza la compilación de producción localmente
npm run lint     # Comprueba tipos con tsc --noEmit
```

---

## 🚀 Despliegue

El proyecto incluye un flujo de integración continua con **GitHub Actions** configurado para compilar y desplegar automáticamente en **GitHub Pages** en cada push a la rama principal (`main`). La configuración de base en `vite.config.ts` detecta el entorno automáticamente para resolver las rutas relativas.

---

## 📜 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.

<div align="center">
  <sub>Diseñado y desarrollado con pasión por <b>theAstroBruh</b> 🪐</sub>
</div>
