# Cómo Briefear — README para la IA

> Este documento le explica a la IA cómo interpretar el resto de los documentos
> del proyecto y qué priorizar en cada etapa. Léelo primero, siempre.

## Orden de lectura obligatorio
1. `02-brief-del-proyecto.md` — contexto general y reglas de estilo (máxima prioridad)
2. `05-como-briefear.md` — este documento (cómo usar todo lo demás)
3. `01-documento-de-contenido.md` — copy exacto a usar
4. `04-mapa-de-secciones.md` — estructura y orden de construcción
5. `03-referencias-tecnicas.md` — código real de referencia por sección
6. `06-prompt-maestro.md` — instrucciones de ejecución final

## Jerarquía de decisiones (en caso de conflicto)
1. **Brief del Proyecto** manda sobre todo lo demás.
2. **Documento de Contenido** manda sobre cualquier copy que la IA quiera generar.
3. **Referencias Técnicas** mandan sobre estructura/maquetación, pero NUNCA sobre
   colores, tipografía o contenido (eso lo define el Brief y el Doc. de Contenido).
4. Si hay un vacío de información, la IA debe:
   - Marcar `[FALTA: qué información se necesita]` en el output.
   - NO inventar datos de negocio, cifras, testimonios ni nombres de features.
   - SÍ puede tomar decisiones menores de estilo (espaciados, microinteracciones)
     siempre que sean consistentes con el Brief.

## Qué priorizar en cada etapa

### Etapa 1 — Estructura (wireframe/esqueleto)
- Prioridad: Mapa de Secciones.
- Ignorar por ahora: detalles visuales finos (esos vienen en la etapa 3).

### Etapa 2 — Contenido
- Prioridad: Documento de Contenido, palabra por palabra.
- No resumir, no parafrasear, no "mejorar" el copy sin que se pida explícitamente.

### Etapa 3 — Estilo visual y maquetación
- Prioridad: Brief (sección de estilo visual) + Referencias Técnicas.
- Usar las referencias para estructura/espaciado/interacción, no para colores/tipografía.

### Etapa 4 — Revisión final
- Chequear contra el Brief: ¿se cumple el objetivo de negocio? ¿el tono es el correcto?
- Chequear contra el Mapa de Secciones: ¿están todas las secciones, en orden, con sus interacciones?
- Listar cualquier `[FALTA]` pendiente al final del output.

## Qué NO debe hacer la IA nunca
- No inventar copy que no esté en el Documento de Contenido.
- No usar paletas/tipografías "por defecto" si el Brief define otras.
- No ignorar los anti-patrones listados en el Brief.
- No mezclar el estilo de dos referencias técnicas distintas sin indicarlo.

## Formato de output esperado
- Proyecto Astro **ya existente**, no se construye desde cero. Trabajar componente por componente sobre los `.astro` reales en `src/components/` y `src/pages/`, en el orden del `04-mapa-de-secciones.md`.
- No reescribir componentes enteros si el cambio es puntual (ej. paleta de colores): editar `src/styles/global.css` (tokens) primero, y dejar que los componentes hereden el cambio.
- Cada componente tocado se entrega directamente en código (Astro + Tailwind), sin explicación previa extensa — el usuario ya aprobó la dirección en este brief.
- Excepción: el hero 3D tipo Refokus (`03-referencias-tecnicas.md` Referencia 3) no se construye en esta pasada — queda pendiente para una iteración específica de animaciones/microinteracciones.
