# assets/music

Coloca aquí tus canciones (`.mp3`, `.ogg`, `.wav`, `.m4a`).

## Cómo usarlas

### Opción A — Desde la app
Abre **Música & Radio → Cargar Carpeta / Archivos** y selecciona las
canciones. Se reproducen al instante (solo durante la sesión).

### Opción B — Biblioteca permanente
Agrega cada canción a `assets/manifest.json`:

```json
{
  "songs": [
    "assets/music/mi-cancion.mp3",
    { "name": "Intro Espacial", "url": "assets/music/intro.mp3" }
  ]
}
```

La app las agrega a la lista de reproducción al cargar y también se
pueden usar con los botones anterior / siguiente.

> Consejo: usa archivos ligeros (MP3 128–192 kbps) para que la carga del
> sitio siga siendo rápida.
