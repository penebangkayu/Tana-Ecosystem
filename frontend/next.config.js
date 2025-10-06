const createNextIntlPlugin = require('next-intl/plugin');

// arahkan plugin ke file request
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "www.binance.com",
      },
      {
        protocol: "https",
        hostname: "indodax.com",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
