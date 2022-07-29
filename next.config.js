/** @type {import('next').NextConfig} */
import { join } from 'path';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ];
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [join(__dirname, 'styles')],
  },
};

export default nextConfig;
