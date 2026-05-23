import { create } from 'zustand';
import api from '@/services/api';
import type { Product } from '@/types';

interface ProductStore {
  products: Product[];
  lowStock: Product[];
  total: number;
  loading: boolean;
  lowStockLoading: boolean;
  error: string | null;
  fetchProducts: (params?: { page?: number; limit?: number; category?: string; supplierId?: string; search?: string }) => Promise<void>;
  fetchLowStock: () => Promise<void>;
  createProduct: (data: { name: string; category: string; price: number; minStock?: number; supplierId: string }) => Promise<void>;
  updateProduct: (id: string, data: { name?: string; category?: string; price?: number; minStock?: number; supplierId?: string }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  lowStock: [],
  total: 0,
  loading: false,
  lowStockLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/products', { params });
      set({ products: data.data || [], total: data.total || 0 });
    } catch (err) {
      set({ error: 'Error al cargar productos' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchLowStock: async () => {
    set({ lowStockLoading: true });
    try {
      const { data } = await api.get('/products/low-stock');
      set({ lowStock: data.data || [] });
    } catch {
      set({ lowStock: [] });
    } finally {
      set({ lowStockLoading: false });
    }
  },

  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/products', data);
      await get().fetchProducts();
      await get().fetchLowStock();
    } catch (err) {
      set({ error: 'Error al crear producto' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/products/${id}`, data);
      await get().fetchProducts();
      await get().fetchLowStock();
    } catch (err) {
      set({ error: 'Error al actualizar producto' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      await get().fetchProducts();
      await get().fetchLowStock();
    } catch (err) {
      set({ error: 'Error al eliminar producto' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
