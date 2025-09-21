import { NextRequest } from "next/server";
import { authController } from "@/controllers/AuthController";
import { withRateLimit, magicLinkRateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  return await withRateLimit(req, magicLinkRateLimiter, async (request) => {
    // Adicionar isLogin: false ao body da requisição (padrão para registro)
    const body = await request.json();
    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify({ ...body, isLogin: false }),
    });
    
    return await authController.sendMagicLink(modifiedRequest as NextRequest);
  });
}
