import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useProducts, useLowStock, useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProducts';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('query', () => {
    it('carga productos correctamente', async () => {
      const products = [
        { id: '1', name: 'Producto 1', category: 'Cat A', price: '100', stock: 10, minStock: 5, imageUrl: null, supplierId: 's1', supplier: {} as never, createdAt: '', updatedAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: products, total: 1 } });

      const { result } = renderHook(() => useProducts(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.products).toEqual(products);
      expect(result.current.data?.total).toBe(1);
    });

    it('envía los filtros como params', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });

      renderHook(() => useProducts({ page: 2, search: 'teclado' }), { wrapper });

      await waitFor(() => expect(mockApi.get).toHaveBeenCalled());
      expect(mockApi.get).toHaveBeenCalledWith('/products', { params: { page: 2, search: 'teclado' } });
    });
  });

  describe('useLowStock', () => {
    it('carga productos con stock bajo', async () => {
      const lowStock = [
        { id: '2', name: 'Bajo', category: 'Cat', price: '10', stock: 2, minStock: 5, imageUrl: null, supplierId: 's1', supplier: {} as never, createdAt: '', updatedAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: lowStock } });

      const { result } = renderHook(() => useLowStock(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(lowStock);
    });
  });

  describe('useCreateProduct', () => {
    it('crea producto sin imagen', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useCreateProduct(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          name: 'Nuevo',
          category: 'Cat',
          price: 50,
          supplierId: 's1',
        });
      });

      expect(mockApi.post).toHaveBeenCalledWith('/products', {
        name: 'Nuevo',
        category: 'Cat',
        price: 50,
        supplierId: 's1',
      });
    });

    it('crea producto con imagen usando FormData', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      mockApi.post.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useCreateProduct(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          name: 'Con imagen',
          category: 'Cat',
          price: 50,
          supplierId: 's1',
          image: file,
        });
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        '/products',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });
  });

  describe('useUpdateProduct', () => {
    it('actualiza producto por id', async () => {
      mockApi.put.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useUpdateProduct(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ id: '1', data: { name: 'Actualizado' } });
      });

      expect(mockApi.put).toHaveBeenCalledWith('/products/1', { name: 'Actualizado' });
    });
  });

  describe('useDeleteProduct', () => {
    it('elimina producto por id', async () => {
      mockApi.delete.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useDeleteProduct(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('1');
      });

      expect(mockApi.delete).toHaveBeenCalledWith('/products/1');
    });
  });
});