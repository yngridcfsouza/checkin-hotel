import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const guestProfileSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().length(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento obrigatória"),
  email: z.email("Email inválido"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = guestProfileSchema.parse(body);

    // Verificar se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário já existe" },
        { status: 400 }
      );
    }

    // Gerar senha temporária (será substituída por magic link)
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Criar usuário
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "GUEST",
      },
    });

    // Criar perfil de guest
    const guest = await db.guest.create({
      data: {
        cpf: validatedData.cpf,
        birthDate: new Date(validatedData.birthDate),
        phone: validatedData.phone,
        userId: user.id,
      },
    });

    // Atualizar referência do user para guest
    await db.user.update({
      where: { id: user.id },
      data: { guestId: guest.id },
    });

    // Gerar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        guestId: guest.id,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Criar resposta com cookie httpOnly
    const response = NextResponse.json({
      success: true,
      message: "Cadastro realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Configurar cookie httpOnly
    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no cadastro de guest:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
