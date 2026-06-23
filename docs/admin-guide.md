# Manual del Administrador — Portafolio Profesional QA

Este documento es una guía administrativa privada para realizar modificaciones, agregar datos, cambiar el esquema visual, expandir idiomas o desplegar el portafolio en producción.

---

## 🏗️ Estructura de Dependencias de Contenido

El portafolio sigue un patrón de desacoplamiento estricto. La capa de presentación utiliza claves lógicas de traducción (`translationKey`) para renderizar cadenas localizadas.

```mermaid
graph TD
    portfolioData.js -- Contiene IDs, iconos, números y claves de traducción --> ViewComponents[src/pages/*.jsx]
    translations/es.js -- Mapea claves a texto en Español --> ViewComponents
    translations/en.js -- Mapea claves a texto en Inglés --> ViewComponents
    i18n.js -- Inicializa cargadores y localStorage --> ViewComponents
```

---

## ✍️ Guía de Modificaciones

### 1. ¿Cómo editar textos generales?
Los textos de la interfaz (títulos de secciones, etiquetas de botones, mensajes de validación) se modifican exclusivamente en:
- `src/data/translations/es.js` (Español)
- `src/data/translations/en.js` (Inglés)

*Ejemplo de adición de clave:*
Si deseas cambiar el saludo inicial del Hero, edita la clave `home.hero_title` en ambos diccionarios.

---

### 2. ¿Cómo agregar o editar Proyectos?
Todos los proyectos se configuran en `src/data/portfolioData.js` dentro del array `projects`.

Cada proyecto tiene la siguiente estructura básica:
```javascript
{
  id: "mi-nuevo-proyecto",
  titleKey: "projects.nuevoproyecto.title",
  category: "Categoría de Prueba",
  descriptionKey: "projects.nuevoproyecto.description",
  demo: "https://midemo.com",
  repository: "https://github.com/usuario/repo",
  integrations: ["Postman", "Cypress", "CI/CD"],
  metrics: {
    coverage: 95,
    improvements: 30,
    riskCoverage: 98,
    findingsCritical: 5,
    bugsResolved: 20,
    ambiguitiesFound: 2,
    qualityImpact: "A"
  },
  enableMetrics: true,
  translationKey: "projects.nuevoproyecto"
}
```

**Paso Obligatorio:** Posteriormente, debes agregar las traducciones correspondientes en `es.js` y `en.js`:
```javascript
// En es.js:
projects: {
  // ...
  nuevoproyecto: {
    title: "Mi Nuevo Proyecto Automático",
    description: "Breve resumen explicativo...",
    strategy_summary: "Detalle de estrategia de prueba...",
    risks: "1. Riesgo A\n2. Riesgo B",
    bugs_detailed: "1. Bug A\n2. Bug B"
  }
}
```

---

### 3. ¿Cómo agregar o editar Certificaciones?
Las certificaciones se configuran en el array `certifications` de `src/data/portfolioData.js`.

```javascript
{
  id: "cert-id",
  titleKey: "certs.nombrecert.title",
  authority: "Entidad Emisora",
  image: "URL_DE_IMAGEN_O_PATH_LOCAL",
  tools: ["Herramienta A", "Herramienta B"],
  integrations: ["Integración A"],
  translationKey: "certs.nombrecert"
}
```

Debes agregar el mapeo de textos correspondientes en los diccionarios `es.js` y `en.js`:
```javascript
certs: {
  nombrecert: {
    title: "Título de la Certificación",
    desc: "Resumen detallado de los conocimientos adquiridos..."
  }
}
```

---

### 4. ¿Cómo agregar o editar Documentación QA?
Las plantillas de documentación interactiva que se muestran en el módulo `/documentation` se estructuran en `src/data/portfolioData.js` bajo `documentation.templates`.

Puedes modificar los parámetros estructurales (`parameters`) y las preguntas auditoras (`questions`) directamente como cadenas de texto no localizadas (ya que suelen ser especificaciones técnicas universales), o bien añadir claves de traducción si el cliente final lo requiere.

---

### 5. ¿Cómo cambiar colores y estilos globales?
La paleta se encuentra centralizada en `tailwind.config.js` bajo `theme.extend.colors.brand`:
- `ash`: Gris ceniza (niveles 50 a 900).
- `navy`: Azul marino (niveles 50 a 950).
- `electric`: Azul eléctrico.
- `lilac`: Lila.

Si deseas modificar el color de acento principal (por ejemplo, el azul eléctrico), cambia el valor hexadecimal en `brand.electric.500`. Tailwind propagará el cambio a todos los componentes que usen clases como `text-brand-electric-500` o `bg-brand-electric-500`.

---

