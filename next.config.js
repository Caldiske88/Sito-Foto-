/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'imgbb.com', 'i.ibb.co'],
  },
};

module.exports = nextConfig;
