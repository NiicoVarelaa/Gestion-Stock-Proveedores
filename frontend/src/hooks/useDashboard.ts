import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

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

export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: async () => {
      const { data } = await api.get('/dashboard/metrics');
      return (data.data || null) as DashboardMetrics | null;
    },
    staleTime: 60_000,
  });
}