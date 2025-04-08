// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true, // ✅ Required for App Router
    },
  };
  
  module.exports = nextConfig;
  