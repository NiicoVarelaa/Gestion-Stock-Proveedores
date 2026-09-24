import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovementsPage from './MovementsPage';

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
      <MemoryRouter><MovementsPage /></MemoryRouter>
    </QueryClientProvider>
  );

describe('MovementsPage', () => {
  it('renderiza el título', () => {
    renderPage();
    expect(screen.getByText('Movimientos de Stock')).toBeInTheDocument();
  });

  it('muestra el botón de nuevo movimiento', () => {
    renderPage();
    expect(screen.getByText('Nuevo Movimiento')).toBeInTheDocument();
  });

  it('muestra filtros', () => {
    renderPage();
    expect(screen.getByText('Todos los tipos')).toBeInTheDocument();
    expect(screen.getByText('Todos los proveedores')).toBeInTheDocument();
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
  });
});