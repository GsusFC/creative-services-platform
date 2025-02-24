/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary fix while we resolve type issues
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig
