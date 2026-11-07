<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=200&section=header&text=the.astro.os&fontSize=72&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Web%20Operating%20System%20by%20theAstroBruh&descAlignY=58&descSize=18" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-theastrobruh.github.io-7000FF?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/the.astro.os)
[![Deploy](https://img.shields.io/badge/CI-GitHub%20Actions-00F0FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/theastrobruh/the.astro.os/actions/workflows/deploy.yml)
[![Repo](https://img.shields.io/badge/GitHub-the.astro.os-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/theastrobruh/the.astro.os)
[![Stack](https://img.shields.io/badge/Stack-HTML%20%2F%20CSS%20%2F%20JS-00F0FF?style=for-the-badge&logo=html5&logoColor=white)](index.html)
[![License](https://img.shields.io/badge/License-MIT-FFB800?style=for-the-badge)](LICENSE)

<br/>

> **A web-based operating system experience** — glassmorphism desktop, draggable windows, real physics drag, starfield canvas, multi-timezone clock & more. Pure HTML/CSS/JS, zero build step.

</div>

---

## ✨ What is the.astro.os?

**the.astro.os** is a fully self-contained web "operating system" running directly in the browser. No frameworks, no build tools, no backend — just one HTML file with a stunning glassmorphism UI, draggable desktop icons, media widgets, app windows, and an aesthetic inspired by retro OS + futuristic space vibes.

---

## 🖥️ App Windows

| App | Icon | Description |
|-----|------|-------------|
| **Astro.Bio** | 🧑‍🚀 | Personal profile card & about section |
| **Projects Hub** | 🃏 | CardGram, Inkra & BioHub — all projects |
| **Astro.Paint** | 🎨 | Canvas drawing with tools + touch support |
| **Astro.Notes** | 📝 | Text editor, To-Do list & Glossary suite |
| **Terminal** | 💻 | Simulated console with commands |
| **Theme.XP** | 🌈 | Live theme & color studio with presets |
| **Projects.sys** | 📁 | System drive project explorer |
| **GitHub.Deploy** | 🐙 | GitHub Pages & Actions deployment center |
| **Icon Manager** | 🖼️ | Personalize desktop icons with custom images |

**Desktop extras:** Starfield canvas animation, draggable media widgets (GIFs + photos) with right-click context menu (resize/delete), multi-timezone clock, desktop drawing overlay, icon rearrange & reset.

**Mobile / responsive mode:** On screens under 768px the OS switches to a smartphone layout. The clock, date and system info move to a top status bar, the Start button sits centered in the bottom dock (symmetric quick actions on both sides), and app windows fill the space between both bars. Icon positions and widget layouts are saved separately per device type.

**Widgets:** every widget can be dragged with mouse, touch or pen, and resized freely from its bottom-right corner (hold `Shift` to keep the aspect ratio). Sizes and positions are saved automatically. Create new widgets from **Start → Nuevo Widget de Imagen**.

**Asset folders:** drop your own media in `assets/icons/`, `assets/images/` and `assets/music/`. Add files to `assets/manifest.json` to auto-load images as desktop widgets and songs into the player — see the README inside each folder.

---

## 🌐 My Other Projects

<div align="center">

<table>
<tr>
<td align="center" width="33%">

### 🃏 CardGram

[![CardGram](https://img.shields.io/badge/CardGram-Visit%20Project-00F0FF?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/CardGram/#/home)

Digital cards & web identity platform. Glassmorphism interactive cards, profiles, and portfolios.

</td>
<td align="center" width="33%">

### ✒️ Inkra

[![Inkra](https://img.shields.io/badge/Inkra-Visit%20Project-7000FF?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/Inkra/)

Creative digital design & illustration tool. Interactive canvases, palettes and export.

</td>
<td align="center" width="33%">

### 🧬 BioHub

[![BioHub](https://img.shields.io/badge/BioHub-Visit%20Project-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://theastrobruh.github.io/BioHub/)

Personal bio hub. Links, projects & digital presence centralized in one place.

</td>
</tr>
</table>

[![GitHub](https://img.shields.io/badge/All%20Projects-github.com%2Ftheastrobruh-white?style=for-the-badge&logo=github&logoColor=black)](https://github.com/theastrobruh)

</div>

---

## 🚀 Deploy

### GitHub Pages (auto, via Actions)

1. Go to **Settings → Pages → Source** → select **GitHub Actions**
2. Push to `main` — deploys automatically via the included workflow

**Live:** https://theastrobruh.github.io/the.astro.os

### Local

```bash
python -m http.server 8080
# Then open http://localhost:8080
```

Or open `index.html` directly in the browser — no server needed.

---

## 🗂️ Structure

```
the.astro.os/
├── index.html              # Entire app — self-contained, single file
├── the_astro_os.html       # Original source file
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages auto-deploy workflow
└── README.md
```

> [!NOTE]
> The entire OS lives in **one HTML file** (`index.html`). No build step, no dependencies to install. Everything — styles, logic, app windows, starfield — is embedded.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core** | HTML5 / CSS3 / Vanilla JS — zero dependencies |
| **Styling** | Tailwind CSS via CDN |
| **Fonts** | Google Fonts — Outfit + Space Grotesk |
| **Graphics** | Canvas API — starfield, shooting stars & drawing overlay |
| **Storage** | localStorage — icon positions, theme, timezone prefs |
| **Deploy** | GitHub Actions → GitHub Pages |

---

## ⚡ Features Deep-Dive

```
🌟 Starfield Background        — 300 animated stars + shooting stars on Canvas
🪟 Glassmorphism Windows       — Draggable, minimizable, z-indexed app windows
🖱️ Desktop Icons               — Drag-and-drop, persistent positions, custom images
🖼️ Media Widgets               — GIFs & images; right-click to resize or delete
🎨 Desktop Draw Mode           — Draw directly on the screen (touch + mouse)
🖌️ Astro Paint Studio          — Full drawing app: brush, line, rect, circle, eraser
📝 Notes Suite                 — Editor, To-Do list & searchable Glossary
💻 Terminal                    — Console with commands: help, draw, paint, notes, clear
🌈 Theme Studio                — Live color picker + 4 presets (Sunset, Cyber, Matrix, Synth)
🕐 Multi-Timezone Clock        — Up to 4 simultaneous world clocks, configurable
📱 Mobile Support              — Draggable FAB nav, touch events throughout
```

---

## 📄 License

MIT — do whatever you want, attribution appreciated. ⭐

---

<div align="center">

Made with 💜 by [theAstroBruh](https://github.com/theastrobruh)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=100&section=footer" width="100%"/>

</div>
