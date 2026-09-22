const CACHE='science-hub-v6-live-html';

const SHELL=[
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys
          .filter(k=>k!==CACHE)
          .map(k=>caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;

  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;

  const isHtml=
    e.request.mode==='navigate' ||
    u.pathname.endsWith('.html');

  if(isHtml){
    e.respondWith(
      fetch(e.request,{cache:'no-store'})
        .then(r=>r)
        .catch(async()=>{
          return await caches.match(e.request) ||
                 await caches.match('./index.html');
        })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached=>
      cached ||
      fetch(e.request).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return r;
      })
    )
  );
});
