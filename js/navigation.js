import { $, $$, setExpanded } from './utils.js';
import { CONFIG } from './config.js';

export class Navigation {
  constructor() {
    this.header = $('header');
    this.menuToggle = $('.menu-toggle');
    this.languageSelector = { button: $('.selected-language'), menu: $('.language-options') };
    
    if (this.header && this.menuToggle) this.initMobileMenu();
    if (this.languageSelector.button && this.languageSelector.menu) this.initLanguageMenu();
    
    this.markCurrentPage();
  }
  
  initMobileMenu() {
    this.menuToggle.addEventListener('click', () => {
      const isOpen = this.header.classList.toggle('nav-open');
      setExpanded(this.menuToggle, isOpen);
    });
    
    $$('nav a', this.header).forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    document.addEventListener('click', (e) => {
      const isInsideHeader = e.target.closest('header'); // Verifica si el click está dentro o fuera del header
      if (!isInsideHeader && this.header.classList.contains('nav-open')) {
        this.closeMenu();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.header.classList.contains('nav-open')) {
        this.closeMenu();
      }
    });
    
    window.addEventListener('resize', () => {
      if (window.innerWidth > CONFIG.BREAKPOINTS.MOBILE) {
        this.closeMenu();
      }
    });
  }
  
  closeMenu() {
    if (!this.header) return;
    this.header.classList.remove('nav-open');
    if (this.menuToggle) setExpanded(this.menuToggle, false);
  }
  
  initLanguageMenu() {
    const { button, menu } = this.languageSelector;
    
    button.addEventListener('click', () => {
      const willShow = !menu.classList.contains('show');
      menu.classList.toggle('show');
      setExpanded(button, willShow);
    });
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector') && menu.classList.contains('show')) {
        menu.classList.remove('show');
        setExpanded(button, false);
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('show')) {
        menu.classList.remove('show');
        setExpanded(button, false);
      }
    });
  }
  
  // aria-current="page"
  markCurrentPage() {
    const currentPath = location.pathname.split('/').pop() || 'index.html';
    
    $$('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      const hrefFile = href.includes('#') ? href.split('#')[0] : href;
      const isCurrentPage = hrefFile === currentPath || (currentPath === 'index.html' && href.startsWith('#'));
      
      if (isCurrentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }
}

export const scrollToForm = () => {
  const formContainer = $('.form-container');
  if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.scrollToForm = scrollToForm; // Para que pueda usarlo el HTML
