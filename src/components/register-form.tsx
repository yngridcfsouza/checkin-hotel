import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IRegisterFormProps {
  registerAction: (formData: FormData) => Promise<void>;
}

export function RegisterForm({ registerAction }: IRegisterFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registre sua conta</CardTitle>
          <CardDescription>
            Faça sua conta para acessar nossos serviços!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={registerAction} className="grid w-full gap-4" noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Seu nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome"
                  required
                />
              </div>

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

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Registrar
                </Button>
                <Button variant="outline" className="w-full">
                  Registrar com o Google
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <a href="/login" className="underline underline-offset-4">
              Entre agora
            </a>
            !
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
