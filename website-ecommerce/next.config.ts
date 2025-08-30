/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/uploads/**',
      },
      // Voor productie (vervang met je VPS IP)
      {
        protocol: 'http',
        hostname: '', // bijvoorbeeld: '192.168.1.100'
        port: '9000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig