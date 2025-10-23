import { Navigation } from './navigation.js';
import { initLanguageManager } from './language.js';
import { initCarousels } from './carousel.js';
import { initForm } from './form.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initVideoPlayer } from './video.js';

class App {
  // Constructor se ejecuta al crear una nueva App
  constructor() {
    this.modules = {}; // Objeto para guardar los módulos
    this.init(); // Llama a init() al crear la app
  }
  
  init() {
    // Si el HTML aún esta cargando
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => this.initializeModules());
    else this.initializeModules();
  }
  
  initializeModules() {
    try {
      // Crea una nueva instancia de Navigation
      this.modules.navigation = new Navigation();
      // Inicializa
      this.modules.languageManager = initLanguageManager();
      this.modules.carousels = initCarousels();
      this.modules.form = initForm();
      this.modules.scrollReveal = initScrollReveal();
      this.modules.videoPlayer = initVideoPlayer();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
  
  // Para evitar memory leaks
  destroy() {
    if (this.modules.carousels) this.modules.carousels.forEach(carousel => carousel.destroy?.());
    if (this.modules.scrollReveal) this.modules.scrollReveal.destroy?.();
    if (this.modules.videoPlayer) this.modules.videoPlayer.destroy?.();
  }
}

// Crea una nueva instancia de App
const app = new App();

if (typeof window !== 'undefined') {
  window.app = app; // Guarda app en global
  
  // Expne funciones para los onclick handlers del HTML
  window.scrollToForm = () => {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  window.toggleLanguageMenu = () => {
    const menu = document.querySelector('.language-options');
    const button = document.querySelector('.selected-language');
    if (menu && button) {
      menu.classList.toggle('show');
      button.setAttribute('aria-expanded', menu.classList.contains('show'));
    }
  };
  
  window.changeLanguage = (lang) => {
    if (app.modules.languageManager) app.modules.languageManager.changeLanguage(lang);
  };
}

export default app;
