import { RegisterForm } from "@/components/register-form"
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import z from "zod"

const schema = z.object({
  name: z.string("O nome deve ter pelo menos 2 caracteres").min(2),
  email: z.email("E-mail inválido").min(5),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não coincidem",
});

export default function Page() {
  async function registerAction(formData: FormData) {
    'use server';

    const { success, data } = schema.safeParse(Object.fromEntries(formData));

    if (!success) {
      return;
    }

    const { name, email, password } = data;
    const hashedPassword = await hash(password, 12);

    await db.user.create({
      data: { name, email, password: hashedPassword }
    })
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm registerAction={registerAction}/>
      </div>
    </div>
  )
}
