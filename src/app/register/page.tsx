'use client'
import { RegisterForm } from "@/components/register-form"
import { registerSchema, RegisterSchema } from "@/schemas/registerSchema";

export default function Register() {

  async function registerAction(data: RegisterSchema) {
    const parsed = registerSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error("Dados inválidos")
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })

    if (!res.ok) throw new Error("Erro ao registrar")

    return "success"
  }

  return <RegisterForm registerAction={registerAction} />
}
