import { NextRequest } from "next/server";
import { authController } from "@/controllers/AuthController";
import { withRateLimit, generalRateLimiter } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  return await withRateLimit(request, generalRateLimiter, async (req) => {
    return await authController.getCurrentUser(req);
  });
}