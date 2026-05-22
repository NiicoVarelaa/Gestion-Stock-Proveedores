import { create } from 'zustand';
import api from '@/services/api';
import type { StockMovement } from '@/types';

interface MovementStore {
  movements: StockMovement[];
  loading: boolean;
  error: string | null;
  fetchMovements: (params?: { page?: number; limit?: number; productId?: string; type?: 'IN' | 'OUT'; from?: string; to?: string }) => Promise<void>;
  createMovement: (data: { type: 'IN' | 'OUT'; quantity: number; productId: string; reason?: string }) => Promise<void>;
}

export const useMovementStore = create<MovementStore>((set, get) => ({
  movements: [],
  loading: false,
  error: null,

  fetchMovements: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/stock-movements', { params });
      set({ movements: data.data || [] });
    } catch (err) {
      set({ error: 'Error al cargar movimientos' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createMovement: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/stock-movements', data);
      await get().fetchMovements();
    } catch (err) {
      set({ error: 'Error al registrar movimiento' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
