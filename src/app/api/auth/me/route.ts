import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Buscar dados completos do usuário no banco
    const fullUser = await db.user.findUnique({
      where: { id: user.userId },
      include: {
        guest: true,
        hotel: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Retornar dados do usuário (sem senha)
    const { password, ...userWithoutPassword } = fullUser;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}