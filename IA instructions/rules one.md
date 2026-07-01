# AI EXECUTION RULES & VALIDATION PROTOCOL

## Mandatory Pre-Execution Rules for This Project

Este archivo define las reglas obligatorias que cualquier IA, agente o asistente técnico debe seguir antes, durante y después de modificar este proyecto.

Estas reglas son permanentes y deben verificarse en CADA ejecución.

---

# 1. CORE EXECUTION RULES

## Rule 1 — Do Not Modify Admin Credentials

NO modificar bajo ninguna circunstancia:

* Credenciales del administrador
* Usuario admin
* Contraseña admin
* Tokens estáticos de acceso
* Configuración de autenticación del backoffice

Esto incluye archivos como:

* auth config
* admin auth context
* env variables relacionadas
* login validation
* session validation

Solo pueden modificarse si el usuario lo solicita explícitamente.

---

## Rule 2 — Do Not Modify Login Routes

NO modificar rutas relacionadas al acceso del backoffice.

Ejemplos:

* /admin
* /admin/login
* /backoffice
* rutas privadas
* guards
* middleware de autenticación

Estas rutas deben considerarse estables una vez estén funcionales.

No cambiar:

* Path
* Redirects
* Guards
* Protected Routes

Sin autorización explícita del usuario.

---

## Rule 3 — Do Not Modify UI Styles Without Permission

No modificar:

* Colores
* Paletas
* Fonts
* Espaciados
* Layout
* Márgenes
* Tamaños visuales
* Estructura UI
* Animaciones
* Hover states

A menos que el usuario lo solicite explícitamente.

---

## Rule 4 — No Unrequested Features

No agregar:

* Nuevos módulos
* Nuevos botones
* Nuevos inputs
* Nuevos endpoints
* Nuevas animaciones
* Nuevas librerías
* Nuevas dependencias

A menos que sean explícitamente solicitados.

---

## Rule 5 — Suggestions Allowed, Automatic Changes Forbidden

La IA puede sugerir:

* Mejoras de arquitectura
* Mejoras de seguridad
* Mejoras UI/UX
* Mejoras de performance
* Refactors
* Mejoras SEO

Pero:

NO debe aplicarlas automáticamente.

Debe primero informar:

* Problema detectado
* Impacto
* Mejora sugerida
* Riesgo de implementación

Esperar aprobación antes de ejecutar.

---

# 2. IMPLEMENTATION RULES

## Rule 6 — No Incomplete Code

Nunca dejar:

* Código suelto
* Funciones incompletas
* TODOs sin resolver
* Schemas vacíos
* Formularios a medias
* Componentes rotos
* Imports innecesarios
* Dead code

Toda implementación debe quedar terminada.

---

## Rule 7 — Respect Existing Architecture

Mantener arquitectura existente:

* modules
* contexts
* hooks
* services
* config
* translations
* qa
* docs

No reorganizar estructura sin aprobación.

---

## Rule 8 — Preserve Comments

NO eliminar comentarios existentes de una línea o múltiples líneas.

Ejemplo:

```js
// hidden temporarily because button is broken
```

Asumir que esos comentarios fueron agregados por el usuario.

No borrarlos.

---

# 3. TRANSLATION RULES

## Rule 9 — Update Translation Files

Toda modificación visual o funcional que agregue texto nuevo debe reflejarse en traducciones.

Actualizar siempre:

* translations/es.js
* translations/en.js

No dejar texto hardcodeado dentro de componentes.

---

## Rule 10 — Translation Validation

Verificar que:

* Español funcione
* Inglés funcione
* localStorage persista idioma
* No existan keys rotas
* No existan textos faltantes

---

# 4. TESTING RULES

## Rule 11 — Mandatory QA Execution

Después de cada implementación ejecutar TODOS los tests de QA.

Carpetas obligatorias:

* qa/
* qa/security_tests/
* qa/error_tests/
* testing general project/

Ejecutar:

* Unit tests
* Integration tests
* Regression tests
* Security tests
* UI/UX tests
* Responsive tests

---

## Rule 12 — Validate Admin ↔ Main Integration

Siempre validar:

Cambios en Backoffice → reflejados en Página Principal

Validar módulos:

* Home
* Projects
* Skills
* Documentation
* Certifications
* Contacts
* About
* Appearance
* Navigation
* Modules

---

## Rule 13 — Report All Failures

Si se detecta un error:

NO ocultarlo.

Reportar:

### Error Detected

Qué falló.

### Possible Cause

Por qué falló.

### Impact

Qué afecta.

### Recommended Fix

Cómo solucionarlo.

Formato:

ERROR REPORT:

* Module:
* Error:
* Cause:
* Impact:
* Solution:

---

# 5. VALIDATION CHECKLIST

Antes de finalizar una tarea, verificar:

## Functional Validation

* Todos los botones funcionan
* Todos los formularios funcionan
* Todos los popups funcionan
* Todas las rutas funcionan

---

## Integration Validation

* Admin conectado a Main
* localStorage funciona
* API funciona (si aplica)
* Persistencia funciona

---

## UI Validation

* Responsive OK
* Layout OK
* Cards OK
* Popups OK
* Navbar OK

---

## Translation Validation

* Español OK
* Inglés OK
* No hardcoded text

---

## Error Validation

* No blank screens
* No console errors
* No missing routes
* Error boundaries funcionando

---

# 6. FINAL DELIVERY RULES

Antes de marcar una tarea como completada:

Debe confirmarse:

* Implementación terminada
* Código limpio
* Sin errores
* Tests ejecutados
* Traducciones actualizadas
* QA validado

No cerrar tarea si falta alguno.

---

# FINAL EXECUTION PROTOCOL

En cada ejecución, la IA debe seguir este flujo:

1. Leer este archivo completo
2. Validar restricciones
3. Ejecutar tarea solicitada
4. Actualizar traducciones
5. Ejecutar tests QA
6. Reportar errores encontrados
7. Entregar resultado final

Este protocolo es obligatorio y permanente.
