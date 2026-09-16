import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSupplierStore } from './supplier.store';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

describe('supplierStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSupplierStore.setState({
      suppliers: [],
      total: 0,
      loading: false,
      error: null,
      lastFetchParams: {},
    });
  });

  describe('fetchSuppliers', () => {
    it('carga proveedores correctamente', async () => {
      const suppliers = [
        { id: '1', name: 'Proveedor 1', email: 'prov@test.com', phone: null, address: null, active: true, createdAt: '', updatedAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: suppliers, total: 1 } });

      const result = await useSupplierStore.getState().fetchSuppliers();

      const state = useSupplierStore.getState();
      expect(state.suppliers).toEqual(suppliers);
      expect(state.total).toBe(1);
      expect(result.total).toBe(1);
    });
  });

  describe('createSupplier', () => {
    it('crea proveedor y recarga la lista', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useSupplierStore.getState().createSupplier({
        name: 'Nuevo',
        email: 'nuevo@test.com',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/suppliers', {
        name: 'Nuevo',
        email: 'nuevo@test.com',
      });
    });
  });

  describe('updateSupplier', () => {
    it('actualiza proveedor por id', async () => {
      mockApi.put.mockResolvedValueOnce({ data: {} });
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useSupplierStore.getState().updateSupplier('1', { name: 'Actualizado' });

      expect(mockApi.put).toHaveBeenCalledWith('/suppliers/1', { name: 'Actualizado' });
    });
  });

  describe('deactivateSupplier', () => {
    it('desactiva proveedor por id', async () => {
      mockApi.patch.mockResolvedValueOnce({ data: {} });
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useSupplierStore.getState().deactivateSupplier('1');

      expect(mockApi.patch).toHaveBeenCalledWith('/suppliers/1/deactivate');
    });
  });
});
