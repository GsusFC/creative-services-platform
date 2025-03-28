/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
    turbo: {
      rules: {}
    }
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'i.vimeocdn.com',
      'player.vimeo.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vimeocdn.com'
      },
      {
        protocol: 'https',
        hostname: '**.vimeo.com'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        needle: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        os: false,
        url: false,
        assert: false,
        util: false,
        buffer: false,
        querystring: false
      };
    }
    return config;
  }
}

export default config;
