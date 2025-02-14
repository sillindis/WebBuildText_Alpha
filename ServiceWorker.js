const cacheName = "DefaultCompany-숏폼형 퀴즈 솔루션 왓퀴즈!-25.02.14.001";

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    self.skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
    // 기존 캐시 모두 삭제
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                return caches.delete(key);
            }));
        })
    );
});

self.addEventListener('fetch', function (e) {
    // 캐시를 사용하지 않고 항상 네트워크에서 새로 로드
    e.respondWith(
        fetch(e.request, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).catch(function() {
            console.log('[Service Worker] Fetch failed');
            return new Response('Fetch failed');
        })
    );
});