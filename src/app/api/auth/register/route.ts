import { NextRequest, NextResponse } from "next/server";
import { registerEmailSchema } from "@/schemas/registerEmail";
import { sendMagicLink } from "@/app/actions/sendMagicLink";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = registerEmailSchema.parse(body);

    // Enviar magic link por email com o role especificado
    await sendMagicLink(parsed.email, parsed.role);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration error" }, { status: 500 });
  }
}
