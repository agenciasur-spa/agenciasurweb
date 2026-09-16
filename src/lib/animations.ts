/**
 * Agencia Sur — Animations System
 *
 * Full port of Nexsas Time-Tracking animation system:
 * - Scroll reveals via [data-ns-animate] (GSAP + ScrollTrigger)
 * - Header scroll effects (all 6 variants + AI voice + financial)
 * - NavigationMenu: dropdown hover with bridge + .active class
 * - Sidebar: hamburger open/close
 * - MobileMenuAccordion: mobile accordion submenus
 * - buttonV3: hover slide effect
 * - Progress bars: [data-progress-item] with GSAP
 * - Number counters: [data-counter] with IntersectionObserver + GSAP
 * - Parallax: #scene with .parallax-effect children
 * - Price switcher: #priceCheck toggle
 * - Divider expand: .divider scroll-triggered width
 * - Theme switcher: dark/light toggle with localStorage
 * - Force theme: [data-force-theme] for landing pages
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Scroll Reveal ────────────────────────────────────────────────────

function initRevealElements() {
  const elements = document.querySelectorAll<HTMLElement>('[data-ns-animate]');

  elements.forEach((elem) => {
    const duration = parseFloat(elem.getAttribute('data-duration') ?? '0.6');
    const delay = parseFloat(elem.getAttribute('data-delay') ?? '0');
    const offset = parseFloat(elem.getAttribute('data-offset') ?? '60');
    const instant = elem.hasAttribute('data-instant') && elem.getAttribute('data-instant') !== 'false';
    const start = elem.getAttribute('data-start') || 'top 90%';
    const end = elem.getAttribute('data-end') || 'top 50%';
    const direction = elem.getAttribute('data-direction') || 'down';
    const animationType = elem.getAttribute('data-animation-type') || 'from';

    elem.style.opacity = '1';
    elem.style.filter = 'blur(0)';

    const vars: gsap.TweenVars = {
      duration,
      delay,
      ease: 'power2.out',
    };

    if (animationType === 'to') {
      vars.opacity = 1;
      vars.filter = 'blur(0)';
    } else {
      vars.opacity = 0;
      vars.filter = 'blur(16px)';
    }

    if (!instant) {
      vars.scrollTrigger = {
        trigger: elem,
        start,
        end,
        scrub: false,
      };
    }

    switch (direction) {
      case 'left':  vars.x = -offset; break;
      case 'right': vars.x = offset; break;
      case 'down':  vars.y = offset; break;
      case 'up':
      default:      vars.y = -offset; break;
    }

    if (animationType === 'to') {
      gsap.to(elem, vars);
    } else {
      gsap.from(elem, vars);
    }
  });
}

// ── Header Scroll (all variants) ──────────────────────────────────────

function initHeaderScroll() {
  // Only .header-two is used in this project (Navbar.astro); the other
  // header variants (header-one/three/four/five/six, ai-voice, financial)
  // were leftover from the ported template and were removed.
  const headerTwo = document.querySelector<HTMLElement>('.header-two');
  if (!headerTwo) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      headerTwo.style.transition = 'all 0.5s ease-in-out';
      headerTwo.style.top = '20px';
      headerTwo.classList.add('header-two-scroll');
    } else {
      headerTwo.classList.remove('header-two-scroll');
      headerTwo.style.top = '50px';
    }
  });
}

// ── Navigation Menu ──────────────────────────────────────────────────

class NavigationMenu {
  private activeMenu: HTMLElement | null = null;
  private menuTimeout: ReturnType<typeof setTimeout> | null = null;
  private isMouseInHeader = false;
  private isMouseInMenu = false;

  init() {
    this.bindEvents();
  }

  private bindEvents() {
    const navItems = document.querySelectorAll<HTMLElement>('.nav-item[data-menu]');

    navItems.forEach((item) => {
      const menuId = item.getAttribute('data-menu');
      const menu = document.getElementById(menuId ?? '');
      if (!menu) return;

      item.addEventListener('mouseenter', () => this.showMenu(item, menu));

      item.addEventListener('mouseleave', (e: MouseEvent) => {
        const related = e.relatedTarget as Node | null;
        if (!related || !menu.contains(related)) {
          this.scheduleHideMenu();
        }
      });

      menu.addEventListener('mouseenter', () => {
        this.cancelHideMenu();
        this.showMenu(item, menu);
      });

      menu.addEventListener('mouseleave', (e: MouseEvent) => {
        const related = e.relatedTarget as Node | null;
        if (!related || !item.contains(related)) {
          this.scheduleHideMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest) {
        if (!target.closest('.nav-item') && !target.closest('.dropdown-menu') && !target.closest('.mega-menu')) {
          this.hideAllMenus();
        }
      }
    });

    const header = document.querySelector('header');
    header?.addEventListener('mouseenter', () => {
      this.isMouseInHeader = true;
      this.cancelHideMenu();
    });
    header?.addEventListener('mouseleave', (e: MouseEvent) => {
      this.isMouseInHeader = false;
      const related = e.relatedTarget as HTMLElement | null;
      const movingToMenu = related?.closest?.('.dropdown-menu, .mega-menu');
      if (!movingToMenu) {
        this.scheduleHideMenu();
      }
    });

    document.addEventListener('mouseenter', (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.dropdown-menu, .mega-menu, .dropdown-menu-bridge, .mega-menu-bridge')) {
        this.isMouseInMenu = true;
        this.cancelHideMenu();
      }
    }, true);
  }

  private showMenu(navItem: HTMLElement, menu: HTMLElement) {
    this.cancelHideMenu();
    this.hideAllMenus();
    this.activeMenu = menu;
    navItem.classList.add('active', 'menu-active');
    menu.classList.add('active');
    const bridge = navItem.querySelector<HTMLElement>('.dropdown-menu-bridge, .mega-menu-bridge');
    if (bridge) {
      bridge.style.opacity = '1';
      bridge.style.pointerEvents = 'auto';
    }
  }

  private hideMenu(menu: HTMLElement) {
    menu.classList.remove('active');
    const navItem = document.querySelector<HTMLElement>(`[data-menu="${menu.id}"]`);
    if (navItem) {
      navItem.classList.remove('active', 'menu-active');
      const bridge = navItem.querySelector<HTMLElement>('.dropdown-menu-bridge, .mega-menu-bridge');
      if (bridge) {
        bridge.style.opacity = '0';
        bridge.style.pointerEvents = 'none';
      }
    }
    if (this.activeMenu === menu) {
      this.activeMenu = null;
    }
  }

  private hideAllMenus() {
    document.querySelectorAll<HTMLElement>('.dropdown-menu, .mega-menu, .customer-dropdown-menu').forEach((m) => this.hideMenu(m));
    document.querySelectorAll<HTMLElement>('.nav-item[data-menu]').forEach((i) => {
      i.classList.remove('active', 'menu-active');
    });
    this.activeMenu = null;
  }

  private scheduleHideMenu() {
    this.cancelHideMenu();
    this.menuTimeout = setTimeout(() => {
      if (!this.isMouseInHeader && !this.isMouseInMenu) {
        this.hideAllMenus();
      }
    }, 200);
  }

  private cancelHideMenu() {
    if (this.menuTimeout) {
      clearTimeout(this.menuTimeout);
      this.menuTimeout = null;
    }
  }
}

// ── Sidebar ──────────────────────────────────────────────────────────

function initSidebar() {
  const hamburger = document.querySelector<HTMLElement>('.nav-hamburger');
  const closeBtn = document.querySelector<HTMLElement>('.nav-hamburger-close');
  const sidebar = document.querySelector<HTMLElement>('.sidebar');
  const overlay = document.querySelector<HTMLElement>('.sidebar-overlay');

  hamburger?.addEventListener('click', () => {
    sidebar?.classList.add('show-sidebar');
    document.body.classList.add('overflow-hidden');
    overlay?.classList.remove('hidden');
  });

  const closeSidebar = () => {
    sidebar?.classList.remove('show-sidebar');
    document.body.classList.remove('overflow-hidden');
    overlay?.classList.add('hidden');
  };

  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);
}

// ── Mobile Menu Accordion ────────────────────────────────────────────

class MobileMenuAccordion {
  private defaultOpenMenu: string;
  private toggleButtons: NodeListOf<HTMLElement> | null = null;
  private submenus: NodeListOf<HTMLElement> | null = null;
  private arrows: NodeListOf<HTMLElement> | null = null;

  constructor(options: { defaultOpenMenu?: string } = {}) {
    this.defaultOpenMenu = options.defaultOpenMenu || 'servicios-mobile';
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bindEvents());
    } else {
      this.bindEvents();
    }
  }

  private bindEvents() {
    this.toggleButtons = document.querySelectorAll('.mobile-menu-toggle[data-menu]');
    if (!this.toggleButtons.length) return;

    this.submenus = document.querySelectorAll('.mobile-submenu[data-submenu]');
    this.arrows = document.querySelectorAll('.mobile-menu-toggle .menu-arrow');

    this.setDefaultState();

    this.toggleButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const menuId = button.getAttribute('data-menu');
        if (menuId) this.toggleMenu(menuId);
      });
    });
  }

  private setDefaultState() {
    this.submenus?.forEach((sub) => {
      sub.classList.add('hidden');
      sub.classList.remove('block');
    });
    this.arrows?.forEach((a) => a.classList.remove('rotate-90'));

    if (this.defaultOpenMenu) {
      const defaultSub = document.querySelector(`.mobile-submenu[data-submenu="${this.defaultOpenMenu}"]`);
      const defaultBtn = document.querySelector(`.mobile-menu-toggle[data-menu="${this.defaultOpenMenu}"]`);
      const defaultArrow = defaultBtn?.querySelector('.menu-arrow');
      defaultSub?.classList.remove('hidden');
      defaultSub?.classList.add('block');
      defaultArrow?.classList.add('rotate-90');
    }
  }

  private toggleMenu(menuId: string) {
    const submenu = document.querySelector<HTMLElement>(`.mobile-submenu[data-submenu="${menuId}"]`);
    const button = document.querySelector<HTMLElement>(`.mobile-menu-toggle[data-menu="${menuId}"]`);
    const arrow = button?.querySelector<HTMLElement>('.menu-arrow');
    if (!submenu || !button) return;

    const isOpen = submenu.classList.contains('block') && !submenu.classList.contains('hidden');
    this.closeAllMenus();

    if (isOpen) {
      submenu.classList.add('hidden');
      submenu.classList.remove('block');
      arrow?.classList.remove('rotate-90');
    } else {
      submenu.classList.remove('hidden');
      submenu.classList.add('block');
      arrow?.classList.add('rotate-90');
    }
  }

  private closeAllMenus() {
    this.submenus?.forEach((sub) => {
      sub.classList.add('hidden');
      sub.classList.remove('block');
    });
    this.arrows?.forEach((a) => a.classList.remove('rotate-90'));
  }
}

// ── Button V3 Hover Effect ───────────────────────────────────────────

const buttonV3 = {
  init(root: HTMLElement | Document = document) {
    const wrappers = root.querySelectorAll<HTMLElement>('[data-button-v3]');
    wrappers.forEach((wrapper) => {
      if (wrapper.dataset.v3Bound) return;
      wrapper.dataset.v3Bound = 'true';

      const icon = wrapper.querySelector<HTMLElement>('[data-button-v3-icon]');
      const text = wrapper.querySelector<HTMLElement>('[data-button-v3-text]');
      if (!icon || !text) return;

      const onEnter = () => {
        const wrapperW = Math.ceil(wrapper.clientWidth);
        const iconW = icon.clientWidth;
        icon.style.transform = `translateX(${wrapperW - (iconW + 9)}px)`;
        text.style.transform = `translateX(-${iconW}px)`;
      };

      const onLeave = () => {
        icon.style.transform = 'translateX(0)';
        text.style.transform = 'translateX(0)';
      };

      wrapper.addEventListener('mouseenter', onEnter);
      wrapper.addEventListener('mouseleave', onLeave);
    });
  },
};

// ── Number Counter (IntersectionObserver) ────────────────────────────

function initCounterAnimation() {
  const observers: IntersectionObserver[] = [];

  const els = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      if (el.classList.contains('animated')) return;
      el.classList.add('animated');

      const target = parseInt(el.getAttribute('data-counter') ?? '0', 10);
      const prefix = el.getAttribute('data-counter-prefix') ?? '';
      const suffix = el.getAttribute('data-counter-suffix') ?? '';

      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${Math.floor(counter.val)}${suffix}`;
        },
      });
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

  els.forEach((el) => observer.observe(el));
  observers.push(observer);
}

// ── Step Line Animation (Process Steps) ──────────────────────────────

function initStepLineAnimation() {
  const stepLines = document.querySelectorAll<HTMLElement>('.step-line');
  if (!stepLines.length) return;

  stepLines.forEach((line, index) => {
    // Each step-line sits inside a container with h-[320px] lg:h-[380px]
    // Animate to fill the full parent height
    const parent = line.parentElement;
    if (!parent) return;
    const targetHeight = parent.getBoundingClientRect().height;

    gsap.set(line, { height: '0px' });

    gsap.to(line, {
      height: targetHeight,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: line,
        start: 'top 75%',
        end: 'top 15%',
        toggleActions: 'play none none reverse',
      },
      delay: index * 0.15,
    });
  });
}

// ── Parallax Effect ──────────────────────────────────────────────────

function initParallax() {
  const scene = document.getElementById('scene');
  if (!scene) return;

  const parallaxEls = scene.querySelectorAll<HTMLElement>('.parallax-effect');
  if (!parallaxEls.length) return;

  parallaxEls.forEach((el) => {
    el.style.willChange = 'transform';
    el.style.transform = 'translate3d(0px, 0px, 0)';
  });

  const configs = Array.from(parallaxEls).map((el) => ({
    el,
    depth: parseFloat(el.getAttribute('data-parallax-value') ?? '1'),
    dirX: parseFloat(el.getAttribute('data-data-parallax-x') ?? '1'),
    dirY: parseFloat(el.getAttribute('data-data-parallax-y') ?? '1'),
  }));

  let rafId: number | null = null;
  let mouseX = scene.offsetWidth / 2;
  let mouseY = scene.offsetHeight / 2;

  const update = () => {
    const cx = scene.offsetWidth / 2;
    const cy = scene.offsetHeight / 2;
    const rx = (mouseX - cx) / cx;
    const ry = (mouseY - cy) / cy;

    configs.forEach(({ el, depth, dirX, dirY }) => {
      el.style.transform = `translate3d(${rx * depth * dirX * 25}px, ${ry * depth * dirY * 25}px, 0)`;
    });
    rafId = null;
  };

  scene.addEventListener('mousemove', (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    if (!rafId) rafId = requestAnimationFrame(update);
  }, { passive: true });

  scene.addEventListener('mouseleave', () => {
    setTimeout(() => {
      configs.forEach(({ el }) => { el.style.willChange = 'auto'; });
    }, 1000);
  });
}

// ── Divider Expand ──────────────────────────────────────────────────

function initDividerExpand() {
  const dividers = document.querySelectorAll<HTMLElement>('.divider, .footer-divider');
  dividers.forEach((div) => {
    gsap.to(div, {
      scrollTrigger: { trigger: div, start: 'top 100%', end: 'top 50%' },
      width: '100%', duration: 1, delay: 0.7, ease: 'power2.out',
    });
  });
}

// ── Servicios reveal (entrada sobre el Hero) ────────────────────────
// El panel de #servicios (fondo claro, esquinas redondeadas superiores)
// se "desliza" hacia arriba y se asienta sobre el Hero oscuro a medida
// que se hace scroll, en vez de aparecer estático de golpe.

function initServiciosReveal() {
  const panel = document.getElementById('servicios');
  // Sentinel sin transform (ver ServiciosGrid.astro): el trigger del
  // scroll NO puede ser el propio panel animado, porque GSAP mide su
  // posicion con getBoundingClientRect y el transform que le vamos
  // aplicando retroalimenta esa medicion y desincroniza el scrub.
  const trigger = document.getElementById('servicios-trigger');
  if (!panel || !trigger) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.set(panel, { transformOrigin: '50% 0%', willChange: 'transform, box-shadow' });

  gsap.fromTo(
    panel,
    {
      y: 140,
      scale: 0.96,
      boxShadow: '0 0px 0px 0px rgba(0,0,0,0)',
    },
    {
      y: 0,
      scale: 1,
      boxShadow: '0 -40px 80px -40px rgba(0,0,0,0.35)',
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'top 55%',
        scrub: true,
      },
    }
  );
}

// ── Theme Switcher ──────────────────────────────────────────────────

const themeSwitcher = {
  init() {
    try {
      this.bindEvents();
    } catch (e) {
      console.error('Theme switcher init failed:', e);
    }
  },

  bindEvents() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(next);
      localStorage.setItem('theme', next);
    });
  },
};

// ── Force Theme Switcher (landing pages) ────────────────────────────

function initForceTheme() {
  const html = document.documentElement;
  const forced = html.getAttribute('data-force-theme');
  if (forced) {
    html.classList.remove('dark', 'light');
    html.classList.add(forced);
  }
}

/**
 * Hero phrase rotator — cicla la palabra de acento del H1 del Hero
 * (ej. "criticos" -> "manuales" -> "repetitivos") con un crossfade +
 * blur sutil, inspirado en el "Designed to mean ___." de trionn.com.
 * Se detiene si el usuario prefiere menos movimiento.
 */
