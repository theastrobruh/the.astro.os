<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=200&section=header&text=the.astro.os&fontSize=72&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Cosmic%20Physics%20Web%20Operating%20System%20v.0.5.0&descAlignY=58&descSize=18" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-theastrobruh.github.io-7000FF?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/the.astro.os)
[![Repo](https://img.shields.io/badge/GitHub-the.astro.os-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/theastrobruh/the.astro.os)
[![Version](https://img.shields.io/badge/Version-v.0.5.0-FFB800?style=for-the-badge)](package.json)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Vite%208%20%7C%20Tailwind%20v4-00F0FF?style=for-the-badge&logo=react&logoColor=white)](package.json)

<br/>

> **the.astro.os v.0.5.0** — Sistema operativo web interactivo con estética *Glassmorphism + Space Cyberpunk*, motor de físicas rígidas 2D (SAT OBB, momento de inercia rotacional, fricción de Coulomb), audio procedural Web Audio, widgets GIF/imagen arrastrables, diseño responsive Desktop/Mobile y aplicaciones integradas.

</div>

---

## Características Principales

### 1. Motor de Físicas Rígidas 2D (SAT OBB)
- **4 Modos de Física:** `Tactile`, `Gravity` (caída libre con sub-stepping 4x y estabilización Baumgarte), `Zero-G` (deriva orbital y repulsión radial) y `Static`.
- **Colisiones Rígidas Exactas:** Detección OBB por Separating Axis Theorem (SAT), transferencia de momento angular $I = \frac{1}{12}m(w^2+h^2)$, fricción tangencial de Coulomb y torque de péndulo al arrastrar.
- **Ventanas Limpias:** Las ventanas abiertas nunca colisionan con los íconos del escritorio.

### 2. Barra de Tareas, Menú Inicio, Mobile & Widgets
- **Widgets GIF / Imagen en el Escritorio:** Incluye `Dahyun.gif` y `Cosmos.jpg`, clonación física, redimensionamiento proporcional y menú contextual (en Mobile se ubican compactos en la zona inferior sin interferir con los íconos).
- **Interfaz Simétrica Desktop & Mobile:** Barra superior móvil con controles centrados (Física, Resetear íconos y Temas), dock inferior simétrico con botón Home centrado y barra minimalista con íconos en Desktop.
- **Menú Inicio & Astro.Radio Tray:** Acceso rápido a todas las apps, widgets en vivo y minimizado persistente de música en reproducción.

### 3. Aplicaciones Integradas
- **Astro.Verse** · **CardGram** · **Pressmark** · **Inkra** · **Notes** · **Paint** · **Terminal** · **Music (Astro.Radio)** · **YouTube** · **MediaFlow Studio** · **Theme Studio** · **Icon Manager** · **Control Panel (PIN `0412`)**

---

## Desarrollo Local

```bash
npm install
npm run dev
npm run lint
npm run build
```

---

## Despliegue en GitHub Pages

El repositorio incluye un flujo automático en `.github/workflows/deploy.yml` que compila el proyecto con Vite (`base: '/the.astro.os/'` automático en GitHub Actions) y lo publica en GitHub Pages cada vez que haces `push` a `main`.

1. Sube los cambios a tu repositorio:
   ```bash
   git init
   git remote add origin https://github.com/theastrobruh/the.astro.os.git
   git add .
   git commit -m "feat: upgrade the.astro.os v0.5.0 with React, TypeScript & SAT 2D physics"
   git branch -M main
   git push -u origin main --force
   ```
2. En GitHub, ve a **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**.
