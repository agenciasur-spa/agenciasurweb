# Documento de Contenido — AgenciaSur (rediseño web corporativa)

> Propósito: eliminar toda ambigüedad de copy. La IA NUNCA debe inventar textos;
> si un texto no está acá, debe preguntar o dejar un placeholder marcado como `[FALTA]`.

## Reglas de uso para la IA
- Usar el copy EXACTO tal como está escrito acá, salvo indicación explícita de "adaptar".
- No agregar textos que no estén listados (ni microcopy, ni tooltips, ni CTAs extra).
- Respetar mayúsculas/minúsculas, signos de puntuación y longitud aproximada (importa para el layout).
- Si falta contenido para una sección, marcar `[FALTA: descripción de qué se necesita]` y continuar.

> Nota: este proyecto ya tiene avance real en código (Astro). El copy de acá
> fue extraído de los componentes ya implementados (`Hero.astro`,
> `ServiciosGrid.astro`, `SistemasGrid.astro`, `NosotrosSection.astro`,
> `StatsBar.astro`, `Navbar.astro`, `Footer.astro`), no inventado.

---

## 1. Header / Navegación
| Elemento | Texto |
|---|---|
| Logo (alt text) | AgenciaSur |
| Item de menú 1 | Servicios (dropdown) → Consultoría Estratégica / Desarrollo de Software / Infraestructura Cloud / Soporte Técnico |
| Item de menú 2 | Soluciones (dropdown, ver `SolutionsMenu.astro`) |
| Item de menú 3 | Nosotros |
| Item de menú 4 | Casos de Éxito (dropdown, ver `CasosExitoMenu.astro`) |
| CTA principal (botón) | Contacto → `/contacto` |

## 2. Hero / Sección principal
- **Badge:** Transformación digital
- **Título (H1):** Automatizamos tus procesos críticos.
- **Texto de apoyo:** Transformamos la manera en que tu empresa opera. Desde la consultoría tecnológica hasta el desarrollo de soluciones web a medida, te ayudamos a optimizar cada aspecto de tu negocio.
- **Feature list (3 ítems bajo el texto):** Consultoría TI estratégica / Desarrollo web a medida / Automatización inteligente
- **CTA primario:** Empecemos → `/contacto`
- **CTA secundario:** Ver servicios → `/servicios`

## 3. Sección: "Servicios" (grid de 4 tarjetas)
- **Badge:** Servicios
- **Título de sección:** <span class="highlight">Soluciones</span> para la era digital
- **Descripción:** Transformamos procesos complejos en soluciones simples, eficientes y escalables.
- **Bloques/ítems:**
  1. **Levantamiento de Procesos** — No programamos sin entender. Analizamos y definimos la metodología óptima antes de digitalizar.
  2. **Desarrollo Web & Mobile High-End** — Construimos sistemas robustos sobre arquitecturas modernas o evolucionamos tu infraestructura actual en WordPress/Prestashop hacia el alto rendimiento.
  3. **Integración & Soporte Continuo** — Conectamos tus sistemas existentes con APIs y middleware. Soporte post-entrega para asegurar la operación sin interrupciones.
  4. **Infraestructura Cloud** — Despliegue, monitoreo y escalabilidad en la nube. Tu operación, siempre disponible.

## 4. Sección: "Sistemas Core" (productos, grid de 3 tarjetas)
- **Badge:** Sistemas Core
- **Título:** Plataformas modulares diseñadas para <span class="highlight">optimizar</span> la gestión empresarial
- **Bloques/ítems:** (cada uno con CTA "ver más", links aún apuntan a `#` — `[FALTA: URLs reales de cada sistema]`)
  1. **Sistema de Compras** — Digitaliza el proceso de adquisiciones y haz eficiente tu abastecimiento. Control total desde la solicitud hasta la entrega.
  2. **Gestión de Personal Transitorio** — Estandariza solicitudes, evalúa y valida personal externo en una sola plataforma centralizada.
  3. **Mesa de Ayuda** — Omnicanalidad y base de conocimientos para una autoatención inteligente con SLA automatizado.

## 5. Testimonios / Social proof (sección "Nosotros")
- **Badge:** Sobre Agencia Sur
- **Título:** Transformamos complejidad operativa en <span class="highlight">flujos simples</span>.
- **Texto:** Desde 2016, combinamos 18 años de trayectoria técnica para diseñar la infraestructura digital que permite a las empresas escalar sin fricciones, asegurando que cada línea de código responda a un objetivo de negocio real.
- **Stats (StatsBar):** 18+ Años de trayectoria / 200+ Procesos analizados / 50+ Proyectos de éxito
- **Card lateral:** "Trayectoria comprobada" — "Desde consultoría TI hasta desarrollo a medida"
- **Testimonio 1 / 2 (con nombre y cargo):** N/A — no hay testimonios con cita textual, solo logos de clientes.
- **Logos de clientes/marcas (lista):** BancoEstado, ServiEstado, **Laboratorios Saval** (confirmado por el usuario, falta cargarlo en el código — hoy dice "BancoEstado, ServiEstado, Procesos Digitalizados", y "Procesos Digitalizados" no es un cliente real). **Requisito: el listado debe ser administrable** (no hardcodeado en el componente). Recomendación técnica: `/soluciones` y `/casos-exito` ya usan Sanity CMS con fallback estático — replicar ese mismo patrón para los logos de clientes en vez de hardcodearlos en `NosotrosSection.astro`.

## 6. Precios / Planes
N/A — los servicios son a medida y se cotizan, no hay planes fijos.

## 7. FAQ
N/A — no existe sección de preguntas frecuentes en el proyecto actual. `[FALTA: confirmar si se quiere agregar en este rediseño]`

## 8. CTA final / Cierre (`ContactoFooter.astro` → `ContactFormV2.astro`)
- **Badge:** Contacto
- **Título:** Cuéntanos qué necesitas. Te ayudamos a definir el camino.
- **Texto de apoyo:** Desde la idea hasta la implementación — definimos juntos el camino.
- **Pasos del formulario (multi-step):** 1. Identidad — 2. Necesidades — 3. Resumen
- **Paso 1 "Primero, ¿quién eres?"** — texto: "Tres datos para que sepamos a quién le escribimos."
  - ¿Cómo te llamas?* (placeholder: Tu nombre)
  - ¿A qué correo te escribimos?* (placeholder: tu@correo.com)
  - ¿En qué sector trabaja tu empresa?* (placeholder: Tecnología, retail, salud…)
  - Botón: Siguiente →
- Formulario tipo "mad libs" interactivo (completa una frase con inputs/selects: nombre, correo, sector, necesidad, objetivo, plazo), con mensaje de éxito personalizado ("¡Gracias, {nombre}! Recibimos tu mensaje.").

## 9. Footer
- **Brand:** Logo + "Transformación digital para empresas que quieren crecer."
- **Columna Navegación:** Inicio / Servicios / Soluciones / Casos de éxito / Contacto
- **Columna Servicios:** Desarrollo Web / Apps Móviles / Sistemas a Medida / Consultoría
- **Columna Contacto:** contacto@agenciasur.cl / Lun - Vie: 9:00 - 18:00
- **Texto legal / copyright:** © {año actual} Agencia Sur. Todos los derechos reservados.
- **Links legales:** Privacidad / Términos
- **Redes sociales (links):** `[FALTA: no hay redes sociales en el footer actual]`

---

## 10. Páginas internas (relevadas del código, ya implementadas)

### `/servicios` — "Cómo trabajamos"
- **Hero:** Badge "Nuestro Método" — H2 "Cómo trabajamos" — "No vendemos horas. Entregamos soluciones que resuelven problemas reales. Nuestro proceso existe para garantizar que cada proyecto tenga impacto medible."
- **Metodología (5 pasos, con detalle):**
  1. Levantamiento de Procesos — "No programamos una sola línea hasta entender tu operación."
  2. Diseño de Solución — "Wireframes, arquitectura de datos y plan de integración."
  3. Desarrollo Iterativo — "Sprints de 2 semanas con review del cliente."
  4. Testing & QA — "Nada se entrega sin pasar QA."
  5. Deploy & Soporte — "Acompañamiento continuo, no desaparecemos después del deploy."
  - **Nota clave:** esta sección es justamente lo que respalda los plazos responsables frente a la objeción de negocio identificada en la etapa Negocio — vale la pena que tenga fuerza visual.
- **Stack Tecnológico:** badge "Stack flexible", ~25 tecnologías en marquee (Symfony, Astro, Next.js, NestJS, React, Vue, Angular, Node, Python, Django, Flask, Redis, PHP, Laravel, MySQL, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, Azure, Supabase, Heroku, DigitalOcean, Netlify, Vercel). "Adaptamos el stack a tu infraestructura existente. No forzamos una tecnología si no encaja."
- **CTA final:** "¿Listo para levantar tu proceso?" → botón "Agendar Diagnóstico" (abre `DemoModal`, no el mismo form que la Home).
- **Sección "Diferenciadores" (`hidden` en el código, no visible en el sitio actual):** "Diseñado para entregar resultados tangibles" + 3 bullets (Clarity Over Clutter, People Before Features, Security as a Standard) + stat "100% entes satisfechos" (⚠️ typo, debería decir "clientes"). `[FALTA: confirmar si se activa esta sección en el rediseño]`.

### `/soluciones` — listado (conectado a Sanity CMS, con fallback)
- **Hero:** "Soluciones que resuelven problemas reales" — "Sistemas cerrados, probados en producción, diseñados para procesos empresariales críticos. No vendemos software genérico — entregamos herramientas que encajan en tu operación."
- **3 tarjetas** (mismas del home, con más detalle vía "Ver detalle" → página individual): Sistema de Compras, Personal Transitorio, Mesa de Ayuda — cada una con 3 features puntuales.

