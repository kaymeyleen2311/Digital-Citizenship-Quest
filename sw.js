const CACHE_NAME = 'hero-hub-v9'; // Palitan ang v9 pag may bagong upload
const assets = [
  './',
  './index.html',
  './manifest.json',
  './game1.html', 
  './game2.html', 
  './game3.html', 
  './game4.html', 
  './game5.html',
  './TheTeam.png',
  './tailwind.js', // Yung dinownload mo kanina
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
];

// Install: Sine-save ang lahat ng files sa phone
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(assets.map(url => cache.add(url)));
    })
  );
});

// Activate: Nililinis ang lumang version
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

// Fetch: "Offline-First" Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Kung may baon, ipakita agad (Fast load)
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // 2. I-update ang baon sa background
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
          // Kung walang internet at walang baon, ipakita ang main page
          if (event.request.mode === 'navigate') return caches.match('./index.html');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
