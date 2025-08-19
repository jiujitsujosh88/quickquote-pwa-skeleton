// service-worker.js — App Shell Cache
const CACHE_NAME = 'qqpwa-v1';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js'
  // add './manifest.json' and icon files later if desired
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Cache-first for app shell, network-first for others
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isShell = APP_SHELL.some((p) => url.pathname.endsWith(p.replace('./','/')));
  if (isShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});