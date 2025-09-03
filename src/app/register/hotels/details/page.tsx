"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

// Schema específico para hotéis
const hotelProfileSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  cnpj: z.string().length(14, "CNPJ inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(10, "Endereço muito curto"),
  email: z.string().email("Email inválido"),
});

type HotelProfileInput = z.infer<typeof hotelProfileSchema>;

export default function HotelRegisterDetails() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailFromLink = params.get("email");
    if (!emailFromLink) {
      router.push("/register/hotels"); // se não tiver email, volta para início
    } else {
      setEmail(emailFromLink);
    }
  }, [params, router]);

  const form = useForm<HotelProfileInput>({
    resolver: zodResolver(hotelProfileSchema),
    defaultValues: {
      email,
      name: "",
      cnpj: "",
      phone: "",
      address: "",
    },
  });

  // Atualiza o email no formulário quando ele mudar no estado
  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const onSubmit = async (data: HotelProfileInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register/hotel-profile", {
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
          <h2 className="text-center text-2xl font-bold text-[#0a293f]">Complete seu cadastro de hotel</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Precisamos de algumas informações para finalizar seu cadastro
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Nome do hotel */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome do hotel
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

            {/* CNPJ */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                CNPJ (apenas números)
              </label>
              <input
                id="cnpj"
                type="text"
                {...form.register("cnpj")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="00000000000000"
              />
              {form.formState.errors.cnpj && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cnpj.message}</p>
              )}
            </div>

            {/* Endereço */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Endereço completo
              </label>
              <input
                id="address"
                type="text"
                {...form.register("address")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Rua, número, bairro, cidade, estado, CEP"
              />
              {form.formState.errors.address && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
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