### 6. ¿Cómo agregar un nuevo Idioma (ej. Portugués)?
1. Crea el diccionario correspondiente: `src/data/translations/pt.js`.
2. Exporta el objeto con la misma estructura exacta de claves que `es.js`.
3. Importa el diccionario en `src/i18n.js`:
   ```javascript
   import { pt } from './data/translations/pt.js';
   ```
4. Agrega el recurso dentro de la configuración de `i18n.init`:
   ```javascript
   resources: {
     es: { translation: es },
     en: { translation: en },
     pt: { translation: pt }
   }
   ```
5. El selector de idioma en `Navbar.jsx` detectará automáticamente o puedes adaptarlo para ciclar entre los tres lenguajes disponibles.

---

## 🚀 Plan de Despliegue en Vercel

1. Asegúrate de tener instalado el CLI de Vercel globalmente o vía PNPM:
   ```bash
   pnpm add -g vercel
   ```
2. Ejecuta una compilación local para verificar que no haya lints ni errores de compilación:
   ```bash
   pnpm run build
   ```
3. Ejecuta `vercel` para subir un despliegue de staging y previsualizar en la nube.
4. Si todo es correcto, promueve a producción mediante:
   ```bash
   vercel --prod
   ```
Vercel configurará automáticamente el SPA basándose en las reglas del archivo [vercel.json](file:///C:/Users/ambar/.gemini/antigravity-ide/scratch/qa-portfolio/vercel.json) para asegurar que el enrutador de React Router no devuelva errores 404 al recargar páginas internas.

---

## 🔑 Acceso y Configuración del Backoffice (Administrador)

Este panel de administración privado permite gestionar de manera dinámica los datos cargados desde el servidor de base de datos MySQL.

### 1. Acceso en Entorno Local

* **Ruta de acceso:** `http://localhost:3000/backoffice/login` (o el puerto local configurado por el servidor de desarrollo Vite/Express).
* **Requisitos:**
  * Tener ejecutando la base de datos MySQL local configurada en el archivo `.env`.
  * Iniciar el servidor backend (`node server.js`) en el puerto 3001.
  * Iniciar el servidor frontend de desarrollo (`pnpm run dev`) en el puerto 3000.
* **Autenticación:**
  * Se requiere ingresar el **Username** y **Password** válidos definidos en la base de datos (por defecto creados durante el sembrado inicial en `users`).
  * Al iniciar sesión, la credencial es validada contra el hash almacenado en la tabla `users` mediante el algoritmo bcrypt, generando un token JWT seguro que se guarda en la sesión (`sessionStorage`).

### 2. Acceso en Entorno de Producción (Vercel)

* **Ruta/URL de acceso:** `https://<tu-subdominio>.vercel.app/backoffice/login`
* **Requisitos de configuración en Vercel:**
  * El proyecto requiere una base de datos MySQL accesible públicamente (como Clever Cloud, Aiven, PlanetScale, o una instancia en la nube de AWS/GCP).
  * Es obligatorio registrar las siguientes variables de entorno en el panel de configuración de Vercel (Settings -> Environment Variables):
    * `DB_HOST`: Host del servidor MySQL remoto.
    * `DB_USER`: Nombre del usuario de conexión.
    * `DB_PASSWORD`: Clave de la cuenta de conexión.
    * `DB_NAME`: Nombre de la base de datos.
    * `DB_PORT`: Puerto de conexión (normalmente 3306).
    * `JWT_SECRET`: Llave secreta y robusta para la firma y cifrado de los tokens de sesión.
  * **Habilitar redirección del SPA:** El archivo `vercel.json` ya incluye las reglas necesarias para mapear todas las peticiones del lado del cliente a `index.html`.
* **Flujo de acceso de autenticación:**
  1. El usuario navega a la URL del backoffice.
  2. Completa el formulario de inicio de sesión con su usuario y contraseña corporativa.
  3. El frontend SPA realiza una petición POST con los datos sanitizados contra XSS hacia la API del servidor en la nube.
  4. El servidor verifica el usuario en la base de datos, contrasta el password hash y retorna el token JWT.
  5. El token es almacenado en `sessionStorage` para autorizar las posteriores peticiones PUT, POST y DELETE a las rutas administrativas `/api/admin/*`.

---

## 🛡️ Seguridad del Backoffice

El sistema implementa defensas integradas alineadas con las prácticas recomendadas por OWASP:
* **Sanitización de entradas:** Limpieza automática contra ataques Cross-Site Scripting (XSS) y SQL Injection mediante consultas preparadas/parametrizadas.
* **Cabeceras de protección:** Inyección de CSP (Content Security Policy), HSTS (Strict-Transport-Security) y mitigaciones contra clickjacking en cada respuesta del servidor.
* **Tokens efímeros:** El token JWT tiene un tiempo de vida limitado a 24 horas y solo se transmite mediante cabeceras autorizadas `Authorization: Bearer <token>`.

