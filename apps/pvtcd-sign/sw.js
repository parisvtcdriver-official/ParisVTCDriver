/* PVTCD SIGN : service worker (offline complet + installable) */
var CACHE = 'pvtcd-sign-v2';
var CORE = ['./', './index.html', '../access-gate.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
var FONT_CSS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500;1,600&display=swap';

async function precache() {
  var c = await caches.open(CACHE);
  // App shell
  await c.addAll(CORE).catch(function () {});
  // Google Fonts : récupère la CSS, met en cache la CSS + chaque fichier de police
  try {
    var res = await fetch(FONT_CSS, { mode: 'cors' });
    if (res && res.ok) {
      await c.put(FONT_CSS, res.clone());
      var css = await res.text();
      var urls = (css.match(/url\(([^)]+)\)/g) || []).map(function (m) {
        return m.slice(4, -1).replace(/['"]/g, '');
      });
      await Promise.all(urls.map(function (u) {
        return fetch(u, { mode: 'cors' }).then(function (r) {
          if (r && (r.ok || r.type === 'opaque')) return c.put(u, r.clone());
        }).catch(function () {});
      }));
    }
  } catch (e) {}
}

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(precache());
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        try {
          var url = new URL(e.request.url);
          var keep = url.origin === location.origin ||
                     /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
          if (keep && (res.status === 200 || res.type === 'opaque')) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
        } catch (err) {}
        return res;
      }).catch(function () {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
