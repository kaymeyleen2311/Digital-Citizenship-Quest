const CACHE_NAME = 'hero-hub-v6'; // Binago ko sa v6 para mag-force update ang app mo
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './game1.html', 
  './game2.html', 
  './game3.html', 
  './game4.html', 
  './game5.html',
  './TheTeam.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
];

// 1. INSTALL: Dito pilit nating pinapa-update ang laro
self.addEventListener('install', event => {
  self.skipWaiting(); // UTOS: Huwag nang maghintay, palitan agad ang lumang version!
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url))
      );
    })
  );
});

// 2. ACTIVATE: Dito natin binubura yung mga lumang "v4" at "v5" na nagpapagulo sa app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Burahin ang basura (lumang versions)
          }
        })
      );
    }).then(() => self.clients.claim()) // Kunin agad ang kontrol sa app
  );
});

// 3. FETCH: Dito kinukuha ang laro pag wala nang internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