function initHeroPhraseRotator() {
  const el = document.querySelector<HTMLElement>('[data-hero-rotate]');
  if (!el) return;

  let words: string[] = [];
  try {
    words = JSON.parse(el.getAttribute('data-words') || '[]');
  } catch {
    words = [];
  }
  if (words.length < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const transitionMs = 450;
  const holdMs = 2800;
  let index = 0;

  el.style.display = 'inline-block';
  el.style.transition = `opacity ${transitionMs}ms ease, filter ${transitionMs}ms ease`;
  el.style.willChange = 'opacity, filter';

  setInterval(() => {
    index = (index + 1) % words.length;
    el.style.opacity = '0';
    el.style.filter = 'blur(8px)';
    setTimeout(() => {
      el.textContent = words[index];
      el.style.opacity = '1';
      el.style.filter = 'blur(0px)';
    }, transitionMs);
  }, holdMs + transitionMs);
}

/**
 * Conecta los triggers de "contacto inmediato" (ej. Hero: "Hablemos de tu
 * proyecto" / "Agenda una llamada", estilo trionn.com) con el DemoModal
 * existente. Cada trigger declara su copy via data-attributes y se la pasa
 * al modal como CustomEvent.detail, asi un mismo modal cubre ambos
 * "intents" (obtener el lead / agendar una llamada) sin duplicar el
 * componente. Ver DemoModal.astro para el lado que consume el detail.
 */
function initDemoModalTriggers() {
  const triggers = document.querySelectorAll<HTMLElement>('[data-open-demo-modal]');
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      document.dispatchEvent(
        new CustomEvent('open-demo-modal', {
          detail: {
            modalTitle: trigger.dataset.modalTitle,
            ctaLabel: trigger.dataset.ctaLabel,
            solucion: trigger.dataset.solucion,
            description: trigger.dataset.description,
          },
        })
      );
    });
  });
}

