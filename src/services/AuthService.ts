import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { userRepository } from '@/repositories/UserRepository';
import { magicLinkRepository } from '@/repositories/MagicLinkRepository';
import { sendEmail } from '@/lib/mailer';
import { JWTPayload } from '@/types';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  private readonly JWT_EXPIRES_IN = '7d';
  private readonly MAGIC_LINK_EXPIRES_IN = 15 * 60 * 1000; // 15 minutos

  async generateJWTToken(payload: JWTPayload): Promise<string> {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  async verifyJWTToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async sendMagicLink(email: string, role: 'GUEST' | 'HOTEL' = 'GUEST'): Promise<void> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + this.MAGIC_LINK_EXPIRES_IN);

    // Limpar magic links antigos do email
    await magicLinkRepository.deleteByEmail(email);

    // Criar novo magic link
    await magicLinkRepository.create({
      email,
      token,
      expiresAt,
      role,
    });

    // Enviar email
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: 'Seu link mágico - CheckIn.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bem-vindo ao CheckIn.com!</h2>
          <p>Clique no botão abaixo para continuar seu cadastro:</p>
          <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Continuar Cadastro
          </a>
          <p style="color: #666; font-size: 14px;">
            Este link expira em 15 minutos. Se você não solicitou este cadastro, pode ignorar este email.
          </p>
        </div>
      `,
    });
  }

  async verifyMagicLink(token: string, email: string): Promise<{ isValid: boolean; role?: string; userExists?: boolean }> {
    const magicLink = await magicLinkRepository.findByTokenAndEmail(token, email);

    if (!magicLink) {
      return { isValid: false };
    }

    // Marcar como usado
    await magicLinkRepository.markAsUsed(magicLink.id);

    // Verificar se usuário já existe
    const existingUser = await userRepository.findByEmail(email);

    return {
      isValid: true,
      role: magicLink.role,
      userExists: !!existingUser,
    };
  }

  async getCurrentUser(token: string): Promise<any | null> {
    const payload = await this.verifyJWTToken(token);
    if (!payload) {
      return null;
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      return null;
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async cleanupExpiredMagicLinks(): Promise<void> {
    await magicLinkRepository.deleteExpired();
  }
}

export const authService = new AuthService();
