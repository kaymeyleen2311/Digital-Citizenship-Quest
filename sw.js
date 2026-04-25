const CACHE_NAME = 'hero-hub-v80'; // Palaging taasan ang number (v80, v81...) para mag-force update ang phone
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

// 1. INSTALL: Dito dina-download lahat ng files
self.addEventListener('install', e => {
  self.skipWaiting(); // PINAKA-IMPORTANTE: Pinipilit ang phone na i-update agad ang app
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Offline system: Downloading assets...');
      return cache.addAll(assets);
    })
  );
});

// 2. ACTIVATE: Binubura ang mga lumang v30, v25, etc. para hindi bumigat ang phone
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Pinipilit kontrolin ang page agad-agad
  );
});

// 3. FETCH: Eto yung "Forever Offline" strategy
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Kung nasa cache (baon), ibigay agad. Walang loading, walang "Try Again".
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Kung wala sa cache, tsaka lang kukuha sa internet at ise-save uli
      return fetch(e.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Fallback: Kung offline at wala sa cache, pwede mong ibalik yung main index.html
        if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
        }
      });
    })
  );
});
