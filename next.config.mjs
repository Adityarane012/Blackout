import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // In production, set BACKEND_URL to your Render/Railway URL (e.g. https://blackout-api.onrender.com)
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/v1/:path*',
        destination: `${backendUrl}/v1/:path*` // Proxy to Backend
      }
    ]
  }
}

export default nextConfig
