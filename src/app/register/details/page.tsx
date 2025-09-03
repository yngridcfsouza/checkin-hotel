"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerProfileSchema, RegisterProfileInput } from "@/schemas/registerProfile";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterDetails() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailFromLink = params.get("email");
    if (!emailFromLink) {
      router.push("/register"); // se não tiver email, volta para início
    } else {
      setEmail(emailFromLink);
    }
  }, [params, router]);

  const form = useForm<RegisterProfileInput>({
    resolver: zodResolver(registerProfileSchema),
    defaultValues: {
      email,
      role: "guest",
      name: "",
      cpf: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterProfileInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao salvar dados");

      router.push("/"); // redireciona para dashboard/home
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4"
    >
      <h1 className="text-xl font-bold">Complete seu cadastro</h1>

      <input
        type="text"
        placeholder="Nome completo"
        {...form.register("name")}
        className="w-full p-2 border rounded"
      />
      {form.formState.errors.name && (
        <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
      )}

      <input
        type="text"
        placeholder="CPF (apenas números)"
        {...form.register("cpf")}
        className="w-full p-2 border rounded"
      />
      {form.formState.errors.cpf && (
        <p className="text-red-500 text-sm">{form.formState.errors.cpf.message}</p>
      )}

      <input
        type="text"
        placeholder="Telefone"
        {...form.register("phone")}
        className="w-full p-2 border rounded"
      />
      {form.formState.errors.phone && (
        <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
      )}

      <select {...form.register("role")} className="w-full p-2 border rounded">
        <option value="guest">Hóspede</option>
        <option value="hotel">Hotel</option>
      </select>
      {form.formState.errors.role && (
        <p className="text-red-500 text-sm">{form.formState.errors.role.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white p-2 rounded hover:bg-primary-700"
      >
        {loading ? "Salvando..." : "Finalizar cadastro"}
      </button>
    </form>
  );
}
