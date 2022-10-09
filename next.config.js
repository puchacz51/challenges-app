/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.pl' }],
    domains: [
      'llryklqvbwstlcapwgav.supabase.co',
    ],
  },
};

module.exports = nextConfig;