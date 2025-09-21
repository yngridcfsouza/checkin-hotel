import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  email: string;
  role: "GUEST" | "HOTEL" | "ADMIN";
  guestId?: string;
  hotelId?: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      guestId: decoded.guestId,
      hotelId: decoded.hotelId,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}

export function requireRole(request: NextRequest, allowedRoles: string[]): AuthUser {
  const user = requireAuth(request);
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  
  return user;
}