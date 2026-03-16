import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Forzamos la desactivación de turbopack en build si es que está activo por defecto
  }
};

export default nextConfig;
