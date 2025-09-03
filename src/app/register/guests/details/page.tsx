"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

// Schema específico para hóspedes
const guestProfileSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().length(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento obrigatória"),
  email: z.string().email("Email inválido"),
});

type GuestProfileInput = z.infer<typeof guestProfileSchema>;

export default function GuestRegisterDetails() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailFromLink = params.get("email");
    if (!emailFromLink) {
      router.push("/register/guests"); // se não tiver email, volta para início
    } else {
      setEmail(emailFromLink);
    }
  }, [params, router]);

  const form = useForm<GuestProfileInput>({
    resolver: zodResolver(guestProfileSchema),
    defaultValues: {
      email,
      name: "",
      cpf: "",
      phone: "",
      birthDate: "",
    },
  });

  // Atualiza o email no formulário quando ele mudar no estado
  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const onSubmit = async (data: GuestProfileInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register/guest-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao salvar dados");

      router.push("/dashboard"); // redireciona para dashboard
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-2xl font-bold text-[#0a293f]">Complete seu cadastro de hóspede</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Precisamos de algumas informações para finalizar seu cadastro
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Nome completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                {...form.register("name")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF (apenas números)
              </label>
              <input
                id="cpf"
                type="text"
                {...form.register("cpf")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="00000000000"
              />
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cpf.message}</p>
              )}
            </div>

            {/* Data de nascimento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Data de nascimento
              </label>
              <input
                id="birthDate"
                type="date"
                {...form.register("birthDate")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {form.formState.errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthDate.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone com DDD
              </label>
              <input
                id="phone"
                type="tel"
                {...form.register("phone")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="11999999999"
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            {/* Email (hidden) */}
            <input type="hidden" {...form.register("email")} />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#275f8c] hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? "Salvando..." : "Finalizar cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}