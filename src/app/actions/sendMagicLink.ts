"use server";

import { randomUUID } from "crypto";
import { db } from "@/lib/db"; // Prisma ou outro ORM
import { sendEmail } from "@/lib/mailer"; // função custom p/ envio

export async function sendMagicLink(email: string, role: "guest" | "hotel" = "guest") {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min

  // Verificar se o modelo magicLink existe
  if (!(db as any).magicLink) {
    throw new Error("Modelo MagicLink não encontrado no Prisma Client");
  }

  await (db as any).magicLink.create({
    data: {
      email,
      token,
      expiresAt,
      role,
    },
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic?token=${token}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    to: email,
    subject: "Seu link mágico - CheckIn.com",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bem-vindo ao CheckIn.com!</h2>
        <p>Clique no botão abaixo para continuar seu cadastro:</p>
        <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Continuar Cadastro
        </a>
        <p style="color: #666; font-size: 14px;">
          Este link expira em 15 minutos. Se você não solicitou este cadastro, pode ignorar este email.
        </p>
      </div>
    `,
  });
}
