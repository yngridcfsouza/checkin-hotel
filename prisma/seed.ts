import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash das senhas
  const hashedAdminPassword = await bcrypt.hash("Admin123!", 10);
  const hashedHotelPassword = await bcrypt.hash("Hotel123!", 10);
  const hashedGuestPassword = await bcrypt.hash("Guest123!", 10);

  // 1️⃣ Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin Teste",
      email: "admin@checkin.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  // 2️⃣ Hotel + User
  const hotelUser = await prisma.user.create({
    data: {
      name: "Hotel Padrão",
      email: "hotel@checkin.com",
      password: hashedHotelPassword,
      role: "HOTEL",
    },
  });

  const hotel = await prisma.hotel.create({
    data: {
      cnpj: "12.345.678/0001-99",
      address: "Rua do Hotel, 123",
      phone: "11999999999",
      userId: hotelUser.id,
    },
  });

  // Atualiza referência do user para hotel
  await prisma.user.update({
    where: { id: hotelUser.id },
    data: { hotelId: hotel.id },
  });

  // 3️⃣ Guest + User
  const guestUser = await prisma.user.create({
    data: {
      name: "Hóspede Teste",
      email: "guest@checkin.com",
      password: hashedGuestPassword,
      role: "GUEST",
    },
  });

  const guest = await prisma.guest.create({
    data: {
      cpf: "123.456.789-00",
      birthDate: new Date("1990-01-01"),
      phone: "11988888888",
      userId: guestUser.id,
    },
  });

  // Atualiza referência do user para guest
  await prisma.user.update({
    where: { id: guestUser.id },
    data: { guestId: guest.id },
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
