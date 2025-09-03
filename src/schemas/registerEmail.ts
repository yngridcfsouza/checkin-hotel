import { z } from "zod";

export const registerEmailSchema = z.object({
  email: z.email("E-mail inválido"),
  role: z.enum(["guest", "hotel"]),
});

export type RegisterEmailInput = z.infer<typeof registerEmailSchema>;
