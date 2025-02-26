import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Permite imagens de perfis do Google
  },
};

export default nextConfig;
