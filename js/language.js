import { $, $$, updateText, updateHTML, updateMultiple, storage } from "./utils.js";
import { CONFIG } from "./config.js";
import { translations } from "./translations.js";

export class LanguageManager {
  constructor() {
    this.currentLang = CONFIG.DEFAULT_LANGUAGE;
    this.translations = translations;
  }

  init() {
    const savedLang = storage.get(CONFIG.STORAGE_KEYS.LANGUAGE);
    this.changeLanguage(
      savedLang && this.translations[savedLang] ? savedLang : CONFIG.DEFAULT_LANGUAGE
    );
  }

  changeLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language '${lang}' not found, using default`);
      lang = CONFIG.DEFAULT_LANGUAGE;
    }
    this.currentLang = lang;
    storage.set(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    const translations = this.translations[lang];
    this.updateNavigation(translations);
    this.updateLanguageButton(lang);
    this.updatePageContent(translations);
    this.closeLangMenu();
  }

  updateNavigation(translations) {
    const navLinks = $$("nav ul li a");
    if (translations.navLinks && translations.navLinks.length) {
      translations.navLinks.forEach((text, index) => {
        if (navLinks[index]) {
          updateText(navLinks[index], text);
        }
      });
    }
  }

  updateLanguageButton(lang) {
    const button = $(".selected-language");
    if (!button) return;
    const labels = {
      es: "Español &#9662;",
      en: "English &#9662;",
      fr: "Français &#9662;"
    };
    updateHTML(button, labels[lang] || labels.es);
  }

  updatePageContent(translations) {
    const updateSection = (selector, headerKey, spansKey, isH1 = true) => {
      if (!$(selector)) return;
      const header = $(selector + " " + (isH1 ? "h1" : "h2"));
      if (header && translations[headerKey]) {
        updateText(header, translations[headerKey]);
      }
      const spans = $$(selector + " > span");
      if (spans.length && translations[spansKey]) {
        updateMultiple(spans, translations[spansKey]);
      }
    };

    updateMultiple($$(".introduction-container span"), translations.introductionSpans);
    updateSection(".place-container", "placeHeader", "placeSpans");
    updateSection(".activities-container", "activitiesHeader", "activitiesSpans");
    updateSection(".gastronomy-container", "gastronomyHeader", "gastronomySpans");
    updateSection(".plans-container", "plansHeader", "plansSpans");
    updateText($(".opinions h1"), translations.opinionsHeader);
    updateSection(".form-container", "formHeader", "formSpans", false);
    
    const formSpans = $$(".form-container form > span");
    if (formSpans.length && translations.formSpans) {
      updateMultiple(formSpans, translations.formSpans);
    }
    
    updateSection(".about-us-container", "aboutUsHeader", "aboutUsSpans");
    updateText($("#secret-title"), translations.ourSecretHeader);
    updateMultiple($$(".our-secret-container span"), translations.ourSecretSpans);
    
    this.updatePlacesOverlays(translations);
    this.updateCards(".activity-card", translations.activitiesCards);
    this.updateCards(".gastronomy-card", translations.gastronomyCards);
    this.updatePlanCards(translations);
    this.updatePersonalizedPlan(translations);
    this.updateFormLabels(translations);
    this.updateCTAButtons(translations);
    this.updateFooter(translations);
    this.updateLegalPages(translations);
  }

  updatePlacesOverlays(translations) {
    const overlays = $$(".place .overlay");
    if (translations.placesOverlays && translations.placesOverlays.length) {
      translations.placesOverlays.forEach((place, index) => {
        if (!overlays[index]) return;
        const title = $("h3", overlays[index]);
        const span = $("span", overlays[index]);
        if (title) updateText(title, place.title);
        if (span) updateHTML(span, place.span);
      });
    }
  }

  updateCards(selector, cards) {
    const cardElements = $$(selector);
    if (cards && cards.length) {
      cards.forEach((card, index) => {
        if (!cardElements[index]) return;
        const title = $("h3", cardElements[index]);
        const description = $("span", cardElements[index]);
        if (title) updateText(title, card.title);
        if (description) updateText(description, card.description);
      });
    }
  }

  updatePlanCards(translations) {
    const planCards = $$(".plan_card");
    if (translations.plansCards && translations.plansCards.length) {
      translations.plansCards.forEach((plan, index) => {
        if (!planCards[index]) return;
        const header = $(".card_header span", planCards[index]);
        const content = $(".card_content span", planCards[index]);
        if (header) updateText(header, plan.title);
        if (content) updateText(content, plan.description);
      });
    }
  }

  updatePersonalizedPlan(translations) {
    const title = $(".plans-container .personalized-plan");
    if (title) updateText(title, translations.personalizedPlan);
    const spans = $$(".plans-container .personalized-plan ~ span");
    if (translations.personalizedPlanSpans && translations.personalizedPlanSpans.length) {
      updateMultiple(spans, translations.personalizedPlanSpans);
    }
  }

  updateFormLabels(translations) {
    if (!translations.formLabels) return;
    const labels = {
      name: $('label[for="name"]'),
      email: $('label[for="email"]'),
      phone: $('label[for="telf"]'),
      people: $('label[for="people"]'),
      message: $('label[for="message"]')
    };
    Object.keys(labels).forEach(key => {
      if (labels[key] && translations.formLabels[key]) {
        updateText(labels[key], translations.formLabels[key]);
      }
    });
    const submitButton = $(".form_option button[type='submit']");
    if (submitButton && translations.submitButton) {
      updateText(submitButton, translations.submitButton);
    }
    
    const privacyLabel = $('label[for="privacy-consent"]');
    if (privacyLabel && translations.privacyConsentLabel && translations.privacyPolicy && translations.legalNotice) {
      let labelText = translations.privacyConsentLabel
        .replace("{privacyPolicy}", `<a href="politica-privacidad.html" target="_blank" rel="noopener noreferrer">${translations.privacyPolicy}</a>`)
        .replace("{legalNotice}", `<a href="aviso-legal.html" target="_blank" rel="noopener noreferrer">${translations.legalNotice}</a>`);
      
      updateHTML(privacyLabel, labelText);
    }
  }

  updateCTAButtons(translations) {
    const headerCta = $(".header-cta");
    if (headerCta && translations.headerCta) {
      updateText(headerCta, translations.headerCta);
    }
    
    const footerCta = $(".footer-social .btn-outline");
    if (footerCta) {
      const href = footerCta.getAttribute("href");
      if (href && href.includes("about-us.html")) {
        updateText(footerCta, translations.footerCtaIndex);
      } else if (href && href.includes("index.html")) {
        updateText(footerCta, translations.footerCtaAbout);
      } else {
        updateText(footerCta, translations.footerCtaIndex);
      }
    }
    
    const personalizedPlanCta = $(".btn-personalized-plan");
    if (personalizedPlanCta && translations.personalizedPlanCta) {
      updateText(personalizedPlanCta, translations.personalizedPlanCta);
    }
  }

  updateFooter(translations) {
    const footerContactLabel = $(".footer-contact > span:first-child");
    if (footerContactLabel && translations.footerContactLabel) {
      updateText(footerContactLabel, translations.footerContactLabel);
    }
    
    const footerPolicies = $$(".footer-policies a");
    if (footerPolicies.length && translations.footerPolicies && translations.footerPolicies.length) {
      translations.footerPolicies.forEach((policy, index) => {
        if (footerPolicies[index]) {
          updateText(footerPolicies[index], policy);
        }
      });
    }
    
    const footerBottom = $(".footer-bottom p");
    if (footerBottom && translations.footerBottom) {
      updateText(footerBottom, translations.footerBottom);
    }
  }

  closeLangMenu() {
    const menu = $(".language-options");
    if (menu) {
      menu.classList.remove("show");
    }
  }

  updateLegalPages(translations) {
    const legalContainer = $(".legal-container");
    if (!legalContainer) return;

    const h1 = $(".legal-container h1");
    const legalContent = $(".legal-content");
    if (!h1 || !legalContent) return;

    // Detect which legal page we're on
    const currentPath = window.location.pathname;
    let legalData = null;

    if (currentPath.includes("aviso-legal") || currentPath.includes("legal-notice")) {
      legalData = translations.legalNotice;
    } else if (currentPath.includes("politica-privacidad") || currentPath.includes("privacy-policy") || currentPath.includes("politique-de-confidentialite")) {
      legalData = translations.privacyPolicy;
    } else if (currentPath.includes("politica-cookies") || currentPath.includes("cookie-policy") || currentPath.includes("politique-de-cookies")) {
      legalData = translations.cookiePolicy;
    }

    if (!legalData) return;

    // Update title
    if (legalData.title) {
      updateText(h1, legalData.title);
    }

    // Clear and rebuild content
    legalContent.innerHTML = "";

    if (legalData.sections && legalData.sections.length) {
      legalData.sections.forEach((section) => {
        // Create h2 for section title
        const h2 = document.createElement("h2");
        updateText(h2, section.title);
        legalContent.appendChild(h2);

        // Add subsections if they exist
        if (section.subsections && section.subsections.length) {
          section.subsections.forEach((subsection) => {
            const h3 = document.createElement("h3");
            updateText(h3, subsection.title);
            legalContent.appendChild(h3);

            if (subsection.paragraphs && subsection.paragraphs.length) {
              subsection.paragraphs.forEach((para) => {
                const p = document.createElement("p");
                updateHTML(p, para);
                legalContent.appendChild(p);
              });
            }
          });
        }

        // Add paragraphs before lists
        if (section.paragraphs && section.paragraphs.length) {
          section.paragraphs.forEach((para) => {
            const p = document.createElement("p");
            updateHTML(p, para);
            legalContent.appendChild(p);
          });
        }

        // Add lists if they exist
        if (section.lists && section.lists.length) {
          section.lists.forEach((listItems) => {
            const ul = document.createElement("ul");
            listItems.forEach((item) => {
              const li = document.createElement("li");
              updateHTML(li, item);
              ul.appendChild(li);
            });
            legalContent.appendChild(ul);
          });
        }

        // Add paragraphs after lists
        if (section.paragraphsAfter && section.paragraphsAfter.length) {
          section.paragraphsAfter.forEach((para) => {
            const p = document.createElement("p");
            updateHTML(p, para);
            legalContent.appendChild(p);
          });
        }

        // Add table if it exists
        if (section.table) {
          const table = document.createElement("table");
          table.style.width = "100%";
          table.style.borderCollapse = "collapse";
          table.style.margin = "2rem 0";

          const thead = document.createElement("thead");
          const tr = document.createElement("tr");
          tr.style.background = "rgba(175, 141, 84, 0.1)";
          section.table.headers.forEach((header) => {
            const th = document.createElement("th");
            th.style.padding = "1rem";
            th.style.textAlign = "left";
            th.style.borderBottom = "2px solid var(--gold-brown)";
            updateText(th, header);
            tr.appendChild(th);
          });
          thead.appendChild(tr);
          table.appendChild(thead);

          const tbody = document.createElement("tbody");
          section.table.rows.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
              const td = document.createElement("td");
              td.style.padding = "1rem";
              td.style.borderBottom = "1px solid rgba(175, 141, 84, 0.1)";
              updateText(td, cell);
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
          legalContent.appendChild(table);
        }
      });
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
    const menu = $(".language-options");
    const button = $(".selected-language");
    if (menu && button) {
      const isExpanded = !menu.classList.contains("show");
      menu.classList.toggle("show");
      button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
  };
  
  return manager;
};
