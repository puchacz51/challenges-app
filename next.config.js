/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.co' }],
    domains: ['(oquugzeadwlzhzcgwish.supabase.co/'],
  },

};

module.exports = nextConfig;
