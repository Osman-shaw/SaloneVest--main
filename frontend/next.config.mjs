/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /** Hides the floating Next.js "N" dev indicator (development only). */
  devIndicators: false,
}

export default nextConfig
