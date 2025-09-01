'use client'
import { useActionState } from "react";

import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ILoginFormProps {
  loginAction: (formData: FormData) => Promise<void | { error: string }>;
  googleLoginAction: () => Promise<void>;
}

export function LoginForm({ loginAction, googleLoginAction }: ILoginFormProps) {
  const [, dispatchAction, isPending] = useActionState(
    async (_previousData: any, formData: FormData) => {
      const response = await loginAction(formData);

      if (response?.error) {
        toast.error(response.error);
      }
    },
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para acessar sua conta!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatchAction} className="grid w-full gap-4" noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader2Icon /> : 'Entrar'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isPending}
                  onClick={googleLoginAction}
                >
                  Entrar com o Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Ainda não tem uma conta?{" "}
              <a href="/register" className="underline underline-offset-4">
                Registre-se
              </a>
              !
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
