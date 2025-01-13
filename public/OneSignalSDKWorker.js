// OneSignalSDKWorker.js
// eslint-disable-next-line no-undef
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");


// PWA Service Worker
// const DYNAMIC_CACHE = 'dynamic-cache-v1';

// self.addEventListener('fetch', event => {
//   if (event.request.method !== 'GET') return;

//   if (event.request.url.includes('/api')) {
//     event.respondWith(
//       fetch(event.request).then(networkResponse => {
//         return caches.open(DYNAMIC_CACHE).then(cache => {
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse;
//         });
//       }).catch(() => caches.match(event.request))
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then(response => {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });
