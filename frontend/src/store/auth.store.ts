import { create } from 'zustand';
import api from '@/services/api';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data.user, isAuthenticated: true, initialized: true });
    } catch {
      set({ initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.data.user, isAuthenticated: true });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      set({ user: data.data.user, isAuthenticated: true });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  forgotPassword: async (email: string) => {
    set({ loading: true });
    try {
      await api.post('/auth/forgot-password', { email });
    } finally {
      set({ loading: false });
    }
  },

  verifyResetCode: async (email: string, code: string) => {
    set({ loading: true });
    try {
      await api.post('/auth/verify-code', { email, code });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email: string, code: string, password: string) => {
    set({ loading: true });
    try {
      await api.post('/auth/reset-password', { email, code, password });
    } finally {
      set({ loading: false });
    }
  },
}));
