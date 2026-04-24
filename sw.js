const CACHE_NAME = 'hero-hub-v25';

const assets = [
  './',
  './index.html',
  './manifest.json',
  './tailwind.js', // Pinaka-importante para sa design
  './TheTeam.png',
  './game1.html', 
  './game2.html', 
  './game3.html', 
  './game4.html', 
  './game5.html',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Space+Grotesk:wght@700&display=swap'
];

// INSTALL: Pinipilit ang phone na i-download lahat bago sabihing "Ready"
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('System: Downloading offline assets...');
      return Promise.allSettled(
        assets.map(url => cache.add(url).catch(err => console.log('Critical failure on: ' + url)))
      );
    })
  );
});

// ACTIVATE: Binubura ang lahat ng lumang version na nag-cacause ng "Raw HTML"
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// FETCH: "CACHE-ONLY-IF-OFFLINE" Logic
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Kung nasa storage na (offline baon), ibigay agad. Walang intayan.
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 2. Kung wala sa storage, kuhanin sa internet
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
