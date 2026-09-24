import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Dashboard';

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

let queryClient: QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
});

const renderPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter><Dashboard /></MemoryRouter>
    </QueryClientProvider>
  );

describe('Dashboard', () => {
  it('renderiza el título', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('muestra sección de movimientos recientes', () => {
    renderPage();
    expect(screen.getByText('Últimos Movimientos')).toBeInTheDocument();
  });

  it('muestra gráficos', () => {
    renderPage();
    expect(screen.getByText('Tendencia de Movimientos (7 días)')).toBeInTheDocument();
    expect(screen.getByText('Productos por Categoría')).toBeInTheDocument();
    expect(screen.getByText('Stock por Categoría')).toBeInTheDocument();
    expect(screen.getByText('Distribución Entradas/Salidas')).toBeInTheDocument();
  });
});