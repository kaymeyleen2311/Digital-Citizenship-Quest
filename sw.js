const CACHE_NAME = 'hero-hub-v3';

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
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2511/2511-preview.mp3',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Space+Grotesk:wght@700&display=swap',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Missions saved for offline use! 🚀');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === 'GET') {
            cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      console.log("Offline: Content not found.");
    })
  );
});
