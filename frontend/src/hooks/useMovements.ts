import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

export interface MovementFilters {
  page?: number;
  limit?: number;
  productId?: string;
  type?: 'IN' | 'OUT';
  from?: string;
  to?: string;
  supplierId?: string;
  category?: string;
}

export interface CreateMovementInput {
  type: 'IN' | 'OUT';
  quantity: number;
  productId: string;
  reason?: string;
}

export function useMovements(filters: MovementFilters = {}) {
  return useQuery<{ movements: import('@/types').StockMovement[]; total: number }>({
    queryKey: queryKeys.movements.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/stock-movements', { params: filters });
      return { movements: data.data || [], total: data.total || 0 };
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMovementInput) => {
      const { data } = await api.post('/stock-movements', input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}