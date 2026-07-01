# Checklist de Validación Responsive

## 1. Dispositivos Móviles (Android / iOS)
- [ ] **Android Chrome (Viewport 360x800):** El menú hamburguesa se expande sin superposición.
- [ ] **Android Firefox:** El scroll vertical es suave y no hay scroll horizontal accidental.
- [ ] **iOS Safari (iPhone 13/14 Viewports):** Los botones no se solapan con la barra de navegación nativa inferior.
- [ ] **iOS Chrome:** Las animaciones de Framer Motion se ejecutan fluidamente a 60fps.
- [ ] **Visualización Landscape (Horizontal):** Los grids de proyectos pasan de 1 a 2 columnas de manera armoniosa.

## 2. Tabletas (iPad / Android Tablets)
- [ ] **iPad Portrait (768x1024):** El menú de navegación colapsa en hamburguesa o se muestra completo de forma legible sin desbordamientos.
- [ ] **iPad Landscape:** Grid de habilidades e iconos se renderiza correctamente a 3 columnas.

## 3. Escritorio (Windows / macOS / Linux)
- [ ] **FHD (1920x1080):** Contenedores principales limitados por ancho máximo (`max-w-7xl`).
- [ ] **4K (3840x2160):** Elementos centrados sin distorsión de imágenes.
- [ ] **Safari en macOS:** Las transiciones de color de modo oscuro son consistentes en fondos y textos.
