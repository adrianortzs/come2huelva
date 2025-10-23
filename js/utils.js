// Selectores DOM
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Evita ejecutar una función repetidamente -> ejecuta al final
export const debounce = (fn, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
};

// Menú abierto/cerrado
export const setExpanded = (el, expanded) => {
  if (el) el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
};

// Almacenamiento local
export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available:', e);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }
};

// Notificaciones
export const showToast = (message, type = 'info', duration = 3000) => {
  const container = $('#toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  container.appendChild(toast);

  // Animaciones
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => container.removeChild(toast), 300);
  }, duration);
};

export const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{8}$/;
  return re.test(phone.replace(/\s/g, ''));
};

// Evita ejecutar una función repetidamente -> ejecuta cada x tiempo
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Funciones para actualizar contenido de idiomas
export const updateText = (element, text) => {
  if (element) element.textContent = text;
};

export const updateHTML = (element, html) => {
  if (element) element.innerHTML = html;
};

export const updateMultiple = (elementsOrSelectors, content) => {
  // Si el primer argumento es un array de elementos DOM
  if (Array.isArray(elementsOrSelectors) && elementsOrSelectors.length > 0 && elementsOrSelectors[0].nodeType) {
    elementsOrSelectors.forEach((element, index) => {
      if (content && content[index]) {
        element.textContent = content[index];
      }
    });
    return;
  }
  
  // Si es un objeto con selectores
  if (typeof elementsOrSelectors === 'object' && !Array.isArray(elementsOrSelectors)) {
    Object.entries(elementsOrSelectors).forEach(([selector, content]) => {
      const element = $(selector);
      if (element) {
        if (typeof content === 'string') {
          element.textContent = content;
        } else if (content.html) {
          element.innerHTML = content.html;
        } else if (content.text) {
          element.textContent = content.text;
        }
      }
    });
  }
};
