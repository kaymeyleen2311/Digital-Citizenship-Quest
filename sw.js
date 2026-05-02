const CACHE_NAME = 'hero-hub-v110'; // Taasan mo lagi ang version pag nag-update ka
const assets = [
  './',
  './index.html',
  './tailwind.js', // Dapat sakto ang pangalan dito
  './manifest.json',
  './TheTeam.png',
  './game1.html',
  './game2.html',
  './game3.html',
  './game4.html',
  './game5.html'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

// Eto ang magpapatakbo sa JS mo kahit offline forever
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
