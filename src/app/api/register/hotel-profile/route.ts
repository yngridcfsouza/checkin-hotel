import { NextRequest } from "next/server";
import { userController } from "@/controllers/UserController";

export async function POST(req: NextRequest) {
  return await userController.createHotelProfile(req);
}
