const withPlugins = require('next-compose-plugins');
const withBundleAnalazer = require('@next/bundle-analyzer');
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

const bundleAnalazer = withBundleAnalazer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

module.exports = withPlugins([bundleAnalazer], nextConfig);
// module.exports = nextConfig;
