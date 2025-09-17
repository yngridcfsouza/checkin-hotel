import { NextRequest } from 'next/server';
import {
  getClientIP,
  isIPBlocked,
  blockIP,
  cleanupExpiredBlocks,
  getBlockedIPsCount,
  clearBlockedIPs
} from '../ip-blocker';

// Mock NextRequest
const createMockRequest = (headers: Record<string, string> = {}) => {
  const mockHeaders = new Map(Object.entries(headers));
  return {
    headers: {
      get: (key: string) => mockHeaders.get(key) || null
    }
  } as NextRequest;
};

describe('IP Blocker', () => {
  beforeEach(() => {
    clearBlockedIPs();
  });

  afterEach(() => {
    clearBlockedIPs();
  });

  describe('getClientIP', () => {
    it('deve extrair IP do header cf-connecting-ip', () => {
      const request = createMockRequest({
        'cf-connecting-ip': '192.168.1.100'
      });
      
      expect(getClientIP(request)).toBe('192.168.1.100');
    });

    it('deve extrair IP do header x-real-ip quando cf-connecting-ip não existe', () => {
      const request = createMockRequest({
        'x-real-ip': '192.168.1.101'
      });
      
      expect(getClientIP(request)).toBe('192.168.1.101');
    });

    it('deve extrair primeiro IP do header x-forwarded-for', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.102, 10.0.0.1, 172.16.0.1'
      });
      
      expect(getClientIP(request)).toBe('192.168.1.102');
    });

    it('deve priorizar cf-connecting-ip sobre outros headers', () => {
      const request = createMockRequest({
        'cf-connecting-ip': '192.168.1.100',
        'x-real-ip': '192.168.1.101',
        'x-forwarded-for': '192.168.1.102'
      });
      
      expect(getClientIP(request)).toBe('192.168.1.100');
    });

    it('deve retornar "unknown" quando não há headers de IP', () => {
      const request = createMockRequest({});
      
      expect(getClientIP(request)).toBe('unknown');
    });
  });

  describe('blockIP e isIPBlocked', () => {
    const testIP = '192.168.1.200';

    it('deve bloquear um IP corretamente', () => {
      expect(isIPBlocked(testIP)).toBe(false);
      
      blockIP(testIP, 'Teste de bloqueio');
      
      expect(isIPBlocked(testIP)).toBe(true);
    });

    it('deve usar motivo padrão quando não especificado', () => {
      blockIP(testIP);
      
      expect(isIPBlocked(testIP)).toBe(true);
    });

    it('deve retornar false para IP não bloqueado', () => {
      expect(isIPBlocked('192.168.1.999')).toBe(false);
    });

    it('deve desbloquear IP após expiração simulada', () => {
      // Mock Date.now para simular passagem de tempo
      const originalNow = Date.now;
      const startTime = 1000000000000; // Timestamp fixo
      
      Date.now = jest.fn(() => startTime);
      
      blockIP(testIP, 'Teste de expiração');
      expect(isIPBlocked(testIP)).toBe(true);
      
      // Simula 16 minutos depois (1 minuto além do limite de 15 min)
      Date.now = jest.fn(() => startTime + (16 * 60 * 1000));
      
      expect(isIPBlocked(testIP)).toBe(false);
      
      // Restaura Date.now original
      Date.now = originalNow;
    });
  });

  describe('cleanupExpiredBlocks', () => {
    it('deve remover IPs bloqueados expirados', () => {
      const originalNow = Date.now;
      const startTime = 1000000000000;
      
      Date.now = jest.fn(() => startTime);
      
      // Bloqueia alguns IPs
      blockIP('192.168.1.1', 'Teste 1');
      blockIP('192.168.1.2', 'Teste 2');
      
      expect(getBlockedIPsCount()).toBe(2);
      
      // Simula 16 minutos depois
      Date.now = jest.fn(() => startTime + (16 * 60 * 1000));
      
      cleanupExpiredBlocks();
      
      expect(getBlockedIPsCount()).toBe(0);
      
      Date.now = originalNow;
    });

    it('deve manter IPs bloqueados não expirados', () => {
      const originalNow = Date.now;
      const startTime = 1000000000000;
      
      Date.now = jest.fn(() => startTime);
      
      blockIP('192.168.1.1', 'Teste não expirado');
      
      // Simula 10 minutos depois (ainda dentro do limite)
      Date.now = jest.fn(() => startTime + (10 * 60 * 1000));
      
      cleanupExpiredBlocks();
      
      expect(getBlockedIPsCount()).toBe(1);
      expect(isIPBlocked('192.168.1.1')).toBe(true);
      
      Date.now = originalNow;
    });
  });

  describe('getBlockedIPsCount', () => {
    it('deve retornar 0 quando não há IPs bloqueados', () => {
      expect(getBlockedIPsCount()).toBe(0);
    });

    it('deve retornar contagem correta de IPs bloqueados', () => {
      blockIP('192.168.1.1');
      blockIP('192.168.1.2');
      blockIP('192.168.1.3');
      
      expect(getBlockedIPsCount()).toBe(3);
    });

    it('deve limpar IPs expirados antes de contar', () => {
      const originalNow = Date.now;
      const startTime = 1000000000000;
      
      Date.now = jest.fn(() => startTime);
      
      blockIP('192.168.1.1');
      blockIP('192.168.1.2');
      
      expect(getBlockedIPsCount()).toBe(2);
      
      // Simula expiração
      Date.now = jest.fn(() => startTime + (16 * 60 * 1000));
      
      expect(getBlockedIPsCount()).toBe(0);
      
      Date.now = originalNow;
    });
  });
});