import { db } from '@/lib/db';
import { MagicLink, CreateMagicLinkDTO } from '@/types';
import { BaseRepository } from './BaseRepository';

export class MagicLinkRepository extends BaseRepository<MagicLink, CreateMagicLinkDTO> {
  constructor() {
    super((db as any).magicLink);
  }

  async findByToken(token: string): Promise<MagicLink | null> {
    return await this.model.findFirst({
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

    return await this.model.findFirst({
      where: {
        token,
        email,
        used: false,
        expiresAt: {
          gt: currentTime,
        },
      },
    });
  }

  async markAsUsed(id: string): Promise<MagicLink> {
    return await this.update(id, { used: true });
  }

  async deleteExpired(): Promise<void> {
    await this.model.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(Date.now()),
        },
      },
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.model.deleteMany({
      where: { email },
    });
  }

  async findByEmail(email: string): Promise<MagicLink[]> {
    return await this.model.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const magicLinkRepository = new MagicLinkRepository();