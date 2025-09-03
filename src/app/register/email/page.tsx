// app/register/email/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerEmailSchema, RegisterEmailInput } from "@/schemas/registerEmail";
import { sendMagicLink } from "@/app/actions/sendMagicLink";
import { useState } from "react";

export default function RegisterEmailPage() {
  const [sent, setSent] = useState(false);

  const form = useForm<RegisterEmailInput>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: RegisterEmailInput) => {
    await sendMagicLink(data.email);
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      {!sent ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-xl font-semibold">Inicie seu cadastro</h1>
          <input
            type="email"
            {...form.register("email")}
            placeholder="Seu e-mail"
            className="w-full border p-2 rounded"
          />
          {form.formState.errors.email && (
            <p className="text-red-500">{form.formState.errors.email.message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Enviar link mágico
          </button>
        </form>
      ) : (
        <p className="text-green-600">
          Verifique seu e-mail, enviamos o link mágico ✨
        </p>
      )}
    </div>
  );
}
