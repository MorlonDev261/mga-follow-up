const CACHE_NAME = "offline-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const STATIC_ASSETS = ["/", "/_next/static/", "/images/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Gestion des API en IndexedDB
  if (request.url.includes("/api/")) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Mise en cache des fichiers statiques
  if (STATIC_ASSETS.some((path) => url.pathname.startsWith(path))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    saveApiData(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Données hors ligne non disponibles", { status: 503 });
  }
}

async function saveApiData(request, response) {
  const db = await openDatabase();
  const data = await response.json();
  const tx = db.transaction("api-cache", "readwrite");
  const store = tx.objectStore("api-cache");
  store.put({ url: request.url, data });
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("offline-db", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("api-cache")) {
        db.createObjectStore("api-cache", { keyPath: "url" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
