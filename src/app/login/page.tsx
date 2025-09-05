'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.email('Email inválido'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, role: 'GUEST' }),
      });

      if (!res.ok) {
        throw new Error('Erro ao enviar link de acesso');
      }

      setEmailSent(true);
      toast.success('Link de acesso enviado para seu email!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar link de acesso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gap-x-4">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white rounded-lg">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                className="mx-auto h-12 w-auto"
                src="/logo-resized.png"
                alt="Express.com"
                width={200}
                height={60}
                priority
              />
            </Link>
            <h2 className="mt-6 text-3xl font-semibold text-gray-900">
              Acesse sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Digite seu email para receber um link de acesso seguro
            </p>
          </div>

          {!emailSent ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Digite seu email"
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                  {isLoading ? 'Enviando...' : 'Enviar Link de Acesso'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-blue-900 hover:text-blue-700"
                  >
                    Cadastre-se aqui
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="mt-8 text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
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
              <h3 className="text-lg font-medium text-gray-900">
                Link enviado!
              </h3>
              <p className="text-sm text-gray-600">
                Enviamos um link de acesso para <strong>{getValues('email')}</strong>.
                Verifique sua caixa de entrada e clique no link para acessar sua conta.
              </p>
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="mt-4"
              >
                Enviar novamente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Lado Direito - Imagem Promocional */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-900 relative overflow-hidden rounded-lg">
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="max-w-lg">
            <h1 className="text-3xl font-semibold mb-6">
              Check-in Inteligente
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Simplifique sua experiência de hospedagem
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="border border-white flex items-center justify-center h-10 w-10 rounded-full bg-blue-900 bg-opacity-20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Acesso Seguro</h3>
                  <p className="text-sm opacity-80">Processo otimizado e criptografado</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full border border-white bg-blue-900 bg-opacity-20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Check-in fácil, estadia tranquila</h3>
                  <p className="text-sm opacity-80">Sua estadia começa com um clique</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full border border-white bg-blue-900 bg-opacity-20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">O Check-in nunca foi tão simples</h3>
                  <p className="text-sm opacity-80">Com uma interface moderna e intuitiva, ao chegar no hotel mostre um QR code e pegue suas chaves, simples assim</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white border-opacity-20">
              <p className="text-sm opacity-75">
                Junte-se a milhares de usuários que já simplificaram sua experiência de hospedagem
              </p>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-[#eee] bg-opacity-10"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-[#eee] bg-opacity-10"></div>
        <div className="absolute top-1/2 right-1/6 h-16 w-16 rounded-full bg-[#eee] bg-opacity-5"></div>
      </div>
    </div>
  );
}
