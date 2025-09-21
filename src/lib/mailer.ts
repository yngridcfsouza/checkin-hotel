import nodemailer from "nodemailer";

/* Atenção:
Use 'rejectUnauthorized: false' apenas em desenvolvimento.
Em produção, o ideal é corrigir o problema de certificado. */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false, // para porta 587
  tls: {
    rejectUnauthorized: false,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "Express.com <no-reply@express.com>",
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Erro detalhado ao enviar email:", error);
    throw new Error(`Falha ao enviar email: ${error}`);
  }
}
