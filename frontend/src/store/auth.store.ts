import { create } from 'zustand';
import api from '@/services/api';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

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
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false });
  },
}));
