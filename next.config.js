/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    return config
  },

  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
