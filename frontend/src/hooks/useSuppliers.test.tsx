import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeactivateSupplier } from './useSuppliers';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useSuppliers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('query', () => {
    it('carga proveedores correctamente', async () => {
      const suppliers = [
        { id: '1', name: 'Proveedor 1', email: 'prov@test.com', phone: null, address: null, active: true, createdAt: '', updatedAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: suppliers, total: 1 } });

      const { result } = renderHook(() => useSuppliers(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.suppliers).toEqual(suppliers);
      expect(result.current.data?.total).toBe(1);
    });
  });

  describe('useCreateSupplier', () => {
    it('crea proveedor llamando POST', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useCreateSupplier(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ name: 'Nuevo', email: 'nuevo@test.com' });
      });

      expect(mockApi.post).toHaveBeenCalledWith('/suppliers', { name: 'Nuevo', email: 'nuevo@test.com' });
    });
  });

  describe('useUpdateSupplier', () => {
    it('actualiza proveedor por id', async () => {
      mockApi.put.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useUpdateSupplier(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ id: '1', data: { name: 'Actualizado' } });
      });

      expect(mockApi.put).toHaveBeenCalledWith('/suppliers/1', { name: 'Actualizado' });
    });
  });

  describe('useDeactivateSupplier', () => {
    it('desactiva proveedor por id', async () => {
      mockApi.patch.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useDeactivateSupplier(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('1');
      });

      expect(mockApi.patch).toHaveBeenCalledWith('/suppliers/1/deactivate');
    });
  });
});