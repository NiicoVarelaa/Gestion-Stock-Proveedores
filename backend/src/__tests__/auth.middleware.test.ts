import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars-long';

describe('authMiddleware', () => {
  let authMiddleware: any;
  let mod: typeof import('../middlewares/auth');

  beforeEach(async () => {
    vi.clearAllMocks();
    mod = await import('../middlewares/auth');
    authMiddleware = mod.authMiddleware;
  });

  it('pasa si el token es válido', () => {
    const token = jwt.sign(
      { id: 'user-1', email: 'test@test.com', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const req = { cookies: { auth_token: token } } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user-1');
  });

  it('rechaza si no hay token', () => {
    const req = { cookies: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('rechaza si el token es inválido', () => {
    const req = { cookies: { auth_token: 'invalid-token' } } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('rechaza si el token está expirado', () => {
    const token = jwt.sign(
      { id: 'user-1', email: 'test@test.com', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '0s' }
    );

    const req = { cookies: { auth_token: token } } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });
});
