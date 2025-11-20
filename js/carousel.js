import { $, debounce } from "./utils.js";
import { CONFIG } from "./config.js";

export class Carousel {
  constructor({
    trackSelector,
    prevBtnSelector,
    nextBtnSelector,
    slidesPerView = { mobile: 1, tablet: 2, desktop: 4 },
    auto = true,
    interval = CONFIG.CAROUSEL.DEFAULT_INTERVAL,
    enableMouseSwipe = false,
    enableDragScroll = false
  }) {
    this.track = $(trackSelector);
    this.prevBtn = $(prevBtnSelector);
    this.nextBtn = $(nextBtnSelector);
    this.boundHandlers = new Map();
    this._cachedDimensions = null;
    this._dimensionsDirty = true;
    if (this.track) {
      this.slides = Array.from(this.track.querySelectorAll(".carousel-slide"));
      if (this.slides.length) {
        this.slidesPerView = slidesPerView;
        this.auto = auto;
        this.interval = interval;
        this.currentIndex = 0;
        this.autoScrollInterval = null;
        this.resumeTimer = null;
        this.enableMouseSwipe = enableMouseSwipe;
        this.enableDragScroll = enableDragScroll;
        this.mouseX = null;
        this.mouseMoveThreshold = 50;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.init();
      }
    }
  }

  init() {
    this.setupEventListeners();
    this.updateActiveSlide();
    this.updatePosition();
    if (this.auto) this.startAuto();
  }

  setupEventListeners() {
    if (this.prevBtn) {
      const prevHandler = () => {
      this.changeSlide(-1);
      this.pauseTemporarily();
      };
      this.boundHandlers.set("prevBtn", prevHandler);
      this.prevBtn.addEventListener("click", prevHandler);
    }
    if (this.nextBtn) {
      const nextHandler = () => {
      this.changeSlide(1);
      this.pauseTemporarily();
      };
      this.boundHandlers.set("nextBtn", nextHandler);
      this.nextBtn.addEventListener("click", nextHandler);
    }
    
    const resizeHandler = debounce(() => {
      this._dimensionsDirty = true;
      this.updatePosition();
      if (this.auto) this.startAuto();
    }, CONFIG.CAROUSEL.RESIZE_DEBOUNCE);
    this.boundHandlers.set("resize", resizeHandler);
    window.addEventListener("resize", resizeHandler);
    
    const mouseEnterHandler = () => this.stopAuto();
    this.boundHandlers.set("mouseenter", mouseEnterHandler);
    this.track.addEventListener("mouseenter", mouseEnterHandler);
    
    const mouseLeaveHandler = () => {
      this.startAuto();
      this.mouseX = null;
    };
    this.boundHandlers.set("mouseleave", mouseLeaveHandler);
    this.track.addEventListener("mouseleave", mouseLeaveHandler);
    
    const pauseHandler = () => this.pauseTemporarily();
    ["pointerdown", "touchstart"].forEach((eventType) => {
      this.track.addEventListener(eventType, pauseHandler, { passive: true });
      const key = `pause-${eventType}`;
      this.boundHandlers.set(key, pauseHandler);
    });
    
    if (this.enableMouseSwipe) {
      const container = this.track.closest(".opinions-carousel-container") || 
                        this.track.closest(".places-carousel-container") || 
                        this.track.parentElement;
      if (container) {
        const mouseMoveHandler = (e) => this.handleMouseMove(e);
        this.boundHandlers.set("mousemove", mouseMoveHandler);
        container.addEventListener("mousemove", mouseMoveHandler);
        
        // Inicializar índice para places carousel
        if (container.classList.contains("places-carousel-container")) {
          const slideWidth = this.slides[0]?.getBoundingClientRect().width || container.getBoundingClientRect().width;
          const scrollLeft = container.scrollLeft;
          const slideIndex = Math.round(scrollLeft / slideWidth);
          // Para places carousel, usar bucle infinito
          this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
          
          // Actualizar índice cuando se hace scroll
          const scrollHandler = () => {
            const slideWidth = this.slides[0]?.getBoundingClientRect().width || container.getBoundingClientRect().width;
            const scrollLeft = container.scrollLeft;
            const slideIndex = Math.round(scrollLeft / slideWidth);
            // Para places carousel, usar bucle infinito
            this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
          };
          this.boundHandlers.set("scroll", scrollHandler);
          container.addEventListener("scroll", scrollHandler, { passive: true });
        }
      }
    }
    
    if (this.enableDragScroll) {
      this.setupDragScroll();
    }
  }

