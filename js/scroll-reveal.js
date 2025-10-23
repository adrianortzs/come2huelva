import { $$ } from './utils.js';
import { CONFIG } from './config.js';

export class ScrollReveal {
  constructor(selector = '.reveal', options = {}) {
    this.elements = $$(selector);
    this.options = {
      threshold: options.threshold || CONFIG.INTERSECTION_THRESHOLD,
      rootMargin: options.rootMargin || '0px',
      ...options
    };
    
    this.init();
  }
  
  init() {
    if (!this.elements.length) return;
    
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, showing all elements');
      this.showAllElements();
      return;
    }
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.options
    );
    
    this.elements.forEach(el => this.observer.observe(el));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  showAllElements() {
    this.elements.forEach(el => el.classList.add('reveal-visible'));
  }
  
  destroy() {
    if (this.observer) this.observer.disconnect();
  }
}

export const initScrollReveal = () => new ScrollReveal();
