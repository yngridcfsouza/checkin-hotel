import { db } from '@/lib/db';
import { User, CreateUserDTO } from '@/types';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { email },
      include: {
        guest: true,
        hotel: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { id },
      include: {
        guest: true,
        hotel: true,
      },
    });
  }

  async create(userData: CreateUserDTO): Promise<User> {
    return await db.user.create({
      data: userData,
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return await db.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await db.user.delete({
      where: { id },
    });
  }

  async exists(email: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }
}

export const userRepository = new UserRepository();