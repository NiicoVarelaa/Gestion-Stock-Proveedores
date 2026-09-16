import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProductStore } from './product.store';
import api from '@/services/api';

vi.mock('@/services/api');

const mockApi = vi.mocked(api);

describe('productStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProductStore.setState({
      products: [],
      lowStock: [],
      total: 0,
      loading: false,
      lowStockLoading: false,
      error: null,
      lastFetchParams: {},
    });
  });

  describe('fetchProducts', () => {
    it('carga productos correctamente', async () => {
      const products = [
        { id: '1', name: 'Producto 1', category: 'Cat A', price: '100', stock: 10, minStock: 5, imageUrl: null, supplierId: 's1', supplier: {} as any, createdAt: '', updatedAt: '' },
      ];
      mockApi.get.mockResolvedValueOnce({ data: { data: products, total: 1 } });

      await useProductStore.getState().fetchProducts();

      const state = useProductStore.getState();
      expect(state.products).toEqual(products);
      expect(state.total).toBe(1);
      expect(state.loading).toBe(false);
    });

    it('setea error cuando falla', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(useProductStore.getState().fetchProducts()).rejects.toThrow();

      expect(useProductStore.getState().error).toBe('Error al cargar productos');
      expect(useProductStore.getState().loading).toBe(false);
    });
  });

  describe('createProduct', () => {
    it('crea producto sin imagen', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });
      mockApi.get
        .mockResolvedValueOnce({ data: { data: [], total: 0 } })
        .mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useProductStore.getState().createProduct({
        name: 'Nuevo',
        category: 'Cat',
        price: 50,
        supplierId: 's1',
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
      mockApi.get
        .mockResolvedValueOnce({ data: { data: [], total: 0 } })
        .mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useProductStore.getState().createProduct({
        name: 'Con imagen',
        category: 'Cat',
        price: 50,
        supplierId: 's1',
        image: file,
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        '/products',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });
  });

  describe('deleteProduct', () => {
    it('elimina producto por id', async () => {
      mockApi.delete.mockResolvedValueOnce({ data: {} });
      mockApi.get
        .mockResolvedValueOnce({ data: { data: [], total: 0 } })
        .mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await useProductStore.getState().deleteProduct('1');

      expect(mockApi.delete).toHaveBeenCalledWith('/products/1');
    });
  });
});
