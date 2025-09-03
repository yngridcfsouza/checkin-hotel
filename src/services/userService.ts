import bcrypt from "bcryptjs";
import z from "zod";

import { db } from "@/lib/db";

const guestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(100),
  cpf: z.string().min(11).max(11),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  phone: z.string().min(10).max(15),
});

const hotelSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(100),
  cnpj: z.string().min(14).max(14),
  address: z.string().min(5).max(200),
  phone: z.string().min(10).max(15),
});

type CreateGuestInput = z.infer<typeof guestSchema>;
type CreateHotelInput = z.infer<typeof hotelSchema>;

export async function createGuest(data: CreateGuestInput) {
  const parsedData = guestSchema.parse(data);

  const hashedPassword = await bcrypt.hash(parsedData.password, 12);

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "GUEST",
    },
  });

  const guest = await db.guest.create({
    data: {
      cpf: data.cpf,
      birthDate: new Date(data.birthDate),
      phone: data.phone,
      userId: user.id,
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { guestId: guest.id },
  });

  return user;
}

export async function createHotel(data: CreateHotelInput) {
  const parsedData = hotelSchema.parse(data);

  const hashedPassword = await bcrypt.hash(parsedData.password, 12);

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "HOTEL",
    },
  });

  const hotel = await db.hotel.create({
    data: {
      cnpj: data.cnpj,
      address: data.address,
      phone: data.phone,
      userId: user.id,
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { hotelId: hotel.id },
  });

  return user;
}
