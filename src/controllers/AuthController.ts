import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/services/AuthService';
import { apiAction } from '@/lib/api-handler';

// Schemas de validação
const sendMagicLinkSchema = z.object({
  email: z.email('Email inválido'),
  role: z.enum(['GUEST', 'HOTEL']).optional().default('GUEST'),
  isLogin: z.boolean().optional().default(false),
});

const verifyMagicLinkSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  email: z.email('Email inválido'),
});

export class AuthController {
  async sendMagicLink(req: NextRequest): Promise<NextResponse> {
    return apiAction(async () => {
      const body = await req.json();
      const { email, role, isLogin } = sendMagicLinkSchema.parse(body);

      await authService.sendMagicLink(email, role, isLogin);
      return NextResponse.json({ success: true });
    });
  }

  async verifyMagicLink(req: NextRequest): Promise<NextResponse | undefined> {
    return apiAction(async () => {
      const body = await req.json();
      const { token, email } = verifyMagicLinkSchema.parse(body);

      const result = await authService.verifyMagicLink(token, email);

      if (!result.isValid) {
        throw new Error('Link inválido ou expirado');
      }

      if (result.isLogin && result.userExists) {
        // É um link de login e usuário existe - marcar como usado e gerar token
        if (result.magicLinkId) {
          await authService.markMagicLinkAsUsed(result.magicLinkId);
        }

        // Buscar dados completos do usuário para gerar o token
        const user = await authService.getCurrentUserByEmail(email);
        if (!user) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        // Gerar JWT token
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role,
          ...(user.guestId && { guestId: user.guestId }),
          ...(user.hotelId && { hotelId: user.hotelId }),
        };

        const jwtToken = await authService.generateJWTToken(tokenPayload);

        // Criar resposta com cookie
        const response = NextResponse.json({
          success: true,
          action: 'login',
          message: 'Login realizado com sucesso',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: jwtToken,
        });

        // Definir cookie httpOnly para o token
        response.cookies.set('auth-token', jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          path: '/',
        });

        return response;
      } else if (!result.isLogin) {
        // É um link de registro - marcar como usado
        if (result.magicLinkId) {
          await authService.markMagicLinkAsUsed(result.magicLinkId);
        }
        return NextResponse.json({
          success: true,
          action: 'register',
          role: result.role,
          message: 'Prossiga com o cadastro',
        });
      }
      
      throw new Error('Estado de autenticação inválido');
    });
  }

  async getCurrentUser(req: NextRequest): Promise<NextResponse> {
    return apiAction(async () => {
      const token = req.cookies.get('auth-token')?.value;

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
    });
  }

  async logout(): Promise<NextResponse> {
    return apiAction(async () => {
      const response = NextResponse.json({
        success: true,
        message: 'Logout realizado com sucesso',
      });

      // Remover o cookie de autenticação
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    });
  }

  async updateCurrentUser(req: NextRequest): Promise<NextResponse> {
    return apiAction(async () => {
      const token = req.cookies.get('auth-token')?.value;

      if (!token) {
        return NextResponse.json(
          { error: 'Token não encontrado' },
          { status: 401 }
        );
      }

      const body = await req.json();
      const updatedUser = await authService.updateCurrentUser(token, body);

      if (!updatedUser) {
        throw new Error('Usuário não encontrado');
      }

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'Dados atualizados com sucesso',
      });
    });
  }
}

export const authController = new AuthController();

