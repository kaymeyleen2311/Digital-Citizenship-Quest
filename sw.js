const CACHE_NAME = 'digital-hero-v1'; // Palitan ang version 'v2' sa susunod na update
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './game1.html',
  './game2.html',
  './game3.html',
  './game4.html',
  './game5.html',
  './tailwind.js',
  './manifest.json',
  './TheTeam.png'
];

// 1. INSTALLATION - Dito dina-download lahat ng files para sa offline
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATION - Paglilinis ng mga lumang cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

// 3. FETCH - Dito sinasabi na "Kuhanin muna sa Cache, huwag sa Internet"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Kung nasa cache, ibigay agad (Instant Offline)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Kung wala sa cache, kuhanin sa network at i-save para sa susunod
      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // Option para sa Fallback kung talagang walang mahanap
    })
  );
});
