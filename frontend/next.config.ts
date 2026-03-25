import type { NextConfig } from "next";

const getNgrokHost = () => {
  if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('ngrok')) {
    try { return new URL(process.env.FRONTEND_URL).hostname; } catch {}
  }
  return 'citeable-venus-apt.ngrok-free.dev';
};

const nextConfig: NextConfig = {
  // Permite conexões do ngrok para funcionar o Hot-Reload e Requisições do Next.js
  allowedDevOrigins: [getNgrokHost(), 'citeable-venus-apt.ngrok-free.dev'],
} as any;
export default nextConfig;
