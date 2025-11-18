export function initServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return null;
  }

  return (async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      console.log("Service Worker registered successfully:", registration);

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateNotification();
          }
        });
      });

      navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  })();
}

function handleServiceWorkerMessage(event) {
  const { data } = event;
  switch (data.type) {
    case "CACHE_UPDATED":
      console.log("Cache updated:", data.cacheName);
      break;
    case "OFFLINE_MODE":
      showOfflineIndicator();
      break;
    case "ONLINE_MODE":
      hideOfflineIndicator();
      break;
    default:
      console.log("Service Worker message:", data);
  }
}

function handleOnline() {
  console.log("Connection restored");
  hideOfflineIndicator();
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "ONLINE" });
  }
  showToast("Conexión restaurada", "success");
}

function handleOffline() {
  console.log("Connection lost");
  showOfflineIndicator();
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "OFFLINE" });
  }
}

function showUpdateNotification() {
  const container = document.createElement("div");
  container.className = "update-notification";
  
  const content = document.createElement("div");
  content.className = "update-content";
  
  const title = document.createElement("h3");
  title.textContent = "🔄 Nueva versión disponible";
  
  const message = document.createElement("p");
  message.textContent = "Hay una nueva versión de Come2Huelva disponible. ¿Quieres actualizarla ahora?";
  
  const actions = document.createElement("div");
  actions.className = "update-actions";
  
  const updateBtn = document.createElement("button");
  updateBtn.className = "update-btn";
  updateBtn.textContent = "Actualizar";
  updateBtn.addEventListener("click", updateServiceWorker);
  
  const dismissBtn = document.createElement("button");
  dismissBtn.className = "dismiss-btn";
  dismissBtn.textContent = "Más tarde";
  dismissBtn.addEventListener("click", dismissUpdate);
  
  actions.appendChild(updateBtn);
  actions.appendChild(dismissBtn);
  content.appendChild(title);
  content.appendChild(message);
  content.appendChild(actions);
  container.appendChild(content);
  
  Object.assign(container.style, {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: "10000",
    maxWidth: "400px",
    animation: "slideInRight 0.3s ease-out"
  });
  
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .update-content h3 { margin: 0 0 0.5rem 0; color: #333; }
    .update-content p { margin: 0 0 1rem 0; color: #666; }
    .update-actions { display: flex; gap: 0.5rem; }
    .update-btn, .dismiss-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 600;
    }
    .update-btn {
      background: #af8d54;
      color: white;
    }
    .dismiss-btn {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(container);
  
  setTimeout(() => {
    if (container.parentNode) {
      container.style.animation = "slideInRight 0.3s ease-out reverse";
      setTimeout(() => container.remove(), 300);
    }
  }, 10000);
}

function showOfflineIndicator() {
  let indicator = document.querySelector(".offline-indicator");
  if (indicator) return;
  
  indicator = document.createElement("div");
  indicator.className = "offline-indicator";
  
  const content = document.createElement("div");
  content.className = "offline-content";
  
  const icon = document.createElement("span");
  icon.className = "offline-icon";
  icon.textContent = "🔌";
  
  const text = document.createElement("span");
  text.className = "offline-text";
  text.textContent = "Sin conexión";
  
  content.appendChild(icon);
  content.appendChild(text);
  indicator.appendChild(content);
  
  Object.assign(indicator.style, {
    position: "fixed",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#dc3545",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    zIndex: "9999",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    animation: "slideDown 0.3s ease-out"
  });
  
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    .offline-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(indicator);
}

function hideOfflineIndicator() {
  const indicator = document.querySelector(".offline-indicator");
  if (indicator) {
    indicator.style.animation = "slideDown 0.3s ease-out reverse";
    setTimeout(() => indicator.remove(), 300);
  }
}

function showToast(message, type = "info") {
  document.querySelectorAll(".toast").forEach(toast => toast.remove());
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  
  Object.assign(toast.style, {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    color: "white",
    fontWeight: "600",
    fontSize: "1.4rem",
    zIndex: "9999",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-out",
    backgroundColor: type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8"
  });
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 10);
  
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.updateServiceWorker = async () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }
};

window.dismissUpdate = () => {
  const notification = document.querySelector(".update-notification");
  if (notification) {
    notification.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => notification.remove(), 300);
  }
};

export async function clearCache() {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log("All caches cleared");
  }
}

export async function getCacheInfo() {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    const info = {};
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      info[name] = keys.length;
    }
    return info;
  }
  return null;
}

export async function preloadCriticalResources() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_URLS",
      urls: ["/styles.css", "/js/app.js", "/img/logonuevo.webp"]
    });
  }
}
