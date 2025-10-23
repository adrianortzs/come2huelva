import { $, $$, updateText, updateHTML, updateMultiple, storage } from './utils.js';
import { CONFIG } from './config.js';
import { translations } from './translations.js';

export class LanguageManager {
  constructor() {
    this.currentLang = CONFIG.DEFAULT_LANGUAGE;
    this.translations = translations;
  }
  
  init() {
    const savedLang = storage.get(CONFIG.STORAGE_KEYS.LANGUAGE);
    const initialLang = savedLang && this.translations[savedLang] ? savedLang : CONFIG.DEFAULT_LANGUAGE;
    this.changeLanguage(initialLang);
  }
  
  changeLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language '${lang}' not found, using default`);
      lang = CONFIG.DEFAULT_LANGUAGE;
    }
    
    this.currentLang = lang;
    storage.set(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    
    const t = this.translations[lang];
    
    this.updateNavigation(t);
    this.updateLanguageButton(lang);
    this.updatePageContent(t);
    this.closeLangMenu();
  }
  
  updateNavigation(t) {
    const navLinks = $$('nav ul li a');
    if (t.navLinks) {
      t.navLinks.forEach((text, i) => {
        if (navLinks[i]) updateText(navLinks[i], text);
      });
    }
  }
  
  updateLanguageButton(lang) {
    const button = $('.selected-language');
    if (!button) return;
    
    const labels = {
      es: 'Español &#9662;',
      en: 'English &#9662;',
      fr: 'Français &#9662;'
    };
    
    updateHTML(button, labels[lang] || labels.es);
  }
  
  updatePageContent(t) {
    const updateSection = (containerSelector, headerKey, spansKey, isH1 = true) => {
      const container = $(containerSelector);
      if (!container) return;
      
      const headerTag = isH1 ? 'h1' : 'h2';
      const header = $(containerSelector + ` ${headerTag}`);
      if (header && t[headerKey]) updateText(header, t[headerKey]);
      
      const spans = $$(containerSelector + ' > span');
      if (spans.length && t[spansKey]) updateMultiple(spans, t[spansKey]);
    };
    
    updateMultiple($$('.introduction-container span'), t.introductionSpans);
    updateSection('.place-container', 'placeHeader', 'placeSpans');
    updateSection('.activities-container', 'activitiesHeader', 'activitiesSpans');
    updateSection('.gastronomy-container', 'gastronomyHeader', 'gastronomySpans');
    updateSection('.plans-container', 'plansHeader', 'plansSpans');
    updateText($('.opinions h1'), t.opinionsHeader);
    updateSection('.form-container', 'formHeader', 'formSpans');
    updateSection('.about-us-container', 'aboutUsHeader', 'aboutUsSpans');
    updateText($('#secret-title'), t.ourSecretHeader);
    updateMultiple($$('.our-secret-container span'), t.ourSecretSpans);
    
    this.updatePlacesOverlays(t);
    this.updateCards('.activity-card', t.activitiesCards);
    this.updateCards('.gastronomy-card', t.gastronomyCards);
    this.updatePlanCards(t);
    this.updatePersonalizedPlan(t);
    this.updateFormLabels(t);
    this.updateCTAButtons(t);
  }
  
  updatePlacesOverlays(t) {
    const overlays = $$('.places-container .place .overlay');
    if (!t.placesOverlays) return;
    
    t.placesOverlays.forEach((overlay, i) => {
      if (!overlays[i]) return;
      const h3 = $('h3', overlays[i]);
      const span = $('span', overlays[i]);
      if (h3) updateText(h3, overlay.title);
      if (span) updateHTML(span, overlay.span);
    });
  }
  
  updateCards(selector, cardsData) {
    const cards = $$(selector);
    if (!cardsData) return;
    
    cardsData.forEach((cardData, i) => {
      if (!cards[i]) return;
      const h3 = $('h3', cards[i]);
      const span = $('span', cards[i]);
      if (h3) updateText(h3, cardData.title);
      if (span) updateText(span, cardData.description);
    });
  }
  
  updatePlanCards(t) {
    const planCards = $$('.plan_card');
    if (!t.plansCards) return;
    
    t.plansCards.forEach((card, i) => {
      if (!planCards[i]) return;
      const headerSpan = $('.card_header span', planCards[i]);
      const contentSpan = $('.card_content span', planCards[i]);
      if (headerSpan) updateText(headerSpan, card.title);
      if (contentSpan) updateText(contentSpan, card.description);
    });
  }
  
  updatePersonalizedPlan(t) {
    const personalizedPlan = $('.plans-container .personalized-plan');
    updateText(personalizedPlan, t.personalizedPlan);
    
    const personalizedSpans = $$('.plans-container .personalized-plan ~ span');
    if (t.personalizedPlanSpans) {
      updateMultiple(personalizedSpans, t.personalizedPlanSpans);
    }
  }
  
  updateFormLabels(t) {
    if (!t.formLabels) return;
    
    const labels = {
      name: $('label[for="name"]'),
      email: $('label[for="email"]'),
      phone: $('label[for="telf"]'),
      people: $('label[for="people"]'),
      message: $('label[for="message"]')
    };
    
    Object.keys(labels).forEach(key => {
      updateText(labels[key], t.formLabels[key]);
    });
    
    updateText($('.form_option button'), t.submitButton);
  }
  
  updateCTAButtons(t) {
    const headerCta = $('.header-cta');
    updateText(headerCta, t.headerCta);
    
    const footerCta = $('.footer-cta .btn-outline');
    if (footerCta) {
      const isAboutPage = footerCta.getAttribute('href')?.includes('index.html');
      updateText(footerCta, isAboutPage ? t.footerCtaAbout : t.footerCtaIndex);
    }
  }
  
  closeLangMenu() {
    const menu = $('.language-options');
    if (menu) menu.classList.remove('show');
  }
}

export const initLanguageManager = () => {
  const manager = new LanguageManager();
  manager.init();
  
  window.changeLanguage = (lang) => manager.changeLanguage(lang);
  window.toggleLanguageMenu = () => {
    const menu = $('.language-options');
    const btn = $('.selected-language');
    if (menu && btn) {
      const willShow = !menu.classList.contains('show');
      menu.classList.toggle('show');
      btn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
    }
  };
  
  return manager;
};