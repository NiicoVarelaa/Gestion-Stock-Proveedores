import { create } from 'zustand';
import api from '@/services/api';

export interface DashboardMetrics {
  totalProducts: number;
  totalSuppliers: number;
  totalMovements: number;
  lowStockCount: number;
  totalStockUnits: number;
  totalInventoryValue: number;
  categoryDistribution: { category: string; count: number; stock: number }[];
  typeDistribution: { type: string; count: number; totalQuantity: number }[];
  movementsTrend: { date: string; IN: number; OUT: number }[];
  topProducts: { id: string; name: string; stock: number; category: string; imageUrl: string | null }[];
  recentMovements: {
    id: string;
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string | null;
    productName: string;
    category: string;
    createdAt: string;
  }[];
}

interface DashboardStore {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  metrics: null,
  loading: false,
  error: null,

  fetchMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/dashboard/metrics');
      set({ metrics: data.data });
    } catch {
      set({ error: 'Error al cargar métricas del dashboard' });
    } finally {
      set({ loading: false });
    }
  },
}));
