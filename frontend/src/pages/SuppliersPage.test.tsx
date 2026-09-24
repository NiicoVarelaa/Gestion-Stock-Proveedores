import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import SuppliersPage from './SuppliersPage';

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
      <MemoryRouter>
        <TooltipProvider><SuppliersPage /></TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

describe('SuppliersPage', () => {
  it('renderiza el título', () => {
    renderPage();
    expect(screen.getByText('Proveedores')).toBeInTheDocument();
  });

  it('muestra el botón de nuevo proveedor', () => {
    renderPage();
    expect(screen.getByText('Nuevo Proveedor')).toBeInTheDocument();
  });

  it('muestra campo de búsqueda', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Buscar por nombre o email...')).toBeInTheDocument();
  });
});