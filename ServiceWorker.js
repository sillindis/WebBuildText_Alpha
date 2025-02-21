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
    // 캐시 설치 과정 스킵
    self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        fetch(e.request)
            .then(function(response) {
                return response;
            })
            .catch(function() {
                // 네트워크 요청 실패시에만 캐시 사용
                return caches.match(e.request);
            })
    );
});

// 이전 캐시 정리
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});