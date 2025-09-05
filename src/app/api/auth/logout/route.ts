import { authController } from "@/controllers/AuthController";

export async function POST() {
  return await authController.logout();
}