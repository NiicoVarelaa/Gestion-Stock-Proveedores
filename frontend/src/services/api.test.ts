import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInterceptorsUse = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: { response: { use: mockInterceptorsUse } },
      get: vi.fn(),
      post: vi.fn(),
    })),
  },
}));

type LocationLike = Pick<Location, 'href'> & { assign?: never };

const mockLocation = (href: string): void => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { href } satisfies LocationLike,
  });
};

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('configura baseURL y withCredentials', async () => {
    const axios = (await import('axios')).default;
    await import('./api');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      withCredentials: true,
    });
  });

  it('configura interceptor de respuesta', async () => {
    await import('./api');
    expect(mockInterceptorsUse).toHaveBeenCalled();
  });

  it('redirige a /login en 401 (excepto /auth/me)', async () => {
    await import('./api');

    const errorHandler = mockInterceptorsUse.mock.calls[0][1];

    mockLocation('');

    await expect(errorHandler({
      response: { status: 401 },
      config: { url: '/api/products' },
    })).rejects.toThrow();

    expect(window.location.href).toBe('/login');
  });

  it('NO redirige en 401 si la URL es /auth/me', async () => {
    await import('./api');

    const errorHandler = mockInterceptorsUse.mock.calls[0][1];

    mockLocation('');

    await expect(errorHandler({
      response: { status: 401 },
      config: { url: '/auth/me' },
    })).rejects.toThrow();

    expect(window.location.href).toBe('');
  });

  it('NO redirige en otros códigos de error', async () => {
    await import('./api');

    const errorHandler = mockInterceptorsUse.mock.calls[0][1];

    mockLocation('');

    await expect(errorHandler({
      response: { status: 500 },
      config: { url: '/api/products' },
    })).rejects.toThrow();

    expect(window.location.href).toBe('');
  });
});
