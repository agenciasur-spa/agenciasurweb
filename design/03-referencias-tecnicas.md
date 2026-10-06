# Referencias Técnicas — AgenciaSur (rediseño web corporativa)

> Nota metodológica: Refokus y Baunfire son SPAs pesadas en JS (animaciones
> lettering SVG, scroll-driven sections). El HTML crudo capturado con
> Playwright viene lleno de markup decorativo (SVGs de animación de logo,
> wrappers de transform) que no sirve para replicar estructura. En su lugar,
> se capturaron **valores computados reales** (colores, tipografía, spacing) —
> que es lo que realmente informa `07-design-tokens.md` — más una descripción
> estructural fiel a partir de screenshots. Fuente de la decisión de usar estas
> dos referencias: elegidas explícitamente por el usuario sobre las otras 3
> candidatas (innowise, trespuntoscomunicacion, suratica), que quedan como
> referencia de tono en `02-brief-del-proyecto.md` sección 4, sin deep-dive visual.

---

## Referencia 1: Hero — Baunfire
- **Fuente:** https://www.baunfire.com/
- **Por qué se eligió:** dirección visual objetivo explícita del usuario (junto a Refokus). Ejemplo del contraste de peso tipográfico y minimalismo de "chrome" que se busca.
- **Estructura real (a partir de screenshot + computed styles):**
  - Fondo casi-negro (`rgb(31,30,29)` en secciones oscuras).
  - Eyebrow label uppercase, acento rojo-naranja, `letter-spacing: 2.1px`, `font-size: 14px`, sobre el H1.
  - H1: `font-size: 72px`, `font-weight: 700`, `line-height: 90px`, `letter-spacing: -0.72px`, color blanco puro.
  - Párrafo de apoyo corto (3 líneas máx), gris medio, bien por debajo del peso visual del H1.
  - Marca-fantasma gigante (isotipo en outline, muy sutil) de fondo, decorativo, no interactivo.
  - CTA: botón circular/pill oscuro con "+" y texto pequeño uppercase al lado — no un botón ancho tradicional.
  - Nav: logo wordmark simple izquierda, "LET'S TALK" + botón circular de menú (hamburguesa en círculo) a la derecha. Muy poco chrome.
- **Computed CSS clave:**
```css
h1 {
  font-family: Montserrat, sans-serif; /* fuente puntual de este elemento; el H1 principal usa "Neue Plak W01 Narrow SemiBold" */
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -0.72px;
  line-height: 90px;
  color: rgb(255, 255, 255);
}
/* micro-label */
.eyebrow { font-size: 14px; text-transform: uppercase; letter-spacing: 2.1px; }
```

## Referencia 2: Sección de estadística — Refokus
- **Fuente:** https://www.refokus.com/
- **Por qué se eligió:** patrón de "número gigante como elemento gráfico" — aplica directo a los stats de AgenciaSur (18+ años, 200+ procesos, 50+ proyectos) que hoy están sub-utilizados visualmente.
- **Estructura real:** cifra (`85%`) ocupando gran parte del ancho de la sección, con la palabra "%" en un color de acento distinto al número, sobre fondo casi-negro; debajo y a la izquierda, un párrafo corto y discreto de contexto — la cifra es el protagonista absoluto, no un ícono ni una tarjeta.
- **Tipografía general del sitio:** `font-family: "Generalsans Variable", Arial, sans-serif`, cuerpo de texto `20.8px`, color `rgb(114,122,131)` sobre fondo blanco en secciones claras (el sitio alterna secciones claras/oscuras al hacer scroll).

## Referencia 3: Hero 3D (concepto a rescatar) — Refokus
- **Fuente:** https://www.refokus.com/ (hero de entrada, con sonido opcional)
- **Por qué se eligió:** el usuario identificó este mecanismo específico como algo a rescatar para AgenciaSur, más allá de la dirección general ya definida.
- **Mecanismo (a partir de capturas del usuario):** bloques 3D extruidos (formas tipo prisma/rodillo con bisel, material con gradiente violeta) flotan y rotan en el espacio, agrupándose momentáneamente para deletrear palabras clave ("Web Design", "Development", "Motion"), y luego se reordenan para formar el isotipo de la marca ("F" de Refokus) mientras aparece el titular "It's time to Refokus". Fondo de barras verticales tipo cortina con textura de luz, y un toggle "click to enable sound" que sugiere reactividad a audio.
- **Adaptación propuesta para AgenciaSur (no copiar literal):** mismos bloques/mecanismo, pero con la paleta evolucionada (`#8FD14F` en vez de violeta) y palabras propias del negocio ("Consultoría", "Desarrollo", "Automatización") que terminan formando el isotipo de AgenciaSur. Sin necesidad de replicar la reactividad a sonido salvo que se decida explícitamente.
- **Decisión técnica pendiente (fuera de esta etapa del brief, a definir en la pasada de animaciones/microinteracciones):** nivel de fidelidad — escena 3D real (ej. Three.js, no está en el stack actual) vs. aproximación con `transform`/`perspective` de CSS. Impacta el stack tecnológico de la sección 6 del Brief.

## Referencia 4: Navegación — Baunfire
- **Fuente:** https://www.baunfire.com/
- **Por qué se eligió:** el patrón de nav minimalista ya es cercano al `Navbar.astro` actual (pill, backdrop-blur), sirve para confirmar que la dirección actual de nav no necesita cambios grandes.
- **Nota:** el `Navbar.astro` actual (pill flotante centrado, backdrop-blur) ya está en línea con esta referencia — no se identificó necesidad de rehacer la navegación, solo ajustar colores según los nuevos tokens.

---

## Notas de adaptación

| Referencia | Tomar | No tomar |
|---|---|---|
| Baunfire — Hero | Contraste de peso (H1 bold vs. body liviano), letter-spacing negativo en headings grandes, minimalismo de CTA, marca-fantasma decorativa de fondo | La fuente "Neue Plak" (no está en el brief, usar Inter Tight), el acento rojo-naranja (la marca es verde) |
| Refokus — Stats | Tratamiento de cifra gigante como elemento gráfico protagonista | El acento violeta (no es color de marca), el alternado agresivo claro/oscuro por sección (mantener consistencia dark-first) |
| Baunfire — Nav | Confirmar que el nav pill actual ya funciona | No hace falta rehacer el componente |
| Refokus — Hero 3D | El mecanismo (bloques que deletrean y reforman el isotipo) y la estructura conceptual | El violeta (usar el verde evolucionado), el isotipo de Refokus (usar el de AgenciaSur), la reactividad a sonido (opcional, no confirmada) |
