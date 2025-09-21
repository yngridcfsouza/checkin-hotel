import { UserRepository } from '@/repositories/UserRepository';
import { GuestRepository } from '@/repositories/GuestRepository';
import { HotelRepository } from '@/repositories/HotelRepository';
import { AuthService } from './AuthService';
import { GuestProfileDTO, HotelProfileDTO, AuthResponse, JWTPayload } from '@/types';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly guestRepository: GuestRepository,
    private readonly hotelRepository: HotelRepository,
    private readonly authService: AuthService
  ) {}

  async createGuestProfile(profileData: GuestProfileDTO): Promise<AuthResponse> {
    try {
      // Verificar se usuário já existe
      const existingUser = await this.userRepository.findByEmail(profileData.email);
      if (existingUser) {
        throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.');
      }

      // Verificar se CPF já existe
      const existingGuest = await this.guestRepository.findByCpf(profileData.cpf);
      if (existingGuest) {
        throw new Error('Este CPF já está cadastrado no sistema.');
      }

      // Gerar senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await this.authService.hashPassword(tempPassword);

      // Criar usuário
      const user = await this.userRepository.create({
        name: profileData.name,
        email: profileData.email,
        password: hashedPassword,
        role: 'GUEST',
      });

      // Criar perfil de guest
      const guest = await this.guestRepository.create({
        cpf: profileData.cpf,
        birthDate: new Date(profileData.birthDate),
        phone: profileData.phone,
        userId: user.id,
      });

      // Atualizar referência do user para guest
      await this.userRepository.update(user.id, { guestId: guest.id });

      // Gerar JWT token
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        guestId: guest.id,
      };

      const token = await this.authService.generateJWTToken(tokenPayload);

      return {
        success: true,
        message: 'Cadastro realizado com sucesso! Bem-vindo ao Express.com!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error('Erro ao criar perfil de guest:', error);
      if (error instanceof Error) {
        throw error; // Re-throw specific errors with user-friendly messages
      }
      throw new Error('Não foi possível completar seu cadastro. Tente novamente em alguns instantes.');
    }
  }

  async createHotelProfile(profileData: HotelProfileDTO): Promise<AuthResponse> {
    try {
      // Verificar se usuário já existe
      const existingUser = await this.userRepository.findByEmail(profileData.email);
      if (existingUser) {
        throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.');
      }

      // Verificar se CNPJ já existe
      const existingHotel = await this.hotelRepository.findByCnpj(profileData.cnpj);
      if (existingHotel) {
        throw new Error('Este CNPJ já está cadastrado no sistema.');
      }

      // Gerar senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await this.authService.hashPassword(tempPassword);

      // Criar usuário
      const user = await this.userRepository.create({
        name: profileData.name,
        email: profileData.email,
        password: hashedPassword,
        role: 'HOTEL',
      });

      // Criar perfil de hotel
      const hotel = await this.hotelRepository.create({
        cnpj: profileData.cnpj,
        phone: profileData.phone,
        address: profileData.address,
        userId: user.id,
      });

      // Atualizar referência do user para hotel
      await this.userRepository.update(user.id, { hotelId: hotel.id });

      // Gerar JWT token
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        hotelId: hotel.id,
      };

      const token = await this.authService.generateJWTToken(tokenPayload);

      return {
        success: true,
        message: 'Cadastro do hotel realizado com sucesso! Bem-vindo ao Express.com!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error('Erro ao criar perfil de hotel:', error);
      if (error instanceof Error) {
        throw error; // Re-throw specific errors with user-friendly messages
      }
      throw new Error('Não foi possível completar o cadastro do hotel. Tente novamente em alguns instantes.');
    }
  }

  async getUserById(id: string): Promise<any | null> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw new Error('Não foi possível encontrar o usuário solicitado.');
    }
  }

  async getUserByEmail(email: string): Promise<any | null> {
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
      throw new Error('Não foi possível encontrar o usuário com este email.');
    }
  }

  async updateUser(id: string, data: any): Promise<any> {
    try {
      const updatedUser = await this.userRepository.update(id, data);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Não foi possível atualizar os dados do usuário. Tente novamente.');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Não foi possível excluir o usuário. Tente novamente.');
    }
  }
}

// Criar instâncias dos repositórios e services
import { userRepository } from '@/repositories/UserRepository';
import { guestRepository } from '@/repositories/GuestRepository';
import { hotelRepository } from '@/repositories/HotelRepository';
import { authService } from './AuthService';

// Criar instância do UserService com injeção de dependências
export const userService = new UserService(
  userRepository,
  guestRepository,
  hotelRepository,
  authService
);