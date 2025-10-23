import { $, $$ } from './utils.js';

export class ImageOptimizer {
  constructor() {
    this.webpSupported = false;
    this.observer = null;
    this.init();
  }

  async init() {
    this.webpSupported = await this.detectWebPSupport();
    this.initLazyLoading();
    this.preloadCriticalImages();
  }

  // Comprueba si el navegador soporta WebP
  detectWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Carga las imágenes cuando están a punto de verse
  initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      this.loadAllImages();
      return;
    }

    this.observer = new IntersectionObserver((entries) => { // IntersectionObserver detecta cuando una imagen entra en pantalla
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    $$('img[loading="lazy"]').forEach(img => {
      this.observer.observe(img);
    });
  }

  // Carga .webp si no .jpg o .png
  loadImage(img) {
    if (img.classList.contains('loaded')) return;

    const originalSrc = img.dataset.src || img.src;
    const webpSrc = this.getWebPSrc(originalSrc);
    
    if (this.webpSupported && webpSrc && webpSrc !== originalSrc) img.src = webpSrc;
    else img.src = originalSrc;
    
    img.classList.add('loaded');
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
    
    img.onload = () => {
      img.style.opacity = '1';
    };
  }

  loadAllImages() {
    $$('img[loading="lazy"]').forEach(img => {
      this.loadImage(img);
    });
  }

  // Convierte la ruta de la imagen a .webp
  getWebPSrc(originalSrc) {
    if (!originalSrc || originalSrc.includes('.webp')) return originalSrc;
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  // Pre carga las imágenes críticas
  preloadCriticalImages() {
    const criticalImages = [ 'img/logonuevo.webp', 'img/favicon.webp' ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  generateSrcSet(baseSrc, sizes = [320, 640, 1024, 1920]) {
    return sizes.map(size => `${baseSrc}?w=${size} ${size}w`).join(', ');
  }

  async convertToWebP(img, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/webp', quality);
    });
  }

  // Efecto de carga de la imagen
  optimizeImage(img) {
    if (!img.dataset.src) {
      img.style.backgroundColor = '#f0f0f0';
      img.style.backgroundImage = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
      img.style.backgroundSize = '200% 100%';
      img.style.animation = 'shimmer 1.5s infinite';
    }
  }
}

export const imageOptimizer = new ImageOptimizer();
