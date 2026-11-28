/* Service worker — by Lollo ®2026
   1. tiene sul telefono i file dell'app: si apre anche senza rete;
   2. si accorge delle nuove versioni (cambia versione.js) e aspetta il pulsante «Aggiorna».
   L'elenco dei file qui sotto lo scrive crea_pwa_zip.py a ogni versione. */
importScripts('versione.js'); // definisce self.VERSIONE

const CACHE =( 'gestore-gpx-' + self.VERSIONE)+'-brand-20261128';
const FILE = ['./lollo-logo.png',
  "geomagnetism.js",
  "zone.js",
  "sentieri-vda-2026-11-17.json",
  "icone/icona-192.png",
  "icone/icona-512.png",
  "icone/icona-maskable-512.png",
  "index.html",
  "manifest.webmanifest",
  "pwa.js",
  "versione.js"
];

self.addEventListener('install', (e) => {
  // cache: 'reload' = scarica davvero i file nuovi, saltando la cache del browser
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILE.map((f) => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (nome.startsWith('gestore-gpx-') && nome !== CACHE) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  const tipo = e.data && e.data.tipo;
  if (tipo === 'versione' && e.ports[0]) e.ports[0].postMessage(self.VERSIONE);
  if (tipo === 'attiva') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // altri siti: rete normale
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const inCache = req.mode === 'navigate' ? await cache.match('index.html')
      : await cache.match(req, { ignoreSearch: true });
    return inCache || fetch(req);
  })());
});
