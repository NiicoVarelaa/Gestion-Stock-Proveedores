import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDashboardStore } from './dashboard.store';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

describe('dashboardStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardStore.setState({
      metrics: null,
      loading: false,
      error: null,
    });
  });

  describe('fetchMetrics', () => {
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

      await useDashboardStore.getState().fetchMetrics();

      const state = useDashboardStore.getState();
      expect(state.metrics).toEqual(metrics);
      expect(state.loading).toBe(false);
    });

    it('setea error cuando falla', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      await useDashboardStore.getState().fetchMetrics();

      expect(useDashboardStore.getState().error).toBe('Error al cargar métricas del dashboard');
      expect(useDashboardStore.getState().loading).toBe(false);
    });
  });
});
