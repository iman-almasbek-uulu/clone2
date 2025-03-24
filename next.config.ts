const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sitetrevel.online",
      },
      {
        protocol: "http", // Добавляем http
        hostname: "api.sitetrevel.online",
      },
      {
        protocol: "https",
        hostname: "*.api.sitetrevel.online",
      },
      {
        protocol: "http", // Для поддоменов с http
        hostname: "*.api.sitetrevel.online",
      },
    ],
  },
};

module.exports = nextConfig;