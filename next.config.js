/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponents: true,
    // styledComponents: true
  },
  externals: {
    'supports-color': 'supports-color'
  },
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig
