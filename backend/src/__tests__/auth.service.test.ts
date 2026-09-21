import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockPrisma } from './mocks';

vi.mock('../config/database', () => ({ prisma: mockPrisma }));

const mockUser = {
  id: 'uuid-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
  password: '$2b$10$hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let authService: Awaited<typeof import('../services/auth.service')>['AuthService'] extends new () => infer T ? T : never;
  let mod: typeof import('../services/auth.service');

  beforeEach(async () => {
    vi.clearAllMocks();
    mod = await import('../services/auth.service');
    authService = new mod.AuthService();
  });

  describe('register', () => {
    it('crea usuario y retorna token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await authService.register('test@example.com', 'password123', 'Test User');

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('lanza error si el email ya existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        authService.register('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('login', () => {
    it('login exitoso con credenciales válidas', async () => {
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashedPassword });

      const result = await authService.login('test@example.com', 'password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('lanza error si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Credenciales inválidas');
    });

    it('lanza error si la contraseña es incorrecta', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Credenciales inválidas');
    });
  });
});

describe('setAuthCookie', () => {
  it('setea cookie con opciones correctas', async () => {
    const mod = await import('../services/auth.service');
    const res = { cookie: vi.fn() } as any;
    mod.setAuthCookie(res, 'test-token');

    expect(res.cookie).toHaveBeenCalledWith(
      'auth_token',
      'test-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      })
    );
  });
});

describe('clearAuthCookie', () => {
  it('limpia la cookie', async () => {
    const mod = await import('../services/auth.service');
    const res = { clearCookie: vi.fn() } as any;
    mod.clearAuthCookie(res);

    expect(res.clearCookie).toHaveBeenCalledWith('auth_token', { path: '/' });
  });
});
