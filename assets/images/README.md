# assets/images

Coloca aquí las imágenes (`.jpg`, `.png`, `.webp`, `.gif`) que quieras
mostrar como widgets en el escritorio.

## Cómo usarlas

### Opción A — Desde la app (sin tocar código)
Usa **Inicio → 🖼️ Nuevo Widget de Imagen** y elige uno o varios archivos.
El widget queda guardado en el navegador y puedes moverlo y redimensionarlo.

### Opción B — Cargarlas desde esta carpeta
Agrega cada imagen a `assets/manifest.json`:

```json
{
  "images": [
    "assets/images/cosmos.jpg",
    { "src": "assets/images/ciudad.png", "label": "AstroCity" }
  ]
}
```

Al recargar la app, cada imagen aparece como un widget del escritorio.
Si borras un widget, no vuelve a aparecer (se guarda la preferencia).
