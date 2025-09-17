import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configurações de segurança
  poweredByHeader: false, // Remove o header X-Powered-By
  
  // Headers de segurança globais
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
  
  // Configurações experimentais para melhor performance
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
};

export default nextConfig;
