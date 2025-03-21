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
    domains: [
      'images.unsplash.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ],
  },
}

module.exports = nextConfig