### `/casos-exito` — listado (conectado a Sanity CMS, con fallback)
- **Hero:** "Problemas reales. Resultados medibles." — "Desde startups en crecimiento hasta empresas consolidadas..."
- **Caso destacado (featured):** BancoEstado — Automatización de procesos de compra — resultados: "60% reducción en tiempo de aprobación", "100% eliminación de papel".
- **Segundo caso:** ServiEstado — Gestión centralizada de personal externo — "40% menos tiempo en onboarding", "Control total de documentación".
- `[FALTA: caso de Laboratorios Saval, una vez confirmado como cliente]`.
- **CTA final:** "¿Tu empresa tiene un desafío similar?" → botón "Contactar".

### `/nosotros`
- **Hero:** Badge "Quiénes Somos" — H2 "18 años convirtiendo complejidad en simplicidad" — "Somos un equipo técnico con trayectoria real en operaciones empresariales. No somos una agencia creativa — somos ingenieros que resuelven problemas de negocio con software."
- **Stats destacadas:** 50+ Proyectos, 18+ años Experiencia, 200+ Procesos, 30+ Clientes (⚠️ este último stat de "30+ Clientes" no aparece en `StatsBar.astro` de la Home — inconsistencia entre páginas, revisar).
- **Timeline ("Nuestra Historia"):** 2008 (inicio trayectoria técnica) → 2012 (primeros proyectos automatización financiero) → 2016 (fundación Agencia Sur) → 2019 (lanzamiento Sistema de Compras) → 2021 (expansión Personal Transitorio y Mesa de Ayuda) → 2024 (50+ proyectos, BancoEstado y ServiEstado).
- **Principios/Valores (4):** "Antes de programar, entendemos" / "Código con propósito" / "Acompañamiento continuo" / "Transparencia total" — con descripciones cortas cada uno.
- **CTA final:** "¿Quieres conocer nuestro enfoque?" → botón "Hablemos".

### `/contacto`
- **Heading:** "¿Tienes un proyecto?" — "Cuéntanos qué necesitas. Te ayudamos a definir el camino desde la idea hasta la implementación. Estamos disponibles para responder consultas técnicas, cotizaciones o simplemente charlar sobre tu operación."
- **Datos de contacto:** Dirección: Las Bellotas 199, of 62, Providencia — Email: contacto@agenciasur.cl — Teléfono: +56 9 7864 0400.
- ⚠️ **Inconsistencia detectada:** esta página usa el componente `ContactForm.astro` (versión original, un solo paso), mientras que la Home usa `ContactFormV2.astro` (wizard de 3 pasos que probamos recién). Son dos formularios "mad libs" distintos para el mismo propósito. `[FALTA: definir cuál se mantiene / unifica en el rediseño]`.

## 11. Hallazgos técnicos a resolver (no son copy, pero afectan el rediseño)
- ~~El formulario de la Home no envía datos a ningún lado~~ — **corregido tras revisión de código más profunda**: `ContactFormV2.astro` (el que realmente se renderiza en Home) sí llama a `fetch('/api/contacto', ...)` y maneja éxito/error real. El comentario `// TODO: integrate with /api/contacto` vive en un script **huérfano** dentro de `ContactoFooter.astro` que apunta a ids (`mad-libs-form`, `ml-*`) que no existen en el DOM real — nunca se ejecuta. Es código muerto a limpiar, no un formulario roto. (La simulación en navegador que hicimos mostró un éxito real, no falso.)
- Dos componentes de formulario distintos (`ContactForm.astro` vs `ContactFormV2.astro`) para el mismo propósito de negocio — ambos funcionan y llaman a `/api/contacto` correctamente; sigue valiendo la pena unificarlos por consistencia, ya no por urgencia de negocio.
- Limpieza pendiente: eliminar el script huérfano de `ContactoFooter.astro` (código muerto, nunca se ejecuta).
- Logos de clientes hardcodeados en `NosotrosSection.astro` — debería administrarse vía Sanity, como ya se hace en `/soluciones` y `/casos-exito`.
- Los "ver más" de Sistemas Core (Home) y enlaces internos apuntan a `#` (sin URL real).

---

## Glosario de términos de marca
> Términos específicos que la IA debe usar siempre igual (ej. nombre del producto,
> nombre de features, terminología del rubro). Evita sinónimos inventados.

| Término correcto | No usar |
|---|---|
| AgenciaSur | Agencia Sur (con espacio) — el copyright del footer usa "Agencia Sur", `[FALTA: definir grafía oficial única]` |
| Levantamiento de Procesos | Análisis de procesos, relevamiento |
| Sistemas Core | Productos, soluciones (para evitar confusión con la sección "Soluciones" del menú) |
