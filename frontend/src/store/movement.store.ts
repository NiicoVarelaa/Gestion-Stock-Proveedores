import { create } from 'zustand';
import api from '@/services/api';
import type { StockMovement } from '@/types';

interface MovementStore {
  movements: StockMovement[];
  loading: boolean;
  fetchMovements: (params?: { page?: number; limit?: number; productId?: string; type?: 'IN' | 'OUT'; from?: string; to?: string }) => Promise<void>;
  createMovement: (data: { type: 'IN' | 'OUT'; quantity: number; productId: string; reason?: string }) => Promise<void>;
}

export const useMovementStore = create<MovementStore>((set, get) => ({
  movements: [],
  loading: false,

  fetchMovements: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/stock-movements', { params });
      set({ movements: data.data || [] });
    } finally {
      set({ loading: false });
    }
  },

  createMovement: async (data) => {
    await api.post('/stock-movements', data);
    await get().fetchMovements();
  },
}));
