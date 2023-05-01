/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'oquugzeadwlzhzcgwish.supabase.co',
      'avatars.githubusercontent.com',
    ],
  },
};

module.exports = nextConfig;
