/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002', 'localhost:3003']
    },
    turbo: {
      rules: {
        // Configuración de Turbopack
      }
    }
  },
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
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
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
