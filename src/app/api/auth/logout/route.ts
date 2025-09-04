import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    });

    // Remover o cookie de autenticação
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expira imediatamente
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}