const CACHE_NAME = 'game-hub-cache-v1';

// Assets to cache using relative paths
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './game1.html',
  './game2.html',
  './game3.html',
  './game4.html',
  './game5.html',
  './TheTeam.png', // HUWAG KALIMUTAN ITO para lumabas ang picture ng team offline
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache opened and assets added');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 1. Kung nasa cache, ibalik ang cached file
      if (response) return response;

      // 2. Kung wala sa cache, subukang kunin sa network
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // I-save sa cache ang mga bagong nakuha na file para sa susunod (Dynamic Caching)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }).catch(() => {
      console.log("Resource not found offline.");
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});
