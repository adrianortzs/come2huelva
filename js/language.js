import { $ as a, $$ as n, updateText as e, updateHTML as t, updateMultiple as s, storage as o } from "./utils.js";
import { CONFIG as r } from "./config.js";
import { translations as i } from "./translations.js";

export class LanguageManager {
  constructor() {
    this.currentLang = r.DEFAULT_LANGUAGE;
    this.translations = i;
  }

  init() {
    const savedLang = o.get(r.STORAGE_KEYS.LANGUAGE);
    this.changeLanguage(
      savedLang && this.translations[savedLang] ? savedLang : r.DEFAULT_LANGUAGE
    );
  }

  changeLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language '${lang}' not found, using default`);
      lang = r.DEFAULT_LANGUAGE;
    }
    this.currentLang = lang;
    o.set(r.STORAGE_KEYS.LANGUAGE, lang);
    const translations = this.translations[lang];
    this.updateNavigation(translations);
    this.updateLanguageButton(lang);
    this.updatePageContent(translations);
    this.closeLangMenu();
  }

  updateNavigation(translations) {
    const navLinks = n("nav ul li a");
    if (translations.navLinks && translations.navLinks.length) {
      translations.navLinks.forEach((text, index) => {
        if (navLinks[index]) {
          e(navLinks[index], text);
        }
      });
    }
  }

  updateLanguageButton(lang) {
    const button = a(".selected-language");
    if (!button) return;
    const labels = {
      es: "Español &#9662;",
      en: "English &#9662;",
      fr: "Français &#9662;"
    };
    t(button, labels[lang] || labels.es);
  }

  updatePageContent(translations) {
    const updateSection = (selector, headerKey, spansKey, isH1 = true) => {
      if (!a(selector)) return;
      const header = a(selector + " " + (isH1 ? "h1" : "h2"));
      if (header && translations[headerKey]) {
        e(header, translations[headerKey]);
      }
      const spans = n(selector + " > span");
      if (spans.length && translations[spansKey]) {
        s(spans, translations[spansKey]);
      }
    };

    s(n(".introduction-container span"), translations.introductionSpans);
    updateSection(".place-container", "placeHeader", "placeSpans");
    updateSection(".activities-container", "activitiesHeader", "activitiesSpans");
    updateSection(".gastronomy-container", "gastronomyHeader", "gastronomySpans");
    updateSection(".plans-container", "plansHeader", "plansSpans");
    e(a(".opinions h1"), translations.opinionsHeader);
    updateSection(".form-container", "formHeader", "formSpans", false);
    
    // Actualizar spans del formulario (están dentro del form, no directamente en form-container)
    const formSpans = n(".form-container form > span");
    if (formSpans.length && translations.formSpans) {
      s(formSpans, translations.formSpans);
    }
    
    updateSection(".about-us-container", "aboutUsHeader", "aboutUsSpans");
    e(a("#secret-title"), translations.ourSecretHeader);
    s(n(".our-secret-container span"), translations.ourSecretSpans);
    
    this.updatePlacesOverlays(translations);
    this.updateCards(".activity-card", translations.activitiesCards);
    this.updateCards(".gastronomy-card", translations.gastronomyCards);
    this.updatePlanCards(translations);
    this.updatePersonalizedPlan(translations);
    this.updateFormLabels(translations);
    this.updateCTAButtons(translations);
    this.updateFooter(translations);
  }

  updatePlacesOverlays(translations) {
    const overlays = n(".place .overlay");
    if (translations.placesOverlays && translations.placesOverlays.length) {
      translations.placesOverlays.forEach((place, index) => {
        if (!overlays[index]) return;
        const title = a("h3", overlays[index]);
        const span = a("span", overlays[index]);
        if (title) e(title, place.title);
        if (span) t(span, place.span);
      });
    }
  }

  updateCards(selector, cards) {
    const cardElements = n(selector);
    if (cards && cards.length) {
      cards.forEach((card, index) => {
        if (!cardElements[index]) return;
        const title = a("h3", cardElements[index]);
        const description = a("span", cardElements[index]);
        if (title) e(title, card.title);
        if (description) e(description, card.description);
      });
    }
  }

  updatePlanCards(translations) {
    const planCards = n(".plan_card");
    if (translations.plansCards && translations.plansCards.length) {
      translations.plansCards.forEach((plan, index) => {
        if (!planCards[index]) return;
        const header = a(".card_header span", planCards[index]);
        const content = a(".card_content span", planCards[index]);
        if (header) e(header, plan.title);
        if (content) e(content, plan.description);
      });
    }
  }

  updatePersonalizedPlan(translations) {
    const title = a(".plans-container .personalized-plan");
    if (title) e(title, translations.personalizedPlan);
    const spans = n(".plans-container .personalized-plan ~ span");
    if (translations.personalizedPlanSpans && translations.personalizedPlanSpans.length) {
      s(spans, translations.personalizedPlanSpans);
    }
  }

  updateFormLabels(translations) {
    if (!translations.formLabels) return;
    const labels = {
      name: a('label[for="name"]'),
      email: a('label[for="email"]'),
      phone: a('label[for="telf"]'),
      people: a('label[for="people"]'),
      message: a('label[for="message"]')
    };
    Object.keys(labels).forEach(key => {
      if (labels[key] && translations.formLabels[key]) {
        e(labels[key], translations.formLabels[key]);
      }
    });
    const submitButton = a(".form_option button[type='submit']");
    if (submitButton && translations.submitButton) {
      e(submitButton, translations.submitButton);
    }
    
    // Actualizar label de privacy consent
    const privacyLabel = a('label[for="privacy-consent"]');
    if (privacyLabel && translations.privacyConsentLabel && translations.privacyPolicy && translations.legalNotice) {
      // Reemplazar placeholders con enlaces HTML
      let labelText = translations.privacyConsentLabel
        .replace("{privacyPolicy}", `<a href="politica-privacidad.html" target="_blank" rel="noopener noreferrer">${translations.privacyPolicy}</a>`)
        .replace("{legalNotice}", `<a href="aviso-legal.html" target="_blank" rel="noopener noreferrer">${translations.legalNotice}</a>`);
      
      // Usar updateHTML para mantener los enlaces
      t(privacyLabel, labelText);
    }
  }

  updateCTAButtons(translations) {
    const headerCta = a(".header-cta");
    if (headerCta && translations.headerCta) {
      e(headerCta, translations.headerCta);
    }
    
    // Actualizar botón del footer - buscar en .footer-social .btn-outline
    const footerCta = a(".footer-social .btn-outline");
    if (footerCta) {
      const href = footerCta.getAttribute("href");
      if (href && href.includes("about-us.html")) {
        // Estamos en index.html, mostrar "Conócenos"
        e(footerCta, translations.footerCtaIndex);
      } else if (href && href.includes("index.html")) {
        // Estamos en about-us.html, mostrar "Ver planes"
        e(footerCta, translations.footerCtaAbout);
      } else {
        // Por defecto, usar footerCtaIndex
        e(footerCta, translations.footerCtaIndex);
      }
    }
    
    // Actualizar botón del plan personalizado
    const personalizedPlanCta = a(".btn-personalized-plan");
    if (personalizedPlanCta && translations.personalizedPlanCta) {
      e(personalizedPlanCta, translations.personalizedPlanCta);
    }
  }

  updateFooter(translations) {
    // Actualizar label "Contacto" en footer-contact
    const footerContactLabel = a(".footer-contact > span:first-child");
    if (footerContactLabel && translations.footerContactLabel) {
      e(footerContactLabel, translations.footerContactLabel);
    }
    
    // Actualizar enlaces de footer-policies
    const footerPolicies = n(".footer-policies a");
    if (footerPolicies.length && translations.footerPolicies && translations.footerPolicies.length) {
      translations.footerPolicies.forEach((policy, index) => {
        if (footerPolicies[index]) {
          e(footerPolicies[index], policy);
        }
      });
    }
    
    // Actualizar texto del footer-bottom
    const footerBottom = a(".footer-bottom p");
    if (footerBottom && translations.footerBottom) {
      e(footerBottom, translations.footerBottom);
    }
  }

  closeLangMenu() {
    const menu = a(".language-options");
    if (menu) {
      menu.classList.remove("show");
    }
  }
}

export const initLanguageManager = () => {
  const manager = new LanguageManager();
  manager.init();
  
  window.changeLanguage = (lang) => {
    manager.changeLanguage(lang);
  };
  
  window.toggleLanguageMenu = () => {
    const menu = a(".language-options");
    const button = a(".selected-language");
    if (menu && button) {
      const isExpanded = !menu.classList.contains("show");
      menu.classList.toggle("show");
      button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
  };
  
  return manager;
};
