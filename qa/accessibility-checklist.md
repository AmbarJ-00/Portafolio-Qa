# Checklist de Validación de Accesibilidad (WCAG 2.1 AA)

- [ ] **Navegación por Teclado:** Se puede recorrer toda la aplicación usando exclusivamente `Tab` y `Shift + Tab`.
- [ ] **Focus Visible:** Todos los elementos interactivos tienen un contorno visible claro cuando se navega por teclado (clase personalizada `:focus-visible`).
- [ ] **Contraste de Texto:** Relación mínima de contraste de 4.5:1 para texto normal en modo claro y modo oscuro.
- [ ] **Etiquetas de Formulario:** Todos los campos del formulario en `Contact.jsx` tienen su respectiva etiqueta `<label>` con el atributo `htmlFor` apuntando al `id` del input.
- [ ] **Descriptores de Error:** Los mensajes de error de validación del formulario tienen IDs asociados mediante `aria-describedby` al input correspondiente.
- [ ] **Lectores de Pantalla:** Imágenes decorativas tienen `alt=""` o `role="presentation"`. Logos e iconos interactivos tienen `aria-label` descriptivo.
- [ ] **Modal de Habilidades:** Al abrirse el modal, se bloquea el fondo y el usuario puede cerrarlo mediante el botón `X` o teclado.
