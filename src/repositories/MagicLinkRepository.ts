import { db } from '@/lib/db';
import { MagicLink, CreateMagicLinkDTO } from '@/types';

export class MagicLinkRepository {
  async findByToken(token: string): Promise<MagicLink | null> {
    return await (db as any).magicLink.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(Date.now()),
        },
      },
    });
  }

  async findByTokenAndEmail(token: string, email: string): Promise<MagicLink | null> {
    const currentTime = new Date(Date.now());

    const result = await (db as any).magicLink.findFirst({
      where: {
        token,
        email,
        used: false,
        expiresAt: {
          gt: currentTime,
        },
      },
    });

    return result;
  }

  async create(magicLinkData: CreateMagicLinkDTO): Promise<MagicLink> {
    return await (db as any).magicLink.create({
      data: {
        email: magicLinkData.email,
        token: magicLinkData.token,
        expiresAt: magicLinkData.expiresAt,
        role: magicLinkData.role || 'GUEST',
        isLogin: magicLinkData.isLogin || false,
      },
    });
  }

  async markAsUsed(id: string): Promise<MagicLink> {
    return await (db as any).magicLink.update({
      where: { id },
      data: { used: true },
    });
  }

  async deleteExpired(): Promise<void> {
    await (db as any).magicLink.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(Date.now()),
        },
      },
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await (db as any).magicLink.deleteMany({
      where: { email },
    });
  }

  async findByEmail(email: string): Promise<MagicLink[]> {
    return await (db as any).magicLink.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const magicLinkRepository = new MagicLinkRepository();