const CACHE_NAME = 'come2huelva-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/images/logonuevo.webp',
  '/images/favicon.webp',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static assets
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/images/')) {
      event.respondWith(
        caches.match(request)
          .then(response => response || fetch(request))
      );
    }
    // API requests
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => caches.match(request))
      );
    }
    // HTML pages
    else if (request.headers.get('accept').includes('text/html')) {
      event.respondWith(
        caches.match(request)
          .then(response => response || fetch(request))
      );
    }
  }
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'form-submission') {
    event.waitUntil(handleFormSubmission());
  }
});

async function handleFormSubmission() {
  // Handle offline form submissions
  console.log('Handling background sync for form submission');
}