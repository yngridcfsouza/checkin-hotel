import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UserRepository } from '@/repositories/UserRepository';
import { GuestRepository } from '@/repositories/GuestRepository';
import { HotelRepository } from '@/repositories/HotelRepository';
import { MagicLinkRepository } from '@/repositories/MagicLinkRepository';
import { sendEmail } from '@/lib/mailer';
import { JWTPayload } from '@/types';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN = '7d';
  private readonly MAGIC_LINK_EXPIRES_IN = 15 * 60 * 1000; // 15 minutos

  constructor(
    private readonly userRepository: UserRepository,
    private readonly guestRepository: GuestRepository,
    private readonly hotelRepository: HotelRepository,
    private readonly magicLinkRepository: MagicLinkRepository
  ) {}

  async generateJWTToken(payload: JWTPayload): Promise<string> {
    try {
      if (!this.JWT_SECRET) {
        throw new Error('Configuração de segurança não encontrada. Entre em contato com o suporte.');
      }
      return jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      });
    } catch (error) {
      console.error('Erro ao gerar token JWT:', error);
      throw new Error('Não foi possível gerar o token de autenticação. Tente novamente.');
    }
  }

  async verifyJWTToken(token: string): Promise<JWTPayload | null> {
    try {
      if (!this.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Erro ao criptografar senha:', error);
      throw new Error('Erro interno ao processar dados de segurança. Tente novamente.');
    }
  }

  async sendMagicLink(email: string, role: 'GUEST' | 'HOTEL' = 'GUEST', isLogin: boolean = false): Promise<void> {
    try {
      const token = randomUUID();
      // Garantir que estamos usando UTC para evitar problemas de fuso horário
      const expiresAt = new Date(Date.now() + this.MAGIC_LINK_EXPIRES_IN);

      // Se for tentativa de login, verificar se usuário existe
      if (isLogin) {
        const userExists = await this.userRepository.findByEmail(email);
        if (!userExists) {
          throw new Error('Usuário não encontrado. Verifique o email ou faça seu cadastro primeiro.');
        }
      }

      // Limpar links expirados antes de criar um novo
      await this.magicLinkRepository.deleteByEmail(email);
      // Criar novo magic link
      await this.magicLinkRepository.create({
        email,
        token,
        expiresAt,
        role,
        isLogin,
      });

      // Enviar email normal
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic?token=${token}&email=${encodeURIComponent(email)}`;

      await sendEmail({
        to: email,
        subject: isLogin ? 'Seu link de acesso - Express.com' : 'Seu link mágico - Express.com',
        html: this.generateEmailTemplate(link, isLogin)
      });
    } catch (error) {
      console.error('Erro ao enviar magic link:', error);
      if (error instanceof Error && error.message.includes('Usuário não encontrado')) {
        throw error; // Re-throw specific user errors
      }
      throw new Error('Não foi possível enviar o email de acesso. Verifique seu email e tente novamente.');
    }
  }



  private generateUserNotFoundEmailTemplate(registerLink: string): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo ao Express.com! - Vamos criar sua conta</title>
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
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header com Logo -->
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; box-shadow: 0 8px 32px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
              <!-- Decoração de fundo -->
              <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #3b82f6, #8b5cf6); border-radius: 50%; opacity: 0.1;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: linear-gradient(45deg, #10b981, #06b6d4); border-radius: 50%; opacity: 0.1;"></div>

              <div style="text-align: center; margin-bottom: 30px; position: relative; z-index: 1;">
                <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-resized.png" alt="Express.com" style="height: 48px; width: auto; margin-bottom: 25px;" />
                <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);">
                  <span style="font-size: 36px;">🔍</span>
                </div>
                <h1 style="color: #1e40af; margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #1e40af, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                  Ops! Não encontramos sua conta 😅
                </h1>
                <p style="color: #64748b; font-size: 18px; margin: 10px 0 0 0; font-weight: 500;">
                  Que tal criarmos uma agora mesmo?
                </p>
              </div>

              <!-- Mensagem Principal Personalizada para Login -->
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 25px; border-radius: 12px; border: 1px solid #3b82f6; margin-bottom: 30px; position: relative;">
                <div style="position: absolute; top: 15px; right: 15px; font-size: 24px;">💡</div>
                <h2 style="color: #1e40af; font-size: 20px; font-weight: 700; margin: 0 0 15px 0;">
                  🎯 Vamos criar sua conta!
                </h2>
                <p style="color: #1e40af; font-size: 16px; line-height: 1.7; margin: 0; font-weight: 500;">
                  Você tentou fazer login, mas sua conta ainda não existe em nosso sistema.<br><br>
                  <strong>Não se preocupe!</strong> Clique no botão abaixo e complete seu cadastro rapidamente. Já temos seu e-mail, então será super rápido!
                </p>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${registerLink}" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #059669 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 8px 25px rgba(22, 163, 74, 0.4); transition: all 0.3s ease; border: none; cursor: pointer;">
                  🚀 Completar Meu Cadastro
                </a>
                <p style="color: #64748b; font-size: 14px; margin: 15px 0 0 0; font-style: italic;">
                  Link válido por 15 minutos
                </p>
              </div>

              <!-- Informação Adicional -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 20px; border-radius: 10px; border: 1px solid #bfdbfe; margin-top: 25px;">
                <p style="color: #1e40af; font-size: 15px; margin: 0; line-height: 1.6; text-align: center;">
                  <strong style="color: #1d4ed8;">💡 Após criar sua conta:</strong><br>
                  Você poderá fazer login normalmente usando este mesmo email e terá acesso completo à plataforma!
                </p>
              </div>
            </div>

            <!-- Seção de Benefícios Modernizada -->
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 40px 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; position: relative;">
              <!-- Decoração -->
              <div style="position: absolute; top: 20px; right: 20px; width: 80px; height: 80px; background: linear-gradient(45deg, #f59e0b, #f97316); border-radius: 50%; opacity: 0.05;"></div>

              <h2 style="color: #1e40af; font-size: 26px; font-weight: 700; text-align: center; margin-bottom: 35px; background: linear-gradient(135deg, #1e40af, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                🎉 O que você ganha ao se cadastrar?
              </h2>

              <!-- Benefício 1 -->
              <div style="margin-bottom: 30px; display: flex; align-items: flex-start; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">⚡</span>
                </div>
                <div style="flex: 1;">
                  <h3 style="color: #047857; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">Check-in Express</h3>
                  <p style="color: #065f46; font-size: 15px; line-height: 1.6; margin: 0;">Esqueça as filas! Faça seu check-in online em segundos e chegue direto ao seu quarto. Tecnologia que economiza seu tempo.</p>
                </div>
              </div>

              <!-- Benefício 2 -->
              <div style="margin-bottom: 30px; display: flex; align-items: flex-start; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; border: 1px solid #93c5fd;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">🎯</span>
                </div>
                <div style="flex: 1;">
                  <h3 style="color: #1d4ed8; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">Perfil Inteligente</h3>
                  <p style="color: #1e40af; font-size: 15px; line-height: 1.6; margin: 0;">Salve suas preferências e tenha uma experiência personalizada. Quartos favoritos, serviços preferidos, tudo do seu jeito!</p>
                </div>
              </div>

              <!-- Benefício 3 -->
              <div style="margin-bottom: 30px; display: flex; align-items: flex-start; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 1px solid #fbbf24;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">🏆</span>
                </div>
                <div style="flex: 1;">
                  <h3 style="color: #92400e; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">Ofertas VIP</h3>
                  <p style="color: #a16207; font-size: 15px; line-height: 1.6; margin: 0;">Descontos exclusivos, upgrades gratuitos e promoções especiais só para membros. Economize em cada hospedagem!</p>
                </div>
              </div>

              <!-- Benefício 4 -->
              <div style="display: flex; align-items: flex-start; background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 20px; border-radius: 12px; border: 1px solid #c4b5fd;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">📱</span>
                </div>
                <div style="flex: 1;">
                  <h3 style="color: #6b21a8; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">App Completo</h3>
                  <p style="color: #7c2d92; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0;">Controle tudo pelo celular: check-in, serviços do quarto, pedidos e muito mais!</p>
                  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="#" style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #000000, #374151); color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                      <span style="margin-right: 6px;">📱</span> App Store
                    </a>
                    <a href="#" style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #01875f, #047857); color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(1,135,95,0.3);">
                      <span style="margin-right: 6px;">🤖</span> Play Store
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aviso de Segurança Modernizado -->
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 25px 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 1px solid #fbbf24; position: relative;">
                <div style="position: absolute; top: 15px; right: 15px; font-size: 20px;">🔒</div>
                <p style="color: #92400e; font-size: 15px; margin: 0; line-height: 1.7; font-weight: 500;">
                  <strong style="color: #78350f;">🛡️ Sua Segurança em Primeiro Lugar:</strong><br>
                  Se você não tentou fazer login no Express.com, pode ignorar este email com total tranquilidade.<br>
                  <span style="color: #a16207;">Seus dados estão 100% protegidos e nenhuma conta foi criada automaticamente.</span>
                </p>
              </div>
            </div>

            <!-- Rodapé Modernizado -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 35px 30px; border-radius: 0 0 16px 16px; color: white; text-align: center; position: relative; overflow: hidden;">
              <!-- Decoração de fundo -->
              <div style="position: absolute; top: -40px; left: -40px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; right: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>

              <div style="margin-bottom: 25px; position: relative; z-index: 1;">
                <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-resized.png" alt="Express.com" style="height: 36px; width: auto; filter: brightness(0) invert(1);" />
              </div>

              <h3 style="color: white; font-size: 22px; font-weight: 700; margin: 0 0 15px 0; position: relative; z-index: 1;">Express.com</h3>
              <p style="color: #bfdbfe; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; position: relative; z-index: 1;">
                🚀 Transformando a experiência de hospedagem com tecnologia e inovação.
              </p>

              <!-- Informações de Contato Modernizadas -->
              <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; margin: 25px 0; position: relative; z-index: 1;">
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px;">
                  <div style="text-align: center; min-width: 200px;">
                    <div style="background: rgba(255,255,255,0.15); width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <span style="font-size: 20px;">📧</span>
                    </div>
                    <p style="color: #e0e7ff; font-size: 14px; margin: 0; line-height: 1.5; font-weight: 500;">
                      <strong>Suporte 24/7</strong><br>
                      suporte@express.com<br>
                      contato@express.com
                    </p>
                  </div>
                  <div style="text-align: center; min-width: 200px;">
                    <div style="background: rgba(255,255,255,0.15); width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <span style="font-size: 20px;">📞</span>
                    </div>
                    <p style="color: #e0e7ff; font-size: 14px; margin: 0; line-height: 1.5; font-weight: 500;">
                      <strong>Atendimento</strong><br>
                      +55 (11) 9999-9999<br>
                      Seg-Sex: 8h às 18h
                    </p>
                  </div>
                </div>
              </div>

              <!-- Copyright Modernizado -->
              <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px; position: relative; z-index: 1;">
                <p style="color: #93c5fd; font-size: 13px; margin: 0; line-height: 1.5; font-weight: 400;">
                  Hospedado com ❤️ no Brasil | Servidor: AWS São Paulo<br>
                  © 2025 Express.com - Todos os direitos reservados<br>
                  CNPJ: 00.000.000/0001-00 | Razão Social: Express Tecnologia Ltda.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
  }

  private generateEmailTemplate(link: string, isLogin: boolean): string {
    return `
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
      `;
  }

  async verifyMagicLink(token: string, email: string): Promise<{ isValid: boolean; magicLinkId?: string; role?: 'GUEST' | 'HOTEL'; isLogin?: boolean; userExists?: boolean; debugInfo?: any }> {
    try {
      const magicLink = await this.magicLinkRepository.findByTokenAndEmail(token, email);

      if (!magicLink) {
        return { isValid: false };
      }

      // Verificar se usuário já existe
      const existingUser = await this.userRepository.findByEmail(email);

      // Retornar dados para validação no controller, mas NÃO marcar como usado ainda
      const result = {
        isValid: true,
        role: magicLink.role as 'GUEST' | 'HOTEL',
        userExists: !!existingUser,
        isLogin: magicLink.isLogin,
        magicLinkId: magicLink.id,
        debugInfo: {
          expiresAt: magicLink.expiresAt,
          currentTime: new Date(),
          timeDiff: magicLink.expiresAt.getTime() - Date.now(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      return result;
    } catch (error) {
      console.error('Erro ao verificar magic link:', error);
      throw new Error('Não foi possível verificar o link de acesso. Tente solicitar um novo link.');
    }
  }

  async markMagicLinkAsUsed(magicLinkId: string): Promise<void> {
    try {
      await this.magicLinkRepository.markAsUsed(magicLinkId);
    } catch (error) {
      console.error('Erro ao marcar magic link como usado:', error);
      throw new Error('Erro interno ao processar o link de acesso.');
    }
  }

  async getCurrentUserByEmail(email: string): Promise<any | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw new Error('Não foi possível buscar os dados do usuário. Tente novamente.');
    }
  }

  async getCurrentUser(token: string): Promise<any | null> {
    try {
      const payload = await this.verifyJWTToken(token);
      if (!payload) {
        return null;
      }

      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        return null;
      }

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw new Error('Não foi possível verificar sua sessão. Faça login novamente.');
    }
  }

  async updateCurrentUser(token: string, updateData: any): Promise<any | null> {
    try {
      const payload = await this.verifyJWTToken(token);
      if (!payload) {
        return null;
      }

      const user = await userRepository.findById(payload.userId);
      if (!user) {
        return null;
      }

      // Separar campos do User e do Guest
      const userFields = ['name', 'email'];
      const guestFields = ['cpf', 'birthDate', 'phone'];
      const hotelFields = ['address'];

      const userUpdateData: any = {};
      const guestUpdateData: any = {};
      const hotelUpdateData: any = {};

      // Classificar os campos de acordo com o modelo
      Object.keys(updateData).forEach(key => {
        if (userFields.includes(key)) {
          userUpdateData[key] = updateData[key];
        } else if (guestFields.includes(key)) {
          if (key === 'birthDate' && updateData[key]) {
            // Converter data para formato DateTime do Prisma
            guestUpdateData[key] = new Date(updateData[key] + 'T00:00:00.000Z');
          } else {
            guestUpdateData[key] = updateData[key];
          }
        } else if (hotelFields.includes(key)) {
          hotelUpdateData[key] = updateData[key];
        }
      });

      // Atualizar dados do usuário se houver
      if (Object.keys(userUpdateData).length > 0) {
        await userRepository.update(payload.userId, userUpdateData);
      }

      // Atualizar dados do guest se houver
      if (Object.keys(guestUpdateData).length > 0) {
        if (user.guestId) {
          await guestRepository.update(user.guestId, guestUpdateData);
        } else {
          // Criar guest se não existir
          await guestRepository.create({
            ...guestUpdateData,
            userId: payload.userId
          });
        }
      }

      // Atualizar dados do hotel se houver
      if (Object.keys(hotelUpdateData).length > 0 && user.hotelId) {
        await hotelRepository.update(user.hotelId, hotelUpdateData);
      }

      // Buscar usuário atualizado com relacionamentos
      const finalUser = await userRepository.findById(payload.userId);
      if (!finalUser) {
        return null;
      }

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = finalUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao atualizar usuário atual:', error);
      throw new Error('Não foi possível atualizar seus dados. Tente novamente.');
    }
  }

  async cleanupExpiredMagicLinks(): Promise<void> {
    try {
      await this.magicLinkRepository.deleteExpired();
    } catch (error) {
      console.error('Erro ao limpar magic links expirados:', error);
      // Não lançar erro aqui pois é uma operação de limpeza em background
    }
  }
}

// Criar instâncias dos repositórios
import { userRepository } from '@/repositories/UserRepository';
import { guestRepository } from '@/repositories/GuestRepository';
import { hotelRepository } from '@/repositories/HotelRepository';
import { magicLinkRepository } from '@/repositories/MagicLinkRepository';

// Criar instância do AuthService com injeção de dependências
export const authService = new AuthService(
  userRepository,
  guestRepository,
  hotelRepository,
  magicLinkRepository
);
