const runtimeCaching = [
  {
    urlPattern: /^https:\/\/(res\.cloudinary\.com|lh3\.googleusercontent\.com)\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'external-images',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === 'document',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages-cache',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-resources',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: /\/api\/.*$/,
    handler: 'NetworkFirst',
    method: 'GET',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: /\/api\/sync.*$/,
    handler: 'NetworkFirst',
    method: 'POST',
    options: {
      cacheName: 'sync-cache',
      networkTimeoutSeconds: 10,
      cacheableResponse: {
        statuses: [200],
      },
    },
  },
];

module.exports = runtimeCaching;
