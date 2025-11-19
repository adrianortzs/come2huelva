import { $, $$, showToast as showToastUtil } from "./utils.js";
import { CONFIG } from "./config.js";

export class ContactForm {
  constructor(selector = ".form") {
    this.form = $(selector);
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
    ["name", "email", "telf", "people", "message"].forEach(fieldName => {
      const field = $(`#${fieldName}`);
      if (!field) return;

      let timeout;
      field.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.validateField(fieldName, field);
        }, 300);
      });

      field.addEventListener("blur", () => {
        this.validateField(fieldName, field);
      });

      field.addEventListener("focus", () => {
        this.clearFieldError(field);
      });

      if (fieldName === "message") {
        this.setupCharacterCounter(field);
      }
    });
  }

  setupCharacterCounter(field) {
    const maxLength = this.validationRules.message.maxLength;
    if (!maxLength) return;

    const counter = document.createElement("div");
    counter.className = "char-counter";
    counter.textContent = `0/${maxLength}`;
    field.parentNode.appendChild(counter);

    field.addEventListener("input", () => {
      const length = field.value.length;
      counter.textContent = `${length}/${maxLength}`;
      counter.classList.remove("warning", "error");
      if (length > 0.8 * maxLength) {
        counter.classList.add("warning");
      }
      if (length > maxLength) {
        counter.classList.add("error");
      }
    });
  }

  validateField(fieldName, field) {
    const value = field.value.trim();
    const rule = this.validationRules[fieldName === "telf" ? "phone" : fieldName];
    if (!rule) return true;

    let isValid = true;
    let errorMessage = "";

    if (rule.required && !value) {
      isValid = false;
      errorMessage = "Este campo es obligatorio";
    } else if (
      (value && rule.minLength && value.length < rule.minLength) ||
      (value && rule.maxLength && value.length > rule.maxLength) ||
      (value && rule.pattern && !rule.pattern.test(value)) ||
      (value && rule.min !== undefined && parseInt(value) < rule.min) ||
      (value && rule.max !== undefined && parseInt(value) > rule.max)
    ) {
      isValid = false;
      errorMessage = rule.message;
    }

    if (isValid) {
      this.showFieldSuccess(field);
    } else {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
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

  clearFieldError(field) {
    const error = field.parentNode.querySelector(".field-error");
    if (error) {
      error.remove();
    }
    field.classList.remove("error");
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = this.getFormData();

    if (!this.validateAllFields()) {
      this.showError("Por favor, corrige los errores en el formulario.");
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";

      const result = await this.sendEmail(formData);
      if (result.includes("guardado para envío")) {
        this.showSuccess("¡Formulario guardado! Se enviará automáticamente cuando tengas conexión.");
      } else {
        this.showSuccess("¡Correo enviado exitosamente!");
      }

      this.form.reset();
      this.clearAllFieldStates();
    } catch (error) {
      console.error("Form submission error:", error);
      this.showError("Hubo un error al enviar el correo. Por favor, inténtalo de nuevo.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  validateAllFields() {
    let isValid = true;
    ["name", "email", "telf", "people", "message"].forEach(fieldName => {
      const field = $(`#${fieldName}`);
      if (field && !this.validateField(fieldName, field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  clearAllFieldStates() {
    ["name", "email", "telf", "people", "message"].forEach(fieldName => {
      const field = $(`#${fieldName}`);
      if (field) {
        this.clearFieldError(field);
        field.classList.remove("success", "error");
        field.removeAttribute("aria-invalid");
      }
    });
  }

  getFormData() {
    return {
      name: $("#name")?.value || "",
      email: $("#email")?.value || "",
      phone: $("#telf")?.value || "",
      people: $("#people")?.value || "",
      message: $("#message")?.value || ""
    };
  }

  validateForm(data) {
    return data.name && data.email && data.phone && data.people && this.isValidEmail(data.email);
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async sendEmail(data) {
    if (!navigator.onLine) {
      return this.handleOfflineSubmission(data);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);

    try {
      const response = await fetch(CONFIG.API.EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeout);

      if (error.name === "AbortError") {
        throw new Error("La solicitud ha superado el tiempo de espera");
      }

      if (error.name === "TypeError" || error.message.includes("fetch")) {
        return this.handleOfflineSubmission(data);
      }

      throw error;
    }
  }

  async handleOfflineSubmission(data) {
    try {
      await this.storeOfflineSubmission(data);

      if (
        "serviceWorker" in navigator &&
        "sync" in window.ServiceWorkerRegistration.prototype
      ) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register("form-submission");
      }

      return "Formulario guardado para envío cuando tengas conexión";
    } catch (error) {
      console.error("Failed to store offline submission:", error);
      throw new Error("No se pudo guardar el formulario. Inténtalo de nuevo cuando tengas conexión.");
    }
  }

  async storeOfflineSubmission(data) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("Come2HuelvaDB", 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const transaction = request.result
          .transaction(["pendingSubmissions"], "readwrite")
          .objectStore("pendingSubmissions")
          .add({
            data: data,
            timestamp: Date.now(),
            attempts: 0
          });

        transaction.onsuccess = () => resolve(transaction.result);
        transaction.onerror = () => reject(transaction.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("pendingSubmissions")) {
          db.createObjectStore("pendingSubmissions", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };
    });
  }

  showSuccess(message) {
    this.showToast(message, "success");
  }

  showError(message) {
    this.showToast(message, "error");
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
