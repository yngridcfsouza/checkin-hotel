import z from "zod";

export const registerSchema = z.object({
  role: z.enum(["guest", "hotel"]),
  email: z.email("E-mail inválido").min(5),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),

  //Guest
  name: z.string("O nome deve ter pelo menos 2 caracteres").min(2),
  cpf: z.string().min(11, "O CPF deve ter 11 caracteres").max(11, "O CPF deve ter 11 caracteres"),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 caracteres").max(11, "O telefone deve ter no máximo 11 caracteres"),

  //Hotel
  hotelName: z.string().min(2, "O nome do hotel deve ter pelo menos 2 caracteres"),
  cnpj: z.string().min(14, "O CNPJ deve ter 14 caracteres").max(14, "O CNPJ deve ter 14 caracteres"),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
