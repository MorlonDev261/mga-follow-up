const runtimeCaching = [
  {
    urlPattern: /^https:\/\/(res\.cloudinary\.com|lh3\.googleusercontent\.com)\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'external-images',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
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
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
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
];

module.exports = runtimeCaching;
