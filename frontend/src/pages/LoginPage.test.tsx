import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
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

function renderLoginPage() {
  useAuthStore.setState({ user: null, loading: false, initialized: true, isAuthenticated: false });
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renderiza el logo', () => {
    renderLoginPage();
    expect(screen.getByAltText('Flow Stock Logo')).toBeInTheDocument();
  });

  it('muestra heading de iniciar sesión', () => {
    renderLoginPage();
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('muestra campos de email y contraseña', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('muestra link de olvidé mi contraseña', () => {
    renderLoginPage();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  it('cambia a modo registro al hacer click', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(screen.getByRole('heading', { name: 'Crear Cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa los datos para registrarte')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
  });

  it('muestra link al registro', () => {
    renderLoginPage();
    expect(screen.getByText('¿No tenés cuenta?')).toBeInTheDocument();
  });
});
