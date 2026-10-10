/* المختبر الافتراضي الذكي — service worker (offline cache) */
const CACHE='svl-8274d88eb4';
const ASSETS=['./', 'OrbitControls.js', 'README.md', 'RoomEnvironment.js', 'RoundedBoxGeometry.js', 'apple-touch-icon.png', 'changes.pdf', 'ibm-plex-mono-latin-500-normal.woff2', 'ibm-plex-mono-latin-600-normal.woff2', 'ibm-plex-sans-arabic-arabic-400-normal.woff2', 'ibm-plex-sans-arabic-arabic-500-normal.woff2', 'ibm-plex-sans-arabic-arabic-600-normal.woff2', 'ibm-plex-sans-arabic-latin-400-normal.woff2', 'ibm-plex-sans-arabic-latin-500-normal.woff2', 'ibm-plex-sans-arabic-latin-600-normal.woff2', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'manifest.webmanifest', 'osmosis.pdf', 'ph.pdf', 'photosynthesis.pdf', 'readex-pro-arabic-500-normal.woff2', 'readex-pro-arabic-600-normal.woff2', 'readex-pro-arabic-700-normal.woff2', 'readex-pro-latin-500-normal.woff2', 'readex-pro-latin-600-normal.woff2', 'readex-pro-latin-700-normal.woff2', 'three.min.js', 'index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html',{ignoreSearch:true})));return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})));
});
