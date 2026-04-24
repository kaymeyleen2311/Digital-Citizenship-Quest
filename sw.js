const CACHE_NAME = 'hero-hub-v11'; // In-update sa v11 para mag-refresh ang cache
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

// Install: Sine-save ang lahat ng files sa phone
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Gagamit ng Promise.allSettled para hindi mag-error ang buong caching kung may kulang na file
      return Promise.allSettled(assets.map(url => cache.add(url)));
    })
  );
});

// Activate: Nililinis ang lumang version
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Fetch: "Offline-First" Strategy na may fixed cloning logic
self.addEventListener('fetch', event => {
  // Huwag pansinin ang mga request na hindi GET (gaya ng analytics)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // SIGURADUHIN na valid ang response bago i-cache
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // FIX: I-clone ang response AGAD bago ito gamitin o ibalik
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Kung offline at walang internet, at navigation request ito, ipakita ang index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      // Ipakita ang cached version kung meron (Fast Load), kung wala, hintayin ang network
      return cachedResponse || fetchPromise;
    })
  );
});
