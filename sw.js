const CACHE_NAME = 'hero-hub-forever-v13';
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
  './tailwind.js', 
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
];

// INSTALL: Sapilitang pag-save ng lahat ng files.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Baon is ready! 100% Offline Enabled. 🚀');
      return Promise.allSettled(
        assets.map(url => cache.add(url).catch(err => console.log('Missing file: ' + url)))
      );
    })
  );
});

// ACTIVATE: Burahin ang lahat ng lumang version para hindi mag-clog.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// FETCH: "CACHE-FIRST" STRATEGY (Ang sikreto sa forever offline)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Kung may "baon" sa storage, ibigay agad (0 seconds waiting)
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Kung wala sa baon, saka lang kukuha sa internet
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
