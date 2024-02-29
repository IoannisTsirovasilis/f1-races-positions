/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPEN_F1_URL: process.env.OPEN_F1_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.formula1.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
