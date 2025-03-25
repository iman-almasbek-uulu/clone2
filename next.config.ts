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
    domains: ['maps.googleapis.com'],
  },
  experimental: {
    modularizeImports: {
      'lodash': {
        transform: 'lodash/{{member}}',
      },
      'lodash.debounce': {
        transform: 'lodash.debounce',
      },
    },
  },
};

module.exports = nextConfig;