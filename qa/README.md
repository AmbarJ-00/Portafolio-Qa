# QA Folder — Estrategia de Calidad de Software del Portafolio

Este directorio contiene la documentación de aseguramiento de calidad (QA) y scripts de automatización para validar el correcto funcionamiento, accesibilidad, optimización SEO y adaptabilidad responsive del portafolio.

## Estrategia de Pruebas

Para una Single Page Application (SPA), la cobertura de calidad se centra en garantizar:
1. **Consistencia de Traducciones (Internacionalización):** Asegurar que todas las claves del diccionario español (`es.js`) existan en el diccionario inglés (`en.js`) de manera simétrica.
2. **Accesibilidad (WCAG 2.1):** Verificar la navegación por teclado (tab index), etiquetas ARIA, y constrastes mínimos de color.
3. **Consistencia Responsive:** Asegurar la visualización en los principales viewports móviles y de escritorio.
4. **Optimización SEO:** Evitar fallos de indexación o etiquetas meta incompletas.

---

## Estructura QA

```
qa/
├── README.md                 # Estrategia de pruebas general
├── responsive-checklist.md   # Registro de validación de dispositivos
├── accessibility-checklist.md# Validación WCAG y navegación
├── seo-checklist.md          # Auditoría técnica de rastreo y SEO
└── smoke-tests.js            # Validador programático de esquemas de datos
```

---

## Ejecución de Pruebas Automatizadas (Smoke Tests)

Ejecutar el script de humo local para comprobar la integridad de datos y traducción de la aplicación:

```bash
node qa/smoke-tests.js
```

El script ahora valida tanto la consistencia de traducciones como la integridad de los datos de configuración pública y administrativa.

## Informacion del admin
Ruta del admin: http://localhost:3000/backoffice/login

Password: AdminQA#2026