import { NextRequest } from "next/server";
import { userController } from "@/controllers/UserController";
import { withRateLimit, registerRateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  return await withRateLimit(req, registerRateLimiter, async (request) => {
    return await userController.createGuestProfile(request);
  });
}
