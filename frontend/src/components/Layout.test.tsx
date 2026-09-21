import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Layout from './Layout';
import { ThemeProvider } from './ThemeProvider';
import { useAuthStore } from '@/store/auth.store';

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: { user: null } } }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: { response: { use: vi.fn() } },
  },
}));

function renderLayout(initialRoute = '/') {
  useAuthStore.setState({
    user: { id: '1', email: 'test@test.com', name: 'Test User', role: 'ADMIN' },
    loading: false,
    initialized: true,
    isAuthenticated: true,
  });

  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Layout />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Layout', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renderiza el logo', () => {
    renderLayout();
    expect(screen.getAllByAltText('Flow Stock Logo').length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza el nombre de la app', () => {
    renderLayout();
    expect(screen.getAllByText('Flow Stock').length).toBeGreaterThanOrEqual(1);
  });

  it('muestra links de navegación', () => {
    renderLayout();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Proveedores').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Productos').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Movimientos').length).toBeGreaterThanOrEqual(1);
  });

  it('muestra información del usuario', () => {
    renderLayout();
    expect(screen.getAllByText('Test User').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('test@test.com').length).toBeGreaterThanOrEqual(1);
  });

  it('muestra botón de cerrar sesión', () => {
    renderLayout();
    expect(screen.getAllByText('Cerrar Sesión').length).toBeGreaterThanOrEqual(1);
  });

  it('resalta la ruta activa', () => {
    renderLayout('/products');
    const productsLinks = screen.getAllByText('Productos');
    const activeLink = productsLinks.find(el => el.closest('a')?.classList.contains('bg-sidebar-accent'));
    expect(activeLink).toBeInTheDocument();
  });

  it('muestra indicador de ruta activa', () => {
    renderLayout('/products');
    const productsLinks = screen.getAllByText('Productos');
    const linkWithIndicator = productsLinks.find(el =>
      el.closest('a')?.querySelector('.bg-primary')
    );
    expect(linkWithIndicator).toBeInTheDocument();
  });

  it('ejecuta logout al hacer click', async () => {
    const user = userEvent.setup();
    const mockLogout = vi.fn().mockResolvedValue(undefined);
    useAuthStore.setState({ logout: mockLogout });

    renderLayout();
    await user.click(screen.getAllByText('Cerrar Sesión')[0]);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('renderiza contenido del Outlet', () => {
    renderLayout();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
