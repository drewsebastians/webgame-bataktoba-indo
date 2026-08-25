/* Service worker - Batak Toba Play
 * Strategies:
 *   - navigations (HTML): network-first, cache fallback, offline.html last resort
 *   - /assets/* + /data/published/*: stale-while-revalidate
 *   - everything else (incl. future ads/analytics hosts): network only
 * Old caches are deleted on activation. Bump CACHE_VERSION on every deploy
 * that changes precached content.
 */

const CACHE_VERSION = "btp-005ff7e9c78e";
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
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? (await caches.match("./offline.html")) ?? Response.error();
        }),
    );
    return;
  }

  if (isRuntimeCacheable(url)) {
    // stale-while-revalidate
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached ?? Response.error());
        return cached ?? network;
      }),
    );
  }
  // else: plain network request, no interception
});
