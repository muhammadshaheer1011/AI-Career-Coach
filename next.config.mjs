/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**', // Allow all portrait paths
      },
    ],
  },

  // Good practice settings
  reactStrictMode: true,
};

export default nextConfig;
