// Generated cache name and asset list are tied to the complete Pages build.
const CACHE='formula-bloom:'+new URL('./',self.location.href).pathname+':859372604da7e5d1', ASSETS=["app.js","assets/flowers/camellia.jpg","assets/flowers/chamomile.jpg","assets/flowers/hydrangea.jpg","assets/flowers/lavender.jpg","assets/flowers/lily.jpg","assets/flowers/orchid.jpg","assets/flowers/rose.jpg","assets/flowers/sunflower.jpg","assets/flowers/wildflower.jpg","assets/icons/apple-touch-icon.png","assets/icons/icon-192.png","assets/icons/icon-512.png","assets/icons/icon-maskable-512.png","assets/realistic-flower.png","barcode-reconciliation.js","brand-coverage.json","brand-directory.js","brand-product-registration.json","brand-research-queue.json","brand-source-audit.json","engine.js","facts-index.js","flower-photos.js","flower-types.js","formula-archive.js","formula-intent.js","formula-records.json","formula-signature-v60.js","history-ui.js","history.js","inci-reference-evidence.js","inci-reference-evidence.json","index.html","inference-evidence.js","inference-flower.js","japan-market-policy.js","japan-market.js","japanese.js","maker-brand-directory.json","manifest.webmanifest","my-formulas.js","ocr-review.js","partial-ingredient-evidence.js","partial-ingredient-evidence.json","photo-credits.html","privacy.html","product-families.js","product-identity.js","product-query.js","provenance.js","pwa.js","reference-brand-catalog.json","registered-products.js","research-assist.js","retail-channel-review.js","roundlab-label-review.js","share.js","shared-source.js","sku-evidence.js","sku-evidence.json","static-api.js","style.css","terms.html","theme-elegant.css","unresolved-ingredients.js"];
const BASE=new URL('./',self.location.href);
const PREFIX='formula-bloom:'+BASE.pathname+':';
const urls=ASSETS.map(path=>new URL(path,BASE).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{
  await cache.addAll(urls.map(url=>new Request(url,{cache:'reload'})));
  // Switch only after the complete new snapshot is available. Do not reload open
  // pages or touch localStorage; they keep their current in-progress input.
  await self.skipWaiting();
 }catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{
 if(event.data?.type==='APPLY_UPDATE')event.waitUntil(self.skipWaiting());
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 if(url.pathname===BASE.pathname)url.pathname+='index.html';
 url.search='';url.hash='';
 if(!urls.includes(url.href))return; // No API, third-party requests, or user content.
 event.respondWith((async()=>{
  const cached=await (await caches.open(CACHE)).match(url.href);
  return cached||fetch(event.request);
 })());
});
