const CACHE_VERSION = "v1";
const cacheName = "DefaultCompany-숏폼형 퀴즈 솔루션 왓퀴즈!-25.02.20.001" + "-" + CACHE_VERSION;
const contentToCache = [
    "Build/WebBuildText_Alpha.loader.js",
    "Build/WebBuildText_Alpha.framework.js.unityweb",
    "Build/WebBuildText_Alpha.data.unityweb",
    "Build/WebBuildText_Alpha.wasm.unityweb",
    "TemplateData/style.css"
];

// Install event - caches app shell files
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    // Force new service worker to activate immediately
    self.skipWaiting();
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching app shell and content');
      await cache.addAll(contentToCache);
    })());
});

// Activate event - clean up old caches
self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
    
    // Take control of uncontrolled clients immediately
    self.clients.claim();
    
    e.waitUntil((async function() {
        // Get all cache keys
        const cacheKeys = await caches.keys();
        
        // Delete old caches with the same base name
        const cachesToDelete = cacheKeys.filter(key => {
            return key.startsWith("DefaultCompany-숏폼형 퀴즈 솔루션 왓퀴즈!") && key !== cacheName;
        });
        
        return Promise.all(cachesToDelete.map(function(cacheToDelete) {
            console.log('[Service Worker] Removing old cache:', cacheToDelete);
            return caches.delete(cacheToDelete);
        }));
    })());
});

// Fetch event with network-first strategy
self.addEventListener('fetch', function (e) {
    // Skip cross-origin requests
    if (!e.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    // Handle Unity WebGL resources with a network-first approach
    e.respondWith((async function () {
        try {
            // Try network first
            console.log(`[Service Worker] Fetching resource from network: ${e.request.url}`);
            const networkResponse = await fetch(e.request, { 
                cache: 'no-store',  // Don't use HTTP cache
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            // Cache the new version for offline use
            const cache = await caches.open(cacheName);
            cache.put(e.request, networkResponse.clone());
            
            return networkResponse;
        } catch (error) {
            // If network fails, try the cache
            console.log(`[Service Worker] Network request failed, using cache for: ${e.request.url}`);
            const cachedResponse = await caches.match(e.request);
            
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // If not in cache either, show an error
            console.error(`[Service Worker] Resource not in cache and network unavailable: ${e.request.url}`);
            throw error;
        }
    })());
});