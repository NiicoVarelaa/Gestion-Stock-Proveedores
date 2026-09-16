import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMovementStore } from './movement.store';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

describe('movementStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMovementStore.setState({
      movements: [],
      total: 0,
      loading: false,
      error: null,
      lastFetchParams: {},
    });
  });

  describe('fetchMovements', () => {
    it('carga movimientos correctamente', async () => {
      const movements = [
        { id: '1', type: 'IN', quantity: 10, reason: 'Compra', productId: 'p1', product: {} as any, createdAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: movements, total: 1 } });

      await useMovementStore.getState().fetchMovements();

      const state = useMovementStore.getState();
      expect(state.movements).toEqual(movements);
      expect(state.total).toBe(1);
      expect(state.loading).toBe(false);
    });

    it('setea error cuando falla', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(useMovementStore.getState().fetchMovements()).rejects.toThrow();

      expect(useMovementStore.getState().error).toBe('Error al cargar movimientos');
      expect(useMovementStore.getState().loading).toBe(false);
    });
  });

  describe('createMovement', () => {
    it('crea movimiento y recarga la lista', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useMovementStore.getState().createMovement({
        type: 'IN',
        quantity: 10,
        productId: 'p1',
        reason: 'Compra',
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
