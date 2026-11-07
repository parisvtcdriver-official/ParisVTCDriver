// Service worker PRUDENT — ne met en cache QUE la coquille statique (même origine).
// Jamais de requête Supabase (cross-origin), jamais de données privées en cache.
const C = 'pvtcd-fleet-v10';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest',
               'icon-192.png', 'icon-512.png', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // Laisser passer au réseau sans jamais cacher : non-GET + tout ce qui n'est pas même origine
  // (donc toutes les requêtes Supabase: auth, base de données, stockage).
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Coquille statique : réseau d'abord, repli cache si hors-ligne.
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
