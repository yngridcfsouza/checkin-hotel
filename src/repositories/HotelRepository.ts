import { db } from '@/lib/db';
import { Hotel, CreateHotelDTO } from '@/types';

export class HotelRepository {
  async findById(id: string): Promise<Hotel | null> {
    return await db.hotel.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Hotel | null> {
    return await db.hotel.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findByCnpj(cnpj: string): Promise<Hotel | null> {
    return await db.hotel.findUnique({
      where: { cnpj },
      include: {
        user: true,
      },
    });
  }

  async create(hotelData: CreateHotelDTO): Promise<Hotel> {
    return await db.hotel.create({
      data: hotelData,
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: Partial<Hotel>): Promise<Hotel> {
    return await db.hotel.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await db.hotel.delete({
      where: { id },
    });
  }

  async existsByCnpj(cnpj: string): Promise<boolean> {
    const hotel = await db.hotel.findUnique({
      where: { cnpj },
      select: { id: true },
    });
    return !!hotel;
  }

  async findAll(): Promise<Hotel[]> {
    return await db.hotel.findMany({
      include: {
        user: true,
      },
    });
  }
}

export const hotelRepository = new HotelRepository();