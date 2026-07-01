# Checklist de Validación SEO

- [ ] **robots.txt:** Accesible en `/robots.txt` y enlazado correctamente al sitemap.
- [ ] **sitemap.xml:** Accesible en `/sitemap.xml`. Todos los enlaces devuelven estado 200 OK.
- [ ] **Title dinámico:** Cambia según la ruta cargada (por ejemplo, `Proyectos | Sofia Rodriguez | QA Lead`).
- [ ] **Meta Description:** Única por cada sección de la aplicación para mejorar CTR en buscadores.
- [ ] **Encabezados Semánticos:** Solo existe un elemento `<h1>` por página (Navbar usa `Link` pero no `<h1>`).
- [ ] **OpenGraph (Facebook/LinkedIn):** Etiquetas `og:title` y `og:description` presentes e integradas en el DOM.
- [ ] **Twitter Cards:** Atributo `twitter:card` configurado en `summary_large_image`.
- [ ] **Manifest Webmanifest:** Enlazado en la cabecera HTML y visible en las herramientas de desarrollo (Application Panel).
