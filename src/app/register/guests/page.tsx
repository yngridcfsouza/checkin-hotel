"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerEmailSchema, RegisterEmailInput } from "@/schemas/registerEmail";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function GuestRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<RegisterEmailInput>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: {
      email: "",
      role: "GUEST", // Fixo como "GUEST" para esta página
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
      <div className="min-h-screen flex gap-x-4">
        {/* Lado Esquerdo - Confirmação */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white rounded-lg">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link href="/" className="inline-block">
                <Image
                  className="mx-auto h-12 w-auto"
                  src="/logo-resized.png"
                  alt="Express.com"
                  width={120}
                  height={48}
                  priority
                />
              </Link>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mt-8 mb-6">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quase lá!</h1>
              <p className="text-gray-600 mb-6">
                Verifique seu e-mail. Enviamos um link para continuar seu cadastro!
              </p>
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="mt-4"
              >
                Enviar novamente
              </Button>
            </div>
          </div>
        </div>

        {/* Lado Direito - Área Promocional */}
        <div className="hidden lg:flex flex-1 bg-blue-900 relative overflow-hidden rounded-lg">
          <div className="min-w-lg relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold mb-6">
                Bem-vindo
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Sua jornada de hospedagem começa aqui
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-900 bg-opacity-20">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Perfil Personalizado</h3>
                    <p className="text-sm opacity-80">Suas preferências sempre salvas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Hotéis Verificados</h3>
                    <p className="text-sm opacity-80">Apenas estabelecimentos confiáveis</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Vá na recepção apenas para o necessário</h3>
                    <p className="text-sm opacity-80">Check-in digital e sem complicações</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white border-opacity-20">
                <p className="text-sm opacity-75">
                  Junte-se a milhares de hóspedes que já descobriram uma nova forma de se hospedar
                </p>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute top-1/2 right-1/6 h-16 w-16 rounded-full bg-white bg-opacity-5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex gap-x-4">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white rounded-lg">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                className="mx-auto h-12 w-auto"
                src="/logo-resized.png"
                alt="Express.com"
                width={120}
                height={48}
                priority
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Cadastro de Hóspede
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Informe seu e-mail para começar sua jornada
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Digite seu email"
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <LoadingSpinner size="sm" className="mr-2" />}
                {loading ? 'Enviando...' : 'Continuar Cadastro'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Lado Direito - Área Promocional */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-900 relative overflow-hidden rounded-lg">
        <div className="min-w-lg relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold mb-6">
              Bem-vindo!
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Sua jornada de hospedagem começa aqui
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Perfil Personalizado</h3>
                  <p className="text-sm opacity-80">Suas preferências sempre salvas</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Hotéis Verificados</h3>
                  <p className="text-sm opacity-80">Apenas estabelecimentos confiáveis</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Check-in digital e sem complicações</h3>
                  <p className="text-sm opacity-80">Balcão de recepção? Somente para as chaves</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white border-opacity-20">
              <p className="text-sm opacity-75">
                Junte-se a milhares de hóspedes que já descobriram uma nova forma de se hospedar
              </p>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white bg-opacity-10"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-white bg-opacity-10"></div>
        <div className="absolute top-1/2 right-1/6 h-16 w-16 rounded-full bg-white bg-opacity-5"></div>
      </div>
    </div>
  );
}
