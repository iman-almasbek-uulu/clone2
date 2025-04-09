const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sitetrevel.online",
      },
      {
        protocol: "http",
        hostname: "api.sitetrevel.online",
      },
      {
        protocol: "https",
        hostname: "*.api.sitetrevel.online",
      },
      {
        protocol: "http",
        hostname: "*.api.sitetrevel.online",
      },
    ],
    domains: ['maps.googleapis.com'],
  },
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
    'lodash.debounce': {
      transform: 'lodash.debounce',
    },
  },
  experimental: {
  }
};

module.exports = nextConfig;