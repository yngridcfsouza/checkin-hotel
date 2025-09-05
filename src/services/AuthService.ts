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

    // Verificar se usuário já existe para personalizar o email
    const existingUser = await userRepository.findByEmail(email);
    const isLogin = !!existingUser;

    // Enviar email
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: isLogin ? 'Seu link de acesso - Express.com' : 'Seu link mágico - Express.com',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isLogin ? 'Acesse sua conta' : 'Bem-vindo ao Express.com'}</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header com Logo -->
            <div style="background-color: white; padding: 30px; border-radius: 8px 8px 0 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-resized.png" alt="Express.com" style="height: 48px; width: auto; margin-bottom: 20px;" />
                <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: bold;">
                  ${isLogin ? 'Acesse sua conta!' : 'Bem-vindo ao Express.com!'}
                </h1>
              </div>

              <p style="text-align: center; color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                ${isLogin ? 'Clique no botão abaixo para acessar sua conta e continuar sua jornada de hospedagem:' : 'Sua jornada de hospedagem inteligente começa aqui. Clique no botão abaixo para continuar seu cadastro:'}
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="display: inline-block; background-color: #1e40af; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.3); transition: all 0.2s;">
                  ${isLogin ? 'Acessar Conta' : 'Continuar Cadastro'}
                </a>
              </div>
            </div>

            <!-- Seção de Serviços -->
            <div style="background-color: white; padding: 40px 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
              <h2 style="color: #1e40af; font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 30px;">
                Por que escolher o Express.com?
              </h2>

              <div style="margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 60px; vertical-align: top; padding-right: 15px;">
                      <div style="width: 48px; height: 48px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">🏨</span>
                      </div>
                    </td>
                    <td style="vertical-align: top;">
                      <h3 style="color: #1e40af; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">Para Hóspedes</h3>
                      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">Check-in digital, perfil personalizado e experiência sem complicações em hotéis verificados.</p>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 60px; vertical-align: top; padding-right: 15px;">
                      <div style="width: 48px; height: 48px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">🏢</span>
                      </div>
                    </td>
                    <td style="vertical-align: top;">
                      <h3 style="color: #1e40af; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">Para Hotéis</h3>
                      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">Gestão inteligente de check-ins, redução de filas e maior satisfação dos hóspedes.</p>
                    </td>
                  </tr>
                </table>
              </div>

              <div>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 60px; vertical-align: top; padding-right: 15px;">
                      <div style="width: 48px; height: 48px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📱</span>
                      </div>
                    </td>
                    <td style="vertical-align: top;">
                      <h3 style="color: #1e40af; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">Apps Mobile</h3>
                      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">Baixe nosso app e tenha tudo na palma da sua mão:</p>
                      <div style="display: flex; gap: 10px;">
                        <a href="#" style="display: inline-block; background-color: #000; color: white; padding: 8px 12px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">📱 App Store</a>
                        <a href="#" style="display: inline-block; background-color: #01875f; color: white; padding: 8px 12px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">🤖 Play Store</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Aviso de Expiração -->
            <div style="background-color: white; padding: 20px 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
              <div style="background-color: #fef3c7; padding: 16px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                  <strong>⏰ Este link expira em 15 minutos.</strong><br>
                  ${isLogin ? 'Se você não solicitou este acesso, pode ignorar este email.' : 'Se você não solicitou este cadastro, pode ignorar este email.'}
                </p>
              </div>
            </div>

            <!-- Rodapé -->
            <div style="background-color: #1e40af; padding: 30px; border-radius: 0 0 8px 8px; color: white; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-resized.png" alt="Express.com" style="height: 32px; width: auto; filter: brightness(0) invert(1);" />
              </div>

              <h3 style="color: white; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">Express.com</h3>
              <p style="color: #bfdbfe; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                Transformando a experiência de hospedagem com tecnologia e inovação.
              </p>

              <!-- Informações de Contato -->
              <div style="border-top: 1px solid #3b82f6; padding-top: 20px; margin-top: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="text-align: center; padding: 10px;">
                      <p style="color: #bfdbfe; font-size: 12px; margin: 0; line-height: 1.4;">
                        <strong>📧 Contato:</strong><br>
                        suporte@express.com<br>
                         contato@express.com
                      </p>
                    </td>
                    <td style="text-align: center; padding: 10px;">
                      <p style="color: #bfdbfe; font-size: 12px; margin: 0; line-height: 1.4;">
                        <strong>📞 Telefone:</strong><br>
                        +55 (11) 9999-9999<br>
                        Seg-Sex: 8h às 18h
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Host e Copyright -->
              <div style="border-top: 1px solid #3b82f6; padding-top: 15px; margin-top: 15px;">
                <p style="color: #93c5fd; font-size: 11px; margin: 0; line-height: 1.4;">
                  Hospedado com ❤️ no Brasil | Servidor: AWS São Paulo<br>
                  © 2025 Express.com - Todos os direitos reservados<br>
                   CNPJ: 00.000.000/0001-00 | Razão Social: Express Tecnologia Ltda.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
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
