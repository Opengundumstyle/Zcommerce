/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript:{
    ignoreBuildErrors:true,
  },
  images:{domains:['lh3.googleusercontent.com','files.stripe.com','avatars.githubusercontent.com','images.unsplash.com','res.cloudinary.com','i.scdn.co','mosaic.scdn.co','seed-mix-image.spotifycdn.com','newjams-images.scdn.co','blend-playlist-covers.spotifycdn.com','seeded-session-images.scdn.co']}
}

module.exports = nextConfig
