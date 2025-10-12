const CACHE_NAME = 'stylus-calc-cache-v1';
const PRECACHE_URLS = [
  '.', // index.html
  'index.html',
  'manifest.json',
  // иконки, если есть
  'icons/icon-192.png',
  'icons/icon-512.png'
  // если добавишь внешние ресурсы (tfjs), их можно тоже кэшировать при необходимости
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).catch(()=>{})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // network-first for API? For simple app we use cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // optionally cache new requests for offline use (only successful responses)
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const respClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, respClone).catch(()=>{});
        });
        return response;
      }).catch(() => {
        // fallback: return a simple Response for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
        return new Response('', { status: 503, statusText: 'offline' });
      });
    })
  );
});
