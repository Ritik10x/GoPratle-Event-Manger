/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",      // 👈 REQUIRED for Netlify
  images: {
    unoptimized: true,   // 👈 REQUIRED for Netlify
  },
};

module.exports = nextConfig;
