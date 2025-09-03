import NextAuth from "next-auth"
import Email from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Email({
      server: process.env.EMAIL_SERVER, // ex: smtp://user:pass@smtp.mailtrap.io:2525
      from: process.env.EMAIL_FROM,     // ex: "CheckIn <no-reply@checkin.com>"
    }),
  ],
})
