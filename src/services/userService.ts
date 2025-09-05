import { userRepository } from '@/repositories/UserRepository';
import { guestRepository } from '@/repositories/GuestRepository';
import { hotelRepository } from '@/repositories/HotelRepository';
import { authService } from './AuthService';
import { GuestProfileDTO, HotelProfileDTO, AuthResponse, JWTPayload } from '@/types';

export class UserService {
  async createGuestProfile(profileData: GuestProfileDTO): Promise<AuthResponse> {
    // Verificar se usuário já existe
    const existingUser = await userRepository.findByEmail(profileData.email);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Verificar se CPF já existe
    const existingGuest = await guestRepository.findByCpf(profileData.cpf);
    if (existingGuest) {
      throw new Error('CPF já cadastrado');
    }

    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await authService.hashPassword(tempPassword);

    // Criar usuário
    const user = await userRepository.create({
      name: profileData.name,
      email: profileData.email,
      password: hashedPassword,
      role: 'GUEST',
    });

    // Criar perfil de guest
    const guest = await guestRepository.create({
      cpf: profileData.cpf,
      birthDate: new Date(profileData.birthDate),
      phone: profileData.phone,
      userId: user.id,
    });

    // Atualizar referência do user para guest
    await userRepository.update(user.id, { guestId: guest.id });

    // Gerar JWT token
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      guestId: guest.id,
    };

    const token = await authService.generateJWTToken(tokenPayload);

    return {
      success: true,
      message: 'Cadastro realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async createHotelProfile(profileData: HotelProfileDTO): Promise<AuthResponse> {
    // Verificar se usuário já existe
    const existingUser = await userRepository.findByEmail(profileData.email);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Verificar se CNPJ já existe
    const existingHotel = await hotelRepository.findByCnpj(profileData.cnpj);
    if (existingHotel) {
      throw new Error('CNPJ já cadastrado');
    }

    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await authService.hashPassword(tempPassword);

    // Criar usuário
    const user = await userRepository.create({
      name: profileData.name,
      email: profileData.email,
      password: hashedPassword,
      role: 'HOTEL',
    });

    // Criar perfil de hotel
    const hotel = await hotelRepository.create({
      cnpj: profileData.cnpj,
      address: profileData.address,
      phone: profileData.phone,
      userId: user.id,
    });

    // Atualizar referência do user para hotel
    await userRepository.update(user.id, { hotelId: hotel.id });

    // Gerar JWT token
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      hotelId: hotel.id,
    };

    const token = await authService.generateJWTToken(tokenPayload);

    return {
      success: true,
      message: 'Cadastro realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getUserById(id: string): Promise<any | null> {
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<any | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, data: Partial<any>): Promise<any> {
    const updatedUser = await userRepository.update(id, data);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<void> {
    await userRepository.delete(id);
  }
}

export const userService = new UserService();