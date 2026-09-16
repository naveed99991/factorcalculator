/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — no server runtime needed.
  // Every page is pre-rendered, so Cloudflare serves plain files from its CDN.
  output: 'export',

  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,

  images: {
    // Static export can't use the Next.js image optimizer
    unoptimized: true,
  },

  // headers() and redirects() don't run in static export.
  // Cloudflare handles both via public/_headers and public/_redirects.
};

module.exports = nextConfig;