/**
 * El boton "ver mas" del Hero es `position: fixed` (asi el margen inferior
 * se calcula siempre sobre el 100vh real de la pantalla, sin depender de
 * cuanto mida el Hero en cada breakpoint). Al ser fixed persiste mientras
 * se scrollea el resto del sitio, asi que lo ocultamos apenas se avanza
 * mas alla del propio Hero para que no quede flotando sobre las demas
 * secciones.
 */
function initHeroScrollCue() {
  const cue = document.getElementById('hero-scroll-cue');
  if (!cue) return;

  cue.style.transition = 'opacity 300ms ease';

  function update() {
    const past = window.scrollY > window.innerHeight * 0.6;
    cue!.style.opacity = past ? '0' : '1';
    cue!.style.pointerEvents = past ? 'none' : 'auto';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Init ─────────────────────────────────────────────────────────────

export function initNexsasAnimations() {
  if (typeof window === 'undefined') return;

  initForceTheme();

  setTimeout(() => {
    initRevealElements();
    initHeaderScroll();
    initSidebar();
    initCounterAnimation();
    initStepLineAnimation();
    initParallax();
    initDividerExpand();
    initServiciosReveal();
    initHeroPhraseRotator();
    initDemoModalTriggers();
    initHeroScrollCue();
    themeSwitcher.init();
    buttonV3.init();

    const nav = new NavigationMenu();
    nav.init();

    const mobileAccordion = new MobileMenuAccordion({ defaultOpenMenu: 'servicios-mobile' });
    mobileAccordion.init();

    ScrollTrigger.refresh();
  }, 100);
}
