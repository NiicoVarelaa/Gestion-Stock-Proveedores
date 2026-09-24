import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsPage from './ProductsPage';

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
      <MemoryRouter><ProductsPage /></MemoryRouter>
    </QueryClientProvider>
  );

describe('ProductsPage', () => {
  it('renderiza el título', () => {
    renderPage();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('muestra el botón de nuevo producto', () => {
    renderPage();
    expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
  });

  it('muestra campo de búsqueda', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Buscar producto...')).toBeInTheDocument();
  });
});