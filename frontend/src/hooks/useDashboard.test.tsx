import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useDashboardMetrics } from './useDashboard';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useDashboardMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga métricas correctamente', async () => {
    const metrics = {
      totalProducts: 10,
      totalSuppliers: 5,
      totalMovements: 100,
      lowStockCount: 2,
      totalStockUnits: 500,
      totalInventoryValue: 25000,
      categoryDistribution: [],
      typeDistribution: [],
      movementsTrend: [],
      topProducts: [],
      recentMovements: [],
    };
    mockApi.get.mockResolvedValueOnce({ data: { data: metrics } });

    const { result } = renderHook(() => useDashboardMetrics(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(metrics);
  });
});