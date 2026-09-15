# Brief del Proyecto — AgenciaSur (rediseño web corporativa)

> Este es el documento "cerebro". Antes de generar cualquier diseño, la IA debe
> leer este archivo completo. Si algo del resto de los documentos contradice esto,
> este documento tiene prioridad.

## 1. Producto
- **¿Qué es?** Empresa de consultoría TI y desarrollo web/mobile a medida, especializada en automatizar procesos críticos de empresas (workflow, compras, mesa de ayuda, e-commerce/CMS).
- **¿Qué problema resuelve?** Empresas con procesos operativos manuales/ineficientes que necesitan digitalizarlos, y empresas que necesitan un sitio o sistema web a medida conectado a un objetivo de negocio real (no solo "una página bonita").
- **¿Qué lo diferencia de la competencia?** No es solo una fábrica de código: hacen consultoría TI estratégica y levantamiento de procesos previo al desarrollo, con metodología propia. Cada decisión técnica responde a un objetivo de negocio medible. 18 años de trayectoria técnica combinada, desde 2016 como empresa.
- **Etapa del producto:** Producto/servicio maduro (+50 proyectos exitosos, +200 levantamientos de procesos, clientes como BancoEstado y Laboratorios Saval).

## 2. Público objetivo
- **Quién es (demográfico/profesional):** Amplio — va desde gerencias de TI/operaciones de grandes empresas (banca, laboratorios) hasta dueños/gerentes de PyME que necesitan un sistema o sitio a medida más acotado.
- **Qué nivel de sofisticación técnica tiene:** Mixto. Perfiles técnicos (TI corporativo) conviven con perfiles de negocio que no manejan jerga técnica y solo esperan resultados.
- **Qué lo frena de comprar/registrarse (objeciones):** Expectativa de plazos. Al menos 2 contratos recientes se cayeron porque AgenciaSur presenta plazos responsables/realistas y el cliente esperaba tiempos más cortos.
- **Qué lo convence (triggers):** Metodología y transparencia del proceso (justifica por qué el plazo es el que es), la consultoría/levantamiento previo (no cotizan a ciegas), y casos de éxito con clientes reconocidos.

## 3. Objetivos de negocio
- **Objetivo principal de la página/producto:** Que el visitante entienda quiénes son y qué hacen, vea casos de éxito, y termine solicitando una cotización.
- **Métrica de éxito:** [FALTA: métrica formal de conversión — ej. Nº de cotizaciones/mes — no definida aún]
- **Acción #1 que queremos que el usuario haga:** Solicitar cotización / contacto.
- **Acción #2 (secundaria):** Explorar casos de éxito.

## 4. Tono de comunicación
- **3 adjetivos que describen el tono:** Estratégico, estructurado, medible.
- **Ejemplos de marcas con tono similar:** baunfire.com, refokus.com, innowise.com, trespuntoscomunicacion.es, suratica.es (se profundiza en etapa Visual con `03-referencias-tecnicas.md`).
- **Qué evitar:** Jerga técnica sin traducir a beneficio de negocio (ej. no dejar "automatización inteligente" suelto sin decir qué le ahorra al cliente en tiempo/plata) — el público no siempre es técnico.

## 5. Decisiones de estilo visual
- **Estilo general:** Dark-first, editorial/premium con mucho contraste de escala tipográfica (titulares grandes y fuertes, cuerpo discreto) y espacio negativo generoso — evolucionando desde un look "SaaS con glow" hacia algo más sobrio tipo agencia digital.
- **Paleta de color:** Fondo oscuro (escala ya existente `#070b10`→`#1a1a1c`, se mantiene) + verde de marca evolucionado (`#8FD14F` como acento principal, ver `07-design-tokens.md` para la escala completa) partiendo del verde real de agenciasur.cl (`#8BC841`), llevado a un punto medio más vibrante — no el neón `#22FF88` que había quedado del template base, ni el oliva apagado original. Se elimina el azul residual del template (no tiene uso real ni es color de marca).
- **Tipografía:** Se mantiene Inter Tight (ya cargada). Cambio de criterio: reservar peso bold + letter-spacing negativo para 1-2 momentos de máximo impacto (Hero de Home), en vez de `font-light` uniforme en todos los headings.
- **Referencias visuales (sitios o marcas):** Dirección objetivo: refokus.com (números gigantes como elemento gráfico, contraste tipográfico) y baunfire.com (peso bold en H1, minimalismo de CTA/nav, marca-fantasma decorativa). Referencias de tono adicionales (sin deep-dive visual): baunfire.com, refokus.com, innowise.com, trespuntoscomunicacion.es, suratica.es.
- **Qué NO hacer (anti-patrones):**
  - Nada de tarjetas con glow/gradiente-borde brillante (eliminar patrón actual de `ServiciosGrid.astro`)
  - Nada de gradientes azul→verde
  - Nada de ilustraciones 3D genéricas tipo stock
  - Nada de sombras decorativas pesadas en cards

## 6. Stack tecnológico sugerido
- **Framework:** Astro (ya en uso, no se propone cambio).
- **Librería de estilos:** Tailwind CSS v4, vía tokens en `src/styles/global.css` (`@theme`) — ver `07-design-tokens.md` para los valores evolucionados.
- **Librería de componentes:** Ninguna de terceros — componentes Astro propios (`src/components/`). Iconos: `@lucide/astro`. Stack marquee: `tech-stack-icons` + `vanilla-infinite-marquee`.
- **CMS:** Sanity, ya integrado parcialmente (`/soluciones`, `/casos-exito` con fallback estático). Extender el mismo patrón a los logos de clientes (hoy hardcodeados en `NosotrosSection.astro`).
- **Restricciones técnicas:**
  - ~~El formulario de contacto de la Home no tiene backend conectado~~ — corregido: `ContactFormV2.astro` sí llama a `/api/contacto` y funciona. El TODO que generó la confusión está en código muerto huérfano dentro de `ContactoFooter.astro` (a limpiar, sin urgencia de negocio).
  - Unificar `ContactForm.astro` (usado en `/contacto`) y `ContactFormV2.astro` (usado en la Home) — ambos funcionan, pero siguen siendo dos implementaciones distintas del mismo patrón "mad libs" (consistencia, no bug).
  - `[FALTA]` Hero 3D tipo Refokus (ver `03-referencias-tecnicas.md` Referencia 3): decidir si requiere sumar una librería 3D (ej. Three.js) o se resuelve con CSS 3D — decisión pospuesta a la pasada de animaciones/microinteracciones, no bloquea el resto del rediseño.

## 7. Alcance
- **Páginas/secciones incluidas en este proyecto:** Home, Servicios, Soluciones (índice + detalle), Casos de éxito (índice + detalle), Nosotros, Contacto — ya existen como páginas Astro en el proyecto, en distintos grados de avance.
- **Fuera de alcance (explícito):** Ninguno — el rediseño cubre todo el sitio tal como está estructurado hoy (Home, Servicios, Soluciones, Casos de éxito, Nosotros, Contacto).

## 8. Contexto adicional
- **Deadline / urgencia:** Sin fecha fija.
- **Quién aprueba el diseño final:** El propio equipo de AgenciaSur (el usuario).
- **Enlaces a otros documentos del proyecto:** `01-documento-de-contenido.md`, `03-referencias-tecnicas.md`, `04-mapa-de-secciones.md`, `07-design-tokens.md`. Moodboard de presentación (Artifact): https://claude.ai/code/artifact/c8ee4a78-487d-4606-89f0-99296fc1362a
