import { z } from "zod";

export const registerEmailSchema = z.object({
  email: z.email("E-mail inválido"),
  role: z.enum(["GUEST", "HOTEL"]),
});

export type RegisterEmailInput = z.infer<typeof registerEmailSchema>;
