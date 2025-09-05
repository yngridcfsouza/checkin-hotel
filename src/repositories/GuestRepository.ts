import { db } from '@/lib/db';
import { Guest, CreateGuestDTO } from '@/types';

export class GuestRepository {
  async findById(id: string): Promise<Guest | null> {
    return await db.guest.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Guest | null> {
    return await db.guest.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findByCpf(cpf: string): Promise<Guest | null> {
    return await db.guest.findUnique({
      where: { cpf },
      include: {
        user: true,
      },
    });
  }

  async create(guestData: CreateGuestDTO): Promise<Guest> {
    return await db.guest.create({
      data: guestData,
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: Partial<Guest>): Promise<Guest> {
    return await db.guest.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await db.guest.delete({
      where: { id },
    });
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    const guest = await db.guest.findUnique({
      where: { cpf },
      select: { id: true },
    });
    return !!guest;
  }
}

export const guestRepository = new GuestRepository();