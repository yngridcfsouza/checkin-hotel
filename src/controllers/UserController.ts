import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { userService } from '@/services/userService';
import { GuestProfileDTO, HotelProfileDTO } from '@/types';
import { apiAction } from '@/lib/api-handler';

// Schemas de validação
const guestProfileSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().length(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  email: z.email('Email inválido'),
});

const hotelProfileSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  cnpj: z.string().length(14, 'CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(10, 'Endereço muito curto'),
  email: z.string().email('Email inválido'),
});

export class UserController {
  async createGuestProfile(req: NextRequest): Promise<NextResponse> {
    return apiAction(async () => {
      const body = await req.json();
      const validatedData = guestProfileSchema.parse(body) as GuestProfileDTO;

      const result = await userService.createGuestProfile(validatedData);

      const response = NextResponse.json({
        success: result.success,
        message: result.message,
        user: result.user,
      });

      if (result.token) {
        response.cookies.set('auth-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          path: '/',
        });
      }

      return response;
    });
  }

  async createHotelProfile(req: NextRequest): Promise<NextResponse> {
    return apiAction(async () => {
      const body = await req.json();
      const validatedData = hotelProfileSchema.parse(body) as HotelProfileDTO;

      const result = await userService.createHotelProfile(validatedData);

      const response = NextResponse.json({
        success: result.success,
        message: result.message,
        user: result.user,
      });

      if (result.token) {
        response.cookies.set('auth-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          path: '/',
        });
      }

      return response;
    });
  }

  async getUserById(req: NextRequest, id: string): Promise<NextResponse> {
    return apiAction(async () => {
      const user = await userService.getUserById(id);

      if (!user) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user,
      });
    });
  }

  async updateUser(req: NextRequest, id: string): Promise<NextResponse> {
    return apiAction(async () => {
      const body = await req.json();
      const updatedUser = await userService.updateUser(id, body);

      return NextResponse.json({
        success: true,
        user: updatedUser,
      });
    });
  }

  async deleteUser(req: NextRequest, id: string): Promise<NextResponse> {
    return apiAction(async () => {
      await userService.deleteUser(id);

      return NextResponse.json({
        success: true,
        message: 'Usuário deletado com sucesso',
      });
    });
  }
}

export const userController = new UserController();

