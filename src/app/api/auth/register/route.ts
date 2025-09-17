import { NextRequest } from "next/server";
import { authController } from "@/controllers/AuthController";
import { withRateLimit, magicLinkRateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  return await withRateLimit(req, magicLinkRateLimiter, async (request) => {
    return await authController.sendMagicLink(request);
  });
}
