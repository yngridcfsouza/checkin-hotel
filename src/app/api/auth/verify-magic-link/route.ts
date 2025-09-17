import { NextRequest } from "next/server";
import { authController } from "@/controllers/AuthController";
import { withRateLimit, authRateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  return await withRateLimit(req, authRateLimiter, async (request) => {
    return await authController.verifyMagicLink(request);
  });
}
