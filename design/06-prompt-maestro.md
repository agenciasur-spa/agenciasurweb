# Prompt Maestro — AgenciaSur (rediseño web corporativa)

> El manual de instrucciones final. Este es el prompt que se pega directamente
> a la IA junto con los demás documentos adjuntos/referenciados.

---

## PROMPT

Actuá como un diseñador/desarrollador frontend senior. Vas a **rediseñar la web corporativa de AgenciaSur**, un proyecto Astro ya existente y parcialmente construido (no una landing desde cero), siguiendo estrictamente los documentos del proyecto que te adjunto:

1. `02-brief-del-proyecto.md`
2. `01-documento-de-contenido.md`
3. `03-referencias-tecnicas.md`
4. `04-mapa-de-secciones.md`
5. `05-como-briefear.md`
6. `07-design-tokens.md`

### Reglas de trabajo
1. Leé TODOS los documentos antes de tocar cualquier archivo.
2. Seguí el orden de prioridad definido en `05-como-briefear.md` y el "Orden de prioridad de construcción" de `04-mapa-de-secciones.md`: primero los tokens (`global.css`), después Home, después Contacto (bloqueante de negocio), después el resto de las páginas internas.
3. Usá el copy EXACTO del `01-documento-de-contenido.md`. No inventes textos ni "mejores" el copy existente sin que se pida explícitamente.
4. Usá `03-referencias-tecnicas.md` para estructura y patrones de interacción (contraste tipográfico, tratamiento de stats, minimalismo de CTA), **nunca** para colores ni tipografía — esos vienen de `07-design-tokens.md`.
5. Construí/editá componente por componente, en el orden del `04-mapa-de-secciones.md`. Es un proyecto real: editá los `.astro` existentes en `src/components/` y `src/pages/`, no regeneres desde cero.
6. **Stack a usar:** Astro + Tailwind CSS v4 (tokens vía `@theme` en `src/styles/global.css`) + Sanity CMS (ya integrado en `/soluciones` y `/casos-exito`). Iconos: `@lucide/astro`. No sumar frameworks de componentes nuevos.
7. Responsive: mobile-first, breakpoints existentes (mobile hasta 639px, tablet 640–1023px, desktop 1024px+).
8. Accesibilidad: contraste AA mínimo, HTML semántico, alt text en imágenes.

### Reglas de diseño
- Verde de marca evolucionado como acento principal: `#8FD14F` (ver escala completa en `07-design-tokens.md`), reemplazando el neón `#22FF88` heredado del template base.
- Eliminar la familia azul residual (`color-primary-*`, `#3b82f6`) si ningún componente la usa realmente.
- Inter Tight se mantiene como única familia tipográfica. Cambio de criterio: peso bold (600–800) + letter-spacing negativo SOLO en 1-2 momentos de máximo impacto por página (ej. H1 del Hero); el resto de headings sigue en `font-light` como está.
- Radios: mantener `20px` en cards, `30–50px` en Hero, `full` en pills/nav/botones — no se tocan.
- **Nada de tarjetas con glow/gradiente-borde brillante** — eliminar el patrón `.glow-pulse` + `gradient-card-*` de `ServiciosGrid.astro` y reemplazar por borde simple (`border-stroke-7`), sin animación de brillo.
- Nada de gradientes azul→verde, nada de ilustraciones 3D genéricas de stock, nada de sombras decorativas pesadas en cards.
- El hero 3D tipo Refokus (bloques que deletrean palabras y reforman el isotipo) queda **fuera de esta pasada** — es una iteración separada de animaciones/microinteracciones.

### Proceso de ejecución esperado
1. Confirmá que leíste los 6 documentos y resumí en 3 líneas el objetivo del rediseño.
2. Listá cualquier `[FALTA]` que detectes antes de empezar (ver también la lista de decisiones pendientes al final de `02-brief-del-proyecto.md` y del moodboard).
3. Aplicá primero los tokens nuevos en `global.css`.
4. Editá Home siguiendo el orden del mapa de secciones, sacando el patrón glow de `ServiciosGrid.astro`.
5. Contacto: ambos formularios (`ContactForm.astro` y `ContactFormV2.astro`) ya llaman correctamente a `/api/contacto` y funcionan — sigue siendo recomendable unificarlos en uno solo (sugerencia: el wizard de 3 pasos, más pulido) por consistencia, no por urgencia. De paso, limpiar el script huérfano y sin uso dentro de `ContactoFooter.astro`.
6. Aplicá los mismos tokens al resto de páginas internas (Servicios, Soluciones, Casos de Éxito, Nosotros, Contacto), sin rehacer su estructura (ya está bien armada).
7. Al final, hacé un checklist: ¿todas las secciones del mapa están presentes? ¿el copy coincide con el documento de contenido? ¿se respetaron los anti-patrones? ¿el formulario de contacto elegido efectivamente envía el email?

### Output esperado
Código directo por componente (Astro + Tailwind), editando los archivos reales del proyecto uno por uno, en el orden de prioridad del mapa de secciones — sin explicación previa extensa por componente (la dirección ya está aprobada en este brief).

---

## Checklist previo a enviar este prompt
- [x] Brief del Proyecto completo (queda 1 `[FALTA]` menor: métrica de éxito, y 1 decisión pospuesta: hero 3D)
- [x] Documento de Contenido completo (Home + 5 páginas internas)
- [x] Referencias técnicas con datos reales (Baunfire, Refokus — stats, Refokus — hero 3D, Nav)
- [x] Mapa de Secciones completo, con orden de prioridad y dependencias
- [x] Cómo Briefear revisado
- [x] Stack y formato de output definidos en este prompt
