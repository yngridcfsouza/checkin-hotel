"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema, registerSchema } from "@/schemas/registerProfile"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoaderCircle } from 'lucide-react';

interface IRegisterFormProps {
  registerAction: (data: RegisterSchema) => Promise<string>
}

export function RegisterForm({ registerAction }: IRegisterFormProps) {
  const [role, setRole] = useState<"guest" | "hotel">("guest")

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "guest",
      email: "",
      password: "",
      name: "",
      phone: "",
      hotelName: "",
      cnpj: "",
    },
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerAction(data)
      toast.success("Registro realizado com sucesso!")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Erro ao registrar. Tente novamente.")
    }
  }

  return (
    <Card className="max-w-md mx-auto bg-gray-50 border border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-900">Registre sua conta</CardTitle>
        <CardDescription className="text-gray-600">Faça sua conta para acessar nossos serviços!</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Toggle Guest / Hotel */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              role === "guest"
                ? "bg-blue-900 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setRole("guest")}
          >
            Guest
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              role === "hotel"
                ? "bg-red-400 text-white hover:bg-red-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setRole("hotel")}
          >
            Hotel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <input type="hidden" value={role} {...register("role")} />

          {/* Campos comuns */}
          <div className="grid gap-3">
            <Label htmlFor="email" className="text-gray-700">E-mail</Label>
            <Input id="email" {...register("email")} placeholder="m@exemplo.com" className="border-gray-300" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password" className="text-gray-700">Senha</Label>
            <Input id="password" type="password" {...register("password")} placeholder="********" className="border-gray-300" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Campos Guest */}
          {role === "guest" && (
            <>
              <div className="grid gap-3">
                <Label htmlFor="name" className="text-gray-700">Nome</Label>
                <Input id="name" {...register("name")} placeholder="Digite seu nome" className="border-gray-300" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                <Input id="phone" {...register("phone")} placeholder="(11) 99999-9999" className="border-gray-300" />
              </div>
            </>
          )}

          {/* Campos Hotel */}
          {role === "hotel" && (
            <>
              <div className="grid gap-3">
                <Label htmlFor="hotelName" className="text-gray-700">Nome do Hotel</Label>
                <Input id="hotelName" {...register("hotelName")} placeholder="Digite o nome do hotel" className="border-gray-300" />
                {errors.hotelName && <p className="text-red-500 text-sm">{errors.hotelName.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="cnpj" className="text-gray-700">CNPJ</Label>
                <Input id="cnpj" {...register("cnpj")} placeholder="12.345.678/0001-99" className="border-gray-300" />
                {errors.cnpj && <p className="text-red-500 text-sm">{errors.cnpj.message}</p>}
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full primary-text text-red-400 hover:bg-blue-500 transition-colors duration-200"
          >
            {isSubmitting ? <LoaderCircle  /> : "Registrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
