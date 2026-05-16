/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co',
      'via.placeholder.com',
      'images.unsplash.com',
      'drive.google.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'imgur.com',
      'i.imgur.com',
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactStrictMode: true,
}

module.exports = nextConfig
