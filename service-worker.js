// service-worker.js — robust for GitHub Pages subpaths
const VERSION = 'v6';
const CACHE_NAME = `qq-shell-${VERSION}`;

// Resolve absolute URLs relative to SW location (handles /user/repo/)
const BASE = new URL('./', self.location).href;
const ABS = p => new URL(p, BASE).toString();

const SHELL = [
  ABS('index.html'),
  ABS('style.css'),
  ABS('app.js'),
  ABS('manifest.json')
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// For navigations, serve index.html from cache (SPA offline)
async function handleNavigation(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(ABS('index.html'));
  return cached || fetch(req);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigations -> serve shell
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Cache-first for known shell files
  if (SHELL.includes(url.toString())) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
    return;
  }

  // Network-first for other same-origin requests, fallback to cache
  event.respondWith(
    fetch(request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request))
  );
});