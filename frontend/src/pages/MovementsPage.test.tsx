import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovementsPage from './MovementsPage';
import { useMovementStore } from '@/store/movement.store';
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
  useMovementStore.setState({ movements: [], total: 0, loading: false, error: null });
  useProductStore.setState({ products: [], loading: false });
  useSupplierStore.setState({ suppliers: [], loading: false });
});

describe('MovementsPage', () => {
  it('renderiza el título', () => {
    render(<MemoryRouter><MovementsPage /></MemoryRouter>);
    expect(screen.getByText('Movimientos de Stock')).toBeInTheDocument();
  });

  it('muestra el botón de nuevo movimiento', () => {
    render(<MemoryRouter><MovementsPage /></MemoryRouter>);
    expect(screen.getByText('Nuevo Movimiento')).toBeInTheDocument();
  });

  it('muestra filtros', () => {
    render(<MemoryRouter><MovementsPage /></MemoryRouter>);
    expect(screen.getByText('Todos los tipos')).toBeInTheDocument();
    expect(screen.getByText('Todos los proveedores')).toBeInTheDocument();
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
  });
});
