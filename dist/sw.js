/* Service worker - Batak Toba Play
 * Strategies:
 *   - navigations (HTML): network-first, cache fallback, offline.html last resort
 *   - /assets/* + /data/published/*: stale-while-revalidate
 *   - everything else (incl. future ads/analytics hosts): network only
 * Old caches are deleted on activation. Bump CACHE_VERSION on every deploy
 * that changes precached content.
 */

const CACHE_VERSION = "btp-99ad841a6622";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = ["./", "./offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

function isRuntimeCacheable(url) {
  return (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/data/published/") ||
    url.pathname.endsWith(".webmanifest")
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return; // ads/analytics: never intercepted

  if (request.mode === "navigate") {
    const networkResponsePromise = fetch(request).then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(SHELL_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    });
    event.respondWith(
      networkResponsePromise.catch(async () => {
        const cached = await caches.match(request);
        return cached ?? (await caches.match("./offline.html")) ?? Response.error();
      }),
    );
    return;
  }

  if (isRuntimeCacheable(url)) {
    // stale-while-revalidate; keep background refresh alive until its cache write finishes.
    const cachePromise = caches.open(RUNTIME_CACHE);
    const networkResponsePromise = cachePromise.then(async (cache) => {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    });
    event.waitUntil(networkResponsePromise.then(() => undefined).catch(() => undefined));
    event.respondWith(
      cachePromise
        .then(async (cache) => {
          const cached = await cache.match(request);
          if (cached) return cached;
          try {
            return await networkResponsePromise;
          } catch {
            return Response.error();
          }
        })
        .catch(() => Response.error()),
    );
  }
  // else: plain network request, no interception
});
