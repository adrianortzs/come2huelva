// Script para desinstalar Service Workers y limpiar cachés
// Este script se ejecuta automáticamente al cargar la página

(function() {
  'use strict';

  if (!('serviceWorker' in navigator)) {
    return;
  }

  console.log('Buscando Service Workers para desinstalar...');

  // Desinstalar todos los Service Workers existentes
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    const promises = [];
    
    // Desinstalar cada Service Worker
    registrations.forEach(function(registration) {
      console.log('Desinstalando Service Worker:', registration.scope);
      promises.push(
        registration.unregister().then(function(success) {
          if (success) {
            console.log('✓ Service Worker desinstalado:', registration.scope);
          } else {
            console.log('✗ No se pudo desinstalar:', registration.scope);
          }
        }).catch(function(error) {
          console.error('Error al desinstalar Service Worker:', error);
        })
      );
    });

    // Limpiar todos los caches
    if ('caches' in window) {
      promises.push(
        caches.keys().then(function(cacheNames) {
          console.log('Encontrados', cacheNames.length, 'caches para eliminar');
          return Promise.all(
            cacheNames.map(function(cacheName) {
              console.log('Eliminando cache:', cacheName);
              return caches.delete(cacheName).then(function(success) {
                if (success) {
                  console.log('✓ Cache eliminado:', cacheName);
                }
              });
            })
          );
        }).then(function() {
          console.log('✓ Todos los caches eliminados');
        }).catch(function(error) {
          console.error('Error al limpiar caches:', error);
        })
      );
    }

    // Registrar el SW de limpieza una vez que los anteriores estén desinstalados
    return Promise.all(promises).then(function() {
      // Esperar un momento antes de registrar el SW de limpieza
      setTimeout(function() {
        navigator.serviceWorker.register('/sw.js?v=2.0.2').then(function(registration) {
          console.log('SW de limpieza registrado, se desinstalará automáticamente...');
          
          // El SW se desinstalará automáticamente
          setTimeout(function() {
            registration.unregister().then(function(success) {
              if (success) {
                console.log('✓ SW de limpieza desinstalado - Todo listo');
              }
            });
          }, 3000);
        }).catch(function(error) {
          console.log('SW de limpieza no pudo registrarse (normal si no existe):', error.message);
        });
      }, 500);
    });
  }).catch(function(error) {
    console.error('Error al obtener registros de Service Worker:', error);
  });
})();

