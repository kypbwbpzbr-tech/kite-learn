/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: '/kite-learn',
  assetPrefix: '/kite-learn',
}

module.exports = nextConfig
