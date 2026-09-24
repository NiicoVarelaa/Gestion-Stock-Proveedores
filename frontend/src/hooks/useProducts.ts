import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';
import type { Product } from '@/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  supplierId?: string;
  search?: string;
}

export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  minStock?: number;
  supplierId: string;
  image?: File | null;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  price?: number;
  minStock?: number;
  supplierId?: string;
  image?: File | null;
  imageUrl?: string;
}

const buildProductPayload = (data: CreateProductInput | UpdateProductInput) => {
  const { image, ...jsonFields } = data;
  if (!image) return jsonFields;
  const formData = new FormData();
  Object.entries(jsonFields).forEach(([key, value]) => {
    if (value !== undefined && key !== 'imageUrl') formData.append(key, String(value));
  });
  formData.append('image', image);
  return formData;
};

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<{ products: Product[]; total: number }>({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/products', { params: filters });
      return { products: data.data || [], total: data.total || 0 };
    },
    placeholderData: keepPreviousData,
  });
}

export function useLowStock() {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.lowStock,
    queryFn: async () => {
      const { data } = await api.get('/products/low-stock');
      return (data.data || []) as Product[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const payload = buildProductPayload(input);
      if (payload instanceof FormData) {
        await api.post('/products', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/products', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductInput }) => {
      const payload = buildProductPayload(data);
      if (payload instanceof FormData) {
        await api.put(`/products/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.put(`/products/${id}`, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lowStock });
    },
  });
}