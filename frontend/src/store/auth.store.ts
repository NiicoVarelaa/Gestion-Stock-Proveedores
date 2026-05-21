import { create } from 'zustand';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token } = data.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      const { user, token } = data.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
