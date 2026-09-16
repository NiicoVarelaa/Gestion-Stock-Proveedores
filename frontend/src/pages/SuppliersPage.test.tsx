import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import SuppliersPage from './SuppliersPage';
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
  useSupplierStore.setState({ suppliers: [], total: 0, loading: false, error: null });
});

describe('SuppliersPage', () => {
  it('renderiza el título', () => {
    render(
      <MemoryRouter>
        <TooltipProvider><SuppliersPage /></TooltipProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Proveedores')).toBeInTheDocument();
  });

  it('muestra el botón de nuevo proveedor', () => {
    render(
      <MemoryRouter>
        <TooltipProvider><SuppliersPage /></TooltipProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Nuevo Proveedor')).toBeInTheDocument();
  });

  it('muestra campo de búsqueda', () => {
    render(
      <MemoryRouter>
        <TooltipProvider><SuppliersPage /></TooltipProvider>
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Buscar por nombre o email...')).toBeInTheDocument();
  });
});
