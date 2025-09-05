import { NextRequest } from "next/server";
import { authController } from "@/controllers/AuthController";

export async function GET(request: NextRequest) {
  return await authController.getCurrentUser(request);
}