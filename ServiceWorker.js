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
    // 기존 캐시 삭제
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    return caches.delete(cache);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    // 네트워크 우선 전략으로 변경
    e.respondWith(
        fetch(e.request)
            .then(function(response) {
                return response;
            })
            .catch(function() {
                return caches.match(e.request);
            })
    );
});