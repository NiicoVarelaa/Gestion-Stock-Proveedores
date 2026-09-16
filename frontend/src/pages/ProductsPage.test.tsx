import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import { useProductStore } from '@/store/product.store';
import { useSupplierStore } from '@/store/supplier.store';

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: [], total: 0 } }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: { response: { use: vi.fn() } },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  useProductStore.setState({ products: [], total: 0, loading: false, error: null });
  useSupplierStore.setState({ suppliers: [], loading: false });
});

describe('ProductsPage', () => {
  it('renderiza el título', () => {
    render(<MemoryRouter><ProductsPage /></MemoryRouter>);
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('muestra el botón de nuevo producto', () => {
    render(<MemoryRouter><ProductsPage /></MemoryRouter>);
    expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
  });

  it('muestra campo de búsqueda', () => {
    render(<MemoryRouter><ProductsPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText('Buscar producto...')).toBeInTheDocument();
  });

  it('muestra skeleton de carga inicialmente', () => {
    useProductStore.setState({ products: [], total: 0, loading: true, error: null });
    render(<MemoryRouter><ProductsPage /></MemoryRouter>);
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});
