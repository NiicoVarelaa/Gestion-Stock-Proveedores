import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      loading: false,
      initialized: false,
      isAuthenticated: false,
    });
  });

  describe('initialize', () => {
    it('setea el usuario cuando /auth/me responde', async () => {
      mockApi.get.mockResolvedValueOnce({
        data: { data: { user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' } } },
      });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.user).toEqual({ id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' });
      expect(state.isAuthenticated).toBe(true);
      expect(state.initialized).toBe(true);
    });

    it('no autentica cuando /auth/me falla', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Unauthorized'));

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.initialized).toBe(true);
    });
  });

  describe('login', () => {
    it('setea el usuario tras login exitoso', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { data: { user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' } } },
      });

      await useAuthStore.getState().login('test@test.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.user).toEqual({ id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' });
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('lanza error cuando las credenciales son inválidas', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(
        useAuthStore.getState().login('test@test.com', 'wrong')
      ).rejects.toThrow();

      expect(useAuthStore.getState().loading).toBe(false);
    });
  });

  describe('logout', () => {
    it('limpia el usuario y desautentica', async () => {
      mockApi.post.mockResolvedValueOnce({});

      useAuthStore.setState({
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' },
        isAuthenticated: true,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('crea cuenta y autentica al usuario', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { data: { user: { id: '2', email: 'new@test.com', name: 'New', role: 'ADMIN' } } },
      });

      await useAuthStore.getState().register('new@test.com', 'password123', 'New');

      const state = useAuthStore.getState();
      expect(state.user).toEqual({ id: '2', email: 'new@test.com', name: 'New', role: 'ADMIN' });
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
