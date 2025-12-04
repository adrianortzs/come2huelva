export const $ = (selector, element = document) => element.querySelector(selector);

export const $$ = (selector, element = document) => Array.from(element.querySelectorAll(selector));

export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const setExpanded = (element, expanded) => {
  if (element) {
    element.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
};

export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("localStorage not available:", error);
      return false;
    }
  }
};

export const showToast = (message, type = "info", duration = 3000) => {
  const container = $("#toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => container.removeChild(toast), 300);
  }, duration);
};

export const updateText = (element, text) => {
  if (element) {
    element.textContent = text;
  }
};

export const updateHTML = (element, html) => {
  if (element) {
    element.innerHTML = html;
  }
};

export const updateMultiple = (elements, updates) => {
  if (!updates) return;
  
  if (Array.isArray(elements) && elements.length > 0 && elements[0]?.nodeType) {
    elements.forEach((element, index) => {
      if (updates[index]) {
        element.textContent = updates[index];
      }
    });
  } else if (typeof elements === "object" && !Array.isArray(elements)) {
    Object.entries(elements).forEach(([selector, update]) => {
      const element = $(selector);
      if (!element) return;
      
      if (typeof update === "string") {
        element.textContent = update;
      } else if (update?.html) {
        element.innerHTML = update.html;
      } else if (update?.text) {
        element.textContent = update.text;
      }
    });
  }
};
