// Spendr Service Worker
// Strategy: Network-first for app shell (always get latest), cache-first for CDN

const CACHE_NAME = 'spendr-v3';   // ← bumped: forces all devices to ditch old cache
const CDN_CACHE  = 'spendr-cdn-v2';

// CDN scripts — React, ReactDOM, Babel
const CDN_SCRIPTS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js',
];

// ── Install ────────────────────────────────────────────────
self.addEventListener('install', event => {
  // Skip waiting immediately so the new SW activates right away
  self.skipWaiting();
  event.waitUntil(
    caches.open(CDN_CACHE).then(cache =>
      Promise.allSettled(CDN_SCRIPTS.map(url =>
        fetch(url, { cache: 'force-cache' })
          .then(res => res.ok ? cache.put(url, res) : null)
          .catch(() => null)
      ))
    )
  );
});

// ── Activate: delete ALL old caches ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CDN_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())  // take control of all open tabs immediately
  );
});

// ── Fetch ──────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // CDN scripts: cache-first (they never change for a given URL)
  if (CDN_SCRIPTS.some(s => request.url === s)) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).then(res => {
          caches.open(CDN_CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
      )
    );
    return;
  }

  // App shell (index.html, manifest, icons): NETWORK-FIRST
  // This ensures every device always loads the latest deployed version
  event.respondWith(
    fetch(request)
      .then(res => {
        // Cache a fresh copy for offline fallback
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))  // offline fallback
  );
});
