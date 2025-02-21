const cacheName = "DefaultCompany-숏폼형 퀴즈 솔루션 왓퀴즈!-25.02.21.001";
const contentToCache = [
    "Build/WebBuildText_Alpha.loader.js",
    "Build/WebBuildText_Alpha.framework.js.unityweb",
    "Build/WebBuildText_Alpha.data.unityweb",
    "Build/WebBuildText_Alpha.wasm.unityweb",
    "TemplateData/style.css"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil((async function () {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if(key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (e) {
    // Skip the cache for Unity build files
    if (e.request.url.includes('Build/') || e.request.url.includes('TemplateData/')) {
        e.respondWith(
            fetch(e.request)
        );
        return;
    }

    // For other resources, use the cache-first strategy
    e.respondWith((async function () {
        const r = await caches.match(e.request);
        if (r) { return r; }
        
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
    })());
});