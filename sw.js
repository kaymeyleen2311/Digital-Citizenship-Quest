const CACHE_NAME = 'hero-hub-v30'; // Bagong version uli
const assets = [
  './',
  './index.html',
  './game1.html',
  './game2.html',
  './game3.html',
  './game4.html',
  './game5.html',
  './tailwind.js',
  './TheTeam.png',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  // Strategy: Kuhanin agad sa CACHE. Pag wala, tsaka mag-INTERNET.
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
