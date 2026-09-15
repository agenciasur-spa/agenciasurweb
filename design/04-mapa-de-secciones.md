# Mapa de Secciones — AgenciaSur (rediseño web corporativa)

> Guía sección por sección, cruzando el Documento de Contenido (`01-`), las
> Referencias Técnicas (`03-`) y los Design Tokens (`07-`). El sitio tiene
> 6 páginas, no una sola landing — el mapa cubre Home en detalle y resume
> las 5 páginas internas ya relevadas en `01-documento-de-contenido.md` sección 10.

## Home (`src/pages/index.astro`)

| # | Sección | Propósito | Contenido (ref. Doc. de Contenido) | Interacciones esperadas | Referencia técnica |
|---|---|---|---|---|---|
| 1 | Header (`Navbar.astro`) | Navegación + CTA principal, compartido en las 6 páginas | Sección 1 | Pill flotante, backdrop-blur, dropdowns en Servicios/Soluciones/Casos de Éxito, hamburguesa en mobile | Confirmado: no requiere rediseño, ya está alineado a la Referencia "Baunfire — Nav" |
| 2 | Hero | Comunicar el giro de posicionamiento ("automatizamos procesos críticos") en <5 seg | Sección 2 | Fade+slide de entrada (`data-ns-animate`), CTAs con hover | ✅ Aplicado: H1 en `font-extrabold` + `tracking-[-0.02em]` (Referencia 1 — Baunfire) |
| 3 | Servicios (grid 4 cards) | Justificar el "por qué" — metodología antes que código | Sección 3 | Stack-cards con scroll, **sin** glow/gradiente-borde (anti-patrón confirmado) | ✅ Aplicado: patrón `.glow-pulse`/`gradient-*` eliminado de `ServiciosGrid.astro` |
| 4 | Sistemas Core (grid 3) | Mostrar productos propios | Sección 4 | Cards con CTA "ver más" | ⚠️ Pendiente: URLs reales (hoy `#`) |
| 5 | Nosotros / social proof | Generar confianza vía trayectoria + clientes | Sección 5 | Stats animados (contador), logos de clientes | ✅ Aplicado: H2 de cierre en `font-extrabold` + `tracking-[-0.02em]` (Referencia 2 — Refokus, mismo criterio de impacto) |
| 6 | Contacto (inline, `ContactFormV2`) | Conversión principal | Sección 8 | Wizard 3 pasos (Identidad → Necesidades → Resumen) | ✅ Ya conectado a `/api/contacto` — el hallazgo inicial del moodboard estaba mal (ver corrección en `01-` sección 11) |
| 7 | Footer | Navegación secundaria + legal, compartido | Sección 9 | — | Confirmado, sin cambios estructurales |

## Páginas internas (resumen — detalle completo en `01-documento-de-contenido.md` sección 10)

| Página | Propósito | Secciones propias | Referencia técnica | Notas |
|---|---|---|---|---|
| `/servicios` | Justificar plazos responsables vía metodología transparente | Hero, 5 pasos de proceso, Stack tecnológico (marquee), CTA Modal Diagnóstico, (Diferenciadores oculto) | Referencia 1 (Baunfire): mismo criterio tipográfico que Home | Activar o no la sección Diferenciadores (decisión pendiente) |
| `/soluciones` | Detalle de los 3 productos propios | Hero, grid 3 (Sanity CMS) | — | Ya conectado a Sanity |
| `/casos-exito` | Social proof profundo con métricas | Hero, caso destacado, grid de más casos | — | Ya conectado a Sanity. Falta cargar caso de Saval |
| `/nosotros` | Historia y valores | Hero+stats, timeline 2008–2024, principios/valores | Referencia 2 (Refokus — Stats) | Stat "30+ Clientes" inconsistente con `StatsBar` de Home — unificar |
| `/contacto` | Conversión alternativa + datos de contacto | Info cards, `ContactForm` (componente #2, distinto al de Home) | — | Decidir si se unifica con el wizard de Home |

---

## Orden de prioridad de construcción

1. ✅ **Design tokens** (`07-`) — nueva escala de verde aplicada a `global.css` (incluye migración de `ns-green` y de TODA la familia azul residual — `text-primary-500`, `.btn-primary`, `.badge-primary-light`, etc. — a la escala `accent-*`). Familia `--color-primary-*` y gradientes `gradient-1`/`gradient-4` eliminados de `global.css`, confirmado sin usos restantes.
2. ✅ **Home** — Hero y cierre de Nosotros con el nuevo peso tipográfico, glow eliminado de Servicios, links de Sistemas Core apuntando a `/soluciones/[slug]` reales, clientes corregidos (Saval en vez de "Procesos Digitalizados").
3. ✅ **Contacto** — unificado en un único formulario (`ContactFormV2.astro`, el wizard de 3 pasos) usado tanto en Home como en `/contacto`; `ContactForm.astro` eliminado (sin más referencias) y el script huérfano de `ContactoFooter.astro` limpiado.
4. ✅ **Servicios** — sección "Diferenciadores" activada (typo corregido) y tokens aplicados. Soluciones/Casos de Éxito/Nosotros heredan los tokens automáticamente, sin cambios estructurales.

## Dependencias entre secciones

- ✅ Resuelto: el CTA "Empecemos" del Header/Hero y `/contacto` llevan al mismo formulario unificado.
- Los stats de Home (`StatsBar`), Nosotros y el "30+ Clientes" siguen sin salir de una única fuente de verdad — pendiente para evitar arrastrar la inconsistencia.
- Pendiente (fuera de esta pasada, toca un sistema externo): migrar los logos de clientes de Nosotros a Sanity para que sean administrables. Por ahora quedaron corregidos como texto hardcodeado (BancoEstado, ServiEstado, Laboratorios Saval).
- Hallazgo nuevo, no resuelto: `ContactoFooter.astro` conserva un bloque `<style>` (`.ml-input`/`.ml-select`/`.ml-preview`) que ya nadie usa tras limpiar el script — CSS muerto a eliminar en una próxima pasada de limpieza.
