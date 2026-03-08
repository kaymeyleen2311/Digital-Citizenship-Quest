const CACHE_NAME = 'hero-hub-v3'; // Version 3

// Dito nakalista lahat ng files na kailangang i-save ng browser
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './TheTeam.png',
  './game1.html', 
  './game2.html', 
  './game3.html', 
  './game4.html', 
  './game5.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Space+Grotesk:wght@700&display=swap'
];

// Pag-install ng Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('System: Saving missions...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Pag-activate at paglilinis ng lumang cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

// Pag-load ng files
self.addEventListener('fetch', event => {
  // SECURITY CHECK: I-ignore ang mga requests na hindi http/https (gaya ng chrome-extension)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          // Dynamic Caching: I-save ang mga images/sounds na gawa ng groupmates mo
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      console.log("Offline: Mission file not in cache.");
    })
  );
});
