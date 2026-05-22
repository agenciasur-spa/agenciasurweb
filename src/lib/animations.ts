/**
 * Agencia Sur — Animations System
 *
 * Adapted from Nexsas Time-Tracking template patterns:
 * - headerTwo: scroll-based pill header (top: 50px → 20px, header-two-scroll)
 * - NavigationMenu: dropdown hover logic with bridge elements + .active class
 * - initRevealElements: GSAP + ScrollTrigger scroll reveals via [data-ns-animate]
 * - sidebarAnimation: hamburger open/close sidebar
 * - MobileMenuAccordion: mobile sidebar accordion submenus
 * - themeSwitcher: dark/light toggle with localStorage persistence
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Scroll Reveal (template: reveal-elements.js) ─────────────────

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

// ── Header Scroll (template: header.js — headerTwo) ──────────────

function initHeaderScroll() {
  const header = document.querySelector<HTMLElement>('.header-two');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      header.style.transition = 'all 0.5s ease-in-out';
      header.style.top = '20px';
      header.classList.add('header-two-scroll');
    } else {
      header.classList.remove('header-two-scroll');
      header.style.top = '50px';
    }
  });
}

// ── Navigation Menu (template: navigation-menu.js) ───────────────

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

    // Click outside closes menus
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest) {
        if (!target.closest('.nav-item') && !target.closest('.dropdown-menu')) {
          this.hideAllMenus();
        }
      }
    });

    // Track header hover area
    const header = document.querySelector('header');
    header?.addEventListener('mouseenter', () => {
      this.isMouseInHeader = true;
      this.cancelHideMenu();
    });
    header?.addEventListener('mouseleave', (e: MouseEvent) => {
      this.isMouseInHeader = false;
      const related = e.relatedTarget as HTMLElement | null;
      const movingToMenu = related?.closest?.('.dropdown-menu');
      if (!movingToMenu) {
        this.scheduleHideMenu();
      }
    });

    // Track menu + bridge hover
    document.addEventListener('mouseenter', (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.dropdown-menu, .dropdown-menu-bridge')) {
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

    const bridge = navItem.querySelector<HTMLElement>('.dropdown-menu-bridge');
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
      const bridge = navItem.querySelector<HTMLElement>('.dropdown-menu-bridge');
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
    document.querySelectorAll<HTMLElement>('.dropdown-menu').forEach((m) => this.hideMenu(m));
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

// ── Sidebar (template: sidebar.js) ────────────────────────────────

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

// ── Mobile Menu Accordion (template: mobile-menu.js) ────────────

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

// ── Theme Switcher ──────────────────────────────────────────────
// Init lo hace el inline script de Layout.astro (antes del render)
// key localStorage: "theme"

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

// ── Init ──────────────────────────────────────────────────────────

export function initNexsasAnimations() {
  // Headless / SSR guard
  if (typeof window === 'undefined') return;

  setTimeout(() => {
    initRevealElements();
    initHeaderScroll();
    initSidebar();
    themeSwitcher.init();

    // Navigation menu
    const nav = new NavigationMenu();
    nav.init();

    // Mobile accordion
    const mobileAccordion = new MobileMenuAccordion({ defaultOpenMenu: 'servicios-mobile' });
    mobileAccordion.init();

    ScrollTrigger.refresh();
  }, 100);
}
