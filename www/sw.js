const CACHE_NAME="simulatore-gea-v5.13.0";
const APP_SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(async cache=>{
    await cache.addAll(APP_SHELL);
    // Il JSON è opzionale: la sua assenza non impedisce l'installazione.
    try{await cache.add("./data/domande.json")}catch(error){}
  }).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("simulatore-gea-v")&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET" || new URL(event.request.url).origin!==self.location.origin)return;
  if(new URL(event.request.url).pathname.endsWith("/data/domande.json")){
    event.respondWith(fetch(event.request).then(response=>{
      if(!response.ok)throw new Error("Banca dati non disponibile");
      const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response;
    }).catch(async()=>await caches.match(event.request)||new Response('{"error":"Banca dati offline non disponibile"}',{status:503,headers:{"Content-Type":"application/json"}})));
    return;
  }
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));
      return response;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});

self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting()});
