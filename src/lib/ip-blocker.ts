import { NextRequest, NextResponse } from 'next/server';

// Configurações simplificadas
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

// Interface para IP bloqueado
interface BlockedIP {
  blockedAt: number;
  reason: string;
}

// Armazenamento em memória (em produção, usar Redis)
const blockedIPs = new Map<string, BlockedIP>();

/**
 * Obtém o IP do cliente a partir do request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

/**
 * Verifica se um IP está bloqueado
 */
export function isIPBlocked(ip: string): boolean {
  const blocked = blockedIPs.get(ip);
  if (!blocked) return false;
  
  // Verifica se o bloqueio expirou
  if (Date.now() - blocked.blockedAt > BLOCK_DURATION) {
    blockedIPs.delete(ip);
    return false;
  }
  
  return true;
}

/**
 * Bloqueia um IP por exceder rate limit
 */
export function blockIP(ip: string, reason: string = 'Rate limit exceeded'): void {
  blockedIPs.set(ip, {
    blockedAt: Date.now(),
    reason
  });
  
  console.warn(`IP bloqueado: ${ip} - Motivo: ${reason}`);
}

/**
 * Middleware simplificado para verificar IPs bloqueados
 */
export async function withIPBlocking<T>(
  request: NextRequest, 
  handler: (req: NextRequest) => Promise<T>
): Promise<T | NextResponse> {
  const ip = getClientIP(request);
  
  if (isIPBlocked(ip)) {
    const blocked = blockedIPs.get(ip)!;
    console.warn(`Tentativa de acesso de IP bloqueado: ${ip}`);
    
    return NextResponse.json(
      { 
        error: 'Acesso negado',
        message: 'Seu IP foi temporariamente bloqueado devido a atividade suspeita',
        blockedAt: new Date(blocked.blockedAt).toISOString(),
        reason: blocked.reason
      },
      { status: 403 }
    );
  }
  
  return handler(request);
}

/**
 * Limpa IPs bloqueados expirados (chamada sob demanda)
 */
export function cleanupExpiredBlocks(): void {
  const now = Date.now();
  
  Array.from(blockedIPs.entries()).forEach(([ip, blocked]) => {
    if (now - blocked.blockedAt > BLOCK_DURATION) {
      blockedIPs.delete(ip);
    }
  });
}

/**
 * Obtém número de IPs atualmente bloqueados
 */
export function getBlockedIPsCount(): number {
  cleanupExpiredBlocks(); // Limpa antes de contar
  return blockedIPs.size;
}

/**
 * Limpa todos os IPs bloqueados (útil para testes)
 */
export function clearBlockedIPs(): void {
  blockedIPs.clear();
}