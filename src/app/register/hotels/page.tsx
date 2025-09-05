"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerEmailSchema, RegisterEmailInput } from "@/schemas/registerEmail";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

export default function HotelRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<RegisterEmailInput>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: {
      email: "",
      role: "HOTEL", // Fixo como "HOTEL" para esta página
    },
  });

  async function onSubmit(data: RegisterEmailInput) {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar");
      }

      setSent(true);
      toast.info("Verifique seu e-mail para continuar o cadastro!");
    } catch (error) {
      console.error(error);
      toast.error("Algo deu errado!");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#0a293f] mb-4">Quase lá!</h1>
          <p className="text-gray-700">
            Verifique seu e-mail. Enviamos um link mágico para continuar seu
            cadastro ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-[#0a293f]">Cadastro de Hotel</h1>
        <p className="text-gray-600">Informe o e-mail comercial para começar</p>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-mail Comercial
          </label>
          <input
            type="email"
            {...form.register("email")}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="hotel@seuhotel.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-700 mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#275f8c] text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          {loading ? "Enviando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
