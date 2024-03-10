const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  './school-vue-app/index.html',
  './school-vue-app/src/assets/main.css',
  './school-vue-app/src/main.js',
  './school-vue-app/src/App.vue',
  './school-vue-app/src/components/Checkout.vue',
  './school-vue-app/src/components/ProductList.vue'
  // Add other local files you want to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cachedFile) {
      // if the file is in the cache, retrieve it from there
      if (cachedFile) {
        console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
        return cachedFile;
      } else { // if the file is not in the cache, download the file
        return fetch(e.request).then(function (response) {
          return caches.open(CACHE_NAME).then(function (cache) { // Fix: use CACHE_NAME here
            // add the new file to the cache
            cache.put(e.request, response.clone());
            console.log("[Service Worker] Resource fetched and saved in the cache for: " +
              e.request.url);
            return response;
          });
        });
      }
    })
  );
});
