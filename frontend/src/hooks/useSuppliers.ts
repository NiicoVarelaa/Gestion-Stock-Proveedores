import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

export interface SupplierFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateSupplierInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function useSuppliers(filters: SupplierFilters = {}) {
  return useQuery<{ suppliers: import('@/types').Supplier[]; total: number }>({
    queryKey: queryKeys.suppliers.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/suppliers', { params: filters });
      return { suppliers: data.data || [], total: data.total || 0 };
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateSupplierInput) => {
      await api.post('/suppliers', input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSupplierInput }) => {
      await api.put(`/suppliers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
}

export function useDeactivateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/suppliers/${id}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
}

