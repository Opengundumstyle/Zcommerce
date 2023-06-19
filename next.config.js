/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript:{
    ignoreBuildErrors:true,
  },
  images:{domains:['lh3.googleusercontent.com','files.stripe.com','avatars.githubusercontent.com','images.unsplash.com','res.cloudinary.com','i.scdn.co']}
}

module.exports = nextConfig
