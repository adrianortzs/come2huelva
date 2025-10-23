import { $, debounce } from './utils.js';
import { CONFIG } from './config.js';

export class Carousel {
  constructor({
    trackSelector,
    prevBtnSelector,
    nextBtnSelector,
    slidesPerView = { mobile: 1, tablet: 2, desktop: 4 },
    auto = true, // Si el carousel se auto-reproduce
    interval = CONFIG.CAROUSEL.DEFAULT_INTERVAL
  }) {
    this.track = $(trackSelector);
    this.prevBtn = $(prevBtnSelector);
    this.nextBtn = $(nextBtnSelector);
    
    if (!this.track || !this.prevBtn || !this.nextBtn) return;
    
    this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
    if (!this.slides.length) return;
    
    this.slidesPerView = slidesPerView;
    this.auto = auto;
    this.interval = interval;
    this.currentIndex = 0;
    this.autoScrollInterval = null;
    this.resumeTimer = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updatePosition();
    if (this.auto) this.startAuto(); // Si el carousel se auto-reproduce, inicia el auto-reproducción
  }
  
  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => {
      this.changeSlide(-1);
      this.pauseTemporarily();
    });
    
    this.nextBtn.addEventListener('click', () => {
      this.changeSlide(1);
      this.pauseTemporarily();
    });
    
    const onResize = debounce(() => {
      this.updatePosition();
      if (this.auto) this.startAuto();
    }, CONFIG.CAROUSEL.RESIZE_DEBOUNCE);
    window.addEventListener('resize', onResize);
    
    // Pausa si el mouse entra en el carousel
    this.track.addEventListener('mouseenter', () => this.stopAuto());
    // Reanuda si el mouse sale del carousel
    this.track.addEventListener('mouseleave', () => this.startAuto());
    // Pausa al tocar el carousel (táctil)
    ['pointerdown', 'touchstart'].forEach(evt => {
      this.track.addEventListener(evt, () => this.pauseTemporarily(), { passive: true });
    });
  }
  
  // Calcula el tamaño del desplazamiento del carousel
  getStepSize() {
    const firstSlide = this.slides[0];
    if (!firstSlide) return 0;
    
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const styles = window.getComputedStyle(this.track);
    const gapValue = parseFloat(styles.columnGap || styles.gap || '0');
    const gap = Number.isNaN(gapValue) ? 0 : gapValue;
    
    return slideWidth + gap;
  }
  
  // Actualiza la posición del carousel
  updatePosition() {
    const step = this.getStepSize();
    this.track.style.transform = `translateX(-${this.currentIndex * step}px)`;
  }
  
  // Cuántas slides se muestran
  getSlidesToShow() {
    const width = window.innerWidth;
    if (width <= CONFIG.BREAKPOINTS.MOBILE) return this.slidesPerView.mobile ?? 1;
    if (width <= CONFIG.BREAKPOINTS.TABLET) return this.slidesPerView.tablet ?? this.slidesPerView.mobile ?? 1;
    return this.slidesPerView.desktop ?? 4;
  }
  
  changeSlide(direction) {
    const totalSlides = this.slides.length;
    const slidesToShow = this.getSlidesToShow();
    const maxIndex = Math.max(0, totalSlides - slidesToShow);
    
    this.currentIndex += direction;
    
    // Si el índice es mayor al máximo, reinicia al inicio
    if (this.currentIndex > maxIndex) this.currentIndex = 0;
    // Si el índice es menor a 0, reinicia al final
    else if (this.currentIndex < 0) this.currentIndex = maxIndex;
    
    this.updatePosition();
  }
  
  startAuto() {
    if (!this.auto) return;
    this.stopAuto();
    this.autoScrollInterval = setInterval(() => this.changeSlide(1), this.interval);
  }
  
  stopAuto() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
  
  pauseTemporarily(duration = CONFIG.CAROUSEL.PAUSE_DURATION) {
    this.stopAuto();
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => this.startAuto(), duration);
  }
  
  destroy() {
    this.stopAuto();
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
  }
}

export const initCarousels = () => {
  const carousels = [
    new Carousel({
      trackSelector: '.carousel-track.activities',
      prevBtnSelector: '.prev-btn-activities',
      nextBtnSelector: '.next-btn-activities'
    }),
    new Carousel({
      trackSelector: '.carousel-track.gastronomy',
      prevBtnSelector: '.prev-btn-gastronomy',
      nextBtnSelector: '.next-btn-gastronomy'
    }),
    new Carousel({
      trackSelector: '.carousel-track.plans',
      prevBtnSelector: '.prev-btn-plans',
      nextBtnSelector: '.next-btn-plans',
      slidesPerView: { mobile: 1, tablet: 1, desktop: 4 }
    }),
    new Carousel({
      trackSelector: '.carousel-track.opinions',
      prevBtnSelector: '.prev-btn-opinions',
      nextBtnSelector: '.next-btn-opinions',
      slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
      auto: true,
      interval: 5000
    })
  ];
  
  return carousels;
};
