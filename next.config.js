/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/dg0cmj6su/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Remove eslint ignore - fix ESLint errors instead
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },

  compiler: {
    // Remove unused CSS in production
    removeConsole: process.env.NODE_ENV === "production",
    styledComponents: true,
  },

  // Enable internationalization
  i18n: {
    locales: ["en", "ko", "zh-CN", "ja", "vi", "es", "ru"],
    defaultLocale: "en",
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Compress output
  compress: true,

  // Generate static pages where possible
  output: "export",
  trailingSlash: true,

  // Bundle analyzer
  ...withBundleAnalyzer({}),
};

module.exports = nextConfig;