  setupDragScroll() {
    // Solo activar drag scroll en móvil o para places carousel
    const isMobile = window.innerWidth <= 768;
    const isPlaces = this.track.closest(".places-carousel-container");
    
    // En desktop (excepto places), no usar drag scroll
    if (!isMobile && !isPlaces) {
      return;
    }
    
    // Para places, usar el contenedor padre
    // Para activities, gastronomy, plans y opinions en móvil, usar el track directamente
    const container = isPlaces 
      ? this.track.closest(".places-carousel-container")
      : this.track; // Para el resto en móvil, usar el track directamente
    if (!container || !this.slides.length) return;
    
    container.style.cursor = "grab";
    container.style.userSelect = "none";
    container.style.touchAction = "pan-y pan-x"; // Permitir scroll vertical y horizontal
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'region');
    const isPlacesContainer = container.classList.contains("places-carousel-container");
    const isOpinionsContainer = container.classList.contains("opinions-carousel-container");
    const isActivities = this.track.classList.contains("activities");
    const isGastronomy = this.track.classList.contains("gastronomy");
    const isPlans = this.track.classList.contains("plans");
    const isOpinions = this.track.classList.contains("opinions");
    let ariaLabel = 'Carousel';
    if (isPlacesContainer) ariaLabel = 'Carousel de lugares';
    else if (isOpinionsContainer || isOpinions) ariaLabel = 'Carousel de opiniones';
    else if (isActivities) ariaLabel = 'Carousel de actividades';
    else if (isGastronomy) ariaLabel = 'Carousel de gastronomía';
    else if (isPlans) ariaLabel = 'Carousel de planes';
    container.setAttribute('aria-label', ariaLabel);
    
    let isScrolling = false;
    let scrollTimeout = null;
    
    const getSlideWidth = () => {
      if (this.slides.length === 0) return window.innerWidth;
      return this.slides[0].getBoundingClientRect().width;
    };
    
    const updateCurrentIndex = () => {
      if (this.slides.length === 0) return;
      const slideWidth = this.slides[0].getBoundingClientRect().width;
      const scrollLeft = container.scrollLeft;
      const isPlacesCarousel = container.classList.contains("places-carousel-container");
      const isMobile = window.innerWidth <= 768;
      const isActivities = this.track.classList.contains("activities");
      const isGastronomy = this.track.classList.contains("gastronomy");
      const isOpinions = this.track.classList.contains("opinions");
      const shouldUseInfiniteLoop = isPlacesCarousel || (isMobile && (isActivities || isGastronomy || isOpinions));
      // Usar un umbral más bajo (20% de la slide) para cambiar más fácilmente
      const threshold = slideWidth * 0.2;
      const slideIndex = Math.round((scrollLeft + threshold) / slideWidth);
      if (shouldUseInfiniteLoop) {
        // Para places carousel o activities/gastronomy/opinions en móvil, usar bucle infinito
        this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
      } else {
        this.currentIndex = Math.max(0, Math.min(slideIndex, this.slides.length - 1));
      }
    };
    
