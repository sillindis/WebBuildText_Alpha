const cacheName = "DefaultCompany-숏폼형 퀴즈 솔루션 왓퀴즈!-25.02.22.001";
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

self.addEventListener('fetch', function (e) {
    // Always try network first, fall back to cache if network fails
    e.respondWith(
        fetch(e.request)
            .catch(() => {
                return caches.match(e.request);
            })
    );
});