<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=200&section=header&text=the.astro.os&fontSize=72&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Cosmic%20Physics%20Web%20Operating%20System%20v.0.5.0&descAlignY=58&descSize=18" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-theastrobruh.github.io-7000FF?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/the.astro.os)
[![Deploy](https://img.shields.io/badge/CI-GitHub%20Actions-00F0FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/theastrobruh/the.astro.os/actions/workflows/deploy.yml)
[![Repo](https://img.shields.io/badge/GitHub-the.astro.os-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/theastrobruh/the.astro.os)
[![Version](https://img.shields.io/badge/Version-v.0.5.0-FFB800?style=for-the-badge)](package.json)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Vite%208%20%7C%20Tailwind%20v4-00F0FF?style=for-the-badge&logo=react&logoColor=white)](package.json)
[![License](https://img.shields.io/badge/License-MIT-34D399?style=for-the-badge)](LICENSE)

<br/>

> **the.astro.os v.0.5.0** — High-performance interactive web operating system blending *Glassmorphism + Space Cyberpunk* visuals with a real-time 2D physics engine, procedural Web Audio soundscapes, YouTube streaming, and mobile responsiveness.

</div>

---

## ✨ Features Overview

### 🌌 1. 2D Physics Kernel & Haptics
- **4 Physics Modes:**
  - 💨 **Tactile:** Natural surface friction and elastic throwing inertia for icons and widgets.
  - 🍎 **Gravity:** Simulated 9.8m/s² vertical free-fall with restitution and bouncing.
  - 🪐 **Zero-G:** Space orbital drift with interactive cursor repulsion.
  - 📌 **Static:** Standard fixed desktop layout.
- **AABB Elastic Collisions:** Impact moment transfer between icons and widgets with real-time shockwave particles on the starfield and Web Audio synthesizers.

### 🪟 2. Taskbar & Ares-Style Tray Minimized Music
- **Quick Icon Reset & Theme Switcher:** The desktop icon reset button is positioned right next to the 2D physics kernel selector and theme studio button.
- **Ares-Style Background Music:** Closing the Music app (`Astro.Radio`) minimizes it into a pulsing system tray indicator in the lower-right corner. Right-click or tap to reopen or exit.
- **Native Context Menu Protection:** Browser default inspection and context menus are suppressed in favor of native OS contextual controls.

### 📱 3. Streamlined Mobile Mode
- **Calibrated Windows:** Eliminates oversized layouts on small screens (`< 768px`). Windows open within safe bounds (`calc(100vh - 94px)`) without clipping taskbars.
- **Adaptive Top Status Bar:** Time, timezone, sound toggles and system indicators sit compactly at the top.
- **No-Scroll Window Design:** Apps like **Astro.Verse** and **Music** are compact and fit completely into their initial viewport.

### 🪟 4. Windows-Style Start Menu & Live Widgets
The Start Menu features app buttons alongside **4 live Windows-style widgets**:
1. 📷 **Image of the Day:** Astronomy picture with survey meta.
2. 🎬 **GIF of the Day:** Curated looped animation.
3. 🌌 **Cosmos News:** Real-time space exploration news feed.
4. ⚡ **Tech Wire:** Web development & technology announcements.

### 🎬 5. Quick GIF Search & Widget Spawner
- **MediaFlow Studio:** Integrated GIF finder with keyword filters (`cyberpunk`, `space`, `anime`, `pixel`, etc.), direct URL spawner, and one-click pin to desktop.

### ▶ 6. YouTube Player App
- Built-in video player with curated lo-fi/synthwave streams and direct search/URL embed support.

### 🃏 7. CardGram in Mobile Viewport
- CardGram launches in an authentic smartphone frame mockup, providing a native mobile web identity experience.

---

## 🖥️ App Windows Summary

| App | Icon | Description |
| :--- | :---: | :--- |
| **Astro.Verse** | 🧑‍🚀 | theAstroBruh's bio, links, and ecosystem projects in a compact, no-scroll card. |
| **YouTube** | ▶ | Video & live stream player with search and suggested cosmic playlists. |
| **Music (Astro.Radio)** | 📻 | Triple music player (Online Streams, Local Files, Offline Synth) with Ares-style tray minimize. |
| **CardGram** | 🃏 | Digital cards & web identity platform running inside a mobile smartphone viewport. |
| **Paint Studio** | 🎨 | Drawing canvas with brushes, shapes, bucket fill, and one-click desktop pinning. |
| **Astro.Notes** | 📝 | Markdown editor with multi-note tabs, priority To-Do checklists, and glossary. |
| **Terminal** | 💻 | Bash console (`v2.5`) with interactive commands (`open`, `physics`, `theme`, `burst`, `draw`). |
| **MediaFlow Studio** | 🖼️ | Image transforms (rotate, crop, cyberpunk filters, watermark) and quick GIF search. |
| **Theme Studio** | 🌈 | Live custom gradients, glassmorphism blur controls, and starfield speed tuning. |
| **Icon Manager** | 🧩 | Upload custom PNG/JPG/GIF icons for desktop applications. |
| **Control Panel** | 👑 | Master admin suite protected by PIN (`0412`). |

---

## 🌍 World Clocks (Expanded Timezones)
Supports up to 4 concurrent taskbar clocks with extended worldwide regions:
- 🇺🇸 New York (`NYC`), Los Angeles (`LAX`)
- 🇵🇪 Lima (`LIM`), 🇲🇽 Mexico City (`MEX`), 🇨🇴 Bogota (`BOG`)
- 🇦🇷 Buenos Aires (`BUE`), 🇧🇷 Sao Paulo (`SAO`), 🇨🇱 Santiago (`SCL`)
- 🇬🇧 London (`LON`), 🇪🇸 Madrid (`MAD`), 🇫🇷 Paris (`PAR`), 🇩🇪 Berlin (`BER`)
- 🇯🇵 Tokyo (`TYO`), 🇰🇷 Seoul (`SEL`), 🇸🇬 Singapore (`SIN`), 🇦🇪 Dubai (`DXB`)
- 🇦🇺 Sydney (`SYD`), 🇳🇿 Auckland (`AKL`)

---

## 📦 Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/theastrobruh/the.astro.os.git
cd the.astro.os

# Install dependencies
npm install

# Start local dev server at http://localhost:3000
npm run dev

# Lint & build production bundle
npm run lint
npm run build
```

---

## 📜 License

MIT License. Designed and developed by **theAstroBruh** 🪐.
