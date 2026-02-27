const CACHE_NAME = 'game-hub-cache-v1';

// Add all the files and external URLs your game relies on here
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/game1.html',
  '/game2.html',
  '/game3.html',
  '/game4.html',
  '/game5.html',
  // Cache the Tailwind CDN
  'https://cdn.tailwindcss.com',
  // Cache the Google Fonts
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

// 1. Install Event: Caches the initial files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Event: Intercepts network requests and serves from cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        
        // Not in cache - return the result from the active network
        return fetch(event.request).then(
          function(networkResponse) {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Optional: Clone the response and add it to cache dynamically for the future
            var responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      }).catch(() => {
        // Fallback if everything fails (optional)
        console.log("Offline and resource not in cache.");
      })
  );
});

// 3. Activate Event: Cleans up old caches if you update CACHE_NAME
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
