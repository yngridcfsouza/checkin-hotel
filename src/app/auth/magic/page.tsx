"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MagicLinkCallback() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
          const role = data.role || "guest";
          if (role === "hotel") {
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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner className="w-16 h-16" />
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>

  return null
}
