import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { userService } from '@/services/userService';
import { GuestProfileDTO, HotelProfileDTO } from '@/types';

// Schemas de validação
const guestProfileSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().length(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  email: z.string().email('Email inválido'),
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
    try {
      const body = await req.json();
      const validatedData = guestProfileSchema.parse(body) as GuestProfileDTO;

      const result = await userService.createGuestProfile(validatedData);



      // Criar resposta com cookie httpOnly
      const response = NextResponse.json({
        success: result.success,
        message: result.message,
        user: result.user,
      });

      // Configurar cookie httpOnly
      if (result.token) {
        response.cookies.set('accessToken', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          path: '/',
        });
      }

      return response;
    } catch (error) {
      console.error('Erro no cadastro de guest:', error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: error.issues },
          { status: 400 }
        );
      }

      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async createHotelProfile(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validatedData = hotelProfileSchema.parse(body) as HotelProfileDTO;

      const result = await userService.createHotelProfile(validatedData);

      // Criar resposta com cookie httpOnly
      const response = NextResponse.json({
        success: result.success,
        message: result.message,
        user: result.user,
      });

      // Configurar cookie httpOnly
      if (result.token) {
        response.cookies.set('accessToken', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          path: '/',
        });
      }

      return response;
    } catch (error) {
      console.error('Erro no cadastro de hotel:', error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: error.issues },
          { status: 400 }
        );
      }

      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async getUserById(req: NextRequest, id: string): Promise<NextResponse> {
    try {
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
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async updateUser(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      const body = await req.json();

      const updatedUser = await userService.updateUser(id, body);

      return NextResponse.json({
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);

      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async deleteUser(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      await userService.deleteUser(id);

      return NextResponse.json({
        success: true,
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }
}

export const userController = new UserController();
