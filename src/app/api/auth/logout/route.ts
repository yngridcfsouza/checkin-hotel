import { NextRequest } from "next/server";
import { authController } from "@/controllers/AuthController";
import { withRateLimit, generalRateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  return await withRateLimit(req, generalRateLimiter, async () => {
    return await authController.logout();
  });
}