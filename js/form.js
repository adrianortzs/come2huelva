import { $ as e, $$ as t, showToast as showToastUtil } from "./utils.js";
import { CONFIG as r } from "./config.js";

export class ContactForm {
  constructor(t = ".form") {
    this.form = e(t);
    if (this.form) {
      this.validationRules = {
        name: {
          required: true,
          minLength: 2,
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          message: "El nombre debe tener al menos 2 caracteres y solo letras"
        },
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Por favor, introduce un email válido"
        },
        phone: {
          required: true,
          pattern: /^[+]?[0-9\s\-\(\)]{9,15}$/,
          message: "Por favor, introduce un teléfono válido"
        },
        people: {
          required: true,
          min: 1,
          max: 10,
          message: "El número de personas debe estar entre 1 y 10"
        },
        message: {
          required: false,
          maxLength: 500,
          message: "El mensaje no puede exceder 500 caracteres"
        }
      };
      this.init();
    }
  }

  init() {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
    this.setupRealTimeValidation();
  }

  setupRealTimeValidation() {
    ["name", "email", "telf", "people", "message"].forEach(t => {
      const r = e(`#${t}`);
      if (!r) return;

      let s;
      r.addEventListener("input", () => {
        clearTimeout(s);
        s = setTimeout(() => {
          this.validateField(t, r);
        }, 300);
      });

      r.addEventListener("blur", () => {
        this.validateField(t, r);
      });

      r.addEventListener("focus", () => {
        this.clearFieldError(r);
      });

      if (t === "message") {
        this.setupCharacterCounter(r);
      }
    });
  }

  setupCharacterCounter(e) {
    const t = this.validationRules.message.maxLength;
    if (!t) return;

    const r = document.createElement("div");
    r.className = "char-counter";
    r.textContent = `0/${t}`;
    e.parentNode.appendChild(r);

    e.addEventListener("input", () => {
      const s = e.value.length;
      r.textContent = `${s}/${t}`;
      r.classList.remove("warning", "error");
      if (s > 0.8 * t) {
        r.classList.add("warning");
      }
      if (s > t) {
        r.classList.add("error");
      }
    });
  }

  validateField(e, t) {
    const r = t.value.trim();
    const s = this.validationRules[e === "telf" ? "phone" : e];
    if (!s) return true;

    let o = true;
    let a = "";

    if (s.required && !r) {
      o = false;
      a = "Este campo es obligatorio";
    } else if (
      (r && s.minLength && r.length < s.minLength) ||
      (r && s.maxLength && r.length > s.maxLength) ||
      (r && s.pattern && !s.pattern.test(r)) ||
      (r && s.min !== undefined && parseInt(r) < s.min) ||
      (r && s.max !== undefined && parseInt(r) > s.max)
    ) {
      o = false;
      a = s.message;
    }

    if (o) {
      this.showFieldSuccess(t);
    } else {
      this.showFieldError(t, a);
    }

    return o;
  }

  showFieldError(e, t) {
    this.clearFieldError(e);
    e.classList.add("error");
    e.classList.remove("success");

    const r = document.createElement("div");
    r.className = "field-error";
    r.textContent = t;
    r.setAttribute("role", "alert");
    e.parentNode.appendChild(r);

    e.setAttribute("aria-invalid", "true");
    e.setAttribute("aria-describedby", r.id || `error-${e.id}`);
  }

  showFieldSuccess(e) {
    this.clearFieldError(e);
    e.classList.add("success");
    e.classList.remove("error");
    e.setAttribute("aria-invalid", "false");
  }

  clearFieldError(e) {
    const t = e.parentNode.querySelector(".field-error");
    if (t) {
      t.remove();
    }
    e.classList.remove("error");
  }

  async handleSubmit(e) {
    e.preventDefault();
    const t = this.getFormData();

    if (!this.validateAllFields()) {
      this.showError("Por favor, corrige los errores en el formulario.");
      return;
    }

    const r = this.form.querySelector('button[type="submit"]');
    const s = r.textContent;

    try {
      r.disabled = true;
      r.textContent = "Enviando...";

      const result = await this.sendEmail(t);
      if (result.includes("guardado para envío")) {
        this.showSuccess("¡Formulario guardado! Se enviará automáticamente cuando tengas conexión.");
      } else {
        this.showSuccess("¡Correo enviado exitosamente!");
      }

      this.form.reset();
      this.clearAllFieldStates();
    } catch (e) {
      console.error("Form submission error:", e);
      this.showError("Hubo un error al enviar el correo. Por favor, inténtalo de nuevo.");
    } finally {
      r.disabled = false;
      r.textContent = s;
    }
  }

  validateAllFields() {
    let t = true;
    ["name", "email", "telf", "people", "message"].forEach(r => {
      const s = e(`#${r}`);
      if (s && !this.validateField(r, s)) {
        t = false;
      }
    });
    return t;
  }

  clearAllFieldStates() {
    ["name", "email", "telf", "people", "message"].forEach(t => {
      const r = e(`#${t}`);
      if (r) {
        this.clearFieldError(r);
        r.classList.remove("success", "error");
        r.removeAttribute("aria-invalid");
      }
    });
  }

  getFormData() {
    return {
      name: e("#name")?.value || "",
      email: e("#email")?.value || "",
      phone: e("#telf")?.value || "",
      people: e("#people")?.value || "",
      message: e("#message")?.value || ""
    };
  }

  validateForm(e) {
    return e.name && e.email && e.phone && e.people && this.isValidEmail(e.email);
  }

  isValidEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async sendEmail(e) {
    if (!navigator.onLine) {
      return this.handleOfflineSubmission(e);
    }

    const t = new AbortController();
    const s = setTimeout(() => t.abort(), r.API.TIMEOUT);

    try {
      const o = await fetch(r.API.EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(e),
        signal: t.signal
      });

      clearTimeout(s);

      if (!o.ok) {
        throw new Error(`HTTP error! status: ${o.status}`);
      }

      return await o.text();
    } catch (t) {
      clearTimeout(s);

      if (t.name === "AbortError") {
        throw new Error("La solicitud ha superado el tiempo de espera");
      }

      if (t.name === "TypeError" || t.message.includes("fetch")) {
        return this.handleOfflineSubmission(e);
      }

      throw t;
    }
  }

  async handleOfflineSubmission(e) {
    try {
      await this.storeOfflineSubmission(e);

      if (
        "serviceWorker" in navigator &&
        "sync" in window.ServiceWorkerRegistration.prototype
      ) {
        const e = await navigator.serviceWorker.ready;
        await e.sync.register("form-submission");
      }

      return "Formulario guardado para envío cuando tengas conexión";
    } catch (e) {
      console.error("Failed to store offline submission:", e);
      throw new Error("No se pudo guardar el formulario. Inténtalo de nuevo cuando tengas conexión.");
    }
  }

  async storeOfflineSubmission(e) {
    return new Promise((t, r) => {
      const s = indexedDB.open("Come2HuelvaDB", 1);

      s.onerror = () => r(s.error);

      s.onsuccess = () => {
        const o = s.result
          .transaction(["pendingSubmissions"], "readwrite")
          .objectStore("pendingSubmissions")
          .add({
            data: e,
            timestamp: Date.now(),
            attempts: 0
          });

        o.onsuccess = () => t(o.result);
        o.onerror = () => r(o.error);
      };

      s.onupgradeneeded = () => {
        const e = s.result;
        if (!e.objectStoreNames.contains("pendingSubmissions")) {
          e.createObjectStore("pendingSubmissions", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };
    });
  }

  showSuccess(e) {
    this.showToast(e, "success");
  }

  showError(e) {
    this.showToast(e, "error");
  }

  showToast(message, type = "info") {
    // Usar función centralizada de utils.js
    if (showToastUtil && typeof showToastUtil === "function") {
      showToastUtil(message, type, 5000);
    } else {
      // Fallback si utils no está disponible
      const toastContainer = document.querySelector("#toast-container");
      if (toastContainer) {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "polite");
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
        }, 5000);
      }
    }
  }
}

export const initForm = () => new ContactForm();
