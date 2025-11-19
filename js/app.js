import { Navigation } from "./navigation.js";
import { initLanguageManager } from "./language.js";
import { initCarousels } from "./carousel.js";
import { initForm } from "./form.js";
import { initScrollReveal } from "./scroll-reveal.js";

class App {
  constructor() {
    this.modules = {};
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeModules());
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      this.modules.navigation = new Navigation();
      this.modules.languageManager = initLanguageManager();
      this.modules.carousels = initCarousels();
      this.modules.form = initForm();
      this.modules.scrollReveal = initScrollReveal();
      this.handleHashNavigation();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }

  handleHashNavigation() {
    const hash = window.location.hash;
    if (!hash) return;
    
    const targetId = hash.substring(1);
    setTimeout(() => {
      if (targetId === "form") {
        const formContainer = document.querySelector(".form-container");
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        const target = document.getElementById(targetId) || 
                      document.querySelector(`.${targetId}`) || 
                      document.querySelector(`[data-id="${targetId}"]`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 150);
  }

  destroy() {
    if (this.modules.carousels) {
      this.modules.carousels.forEach(carousel => {
        if (carousel && typeof carousel.destroy === "function") {
          carousel.destroy();
        }
      });
    }
    if (this.modules.scrollReveal && typeof this.modules.scrollReveal.destroy === "function") {
      this.modules.scrollReveal.destroy();
    }
  }
}

if (typeof window !== "undefined") {
  window.app = new App();
  
  window.scrollToForm = () => {
    const formContainer = document.querySelector(".form-container");
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  window.toggleLanguageMenu = () => {
    const menu = document.querySelector(".language-options");
    const button = document.querySelector(".selected-language");
    if (menu && button) {
      const isExpanded = !menu.classList.contains("show");
      menu.classList.toggle("show");
      button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
  };
  
  window.changeLanguage = (lang) => {
    if (window.app && window.app.modules && window.app.modules.languageManager) {
      window.app.modules.languageManager.changeLanguage(lang);
    }
  };
}

export default window.app;
