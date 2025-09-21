import { NextRequest } from 'next/server';
import { authController } from '@/controllers/AuthController';
import { withRateLimit, magicLinkRateLimiter } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  return await withRateLimit(request, magicLinkRateLimiter, async () => {
    // Adicionar isLogin: true ao body da requisição
    const body = await request.json();
    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify({ ...body, isLogin: true }),
    });
    
    return await authController.sendMagicLink(modifiedRequest as NextRequest);
  });
}