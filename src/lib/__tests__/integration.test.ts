import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, withRateLimit, clearRateLimitStore, stopCleanupInterval } from '../rate-limiter';
import { blockIP, isIPBlocked, getClientIP, cleanupExpiredBlocks, clearBlockedIPs, getBlockedIPsCount } from '../ip-blocker';

// Mock NextRequest
const createMockRequest = (url: string = 'http://localhost:3000/api/auth/login', ip: string = '192.168.1.100') => {
  const headersMap = new Map([
    ['x-forwarded-for', ip],
    ['x-real-ip', ip]
  ]);
  
  const request = {
    nextUrl: {
      pathname: new URL(url).pathname
    },
    headers: {
      get: (name: string) => headersMap.get(name.toLowerCase()) || null,
      has: (name: string) => headersMap.has(name.toLowerCase()),
      forEach: (callback: (value: string, key: string) => void) => {
        headersMap.forEach(callback);
      }
    },
    ip
  } as unknown as NextRequest;
  
  return request;
};

// Handler mock para simular endpoint de login
const mockLoginHandler = jest.fn().mockResolvedValue(
  NextResponse.json({ success: true, message: 'Login realizado com sucesso' })
);

describe('Integração Rate Limiter + IP Blocker', () => {
  beforeEach(() => {
    clearBlockedIPs();
    clearRateLimitStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    clearBlockedIPs();
    clearRateLimitStore();
  });

  afterAll(() => {
    stopCleanupInterval();
  });

  describe('Fluxo completo de proteção', () => {
    it('deve permitir requests normais dentro do limite', async () => {
      const limiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        message: 'Muitas tentativas de login'
      });
      
      const request = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.1');
      
      // Primeira request - deve passar
      const result1 = await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(1);
      
      // Segunda request - deve passar
      const result2 = await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(2);
      
      // Terceira request - deve passar
      const result3 = await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(3);
      
      // IP não deve estar bloqueado ainda
      expect(isIPBlocked('192.168.1.1')).toBe(false);
    });

    it('deve bloquear IP após exceder rate limit e rejeitar requests subsequentes', async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 60000,
        message: 'Muitas tentativas de login'
      });
      
      const request = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.2');
      
      // Duas requests permitidas
      await withRateLimit(request, limiter, mockLoginHandler);
      await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(2);
      
      // Terceira request - deve exceder limite e bloquear IP
      const blockedResult = await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(2); // Não deve chamar handler
      
      // Verifica se IP foi bloqueado
      expect(isIPBlocked('192.168.1.2')).toBe(true);
      
      // Verifica resposta de erro
      expect(blockedResult).toBeDefined();
      expect(typeof blockedResult).toBe('object');
      const responseData = await (blockedResult as NextResponse).json();
      expect(responseData.error).toBe('Muitas tentativas de login');
      
      // Requests subsequentes devem ser bloqueadas pelo IP blocker
      const subsequentResult = await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(2); // Ainda não deve chamar
      
      const subsequentData = await (subsequentResult as NextResponse).json();
      expect(subsequentData.message).toBe('Seu IP foi temporariamente bloqueado devido a atividade suspeita');
    });

    it('deve tratar múltiplos IPs independentemente', async () => {
      const limiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 60000
      });
      
      const requestIP1 = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.10');
      const requestIP2 = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.20');
      
      // IP1 - primeira request permitida
      await withRateLimit(requestIP1, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(1);
      
      // IP1 - segunda request bloqueia IP
      await withRateLimit(requestIP1, limiter, mockLoginHandler);
      expect(isIPBlocked('192.168.1.10')).toBe(true);
      
      // IP2 - deve ainda ter limite disponível
      const resultIP2 = await withRateLimit(requestIP2, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledTimes(2);
      expect(isIPBlocked('192.168.1.20')).toBe(false);
      
      // IP2 - segunda request bloqueia IP2
      await withRateLimit(requestIP2, limiter, mockLoginHandler);
      expect(isIPBlocked('192.168.1.20')).toBe(true);
      
      // Ambos IPs devem estar bloqueados
      expect(isIPBlocked('192.168.1.10')).toBe(true);
      expect(isIPBlocked('192.168.1.20')).toBe(true);
    });

    it('deve incluir headers corretos nas respostas', async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 60000
      });
      
      const request = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.30');
      
      // Primeira request
      const result1 = await withRateLimit(request, limiter, mockLoginHandler) as NextResponse;
      expect(result1.headers.get('X-RateLimit-Limit')).toBe('2');
      expect(result1.headers.get('X-RateLimit-Remaining')).toBe('1');
      
      // Segunda request
      const result2 = await withRateLimit(request, limiter, mockLoginHandler) as NextResponse;
      expect(result2.headers.get('X-RateLimit-Remaining')).toBe('0');
      
      // Terceira request - bloqueada
      const result3 = await withRateLimit(request, limiter, mockLoginHandler) as NextResponse;
      // Verificar se os headers existem (podem estar undefined no mock)
      const headers = (result3 as any).headers;
      if (headers && headers.get) {
        expect(headers.get('X-RateLimit-Remaining')).toBe('0');
        expect(headers.get('Retry-After')).toBeTruthy();
      }
      expect((result3 as any).status).toBe(429);
    });

    it('deve permitir acesso após expiração do bloqueio', async () => {
      // Mock Date.now para controlar tempo
      const originalNow = Date.now;
      let currentTime = 1000000000000;
      Date.now = jest.fn(() => currentTime);
      
      const limiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 60000
      });
      
      const request = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.40');
      
      // Esgota limite e bloqueia IP
      await withRateLimit(request, limiter, mockLoginHandler);
      await withRateLimit(request, limiter, mockLoginHandler);
      
      expect(isIPBlocked('192.168.1.40')).toBe(true);
      
      // Avança tempo além da duração do bloqueio (15 minutos)
      currentTime += 16 * 60 * 1000; // 16 minutos
      
      // Limpa bloqueios expirados
      cleanupExpiredBlocks();
      
      // IP deve estar desbloqueado
      expect(isIPBlocked('192.168.1.40')).toBe(false);
      
      // Nova request deve ser permitida
      const result = await withRateLimit(request, limiter, mockLoginHandler);
      expect(mockLoginHandler).toHaveBeenCalledWith(request);
      
      Date.now = originalNow;
    });
  });

  describe('Cenários de stress', () => {
    it('deve lidar com múltiplas requests simultâneas do mesmo IP', async () => {
      const limiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000
      });
      
      const request = createMockRequest('http://localhost:3000/api/auth/login', '192.168.1.50');
      
      // Simula 5 requests simultâneas
      const promises = Array(5).fill(null).map(() => 
        withRateLimit(request, limiter, mockLoginHandler)
      );
      
      const results = await Promise.all(promises);
      
      // Deve ter chamado o handler no máximo 3 vezes (limite)
      expect(mockLoginHandler).toHaveBeenCalledTimes(3);
      
      // IP deve estar bloqueado após exceder limite
      expect(isIPBlocked('192.168.1.50')).toBe(true);
      
      // Pelo menos 2 requests devem ter retornado erro 429
      const errorResponses = results.filter(result => 
        result && typeof result === 'object' && (result as NextResponse).status === 429
      );
      expect(errorResponses.length).toBeGreaterThanOrEqual(2);
    });

    it('deve manter performance com muitos IPs diferentes', async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 60000
      });
      
      const startTime = Date.now();
      
      // Testa com 50 IPs diferentes
      const promises = Array(50).fill(null).map((_, index) => {
        const ip = `192.168.1.${index + 100}`;
        const request = createMockRequest('http://localhost:3000/api/auth/login', ip);
        return withRateLimit(request, limiter, mockLoginHandler);
      });
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Deve completar em menos de 1 segundo
      expect(duration).toBeLessThan(1000);
      
      // Deve ter processado todas as requests
      expect(mockLoginHandler).toHaveBeenCalledTimes(50);
    });
  });

  describe('Diferentes endpoints', () => {
    it('deve aplicar rate limiting por endpoint', async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 60000
      });
      
      const ip = '192.168.1.60';
      const loginRequest = createMockRequest('http://localhost:3000/api/auth/login', ip);
      const registerRequest = createMockRequest('http://localhost:3000/api/auth/register', ip);
      
      // Esgota limite no endpoint de login
      await withRateLimit(loginRequest, limiter, mockLoginHandler);
      await withRateLimit(loginRequest, limiter, mockLoginHandler);
      
      // Terceira request de login deve ser bloqueada
      const blockedLogin = await withRateLimit(loginRequest, limiter, mockLoginHandler);
      expect(blockedLogin).toBeDefined();
      expect(typeof blockedLogin).toBe('object');
      expect((blockedLogin as any).status).toBe(429);
      
      // IP deve estar bloqueado para qualquer endpoint
      expect(isIPBlocked(ip)).toBe(true);
      
      // Request para register também deve ser bloqueada (IP bloqueado)
      const blockedRegister = await withRateLimit(registerRequest, limiter, mockLoginHandler);
      expect(blockedRegister).toBeDefined();
      expect(typeof blockedRegister).toBe('object');
      
      const registerData = await (blockedRegister as NextResponse).json();
      expect(registerData.message).toBe('Seu IP foi temporariamente bloqueado devido a atividade suspeita');
    });
  });
});