    const snapToSlide = (immediate = false, direction = null) => {
      if (isScrolling) return;
      isScrolling = true;
      
      const slideWidth = getSlideWidth();
      const scrollLeft = container.scrollLeft;
      const isPlacesCarousel = container.classList.contains("places-carousel-container");
      const isMobile = window.innerWidth <= 768;
      const isActivities = this.track.classList.contains("activities");
      const isGastronomy = this.track.classList.contains("gastronomy");
      const isOpinions = this.track.classList.contains("opinions");
      const shouldUseInfiniteLoop = isPlacesCarousel || (isMobile && (isActivities || isGastronomy || isOpinions));
      
      // Si hay una dirección específica (swipe), usarla directamente
      if (direction === 'left') {
        if (shouldUseInfiniteLoop) {
          // Bucle infinito: si está en el último, ir al primero
          this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        } else if (this.currentIndex < this.slides.length - 1) {
          this.currentIndex++;
        }
      } else if (direction === 'right') {
        if (shouldUseInfiniteLoop) {
          // Bucle infinito: si está en el primero, ir al último
          this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        } else if (this.currentIndex > 0) {
          this.currentIndex--;
        }
      } else {
        // Calcular basándose en la posición actual con umbral más bajo
        const threshold = slideWidth * 0.3;
        const slideIndex = Math.round((scrollLeft + threshold) / slideWidth);
        if (shouldUseInfiniteLoop) {
          // Para places o activities/gastronomy/opinions en móvil, asegurar que el índice esté en el rango válido con bucle
          this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
        } else {
          this.currentIndex = Math.max(0, Math.min(slideIndex, this.slides.length - 1));
        }
      }
      
      const targetScroll = this.currentIndex * slideWidth;
      
      if (immediate) {
        container.scrollLeft = targetScroll;
        isScrolling = false;
      } else {
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 300);
      }
    };
    
    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Solo botón izquierdo
      this.isDragging = true;
      container.style.cursor = "grabbing";
      const rect = container.getBoundingClientRect();
      this.startX = e.pageX - rect.left;
      this.scrollLeft = container.scrollLeft;
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handleMouseLeave = () => {
      if (this.isDragging) {
        this.isDragging = false;
        container.style.cursor = "grab";
        snapToSlide();
      }
    };
    
    const handleMouseUp = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        container.style.cursor = "grab";
        snapToSlide();
      }
    };
    
    const handleMouseMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = container.getBoundingClientRect();
      const x = e.pageX - rect.left;
      const walk = (x - this.startX) * 2;
      const newScrollLeft = this.scrollLeft - walk;
      container.scrollLeft = newScrollLeft;
    };
    
    // Touch events para móviles
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScrollLeft = 0;
    let touchStartTime = 0;
    let isHorizontalSwipe = null; // null = aún no determinado, true = horizontal, false = vertical
    let minSwipeDistance = 30; // Reducido de 50 a 30 píxeles
    let swipeThreshold = 10; // Distancia mínima para determinar dirección
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
      touchStartScrollLeft = container.scrollLeft;
      touchStartTime = Date.now();
      isHorizontalSwipe = null; // Resetear la dirección al iniciar un nuevo toque
    };
    
    const handleTouchMove = (e) => {
      if (!touchStartX) return;
      
      const touchX = e.touches[0].pageX;
      const touchY = e.touches[0].pageY;
      const deltaX = Math.abs(touchX - touchStartX);
      const deltaY = Math.abs(touchY - touchStartY);
      
      // Determinar si el gesto es horizontal o vertical solo una vez
      if (isHorizontalSwipe === null && (deltaX > swipeThreshold || deltaY > swipeThreshold)) {
        isHorizontalSwipe = deltaX > deltaY;
        
        // Si es un gesto vertical, resetear todo y permitir el scroll vertical
        if (isHorizontalSwipe === false) {
          touchStartX = 0;
          touchStartY = 0;
          touchStartScrollLeft = 0;
          touchStartTime = 0;
          isHorizontalSwipe = null;
          return; // No interferir con el scroll vertical
        }
      }
      
      // Solo prevenir el comportamiento por defecto y mover el carousel si es un gesto horizontal
      if (isHorizontalSwipe === true) {
        const walk = (touchStartX - touchX);
        container.scrollLeft = touchStartScrollLeft + walk;
        e.preventDefault();
      }
      // Si es vertical, ya reseteamos y retornamos arriba, permitiendo el scroll vertical normal
    };
    
    const handleTouchEnd = (e) => {
      if (!touchStartX) return;
      
      // Solo procesar el swipe si fue un gesto horizontal
      if (isHorizontalSwipe === true) {
        const touchEndX = e.changedTouches[0].pageX;
        const touchEndTime = Date.now();
        const deltaX = touchStartX - touchEndX;
        const deltaTime = touchEndTime - touchStartTime;
        const distance = Math.abs(deltaX);
        const velocity = distance / deltaTime;
        
        // Determinar dirección del swipe
        let direction = null;
        if (distance > minSwipeDistance || velocity > 0.3) {
          direction = deltaX > 0 ? 'left' : 'right';
        }
        
        snapToSlide(false, direction);
      }
      
      // Resetear todas las variables
      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
      isHorizontalSwipe = null;
    };
    
    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (container !== document.activeElement && !container.contains(document.activeElement)) return;
      
      const slideWidth = getSlideWidth();
      const isPlacesCarousel = container.classList.contains("places-carousel-container");
      const isMobile = window.innerWidth <= 768;
      const isActivities = this.track.classList.contains("activities");
      const isGastronomy = this.track.classList.contains("gastronomy");
      const isOpinions = this.track.classList.contains("opinions");
      const shouldUseInfiniteLoop = isPlacesCarousel || (isMobile && (isActivities || isGastronomy || isOpinions));
      let newIndex = this.currentIndex;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (shouldUseInfiniteLoop) {
            // Bucle infinito: si está en 0, ir al último
            newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
          } else {
            newIndex = Math.max(0, this.currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (shouldUseInfiniteLoop) {
            // Bucle infinito: si está en el último, ir al primero
            newIndex = (this.currentIndex + 1) % this.slides.length;
          } else {
            newIndex = Math.min(this.slides.length - 1, this.currentIndex + 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = this.slides.length - 1;
          break;
        default:
          return;
      }
      
      if (newIndex !== this.currentIndex) {
        this.currentIndex = newIndex;
        const finalScroll = newIndex * slideWidth;
        
        container.scrollTo({
          left: finalScroll,
          behavior: 'smooth'
        });
      }
    };
    
    // Wheel scroll
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) {
        e.preventDefault();
        const slideWidth = getSlideWidth();
        const currentScroll = container.scrollLeft;
        const scrollDelta = e.deltaX * 0.5;
        const newScroll = currentScroll + scrollDelta;
        const slideIndex = Math.round(newScroll / slideWidth);
        const targetScroll = slideIndex * slideWidth;
        const isPlacesCarousel = container.classList.contains("places-carousel-container");
        const isMobile = window.innerWidth <= 768;
        const isActivities = this.track.classList.contains("activities");
        const isGastronomy = this.track.classList.contains("gastronomy");
        const isOpinions = this.track.classList.contains("opinions");
        const shouldUseInfiniteLoop = isPlacesCarousel || (isMobile && (isActivities || isGastronomy || isOpinions));
        
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        if (shouldUseInfiniteLoop) {
          // Para places carousel o activities/gastronomy/opinions en móvil, usar bucle infinito
          this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
        } else {
          this.currentIndex = Math.max(0, Math.min(slideIndex, this.slides.length - 1));
        }
      }
    };
    
    // Scroll event con debounce
    let scrollTimeout2 = null;
    const handleScroll = () => {
      if (this.isDragging) return;
      
      clearTimeout(scrollTimeout2);
      scrollTimeout2 = setTimeout(() => {
        updateCurrentIndex();
      }, 100);
    };
    
    // Guardar handlers para cleanup
    const dragHandlers = {
      mousedown: handleMouseDown,
      mouseleave: handleMouseLeave,
      mouseup: handleMouseUp,
      mousemove: handleMouseMove,
      touchstart: handleTouchStart,
      touchmove: handleTouchMove,
      touchend: handleTouchEnd,
      keydown: handleKeyDown,
      wheel: handleWheel,
      scroll: handleScroll
    };
    this.boundHandlers.set("dragHandlers", dragHandlers);
    
    // Event listeners
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll, { passive: true });
    
    // Inicializar posición e índice
    updateCurrentIndex();
    
    // Asegurar que el scroll esté en la posición correcta
    if (container.scrollLeft === 0) {
      container.scrollLeft = 0;
    } else {
      // Si hay scroll, ajustar al slide más cercano
      snapToSlide(true);
    }
  }

  handleMouseMove(e) {
    if (!this.enableMouseSwipe) return;
    
    const container = this.track.closest(".opinions-carousel-container") || 
                      this.track.closest(".places-carousel-container") || 
                      this.track.parentElement;
    if (!container) return;
    
    // Cachear dimensiones para evitar múltiples getBoundingClientRect
    if (!this._cachedDimensions || this._dimensionsDirty) {
      const rect = container.getBoundingClientRect();
      this._cachedDimensions = {
        containerWidth: rect.width,
        leftZone: rect.width * 0.25,
        rightZone: rect.width * 0.75,
        slideWidth: this.slides[0]?.getBoundingClientRect().width || rect.width
      };
      this._dimensionsDirty = false;
    }
    
    const { containerWidth, leftZone, rightZone, slideWidth } = this._cachedDimensions;
    const mouseX = e.clientX - container.getBoundingClientRect().left;
    
    if (this.mouseX === null) {
      this.mouseX = mouseX;
      return;
    }
    
    const deltaX = mouseX - this.mouseX;
    
    if (Math.abs(deltaX) < this.mouseMoveThreshold) return;
    
    // Para places carousel, usar scroll en lugar de changeSlide
    const isPlacesCarousel = container.classList.contains("places-carousel-container");
    
    if (isPlacesCarousel) {
      if (mouseX < leftZone && deltaX < 0) {
        // Mover a slide anterior (bucle infinito: si está en 0, ir al último)
        const newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        if (newIndex !== this.currentIndex) {
          this.currentIndex = newIndex;
          container.scrollTo({
            left: newIndex * slideWidth,
            behavior: 'smooth'
          });
          this.mouseX = null;
        }
      } else if (mouseX > rightZone && deltaX > 0) {
        // Mover a slide siguiente (bucle infinito: si está en el último, ir al primero)
        const newIndex = (this.currentIndex + 1) % this.slides.length;
        if (newIndex !== this.currentIndex) {
          this.currentIndex = newIndex;
          container.scrollTo({
            left: newIndex * slideWidth,
            behavior: 'smooth'
          });
          this.mouseX = null;
        }
      } else {
        this.mouseX = mouseX;
      }
    } else {
      // Para otros carousels (opinions), usar changeSlide
      if (mouseX < leftZone && deltaX < 0) {
        this.changeSlide(-1);
        this.pauseTemporarily(3000);
        this.mouseX = null;
      } else if (mouseX > rightZone && deltaX > 0) {
        this.changeSlide(1);
        this.pauseTemporarily(3000);
        this.mouseX = null;
      } else {
        this.mouseX = mouseX;
      }
    }
  }

  getStepSize() {
    // Solo usar scroll para places carousel o en móvil
    const isMobile = window.innerWidth <= 768;
    const isPlaces = this.track.closest(".places-carousel-container");
    
    if (this.enableDragScroll && (isPlaces || isMobile)) {
      const container = isPlaces 
        ? this.track.closest(".places-carousel-container")
        : this.track;
      if (container) {
        return container.getBoundingClientRect().width;
      }
    }
    const slide = this.slides[0];
    if (!slide) return 0;
    const slideWidth = slide.getBoundingClientRect().width;
    const trackStyle = window.getComputedStyle(this.track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0");
    // Para opinions carousel, solo el ancho del slide (sin padding)
    return slideWidth + (Number.isNaN(gap) ? 0 : gap);
  }

  updatePosition() {
    // Solo usar scroll para places carousel o en móvil
    const isMobile = window.innerWidth <= 768;
    const isPlaces = this.track.closest(".places-carousel-container");
    const isOpinions = this.track.closest(".opinions-carousel-container");
    
    if (this.enableDragScroll && (isPlaces || isOpinions || isMobile)) {
      const container = isPlaces 
        ? this.track.closest(".places-carousel-container")
        : (isOpinions 
          ? this.track.closest(".opinions-carousel-container")
          : this.track);
      if (container) {
        const stepSize = this.getStepSize();
        container.scrollLeft = this.currentIndex * stepSize;
        return;
      }
    }
    
    if (!this.enableDragScroll || (!isPlaces && !isOpinions && !isMobile)) {
      // Para opinions carousel, calcular el desplazamiento correctamente
      if (this.track.classList.contains("opinions")) {
        const container = this.track.closest(".opinions-carousel-container");
        if (container && this.slides.length > 0) {
          const containerWidth = container.getBoundingClientRect().width;
          const slideWidth = this.slides[0].getBoundingClientRect().width;
          const trackStyle = window.getComputedStyle(this.track);
          const paddingLeft = parseFloat(trackStyle.paddingLeft) || 0;
          
          // Calcular el offset inicial para centrar el primer slide
          const initialOffset = (containerWidth - slideWidth) / 2 - paddingLeft;
          
          // El desplazamiento es el índice por el ancho del slide
          const slideOffset = this.currentIndex * slideWidth;
          
          // Transform final: offset inicial + desplazamiento por índice
          this.track.style.transform = `translateX(calc(${initialOffset}px - ${slideOffset}px))`;
        } else {
          const stepSize = this.getStepSize();
          this.track.style.transform = `translateX(-${this.currentIndex * stepSize}px)`;
        }
      } else {
        const stepSize = this.getStepSize();
        this.track.style.transform = `translateX(-${this.currentIndex * stepSize}px)`;
      }
    }
  }

  getSlidesToShow() {
    const width = window.innerWidth;
    return width <= CONFIG.BREAKPOINTS.MOBILE
      ? this.slidesPerView.mobile ?? 1
      : width <= CONFIG.BREAKPOINTS.TABLET
      ? this.slidesPerView.tablet ?? this.slidesPerView.mobile ?? 1
      : this.slidesPerView.desktop ?? 4;
  }

  changeSlide(direction) {
    const totalSlides = this.slides.length;
    const isPlaces = this.track.closest(".places-carousel-container");
    const isMobile = window.innerWidth <= 768;
    const isActivities = this.track.classList.contains("activities");
    const isGastronomy = this.track.classList.contains("gastronomy");
    const isOpinions = this.track.classList.contains("opinions");
    const shouldUseInfiniteLoop = isPlaces || (isMobile && (isActivities || isGastronomy || isOpinions));
    
    // Para places o activities/gastronomy/opinions en móvil, hacer bucle infinito
    if (shouldUseInfiniteLoop) {
      this.currentIndex += direction;
      if (this.currentIndex >= totalSlides) {
        this.currentIndex = 0;
      } else if (this.currentIndex < 0) {
        this.currentIndex = totalSlides - 1;
      }
    } else {
      // Para otros carousels, usar la lógica original
      const slidesToShow = this.getSlidesToShow();
      const maxIndex = Math.max(0, totalSlides - slidesToShow);
      this.currentIndex += direction;
      if (this.currentIndex > maxIndex) {
        this.currentIndex = 0;
      } else if (this.currentIndex < 0) {
        this.currentIndex = maxIndex;
      }
    }
    this.updateActiveSlide();
    this.updatePosition();
  }

  updateActiveSlide() {
    // Actualizar clase active para opinions carousel
    if (this.track.classList.contains("opinions")) {
      this.slides.forEach((slide, index) => {
        if (index === this.currentIndex) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
    }
  }

  startAuto() {
    if (this.auto) {
      this.stopAuto();
      this.autoScrollInterval = setInterval(() => this.changeSlide(1), this.interval);
    }
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
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
    
    // Remover todos los event listeners
    if (this.prevBtn && this.boundHandlers.has("prevBtn")) {
      this.prevBtn.removeEventListener("click", this.boundHandlers.get("prevBtn"));
    }
    if (this.nextBtn && this.boundHandlers.has("nextBtn")) {
      this.nextBtn.removeEventListener("click", this.boundHandlers.get("nextBtn"));
    }
    if (this.boundHandlers.has("resize")) {
      window.removeEventListener("resize", this.boundHandlers.get("resize"));
    }
    if (this.boundHandlers.has("mouseenter")) {
      this.track.removeEventListener("mouseenter", this.boundHandlers.get("mouseenter"));
    }
    if (this.boundHandlers.has("mouseleave")) {
      this.track.removeEventListener("mouseleave", this.boundHandlers.get("mouseleave"));
    }
    
    ["pointerdown", "touchstart"].forEach((eventType) => {
      const key = `pause-${eventType}`;
      if (this.boundHandlers.has(key)) {
        this.track.removeEventListener(eventType, this.boundHandlers.get(key));
      }
    });
    
    // Cleanup de mouse swipe
    if (this.enableMouseSwipe) {
      const container = this.track.closest(".opinions-carousel-container") || 
                        this.track.closest(".places-carousel-container");
      if (container) {
        if (this.boundHandlers.has("mousemove")) {
          container.removeEventListener("mousemove", this.boundHandlers.get("mousemove"));
        }
        if (this.boundHandlers.has("scroll")) {
          container.removeEventListener("scroll", this.boundHandlers.get("scroll"));
        }
      }
    }
    
    // Cleanup de drag scroll
    if (this.enableDragScroll) {
      const container = this.track.closest(".places-carousel-container");
      if (container && this.boundHandlers.has("dragHandlers")) {
        const handlers = this.boundHandlers.get("dragHandlers");
        if (handlers.mousedown) container.removeEventListener("mousedown", handlers.mousedown);
        if (handlers.mouseleave) container.removeEventListener("mouseleave", handlers.mouseleave);
        if (handlers.mouseup) document.removeEventListener("mouseup", handlers.mouseup);
        if (handlers.mousemove) document.removeEventListener("mousemove", handlers.mousemove);
        if (handlers.touchstart) container.removeEventListener("touchstart", handlers.touchstart);
        if (handlers.touchmove) container.removeEventListener("touchmove", handlers.touchmove);
        if (handlers.touchend) container.removeEventListener("touchend", handlers.touchend);
        if (handlers.keydown) container.removeEventListener("keydown", handlers.keydown);
        if (handlers.wheel) container.removeEventListener("wheel", handlers.wheel);
        if (handlers.scroll) container.removeEventListener("scroll", handlers.scroll);
      }
    }
    
    this.boundHandlers.clear();
    this._cachedDimensions = null;
  }
}

export const initCarousels = () => [
  new Carousel({
    trackSelector: ".carousel-track.activities",
    prevBtnSelector: ".prev-btn-activities",
    nextBtnSelector: ".next-btn-activities",
    enableDragScroll: true
  }),
  new Carousel({
    trackSelector: ".carousel-track.gastronomy",
    prevBtnSelector: ".prev-btn-gastronomy",
    nextBtnSelector: ".next-btn-gastronomy",
    enableDragScroll: true
  }),
  new Carousel({
    trackSelector: ".carousel-track.plans",
    prevBtnSelector: ".prev-btn-plans",
    nextBtnSelector: ".next-btn-plans",
    slidesPerView: { mobile: 1, tablet: 1, desktop: 4 },
    enableDragScroll: true
  }),
  new Carousel({
    trackSelector: ".carousel-track.places",
    prevBtnSelector: null,
    nextBtnSelector: null,
    slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
    auto: false,
    enableMouseSwipe: true,
    enableDragScroll: true
  }),
  new Carousel({
    trackSelector: ".carousel-track.opinions",
    prevBtnSelector: null,
    nextBtnSelector: null,
    slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
    auto: true,
    interval: 5000,
    enableMouseSwipe: true,
    enableDragScroll: true
  })
];
