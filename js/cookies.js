import { translations } from "./translations.js";
import { CONFIG } from "./config.js";
import { storage } from "./utils.js";

class CookieConsent {
  constructor() {
    this.cookieName = "come2huelva_cookie_consent";
    this.cookieExpiryDays = 365;
    const savedLang = storage.get(CONFIG.STORAGE_KEYS.LANGUAGE);
    this.currentLang = savedLang && translations[savedLang] ? savedLang : CONFIG.DEFAULT_LANGUAGE;
    this.init();
  }

  init() {
    if (this.hasConsent()) {
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.showBanner());
    } else {
      this.showBanner();
    }
  }

  hasConsent() {
    return localStorage.getItem(this.cookieName) === "accepted";
  }

  setConsent() {
    localStorage.setItem(this.cookieName, "accepted");
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + this.cookieExpiryDays * 24 * 60 * 60 * 1000);
    document.cookie = `${this.cookieName}=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.updateBannerText();
  }

  updateBannerText() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;

    const texts = translations[this.currentLang]?.cookieBanner || translations.es.cookieBanner;
    
    const messageEl = banner.querySelector(".cookie-message");
    const acceptBtn = banner.querySelector(".cookie-accept");
    const policyLink = banner.querySelector(".cookie-policy-link");

    if (messageEl && texts.message) {
      messageEl.innerHTML = texts.message;
    }
    if (acceptBtn && texts.acceptButton) {
      acceptBtn.textContent = texts.acceptButton;
      acceptBtn.setAttribute("aria-label", texts.acceptButton);
    }
    if (policyLink && texts.policyLink) {
      policyLink.textContent = texts.policyLink;
    }
  }

  showBanner() {
    if (this.hasConsent()) {
      return;
    }

    let banner = document.getElementById("cookie-banner");
    if (!banner) {
      banner = this.createBanner();
      document.body.appendChild(banner);
      
      banner.offsetHeight;
    }

    const delay = window.innerWidth <= 768 ? 300 : 500;
    setTimeout(() => {
      if (banner && !banner.classList.contains("show")) {
        banner.classList.add("show");
      }
    }, delay);
  }

  createBanner() {
    const texts = translations[this.currentLang]?.cookieBanner || translations.es.cookieBanner;
    
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", texts.acceptButton);

    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-icon">
          <i class="bi bi-cookie"></i>
        </div>
        <div class="cookie-text">
          <p class="cookie-message">${texts.message}</p>
        </div>
        <div class="cookie-actions">
          <a href="politica-cookies.html" class="cookie-policy-link" target="_blank" rel="noopener noreferrer">${texts.policyLink}</a>
          <button type="button" class="cookie-accept" aria-label="${texts.acceptButton}">${texts.acceptButton}</button>
        </div>
      </div>
    `;

    const acceptBtn = banner.querySelector(".cookie-accept");
    acceptBtn.addEventListener("click", () => this.acceptCookies());

    return banner;
  }

  acceptCookies() {
    this.setConsent();
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.classList.remove("show");
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  reset() {
    localStorage.removeItem(this.cookieName);
    document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export { CookieConsent };
