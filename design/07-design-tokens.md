# Design Tokens — AgenciaSur (rediseño web corporativa)

> Base de partida: el proyecto Astro YA tiene un sistema de tokens completo en
> `src/styles/global.css` (heredado de un template llamado "Nexsas Time-Tracking").
> Esta tabla dice qué se mantiene tal cual, qué se evoluciona y qué se elimina.
> Investigación: sitio actual real (agenciasur.cl, verde de marca) + Refokus.com
> y Baunfire.com (dirección visual objetivo, elegida por el usuario).

## Color

### Se mantiene igual (ya está bien, no tocar)
| Token | Valor (hex) | Uso |
|---|---|---|
| `color-secondary` | `#1a1a1c` | Texto sobre fondo claro / fondo casi-negro |
| `color-accent` (texto claro) | `#fcfcfc` | Texto principal sobre fondo oscuro |
| `color-background-5..9` | `#13171e` → `#070b10` | Escala de fondos oscuros (dark-first), ya coincide con el tono casi-negro de Baunfire (`#1f1e1d`) y las secciones oscuras de Refokus |

### Se evolucionan (verde corporativo → versión más vibrante, decisión del usuario: "punto medio")
| Token | Valor actual | Valor propuesto | Motivo |
|---|---|---|---|
| `color-accent-300` | `#66ffb2` (neón) | `#B4E86B` | Highlight, mismo rol pero menos "neón gamer" |
| `color-accent-400` (**acento principal**) | `#22ff88` (neón) | `#8FD14F` | Evoluciona el verde real de agenciasur.cl (`#8BC841`) con más saturación/energía para funcionar sobre fondo oscuro, sin perder el hue de marca |
| `color-accent-500` | `#00e676` | `#6FB52E` | Estado hover/active |
| `color-accent-600` | `#00c853` | `#578F22` | Texto sobre fondo claro, bordes |
| `color-accent-700` | `#009624` | `#3E6B18` | Variante más oscura, cerca del verde oscuro real (`#489310`) |
| `color-ns-green` | `#c6f56f` | (eliminar, redundante con `accent-300` nuevo) | Eran dos verdes distintos sin motivo claro |

### Se elimina / demota
| Token | Motivo |
|---|---|
| `color-primary-*` (familia azul `#3b82f6`) | No aparece usado visualmente en ninguna página relevada; parece residuo del template Nexsas. La dirección de marca es monocromática oscuro + verde, no azul+verde. `[FALTA: confirmar que ningún componente lo necesita antes de borrarlo]` |
| `color-gradient-1`, `color-gradient-4` (mezclan azul→verde) | Van de la mano con el punto anterior — se caen si se elimina el azul |

## Tipografía
| Token | Valor |
|---|---|
| Familia principal | Inter Tight (se mantiene — ya es geométrica y limpia, en la misma familia visual que "General Sans" de Refokus, no hace falta pagar una fuente nueva) |
| Escala heading | Se mantiene la escala actual (`heading-1` 4.25rem ... `heading-6` 1.25rem) — ya es comparable al h1 de 72px/700 de Baunfire |
| **Cambio de criterio de peso** | Hoy casi todos los H1/H2 usan `font-light` (300) de forma uniforme. Baunfire reserva el peso 700 (bold, `letter-spacing: -0.72px`) para el titular de impacto y deja el resto liviano. Propuesta: usar peso fuerte (600–700) + letter-spacing ligeramente negativo (`-0.02em`) SOLO en el H1 del Hero de Home y en 1-2 momentos de máximo impacto (ej. cierre de "Nosotros"); el resto de headings de sección se queda en `font-light` como está. |
| Micro-labels / badges | Uppercase, `letter-spacing` amplio (~2px), 12-14px — mismo patrón que el "WE ARE BAUNFIRE" de referencia; los `BadgeSection` actuales ya van en esta línea, mantener. |
| Cifras grandes (stats) | Refokus usa números gigantes como elemento gráfico (85% ocupando media pantalla). El `StatsBar`/contador "18+ años" de Nosotros ya apunta ahí — subir su tamaño y protagonismo en al menos una sección. |

## Espaciado
- Se mantiene el criterio actual de espaciado generoso (secciones con `py-24` a `py-[200px]` en desktop) — ya está alineado con el "mucho espacio negativo" de ambas referencias. No requiere cambios de sistema, sí revisar caso a caso que no se llene con más contenido del necesario.

## Bordes y radios
| Token | Valor | Nota |
|---|---|---|
| `radius-card` | `20px` | Se mantiene — funciona como término medio entre el borde duro de Baunfire y el suave de Refokus |
| `radius-hero` | `30–50px` | Se mantiene (ya usado en Hero) |
| `radius-full` | pills / nav / botones | Se mantiene — coincide con el botón "GET TO KNOW US" de Baunfire y los toggles circulares |

## Sombras
- Ninguna de las dos referencias usa sombras marcadas — priorizan contraste de color y espacio, no profundidad con `box-shadow`. Reducir uso de `--shadow-*` a lo mínimo indispensable (dropdowns, modals), no decorativo en cards.

## Breakpoints
| Nombre | Valor |
|---|---|
| mobile | hasta 639px |
| tablet | 640–1023px |
| desktop | 1024px+ |

## Anti-patrones explícitos
> Lo que NO se debe usar, confirmado con el usuario.

- **Nada de tarjetas con glow/gradiente-borde brillante** — eliminar el patrón `glow-pulse` + `gradient-card-*` de `ServiciosGrid.astro`. Reemplazar por tarjetas planas con borde simple (`border-stroke-7`) sin animación de brillo.
- Nada de gradientes azul→verde (`color-gradient-1`, `color-gradient-4`) — la dirección es monocromática oscura + verde.
- Nada de ilustraciones 3D genéricas tipo stock.
- Nada de sombras decorativas pesadas en cards (ver sección Sombras arriba).
