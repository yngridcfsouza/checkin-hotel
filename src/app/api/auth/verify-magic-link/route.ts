import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signIn } from "next-auth/react";

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar o magic link no banco
    if (!(db as any).magicLink) {
      return NextResponse.json(
        { error: "Modelo MagicLink não encontrado" },
        { status: 500 }
      );
    }

    const magicLink = await (db as any).magicLink.findFirst({
      where: {
        token,
        email,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!magicLink) {
      return NextResponse.json(
        { error: "Link inválido ou expirado" },
        { status: 400 }
      );
    }

    // Marcar o magic link como usado
    await (db as any).magicLink.update({
      where: { id: magicLink.id },
      data: { used: true },
    });

    // Verificar se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Se o usuário já existe, fazer login
      return NextResponse.json({
        success: true,
        action: "login",
        message: "Login realizado com sucesso",
      });
    }

    // Buscar o magic link novamente para obter o role
    const magicLinkWithRole = await (db as any).magicLink.findFirst({
      where: { token, email },
      select: { role: true }
    });
    
    const role = magicLinkWithRole?.role || "guest";
    
    // Se não existe, redirecionar para completar cadastro com base no role
    return NextResponse.json({
      success: true,
      action: "register",
      message: "Email verificado. Complete seu cadastro.",
      email,
      role,
    });
  } catch (error) {
    console.error("Erro ao verificar magic link:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
