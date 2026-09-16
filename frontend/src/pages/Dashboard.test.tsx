import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useDashboardStore } from '@/store/dashboard.store';
import { useProductStore } from '@/store/product.store';
import { useMovementStore } from '@/store/movement.store';
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
  useDashboardStore.setState({ metrics: null, loading: false, error: null });
  useProductStore.setState({ lowStock: [], loading: false, lowStockLoading: false });
  useMovementStore.setState({ movements: [], loading: false });
  useSupplierStore.setState({ suppliers: [], loading: false });
});

describe('Dashboard', () => {
  it('renderiza el título', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('muestra sección de movimientos recientes', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByText('Últimos Movimientos')).toBeInTheDocument();
  });

  it('muestra gráficos', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByText('Tendencia de Movimientos (7 días)')).toBeInTheDocument();
    expect(screen.getByText('Productos por Categoría')).toBeInTheDocument();
    expect(screen.getByText('Stock por Categoría')).toBeInTheDocument();
    expect(screen.getByText('Distribución Entradas/Salidas')).toBeInTheDocument();
  });
});
