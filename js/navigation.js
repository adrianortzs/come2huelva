import { $, $$, setExpanded } from "./utils.js";
import { CONFIG } from "./config.js";

export class Navigation {
  constructor() {
    this.header = $("header");
    this.menuToggle = $(".menu-toggle");
    this.languageSelector = {
      button: $(".selected-language"),
      menu: $(".language-options")
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
  }

  initMobileMenu() {
    this.menuToggle.addEventListener("click", () => {
      const isOpen = this.header.classList.toggle("nav-open");
      setExpanded(this.menuToggle, isOpen);
    });
    
    $$("nav a", this.header).forEach(link => {
      link.addEventListener("click", () => this.closeMenu());
    });
    
    document.addEventListener("click", (event) => {
      if (!event.target.closest("header") && this.header.classList.contains("nav-open")) {
        this.closeMenu();
      }
    });
    
    window.addEventListener("resize", () => {
      if (window.innerWidth > CONFIG.BREAKPOINTS.MOBILE) {
        this.closeMenu();
      }
    });
  }

  closeMenu() {
    if (this.header) {
      this.header.classList.remove("nav-open");
      if (this.menuToggle) {
        setExpanded(this.menuToggle, false);
      }
    }
  }

  initLanguageMenu() {
    const { button, menu } = this.languageSelector;
    
    button.addEventListener("click", () => {
      const isExpanded = !menu.classList.contains("show");
      menu.classList.toggle("show");
      setExpanded(button, isExpanded);
    });
    
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".language-selector") && menu.classList.contains("show")) {
        menu.classList.remove("show");
        setExpanded(button, false);
      }
    });
  }

  markCurrentPage() {
    const currentPage = location.pathname.split("/").pop() || "index.html";
    $$("nav a").forEach(link => {
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
  const formContainer = $(".form-container");
  if (formContainer) {
    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
