import { $ as e, $$ as t, setExpanded as s } from "./utils.js";
import { CONFIG as n } from "./config.js";

export class Navigation {
  constructor() {
    this.header = e("header");
    this.menuToggle = e(".menu-toggle");
    this.languageSelector = {
      button: e(".selected-language"),
      menu: e(".language-options")
    };
    if (this.header && this.menuToggle) {
      this.initMobileMenu();
    }
    if (this.languageSelector.button && this.languageSelector.menu) {
      this.initLanguageMenu();
    }
    this.markCurrentPage();
    this.initGlobalEventDelegation();
  }

  initGlobalEventDelegation() {
    // Event delegation para acciones globales
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (target) {
        const action = target.dataset.action;
        if (action === "scroll-to-form") {
          event.preventDefault();
          scrollToForm();
        } else if (action === "go-home") {
          event.preventDefault();
          window.location.href = "index.html#introduction";
        }
      }

      const langButton = event.target.closest("[data-lang]");
      if (langButton && window.changeLanguage) {
        event.preventDefault();
        const lang = langButton.dataset.lang;
        window.changeLanguage(lang);
      }
    }, true);

    // Soporte para teclado en elementos con data-action
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      
      const target = event.target.closest("[data-action]");
      if (target) {
        const action = target.dataset.action;
        if (action === "scroll-to-form") {
          event.preventDefault();
          scrollToForm();
        } else if (action === "go-home") {
          event.preventDefault();
          window.location.href = "index.html#introduction";
        }
      }
    });
  }

  initMobileMenu() {
    this.menuToggle.addEventListener("click", () => {
      const isOpen = this.header.classList.toggle("nav-open");
      s(this.menuToggle, isOpen);
    });
    
    t("nav a", this.header).forEach(link => {
      link.addEventListener("click", () => this.closeMenu());
    });
    
    document.addEventListener("click", (event) => {
      if (!event.target.closest("header") && this.header.classList.contains("nav-open")) {
        this.closeMenu();
      }
    });
    
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.header.classList.contains("nav-open")) {
        this.closeMenu();
      }
    });
    
    window.addEventListener("resize", () => {
      if (window.innerWidth > n.BREAKPOINTS.MOBILE) {
        this.closeMenu();
      }
    });
  }

  closeMenu() {
    if (this.header) {
      this.header.classList.remove("nav-open");
      if (this.menuToggle) {
        s(this.menuToggle, false);
      }
    }
  }

  initLanguageMenu() {
    const { button, menu } = this.languageSelector;
    
    button.addEventListener("click", () => {
      const isExpanded = !menu.classList.contains("show");
      menu.classList.toggle("show");
      s(button, isExpanded);
    });
    
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".language-selector") && menu.classList.contains("show")) {
        menu.classList.remove("show");
        s(button, false);
      }
    });
    
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("show")) {
        menu.classList.remove("show");
        s(button, false);
      }
    });
  }

  markCurrentPage() {
    const currentPage = location.pathname.split("/").pop() || "index.html";
    t("nav a").forEach(link => {
      const href = link.getAttribute("href");
      if (href) {
        const page = href.includes("#") ? href.split("#")[0] : href;
        if (page === currentPage || (currentPage === "index.html" && href.startsWith("#"))) {
          link.setAttribute("aria-current", "page");
        }
      }
    });
  }
}

export const scrollToForm = () => {
  const formContainer = e(".form-container");
  if (formContainer) {
    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

window.scrollToForm = scrollToForm;
