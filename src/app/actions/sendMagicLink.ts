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
      // role será definido pelo default no schema (GUEST)
    },
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic?token=${token}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    to: email,
    subject: "Seu link de cadastro - Express.com",
    html: `
      <div style="font-family: 'Raleway', sans-serif; max-width: 600px; margin: 0;">
        <h2 style="color: #1c398e;">Bem-vindo ao Express.com!</h2>
        <p style="font-size: 14px;">Para concluir seu cadastro e utilizar nossos serviços de Check-in antecipado em milhares de hotéis e acesso à informações incríveis, clique no botão abaixo e faça parte:</p>
        <a href="${link}" style="display: inline-block; background-color: #1c398e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Concluir Cadastro
        </a>
        <p style="color: #666; font-size: 14px;">
          Este link expira em 15 minutos. Se você não solicitou este cadastro, pode ignorar este email.
        </p>
      </div>
    `,
  });
}
