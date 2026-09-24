import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMovements, useCreateMovement } from './useMovements';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useMovements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('query', () => {
    it('carga movimientos correctamente', async () => {
      const movements = [
        { id: '1', type: 'IN', quantity: 10, reason: 'Compra', productId: 'p1', product: {} as never, createdAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: movements, total: 1 } });

      const { result } = renderHook(() => useMovements(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.movements).toEqual(movements);
      expect(result.current.data?.total).toBe(1);
    });
  });

  describe('useCreateMovement', () => {
    it('crea movimiento llamando POST', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { data: {} } });

      const { result } = renderHook(() => useCreateMovement(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          type: 'IN',
          quantity: 10,
          productId: 'p1',
          reason: 'Compra',
        });
      });

      expect(mockApi.post).toHaveBeenCalledWith('/stock-movements', {
        type: 'IN',
        quantity: 10,
        productId: 'p1',
        reason: 'Compra',
      });
    });
  });
});