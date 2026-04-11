const CACHE = 'vs-planung-v3';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./index.html','./manifest.json'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.url.includes('api.anthropic.com') || e.request.url.includes('fonts.')) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp&&resp.ok&&resp.type==='basic'){const c=resp.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));}
    return resp;
  }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
