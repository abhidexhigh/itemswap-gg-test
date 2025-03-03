/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/dg0cmj6su/**",
      },
    ],
    // unoptimized: true,
  },
  reactStrictMode: false,
  // swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  // i18n: {
  //   locales: ["en", "ko", "zh-CN", "ja", "vi", "es", "ru"],
  //   defaultLocale: "en",
  // },
};

module.exports = nextConfig;
