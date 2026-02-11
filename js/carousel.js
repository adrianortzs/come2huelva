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
        this.isVisible = true;
        this._visibilityObserver = null;
        this.init();
      }
    }
  }

  init() {
    this.setupVisibilityObserver();
    this.setupEventListeners();
    this.updateActiveSlide();
    this.updatePosition();
    if (this.auto) this.startAuto();
  }

  /**
   * Observa si el carrusel está visible en el viewport.
   * Pausa el auto-scroll cuando sale y re-sincroniza al volver.
   */
  setupVisibilityObserver() {
    const target = this._getScrollContainer() || this.track;
    if (!target || !("IntersectionObserver" in window)) return;

    this._visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;

          if (!this.isVisible && wasVisible) {
            // Carousel acaba de salir del viewport: pausar auto-scroll
            this.stopAuto();
          } else if (this.isVisible && !wasVisible) {
            // Carousel acaba de volver al viewport: re-sincronizar posición
            this._syncScrollPosition();
            if (this.auto) this.startAuto();
          }
        });
      },
      { threshold: 0.05 }
    );

    this._visibilityObserver.observe(target);
  }

  /**
   * Obtiene el contenedor scrollable del carrusel.
   */
  _getScrollContainer() {
    if (this._isPlacesCarousel()) {
      return this.track.closest(".places-carousel-container");
    }
    if (this._isOpinionsCarousel()) {
      return this.track.closest(".opinions-carousel-container");
    }
    if (this._isMobile() && this.enableDragScroll) {
      return this.track;
    }
    return null;
  }

  /**
   * Re-sincroniza la posición del scroll con el currentIndex actual.
   * Se llama cuando el carrusel vuelve a ser visible.
   */
  _syncScrollPosition() {
    const usesScrollPositioning = this.enableDragScroll &&
      (this._isPlacesCarousel() || this._isOpinionsCarousel() || this._isMobile());

    if (usesScrollPositioning) {
      const container = this._getScrollContainer();
      if (container) {
        const stepSize = this.getStepSize();
        const targetScroll = this.currentIndex * stepSize;
        // Usar scrollTo instant para evitar conflicto con scroll-snap
        container.scrollTo({ left: targetScroll, behavior: "instant" });
      }
    } else {
      // Para desktop con transform, simplemente re-aplicar
      this.updatePosition();
    }
    this.updateActiveSlide();
  }

  _isPlacesCarousel() {
    return this.track.closest(".places-carousel-container") !== null;
  }

  _isOpinionsCarousel() {
    return this.track.closest(".opinions-carousel-container") !== null;
  }

  _isMobile() {
    return window.innerWidth <= 768;
  }

  _isActivities() {
    return this.track.classList.contains("activities");
  }

  _isGastronomy() {
    return this.track.classList.contains("gastronomy");
  }

  _isOpinions() {
    return this.track.classList.contains("opinions");
  }

  _shouldUseInfiniteLoop(container = null) {
    const isPlaces = container 
      ? container.classList.contains("places-carousel-container")
      : this._isPlacesCarousel();
    const isMobile = this._isMobile();
    return isPlaces || (isMobile && (this._isActivities() || this._isGastronomy() || this._isOpinions()));
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
      if (this.isVisible) {
        this._syncScrollPosition();
      }
      if (this.auto && this.isVisible) this.startAuto();
    }, CONFIG.CAROUSEL.RESIZE_DEBOUNCE);
    this.boundHandlers.set("resize", resizeHandler);
    window.addEventListener("resize", resizeHandler);
    
    const mouseEnterHandler = () => this.stopAuto();
    this.boundHandlers.set("mouseenter", mouseEnterHandler);
    this.track.addEventListener("mouseenter", mouseEnterHandler);
    
    const mouseLeaveHandler = () => {
      if (this.isVisible) this.startAuto();
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
        
        if (this._isPlacesCarousel()) {
          const slideWidth = this.slides[0]?.getBoundingClientRect().width || container.getBoundingClientRect().width;
          const scrollLeft = container.scrollLeft;
          const slideIndex = Math.round(scrollLeft / slideWidth);
          this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
          
          const scrollHandler = () => {
            const slideWidth = this.slides[0]?.getBoundingClientRect().width || container.getBoundingClientRect().width;
            const scrollLeft = container.scrollLeft;
            const slideIndex = Math.round(scrollLeft / slideWidth);
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
    if (!this._isMobile() && !this._isPlacesCarousel()) {
      return;
    }
    
    const container = this._isPlacesCarousel()
      ? this.track.closest(".places-carousel-container")
      : this.track;
    if (!container || !this.slides.length) return;
    
    container.style.cursor = "grab";
    container.style.userSelect = "none";
    container.style.webkitUserSelect = "none";
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'region');
    const isPlacesContainer = container.classList.contains("places-carousel-container");
    const isOpinionsContainer = container.classList.contains("opinions-carousel-container");
    let ariaLabel = 'Carousel';
    if (isPlacesContainer) ariaLabel = 'Carousel de lugares';
    else if (isOpinionsContainer || this._isOpinions()) ariaLabel = 'Carousel de opiniones';
    else if (this._isActivities()) ariaLabel = 'Carousel de actividades';
    else if (this._isGastronomy()) ariaLabel = 'Carousel de gastronomía';
    else if (this.track.classList.contains("plans")) ariaLabel = 'Carousel de planes';
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
      if (slideWidth === 0) return; // Element not laid out yet
      const scrollLeft = container.scrollLeft;
      const shouldUseInfiniteLoop = this._shouldUseInfiniteLoop(container);
      const slideIndex = Math.round(scrollLeft / slideWidth);
      if (shouldUseInfiniteLoop) {
        this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
      } else {
        this.currentIndex = Math.max(0, Math.min(slideIndex, this.slides.length - 1));
      }
    };
    
    const snapToSlide = (immediate = false, direction = null) => {
      if (isScrolling) return;
      isScrolling = true;
      
      const slideWidth = getSlideWidth();
      if (slideWidth === 0) {
        isScrolling = false;
        return;
      }
      const scrollLeft = container.scrollLeft;
      const shouldUseInfiniteLoop = this._shouldUseInfiniteLoop(container);
      
      if (direction === 'left') {
        if (shouldUseInfiniteLoop) {
          this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        } else if (this.currentIndex < this.slides.length - 1) {
          this.currentIndex++;
        }
      } else if (direction === 'right') {
        if (shouldUseInfiniteLoop) {
          this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        } else if (this.currentIndex > 0) {
          this.currentIndex--;
        }
      } else {
        const threshold = slideWidth * 0.3;
        const slideIndex = Math.round((scrollLeft + threshold) / slideWidth);
        if (shouldUseInfiniteLoop) {
          this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
        } else {
          this.currentIndex = Math.max(0, Math.min(slideIndex, this.slides.length - 1));
        }
      }
      
      const targetScroll = this.currentIndex * slideWidth;
      
      if (immediate) {
        container.scrollTo({ left: targetScroll, behavior: "instant" });
        isScrolling = false;
      } else {
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 350);
      }
    };
    
    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
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
    
    const handleMouseUp = () => {
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
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScrollLeft = 0;
    let touchStartTime = 0;
    let isHorizontalSwipe = null;
    let minSwipeDistance = 30;
    let swipeThreshold = 10;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
      touchStartScrollLeft = container.scrollLeft;
      touchStartTime = Date.now();
      isHorizontalSwipe = null;
    };
    
    const handleTouchMove = (e) => {
      if (!touchStartX) return;
      
      const touchX = e.touches[0].pageX;
      const touchY = e.touches[0].pageY;
      const deltaX = Math.abs(touchX - touchStartX);
      const deltaY = Math.abs(touchY - touchStartY);
      
      if (isHorizontalSwipe === null && (deltaX > swipeThreshold || deltaY > swipeThreshold)) {
        isHorizontalSwipe = deltaX > deltaY;
        
        if (isHorizontalSwipe === false) {
          touchStartX = 0;
          touchStartY = 0;
          touchStartScrollLeft = 0;
          touchStartTime = 0;
          isHorizontalSwipe = null;
          return;
        }
      }
      
      if (isHorizontalSwipe === true) {
        const walk = (touchStartX - touchX);
        container.scrollLeft = touchStartScrollLeft + walk;
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (e) => {
      if (!touchStartX) return;
      
      if (isHorizontalSwipe === true) {
        const touchEndX = e.changedTouches[0].pageX;
        const touchEndTime = Date.now();
        const deltaX = touchStartX - touchEndX;
        const deltaTime = touchEndTime - touchStartTime;
        const distance = Math.abs(deltaX);
        const velocity = distance / deltaTime;
        
        let direction = null;
        if (distance > minSwipeDistance || velocity > 0.3) {
          direction = deltaX > 0 ? 'left' : 'right';
        }
        
        snapToSlide(false, direction);
      }
      
      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
      isHorizontalSwipe = null;
    };
    
    const handleKeyDown = (e) => {
      if (container !== document.activeElement && !container.contains(document.activeElement)) return;
      
      const slideWidth = getSlideWidth();
      const shouldUseInfiniteLoop = this._shouldUseInfiniteLoop(container);
      let newIndex = this.currentIndex;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (shouldUseInfiniteLoop) {
            newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
          } else {
            newIndex = Math.max(0, this.currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (shouldUseInfiniteLoop) {
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
    
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) {
        e.preventDefault();
        const slideWidth = getSlideWidth();
        const currentScroll = container.scrollLeft;
        const scrollDelta = e.deltaX * 0.5;
        const newScroll = currentScroll + scrollDelta;
        const slideIndex = Math.round(newScroll / slideWidth);
        const targetScroll = slideIndex * slideWidth;
        const shouldUseInfiniteLoop = this._shouldUseInfiniteLoop(container);
        
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        if (shouldUseInfiniteLoop) {
          this.currentIndex = ((slideIndex % this.slides.length) + this.slides.length) % this.slides.length;
        } else {
          this.currentIndex = Math.max(0, Math.min(slideIndex, this.slides.length - 1));
        }
      }
    };
    
    let scrollTimeout2 = null;
    const handleScroll = () => {
      if (this.isDragging) return;
      
      clearTimeout(scrollTimeout2);
      scrollTimeout2 = setTimeout(() => {
        updateCurrentIndex();
      }, 100);
    };
    
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
    
    updateCurrentIndex();
    
    if (container.scrollLeft === 0) {
      container.scrollLeft = 0;
    } else {
      snapToSlide(true);
    }
  }

  handleMouseMove(e) {
    if (!this.enableMouseSwipe) return;
    
    const container = this.track.closest(".opinions-carousel-container") || 
                      this.track.closest(".places-carousel-container") || 
                      this.track.parentElement;
    if (!container) return;
    
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
    
    const { leftZone, rightZone, slideWidth } = this._cachedDimensions;
    const mouseX = e.clientX - container.getBoundingClientRect().left;
    
    if (this.mouseX === null) {
      this.mouseX = mouseX;
      return;
    }
    
    const deltaX = mouseX - this.mouseX;
    
    if (Math.abs(deltaX) < this.mouseMoveThreshold) return;
    
    if (container.classList.contains("places-carousel-container")) {
      if (mouseX < leftZone && deltaX < 0) {
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
    if (this.enableDragScroll && (this._isPlacesCarousel() || this._isMobile())) {
      const container = this._isPlacesCarousel()
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
    return slideWidth + (Number.isNaN(gap) ? 0 : gap);
  }

  updatePosition() {
    // No actualizar scroll de elementos fuera del viewport en móvil
    // Esto previene el bug de Chrome Android con scrollLeft en offscreen elements
    if (!this.isVisible) return;

    if (this.enableDragScroll && (this._isPlacesCarousel() || this._isOpinionsCarousel() || this._isMobile())) {
      const container = this._getScrollContainer();
      if (container) {
        const stepSize = this.getStepSize();
        if (stepSize === 0) return; // Element not laid out
        const targetScroll = this.currentIndex * stepSize;
        // Usar scrollTo con behavior instant para evitar conflicto con scroll-snap
        container.scrollTo({ left: targetScroll, behavior: "instant" });
        return;
      }
    }
    
    if (!this.enableDragScroll || (!this._isPlacesCarousel() && !this._isOpinionsCarousel() && !this._isMobile())) {
      if (this.track.classList.contains("opinions")) {
        const container = this.track.closest(".opinions-carousel-container");
        if (container && this.slides.length > 0) {
          const containerWidth = container.getBoundingClientRect().width;
          const slideWidth = this.slides[0].getBoundingClientRect().width;
          const trackStyle = window.getComputedStyle(this.track);
          const paddingLeft = parseFloat(trackStyle.paddingLeft) || 0;
          
          const initialOffset = (containerWidth - slideWidth) / 2 - paddingLeft;
          
          const slideOffset = this.currentIndex * slideWidth;
          
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
    const shouldUseInfiniteLoop = this._shouldUseInfiniteLoop();
    
    if (shouldUseInfiniteLoop) {
      this.currentIndex += direction;
      if (this.currentIndex >= totalSlides) {
        this.currentIndex = 0;
      } else if (this.currentIndex < 0) {
        this.currentIndex = totalSlides - 1;
      }
    } else {
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
    if (this.auto && this.isVisible) {
      this.stopAuto();
      this.autoScrollInterval = setInterval(() => {
        // Doble comprobación: no auto-scroll si no está visible
        if (this.isVisible) {
          this.changeSlide(1);
        }
      }, this.interval);
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
    this.resumeTimer = setTimeout(() => {
      if (this.isVisible) this.startAuto();
    }, duration);
  }

  destroy() {
    this.stopAuto();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
    
    if (this._visibilityObserver) {
      this._visibilityObserver.disconnect();
      this._visibilityObserver = null;
    }
    
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
    
    if (this.enableDragScroll) {
      const container = this._getScrollContainer() || this.track.closest(".places-carousel-container");
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
