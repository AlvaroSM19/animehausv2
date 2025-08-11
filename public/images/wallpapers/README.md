# Wallpapers para One Piece Quest

Esta carpeta contiene los fondos de pantalla personalizables para la aplicación.

## Estructura recomendada:

```
wallpapers/
├── sunny-bg.jpg          # Fondo del Thousand Sunny
├── wano-bg.jpg           # Fondo del País de Wano  
├── marine-bg.jpg         # Fondo de Marineford
├── cake-bg.jpg           # Fondo de Whole Cake Island
└── previews/
    ├── sunny-preview.jpg    # Miniatura del Sunny (opcional)
    ├── wano-preview.jpg     # Miniatura de Wano (opcional)
    ├── marine-preview.jpg   # Miniatura de Marine (opcional)
    └── cake-preview.jpg     # Miniatura de Cake (opcional)
```

## Especificaciones recomendadas:

- **Resolución mínima:** 1920x1080px
- **Formato:** JPG o WebP
- **Tamaño máximo:** 2MB por imagen
- **Aspect ratio:** 16:9 o similar

## Notas:

- Las imágenes de preview son opcionales (actualmente se usan gradientes de colores)
- Los wallpapers se aplicarán como `background-image` con `bg-cover` y `bg-center`
- Se añade automáticamente un overlay semitransparente para mejorar la legibilidad

## Para añadir nuevos wallpapers:

1. Coloca la imagen en esta carpeta
2. Actualiza el array `wallpapers` en `src/components/WallpaperSelector.tsx`
3. Añade el nuevo gradient de preview correspondiente
