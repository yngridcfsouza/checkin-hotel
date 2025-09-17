// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options) => ({
    nextUrl: { pathname: new URL(url || 'http://localhost:3000').pathname },
    headers: new Map(Object.entries(options?.headers || {})),
    ip: options?.ip || '127.0.0.1',
    ...options
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => {
      const headersMap = new Map(Object.entries(init?.headers || {}));
      return {
        json: () => Promise.resolve(data),
        status: init?.status || 200,
        headers: {
          get: (name) => headersMap.get(name.toLowerCase()),
          has: (name) => headersMap.has(name.toLowerCase()),
          set: (name, value) => headersMap.set(name.toLowerCase(), value),
          forEach: (callback) => headersMap.forEach(callback)
        },
        ...init
      };
    }),
    next: jest.fn().mockReturnValue({ next: true })
  }
}))

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.DATABASE_URL = 'file:./test.db'

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}

// Mock fetch globally
global.fetch = jest.fn()

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})