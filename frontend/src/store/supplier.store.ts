import { create } from 'zustand';
import api from '@/services/api';
import type { Supplier } from '@/types';

interface SupplierStore {
  suppliers: Supplier[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchSuppliers: (params?: { page?: number; limit?: number; search?: string }) => Promise<{ total: number }>;
  createSupplier: (data: { name: string; email: string; phone?: string; address?: string }) => Promise<void>;
  updateSupplier: (id: string, data: { name?: string; email?: string; phone?: string; address?: string }) => Promise<void>;
  deactivateSupplier: (id: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],
  total: 0,
  loading: false,
  error: null,

  fetchSuppliers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/suppliers', { params });
      set({ suppliers: data.data || [], total: data.total || 0 });
      return { total: data.total || 0 };
    } catch (err) {
      set({ error: 'Error al cargar proveedores' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createSupplier: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/suppliers', data);
      await get().fetchSuppliers();
    } catch (err) {
      set({ error: 'Error al crear proveedor' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateSupplier: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/suppliers/${id}`, data);
      await get().fetchSuppliers();
    } catch (err) {
      set({ error: 'Error al actualizar proveedor' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deactivateSupplier: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/suppliers/${id}`);
      await get().fetchSuppliers();
    } catch (err) {
      set({ error: 'Error al desactivar proveedor' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
