// Tipos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'GUEST' | 'HOTEL' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  guestId: string | null;
  hotelId: string | null;
}

export interface Guest {
  id: string;
  cpf: string;
  birthDate: Date;
  phone: string;
  userId: string;
}

export interface Hotel {
  id: string;
  cnpj: string;
  address: string;
  phone: string;
  userId: string;
}

export interface MagicLink {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  role: 'GUEST' | 'HOTEL' | 'ADMIN';
  createdAt: Date;
}

// DTOs para criação
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'GUEST' | 'HOTEL' | 'ADMIN';
}

export interface CreateGuestDTO {
  cpf: string;
  birthDate: Date;
  phone: string;
  userId: string;
}

export interface CreateHotelDTO {
  cnpj: string;
  address: string;
  phone: string;
  userId: string;
}

export interface CreateMagicLinkDTO {
  email: string;
  token: string;
  expiresAt: Date;
  role?: 'GUEST' | 'HOTEL' | 'ADMIN';
}

// DTOs para perfis
export interface GuestProfileDTO {
  name: string;
  cpf: string;
  phone: string;
  birthDate: string;
  email: string;
}

export interface HotelProfileDTO {
  name: string;
  cnpj: string;
  phone: string;
  address: string;
  email: string;
}

// Resposta de autenticação
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'GUEST' | 'HOTEL' | 'ADMIN';
  guestId?: string;
  hotelId?: string;
}