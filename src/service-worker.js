// /// <reference lib="webworker" />
// import { build } from '$service-worker';
// const timestamp = +new Date();

// const cacheKey = `cache@${timestamp}`;

// const toCache = build
//   .concat('/index.html', '/', '/new', '/saves', '/game', '/box')
//   .concat('/api/pokemon.json', '/assets/pokemon.css', '/assets/items.css');

// const staticAssets = new Set(toCache);

// self.addEventListener('install', (evt) => {
//   evt.waitUntil(
//     caches
//       .open(cacheKey)
//       .then((c) => c.addAll(toCache))
//       .then(() => self.skipWaiting())
//       .catch((e) => console.error(e))
//   );
// });

// self.addEventListener('activate', (evt) => {
//   evt.waitUntil(
//     caches
//       .keys()
//       .then((keys) =>
//         Promise.all(
//           keys
//             .filter((key) => key !== cacheKey)
//             .map((key) => caches.delete(key))
//         )
//       )
//       .then(() => self.clients.claim())
//   );
// });

// /**
//  * Fetch the asset from the network and store it in the cache.
//  * Fall back to the cache if the user is offline.
//  */
// async function fetchAndCache(request) {
//   const cache = await caches.open(`offline${timestamp}`);

//   try {
//     const response = await fetch(request);
//     cache.put(request, response.clone());
//     return response;
//   } catch (err) {
//     const response = await cache.match(request);
//     if (response) return response;

//     throw err;
//   }
// }

// self.addEventListener('fetch', (event) => {
//   if (event.request.method !== 'GET' || event.request.headers.has('range'))
//     return;

//   const url = new URL(event.request.url);

//   // don't try to handle e.g. data: URIs
//   const isHttp = url.protocol.startsWith('http');
//   const isDevServerRequest =
//     url.hostname === self.location.hostname && url.port !== self.location.port;
//   const isStaticAsset =
//     url.host === self.location.host && staticAssets.has(url.pathname);
//   const skipBecauseUncached =
//     event.request.cache === 'only-if-cached' && !isStaticAsset;

//   if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
//     event.respondWith(
//       (async () => {
//         const cachedAsset =
//           isStaticAsset && (await caches.match(event.request));
//         return cachedAsset || fetchAndCache(event.request);
//       })()
//     );
//   }
// });
