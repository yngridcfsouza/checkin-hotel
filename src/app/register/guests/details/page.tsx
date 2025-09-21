"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { maskCPF, maskPhone, removeCPFMask, removePhoneMask, validateCPF, validatePhone } from "@/utils/masks";

// Schema específico para hóspedes
const guestProfileSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().length(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento obrigatória"),
  email: z.email("Email inválido"),
});

type GuestProfileInput = z.infer<typeof guestProfileSchema>;

export default function GuestRegisterDetails() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cpfValue, setCpfValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

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
      // Remove máscaras antes de enviar
      const cleanData = {
        ...data,
        cpf: removeCPFMask(data.cpf),
        phone: removePhoneMask(data.phone),
      };

      const res = await fetch("/api/register/guest-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar dados");
      }

      const result = await res.json();
      toast.success(result.message || "Cadastro realizado com sucesso!");
      
      // Redirecionar para dashboard após sucesso
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao salvar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("birthDate", value);
    
    // Validação em tempo real
    if (value) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (birthDate > today) {
        setBirthDateError("Data de nascimento não pode ser no futuro");
      } else if (age < 18) {
        setBirthDateError("Você deve ter pelo menos 18 anos");
      } else if (age > 120) {
        setBirthDateError("Data de nascimento inválida");
      } else {
        setBirthDateError("");
      }
    } else {
      setBirthDateError("");
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.target.value);
    setCpfValue(maskedValue);
    form.setValue("cpf", maskedValue);
    
    // Validação em tempo real
    if (maskedValue) {
      const isValid = validateCPF(maskedValue);
      setCpfError(isValid ? "" : "CPF inválido");
    } else {
      setCpfError("");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    setPhoneValue(maskedValue);
    form.setValue("phone", maskedValue);
    
    // Validação em tempo real
    if (maskedValue) {
      const isValid = validatePhone(maskedValue);
      setPhoneError(isValid ? "" : "Telefone inválido");
    } else {
      setPhoneError("");
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
                Nome completo *
              </label>
              <input
                id="name"
                type="text"
                {...form.register("name")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Digite seu nome completo"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF *
              </label>
              <input
                id="cpf"
                type="text"
                value={cpfValue}
                onChange={handleCpfChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-primary-500 sm:text-sm ${
                  cpfError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                }`}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {cpfError && (
                <p className="text-red-500 text-sm mt-1">{cpfError}</p>
              )}
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cpf.message}</p>
              )}
            </div>

            {/* Data de nascimento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Data de nascimento *
              </label>
              <input
                id="birthDate"
                type="date"
                {...form.register("birthDate")}
                onChange={handleBirthDateChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-primary-500 sm:text-sm ${
                  birthDateError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                }`}
              />
              {birthDateError && (
                <p className="text-red-500 text-sm mt-1">{birthDateError}</p>
              )}
              {form.formState.errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthDate.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone com DDD *
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneValue}
                onChange={handlePhoneChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-primary-500 sm:text-sm ${
                  phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                }`}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            {/* Email (hidden) */}
            <input type="hidden" {...form.register("email")} />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || cpfError !== "" || phoneError !== "" || birthDateError !== ""}
              size="lg"
              className="w-full flex justify-center items-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? "Salvando..." : "Finalizar cadastro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}