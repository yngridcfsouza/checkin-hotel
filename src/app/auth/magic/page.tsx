"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

export default function MagicLinkCallback() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const token = params.get("token")
      const email = params.get("email")
      if (!token || !email) {
        setError("Link inválido")
        setLoading(false)
        return
      }

      const res = await fetch("/api/auth/verify-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      })

      const data = await res.json()

      if (res.ok) {
        if (data.action === "register") {
          // Redirecionar para completar cadastro com base no role
          const role = data.role || "GUEST";
        if (role === "HOTEL") {
            router.push(`/register/hotels/details?email=${encodeURIComponent(email)}`)
          } else {
            router.push(`/register/guests/details?email=${encodeURIComponent(email)}`)
          }
        } else if (data.action === "login") {
          // Usuário já existe, fazer login
          router.push("/dashboard")
        }
      } else {
        setError(data.error || "Link expirado ou inválido")
      }

      setLoading(false)
    }

    verify()
  }, [params, router])

  const handleResendLink = async () => {
    const email = params.get("email")
    if (!email) return

    setIsResending(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'GUEST' }),
      })

      if (res.ok) {
        toast.success('Novo link enviado para seu email!')
      } else {
        toast.error('Erro ao reenviar link. Tente novamente.')
      }
    } catch (error) {
      toast.error('Erro ao reenviar link. Tente novamente.')
    } finally {
      setIsResending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando seu link...</h2>
          <p className="text-gray-600">Aguarde um momento enquanto validamos seu acesso.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Logo */}
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo-resized.png"
                  alt="Express.com"
                  width={120}
                  height={48}
                  className="mx-auto"
                  priority
                />
              </Link>
            </div>

            {/* Ícone de erro */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Título e mensagem */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Link Inválido ou Expirado
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              O link que você clicou pode ter expirado ou já foi utilizado.
              Links de acesso são válidos por apenas 15 minutos por segurança.
            </p>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button
                onClick={handleResendLink}
                disabled={isResending || !params.get("email")}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isResending && <LoadingSpinner size="sm" className="mr-2" />}
                {isResending ? 'Reenviando...' : 'Reenviar Link de Acesso'}
              </Button>

              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Voltar ao Login
                </Button>
              </Link>
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Precisa de ajuda? Entre em contato conosco ou tente fazer login novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
