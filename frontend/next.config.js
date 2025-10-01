/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com", // domain lama CoinGecko
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com", // domain baru CoinGecko
      },
      {
        protocol: "https",
        hostname: "www.binance.com", // jaga2 Binance
      },
      {
        protocol: "https",
        hostname: "indodax.com", // jaga2 Indodax
      },
    ],
  },
};

module.exports = nextConfig;
