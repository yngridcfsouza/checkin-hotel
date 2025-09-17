import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, blockIP, withIPBlocking } from './ip-blocker';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Store em memória (em produção, usar Redis)
const store: RateLimitStore = {};

// Limpeza automática do store a cada 5 minutos
let cleanupInterval: NodeJS.Timeout | null = null;

if (process.env.NODE_ENV !== 'test') {
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }, 5 * 60 * 1000);
}

// Função para limpeza manual (útil para testes)
export function clearRateLimitStore() {
  Object.keys(store).forEach(key => delete store[key]);
}

// Função para parar o intervalo de limpeza (útil para testes)
export function stopCleanupInterval() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  get maxRequests(): number {
    return this.config.maxRequests;
  }

  async checkLimit(req: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    response?: NextResponse;
  }> {
    const key = getClientIP(req);
    const now = Date.now();

    // Inicializar ou resetar contador se a janela expirou
    if (!store[key] || store[key].resetTime <= now) {
      store[key] = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }

    const current = store[key];
    
    // Verificar se excedeu o limite
    if (current.count >= this.config.maxRequests) {
      const response = NextResponse.json(
        {
          error: this.config.message,
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': this.config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': current.resetTime.toString(),
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString()
          }
        }
      );

      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
        response
      };
    }

    // Incrementar contador
    current.count++;

    return {
      allowed: true,
      remaining: this.config.maxRequests - current.count,
      resetTime: current.resetTime
    };
  }

  // Middleware wrapper para facilitar uso
  middleware() {
    return async (req: NextRequest) => {
      const result = await this.checkLimit(req);
      
      if (!result.allowed) {
        return result.response!;
      }

      // Adicionar headers de rate limit na resposta
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
      
      return response;
    };
  }
}

// Rate limiters pré-configurados
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

export const registerRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hora
  maxRequests: 3, // 3 registros por IP por hora
  message: 'Muitas tentativas de registro. Tente novamente em 1 hora.'
});

export const magicLinkRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  maxRequests: 3, // 3 magic links por IP
  message: 'Muitas solicitações de magic link. Tente novamente em 5 minutos.'
});

export const generalRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // 100 requests por IP
  message: 'Muitas requisições. Tente novamente mais tarde.'
});

/**
 * Função helper para aplicar rate limiting em route handlers
 */
export async function withRateLimit<T>(
  request: NextRequest,
  limiter: RateLimiter,
  handler: (req: NextRequest) => Promise<T>
): Promise<T | NextResponse> {
  // Primeiro verifica se o IP está bloqueado
  return withIPBlocking(request, async (req) => {
    const result = await limiter.checkLimit(req);
    
    if (!result.allowed) {
      const ip = getClientIP(req);
      const endpoint = req.nextUrl.pathname;
      
      // Bloqueia IP diretamente quando rate limit é excedido
      blockIP(ip, `Rate limit excedido em ${endpoint}`);
      
      return result.response!;
    }
    
    try {
      const response = await handler(req);
      
      // Adicionar headers de rate limit
      if (response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', limiter.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
      }
      
      return response;
    } catch (error) {
      // Em caso de erro, ainda adicionar headers
      const errorResponse = NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
      
      errorResponse.headers.set('X-RateLimit-Limit', limiter.maxRequests.toString());
      errorResponse.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      errorResponse.headers.set('X-RateLimit-Reset', result.resetTime.toString());
      
      return errorResponse;
    }
  });
}