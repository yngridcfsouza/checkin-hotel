import { db } from '@/lib/db';

/**
 * Base Repository class to provide standard CRUD operations
 * and eliminate repetitive (db as any) casting.
 */
export class BaseRepository<T, CreateDTO = any, UpdateDTO = any> {
  constructor(protected model: any) {}

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  async findAll(args?: any): Promise<T[]> {
    return await this.model.findMany(args);
  }

  async create(data: CreateDTO): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return await this.model.delete({
      where: { id },
    });
  }

  async count(args?: any): Promise<number> {
    return await this.model.count(args);
  }
}
