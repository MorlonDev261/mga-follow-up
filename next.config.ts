const runtimeCaching = require('src/lib/cache'); // ou './lib/cache' si tu l’as mis ailleurs
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production',
  runtimeCaching,
  // "buildExcludes: [/middleware-manifest\.json$/], // optionnel si tu as des erreurs de build
});

const nextConfig = {
  reactStrictMode: true,
  trustedHosts: [
    'mga-follow-up.vercel.app',
    'localhost:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
