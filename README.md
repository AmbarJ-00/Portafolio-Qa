# QA Engineer Professional Portfolio (SPA)

Este es un portafolio web Single Page Application (SPA) de alta fidelidad, diseñado específicamente para profesionales del aseguramiento de calidad (QA). El diseño visual combina una estética moderna y limpia (minimalista y futurista) con los colores institucionales definidos (Gris ceniza, Azul marino, Azul eléctrico, Lila, Blanco, Negro) en temas claro y oscuro automáticos y manuales.

---

## 🛠️ Stack Tecnológico

- **Núcleo:** JavaScript (ES6+), React 18
- **Construcción:** Vite
- **Estilos:** Tailwind CSS (con class-based dark mode)
- **Rutas:** React Router DOM (v6)
- **Animaciones:** Framer Motion (para transiciones fluidas de páginas y modales)
- **Formularios:** React Hook Form + Zod (validaciones avanzadas del lado del cliente)
- **Iconografía:** Lucide React
- **Internacionalización:** i18next + react-i18next (Español e Inglés)
- **Despliegue:** Vercel

---

## 📐 Arquitectura

El diseño arquitectónico separa estrictamente la capa de presentación (componentes y vistas de React) de la capa de configuración de datos. Todo el contenido es dinámico y recargable:

```
qa-portfolio/
├── config/
├── docs/                     # Guía de administración del portafolio (gitignored)
├── public/                   # SEO e iconos (robots.txt, sitemap.xml, manifest)
├── qa/                       # Directorio privado de validación y checklists
└── src/
    ├── components/           # Componentes atómicos e interactivos
    ├── context/              # Gestores de estado (Tema claro/oscuro)
    ├── data/
    │   ├── translations/     # Diccionarios i18n (es.js, en.js)
    │   └── portfolioData.js  # Configuración e información estructurada
    ├── pages/                # Vistas de la aplicación (SPA Router)
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── i18n.js
```

---

## 🚀 Instalación y Ejecución Local

Este proyecto utiliza estrictamente **PNPM**.

### 1. Clonar e Instalar Dependencias

```bash
pnpm install
```

### 2. Ejecutar Servidor de Desarrollo

```bash
pnpm run dev
```

El servidor local se iniciará automáticamente en `http://localhost:3000`.

### 3. Compilar para Producción

```bash
pnpm run build
```

La compilación optimizada se exportará al directorio `dist/`.

---

## 🧪 Pruebas de Calidad (QA)

El proyecto incluye un conjunto de Smoke Tests automáticos que verifican la integridad estructural de los diccionarios de internacionalización y referencias en las configuraciones.

Para ejecutar los Smoke Tests locales:

```bash
node qa/smoke-tests.js
```

---

## 🌐 Despliegue en Vercel

El portafolio está optimizado para su despliegue inmediato en Vercel, incluyendo redirecciones de rutas del lado del cliente (`vercel.json`).

### Despliegue en Staging:
```bash
vercel
```

### Despliegue en Producción:
```bash
vercel --prod
```
