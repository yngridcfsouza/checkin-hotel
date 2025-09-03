import { z } from "zod";

export const registerProfileSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().length(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  role: z.enum(["guest", "hotel"], "Selecione um tipo de usuário"),
  email: z.email("Email inválido"),
});

export type RegisterProfileInput = z.infer<typeof registerProfileSchema>;
