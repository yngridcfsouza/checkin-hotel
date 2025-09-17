import { RateLimiter, clearRateLimitStore, stopCleanupInterval } from '../rate-limiter';
import * as ipBlocker from '../ip-blocker';

// Mock do ip-blocker
jest.mock('../ip-blocker', () => ({
  getClientIP: jest.fn(),
  blockIP: jest.fn(),
  withIPBlocking: jest.fn()
}));

const mockGetClientIP = ipBlocker.getClientIP as jest.MockedFunction<typeof ipBlocker.getClientIP>;
const mockBlockIP = ipBlocker.blockIP as jest.MockedFunction<typeof ipBlocker.blockIP>;

// Mock NextRequest simples
const createMockRequest = (url: string = 'http://localhost:3000/api/test') => {
  return {
    nextUrl: {
      pathname: new URL(url).pathname
    }
  } as any;
};

describe('Rate Limiter', () => {
  beforeEach(() => {
    clearRateLimitStore();
    jest.clearAllMocks();
    mockGetClientIP.mockReturnValue('192.168.1.100');
  });

  afterEach(() => {
    jest.clearAllMocks();
    clearRateLimitStore();
  });

  afterAll(() => {
    stopCleanupInterval();
  });

  describe('RateLimiter Class', () => {
    it('deve criar instância com configuração básica', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000,
        message: 'Limite excedido'
      };
      
      const limiter = new RateLimiter(config);
      
      expect(limiter.maxRequests).toBe(5);
    });

    it('deve permitir requests dentro do limite', async () => {
      const limiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000
      });
      
      const request = createMockRequest();
      
      // Primeira request
      const result1 = await limiter.checkLimit(request);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(2);
      
      // Segunda request
      const result2 = await limiter.checkLimit(request);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(1);
      
      // Terceira request
      const result3 = await limiter.checkLimit(request);
      expect(result3.allowed).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it('deve bloquear quando exceder o limite', async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 60000,
        message: 'Muitas tentativas'
      });
      
      const request = createMockRequest();
      
      // Duas requests permitidas
      await limiter.checkLimit(request);
      await limiter.checkLimit(request);
      
      // Terceira request deve ser bloqueada
      const result = await limiter.checkLimit(request);
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.response).toBeDefined();
    });

    it('deve resetar contador após janela de tempo', async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000 // 1 segundo
      });
      
      const request = createMockRequest();
      
      // Mock Date.now para controlar tempo
      const originalNow = Date.now;
      let currentTime = 1000000000000;
      Date.now = jest.fn(() => currentTime);
      
      // Esgota o limite
      await limiter.checkLimit(request);
      await limiter.checkLimit(request);
      
      const blockedResult = await limiter.checkLimit(request);
      expect(blockedResult.allowed).toBe(false);
      
      // Avança o tempo além da janela
      currentTime += 2000; // 2 segundos
      
      // Deve permitir novamente
      const allowedResult = await limiter.checkLimit(request);
      expect(allowedResult.allowed).toBe(true);
      
      Date.now = originalNow;
    });

    it('deve tratar IPs diferentes independentemente', async () => {
      const limiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 60000
      });
      
      const request = createMockRequest();
      
      // IP 1
      mockGetClientIP.mockReturnValue('192.168.1.1');
      const result1 = await limiter.checkLimit(request);
      expect(result1.allowed).toBe(true);
      
      // Esgota limite para IP 1
      const result2 = await limiter.checkLimit(request);
      expect(result2.allowed).toBe(false);
      
      // IP 2 deve ainda ter limite disponível
      mockGetClientIP.mockReturnValue('192.168.1.2');
      const result3 = await limiter.checkLimit(request);
      expect(result3.allowed).toBe(true);
    });
  });

  describe('Configurações', () => {
    it('deve usar configuração padrão quando não especificada', () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        windowMs: 60000
      });
      
      expect(limiter.maxRequests).toBe(5);
    });

    it('deve aceitar configuração personalizada', () => {
      const customMessage = 'Limite personalizado excedido';
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 120000,
        message: customMessage
      });
      
      expect(limiter.maxRequests).toBe(10);
    });
  });

  describe('Integração com IP Blocker', () => {
    it('deve chamar getClientIP para obter IP do request', async () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        windowMs: 60000
      });
      
      const request = createMockRequest();
      await limiter.checkLimit(request);
      
      expect(mockGetClientIP).toHaveBeenCalledWith(request);
    });

    it('deve usar IP retornado pelo getClientIP como chave', async () => {
      const limiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 60000
      });
      
      const request = createMockRequest();
      
      // Configura IP específico
      mockGetClientIP.mockReturnValue('10.0.0.1');
      
      // Primeira request deve passar
      const result1 = await limiter.checkLimit(request);
      expect(result1.allowed).toBe(true);
      
      // Segunda request deve ser bloqueada (mesmo IP)
      const result2 = await limiter.checkLimit(request);
      expect(result2.allowed).toBe(false);
      
      // Muda para IP diferente
      mockGetClientIP.mockReturnValue('10.0.0.2');
      
      // Nova request deve passar (IP diferente)
      const result3 = await limiter.checkLimit(request);
      expect(result3.allowed).toBe(true);
    });
  });

  describe('Limpeza de dados', () => {
    it('deve limpar dados expirados automaticamente', async () => {
      const limiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 1000 // 1 segundo
      });
      
      const request = createMockRequest();
      
      // Mock Date.now
      const originalNow = Date.now;
      let currentTime = 1000000000000;
      Date.now = jest.fn(() => currentTime);
      
      // Esgota limite
      await limiter.checkLimit(request);
      const blockedResult = await limiter.checkLimit(request);
      expect(blockedResult.allowed).toBe(false);
      
      // Avança tempo para expirar dados
      currentTime += 2000; // 2 segundos
      
      // Nova request deve passar (dados expirados foram limpos)
      const newResult = await limiter.checkLimit(request);
      expect(newResult.allowed).toBe(true);
      expect(newResult.remaining).toBe(0); // Primeira request da nova janela
      
      Date.now = originalNow;
    });
  });
});