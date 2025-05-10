// Service Worker for NovedLabels Shipping Application
const CACHE_NAME = 'novedlabels-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting on install');
        return self.skipWaiting();
      })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip some requests we don't want to cache
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith('/api/') || 
    url.pathname.startsWith('/_next/data/')
  ) {
    return;
  }
  
  // Handle fetch events
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        console.log('[ServiceWorker] Fetched resource ' + event.request.url);
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch((error) => {
        console.log('[ServiceWorker] Fetch failed; returning offline page instead.', error);
        
        // If offline, try to return the cached page
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If even cached page is not available, show offline page
            return caches.match(OFFLINE_URL);
          });
      })
  );
}); 