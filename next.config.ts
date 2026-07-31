import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produit .next/standalone : un serveur autonome avec ses seules dépendances
  // utiles, ce qui permet une image Docker sans node_modules complet.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "media.pinterest.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.ngrok-free.app", "*.ngrok.io"],
    },
  },
  // Supprime les erreurs WebSocket HMR sur ngrok (dev only)
  devIndicators: false,
};

export default nextConfig;
