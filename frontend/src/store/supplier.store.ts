import { create } from 'zustand';
import api from '@/services/api';
import type { Supplier } from '@/types';

interface SupplierStore {
  suppliers: Supplier[];
  loading: boolean;
  fetchSuppliers: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  createSupplier: (data: { name: string; email: string; phone?: string; address?: string }) => Promise<void>;
  updateSupplier: (id: string, data: { name?: string; email?: string; phone?: string; address?: string }) => Promise<void>;
  deactivateSupplier: (id: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],
  loading: false,

  fetchSuppliers: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/suppliers', { params });
      set({ suppliers: data.data || [] });
    } finally {
      set({ loading: false });
    }
  },

  createSupplier: async (data) => {
    await api.post('/suppliers', data);
    await get().fetchSuppliers();
  },

  updateSupplier: async (id, data) => {
    await api.put(`/suppliers/${id}`, data);
    await get().fetchSuppliers();
  },

  deactivateSupplier: async (id) => {
    await api.delete(`/suppliers/${id}`);
    await get().fetchSuppliers();
  },
}));
