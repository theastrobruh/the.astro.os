# 🌌 the.astro.os

> A web-based operating system experience — glassmorphism desktop, draggable windows, starfield background & more. Pure HTML/CSS/JS, zero build step.

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-7000FF?style=flat&logo=github)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Live-00F0FF?style=flat&logo=rocketdotchat&logoColor=white)](.github/workflows/deploy.yml)
[![Stack](https://img.shields.io/badge/Stack-HTML%20%2F%20CSS%20%2F%20JS-FF007A?style=flat&logo=html5&logoColor=white)](index.html)

---

## ✨ Features

| App Window | Description |
|---|---|
| 🧑‍🚀 **Astro Profile** | Personal card / about section |
| 🃏 **CardGram Portfolio** | Glassmorphism portfolio cards |
| 🎨 **Paint / Draw** | Canvas drawing tool with touch support |
| 📝 **Notes, TODO & Glossary** | Sticky-note suite |
| 💻 **Terminal** | Simulated console |
| 🎨 **Theme & Color Studio** | Live theme customizer |
| 📁 **Projects System Drive** | Project explorer |
| 🐙 **GitHub Pages & Actions Center** | Deployment dashboard |
| 🖼️ **Custom Icon Manager** | Personalize desktop icons |

**+ Desktop extras:** starfield canvas, draggable media widgets, multi-timezone clock, desktop drawing overlay, icon rearrange & reset.

---

## 🚀 Deploy

### GitHub Pages (auto, via Actions)

1. Fork / push this repo to GitHub
2. Go to **Settings → Pages → Source** → select **GitHub Actions**
3. Push to `main` — the workflow deploys automatically

**Live at:** `https://YOUR_USERNAME.github.io/the.astro.os`

### Local

```bash
# Any static server works — example with Python
python -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in the browser.

---

## 🗂️ Structure

```
the.astro.os/
├── index.html              # Entire app (self-contained)
├── the_astro_os.html       # Original source file
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages auto-deploy
└── README.md
```

---

## 🛠️ Stack

- **HTML5 / CSS3 / Vanilla JS** — zero dependencies, zero build
- **Tailwind CSS** — via CDN
- **Google Fonts** — Outfit + Space Grotesk
- **Canvas API** — starfield & drawing overlay

---

## 📄 License

MIT — do whatever you want, attribution appreciated. ⭐
