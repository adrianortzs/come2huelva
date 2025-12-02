// Service Worker para auto-desinstalación
// Este archivo se desinstala automáticamente para limpiar cachés antiguos

const CACHE_NAME = 'come2huelva-cache-v1';

// Auto-desinstalación inmediata
self.addEventListener('install', (event) => {
  // Fuerza la activación inmediata del nuevo SW
  self.skipWaiting();
  
  event.waitUntil(
    // Eliminar todos los caches antiguos
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Eliminando cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Todos los caches eliminados');
      // Desinstalar este Service Worker
      self.registration.unregister().then(() => {
        console.log('Service Worker desinstalado');
      });
    })
  );
});

// Activar inmediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Eliminar todos los caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }),
      // Asegurar que este SW controle todos los clientes
      self.clients.claim(),
      // Desinstalar este Service Worker
      self.registration.unregister().then((success) => {
        if (success) {
          console.log('Service Worker desinstalado correctamente');
        }
      })
    ]).then(() => {
      // Notificar a todos los clientes
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UNREGISTERED',
            message: 'Service Worker desinstalado - Cache limpiado'
          });
        });
      });
    })
  );
});

// No interceptar ninguna petición - solo limpiar y desinstalar
self.addEventListener('fetch', (event) => {
  // No hacer nada - dejar que las peticiones pasen directamente al servidor
  // Esto evita cualquier caché del Service Worker
  return;
});

// Auto-desinstalación después de un tiempo si no se ha desinstalado antes
setTimeout(() => {
  self.registration.unregister().then((success) => {
    if (success) {
      console.log('Service Worker auto-desinstalado después del timeout');
    }
  });
}, 1000);

