import { render, screen } from '@testing-library/react';
import App from './App';
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

vi.mock('@/pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('@/pages/ResetPasswordPage', () => ({
  default: () => <div data-testid="reset-password-page">Reset Password Page</div>,
}));

vi.mock('@/pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

vi.mock('@/pages/SuppliersPage', () => ({
  default: () => <div data-testid="suppliers-page">Suppliers Page</div>,
}));

vi.mock('@/pages/ProductsPage', () => ({
  default: () => <div data-testid="products-page">Products Page</div>,
}));

vi.mock('@/pages/MovementsPage', () => ({
  default: () => <div data-testid="movements-page">Movements Page</div>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      loading: false,
      initialized: true,
      isAuthenticated: false,
    });
  });

  it('llama initialize al montar', async () => {
    const mockInitialize = vi.fn().mockResolvedValue(undefined);
    useAuthStore.setState({ initialize: mockInitialize });

    render(<App />);

    expect(mockInitialize).toHaveBeenCalled();
  });

  it('renderiza la página de login en /login', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renderiza la página de reset password en /reset-password', () => {
    window.history.pushState({}, '', '/reset-password');
    render(<App />);

    expect(screen.getByTestId('reset-password-page')).toBeInTheDocument();
  });

  it('redirige a login cuando no está autenticado en ruta protegida', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
  });

  it('renderiza dashboard cuando está autenticado', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' },
      isAuthenticated: true,
    });

    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renderiza suppliers cuando está autenticado', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' },
      isAuthenticated: true,
    });

    window.history.pushState({}, '', '/suppliers');
    render(<App />);

    expect(screen.getByTestId('suppliers-page')).toBeInTheDocument();
  });

  it('renderiza products cuando está autenticado', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' },
      isAuthenticated: true,
    });

    window.history.pushState({}, '', '/products');
    render(<App />);

    expect(screen.getByTestId('products-page')).toBeInTheDocument();
  });

  it('renderiza movements cuando está autenticado', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' },
      isAuthenticated: true,
    });

    window.history.pushState({}, '', '/movements');
    render(<App />);

    expect(screen.getByTestId('movements-page')).toBeInTheDocument();
  });
});
