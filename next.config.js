/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Fügen Sie hier weitere benötigte Domains hinzu
    ],
  },
}

module.exports = nextConfig 