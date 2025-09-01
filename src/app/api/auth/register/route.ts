import { createGuest, createHotel } from "@/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.role === "GUEST") {
      const user = await createGuest(body);
      return NextResponse.json({ message: "Guest registered successfully", user });
    }

    if (body.role === "HOTEL") {
      const user = await createHotel(body);
      return NextResponse.json({ message: "Hotel registered successfully", user });
    }

    return NextResponse.json(
      { error: "Invalid role" },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration error" }, { status: 500 });
  }
}
