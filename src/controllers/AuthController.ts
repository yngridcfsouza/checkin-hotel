import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/services/AuthService';

// Schemas de validação
const sendMagicLinkSchema = z.object({
  email: z.email('Email inválido'),
  role: z.enum(['GUEST', 'HOTEL']).optional().default('GUEST'),
});

const verifyMagicLinkSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  email: z.email('Email inválido'),
});

export class AuthController {
  async sendMagicLink(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validatedData = sendMagicLinkSchema.parse(body);

      await authService.sendMagicLink(validatedData.email, validatedData.role);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao enviar magic link:', error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: error.issues },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async verifyMagicLink(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const { token, email } = verifyMagicLinkSchema.parse(body);

      const result = await authService.verifyMagicLink(token, email);

      if (!result.isValid) {
        return NextResponse.json(
          { error: 'Link inválido ou expirado' },
          { status: 400 }
        );
      }

      if (result.userExists) {
        return NextResponse.json({
          success: true,
          action: 'login',
          message: 'Login realizado com sucesso',
        });
      }

      return NextResponse.json({
        success: true,
        action: 'register',
        role: result.role,
        message: 'Prossiga com o cadastro',
      });
    } catch (error) {
      console.error('Erro ao verificar magic link:', error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: error.issues },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async getCurrentUser(req: NextRequest): Promise<NextResponse> {
    try {
      const token = req.cookies.get('accessToken')?.value;

      if (!token) {
        return NextResponse.json(
          { error: 'Token não encontrado' },
          { status: 401 }
        );
      }

      const user = await authService.getCurrentUser(token);

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
      console.error('Erro ao obter usuário atual:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async logout(): Promise<NextResponse> {
    try {
      const response = NextResponse.json({
        success: true,
        message: 'Logout realizado com sucesso',
      });

      // Remover o cookie de autenticação
      response.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Erro no logout:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }
}

export const authController = new AuthController();
