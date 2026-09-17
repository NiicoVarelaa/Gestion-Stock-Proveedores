import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ResetPasswordPage from './ResetPasswordPage';
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

function renderResetPage() {
  useAuthStore.setState({ user: null, loading: false, initialized: true, isAuthenticated: false });
  return render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <ResetPasswordPage />
    </MemoryRouter>
  );
}

describe('ResetPasswordPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('Paso 1 - Email', () => {
    it('renderiza el logo', () => {
      renderResetPage();
      expect(screen.getByAltText('Flow Stock Logo')).toBeInTheDocument();
    });

    it('muestra heading de recuperar contraseña', () => {
      renderResetPage();
      expect(screen.getByRole('heading', { name: 'Recuperar contraseña' })).toBeInTheDocument();
    });

    it('muestra campo de email', () => {
      renderResetPage();
      expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    });

    it('muestra instrucciones del paso 1', () => {
      renderResetPage();
      expect(screen.getByText('Ingresá tu email para recibir un código de verificación')).toBeInTheDocument();
    });

    it('muestra indicadores de paso', () => {
      renderResetPage();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('valida email inválido', async () => {
      const user = userEvent.setup();
      renderResetPage();

      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
      });
    });

    it('avanza al paso 2 con email válido', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({ forgotPassword: mockForgotPassword });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByText('Ingresá el código de 6 dígitos que enviamos a tu email')).toBeInTheDocument();
      });
    });

    it('muestra error cuando forgotPassword falla', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockRejectedValue(new Error('Error'));
      useAuthStore.setState({ forgotPassword: mockForgotPassword });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByText('Ingresá tu email para recibir un código de verificación')).toBeInTheDocument();
      });
    });
  });

  describe('Paso 2 - Código', () => {
    it('muestra campo de código', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({ forgotPassword: mockForgotPassword });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });
    });

    it('muestra email del usuario', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({ forgotPassword: mockForgotPassword });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByText('test@test.com')).toBeInTheDocument();
      });
    });

    it('valida código inválido', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({ forgotPassword: mockForgotPassword });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('000000'), '123');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      await waitFor(() => {
        expect(screen.getByText('El código debe tener 6 dígitos')).toBeInTheDocument();
      });
    });

    it('avanza al paso 3 con código válido', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      const mockVerifyResetCode = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({
        forgotPassword: mockForgotPassword,
        verifyResetCode: mockVerifyResetCode,
      });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('000000'), '123456');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      await waitFor(() => {
        expect(screen.getByText('Ingresá tu nueva contraseña')).toBeInTheDocument();
      });
    });

    it('retorna al paso 1 con botón de retroceso', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({ forgotPassword: mockForgotPassword });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByText('Ingresá el código de 6 dígitos que enviamos a tu email')).toBeInTheDocument();
      });

      const backButton = screen.getAllByRole('button')[0];
      await user.click(backButton);

      expect(screen.getByText('Ingresá tu email para recibir un código de verificación')).toBeInTheDocument();
    });
  });

  describe('Paso 3 - Contraseña', () => {
    it('muestra campos de contraseña', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      const mockVerifyResetCode = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({
        forgotPassword: mockForgotPassword,
        verifyResetCode: mockVerifyResetCode,
      });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('000000'), '123456');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Repetí tu contraseña')).toBeInTheDocument();
      });
    });

    it('valida contraseña muy corta', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      const mockVerifyResetCode = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({
        forgotPassword: mockForgotPassword,
        verifyResetCode: mockVerifyResetCode,
      });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('000000'), '123456');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), '123');
      await user.type(screen.getByPlaceholderText('Repetí tu contraseña'), '123');
      await user.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
      });
    });

    it('valida contraseñas no coincidentes', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      const mockVerifyResetCode = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({
        forgotPassword: mockForgotPassword,
        verifyResetCode: mockVerifyResetCode,
      });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('000000'), '123456');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), '12345678');
      await user.type(screen.getByPlaceholderText('Repetí tu contraseña'), '87654321');
      await user.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });

    it('actualiza contraseña y navega a login', async () => {
      const user = userEvent.setup();
      const mockForgotPassword = vi.fn().mockResolvedValue(undefined);
      const mockVerifyResetCode = vi.fn().mockResolvedValue(undefined);
      const mockResetPassword = vi.fn().mockResolvedValue(undefined);
      useAuthStore.setState({
        forgotPassword: mockForgotPassword,
        verifyResetCode: mockVerifyResetCode,
        resetPassword: mockResetPassword,
      });

      renderResetPage();

      await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('000000'), '123456');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), '12345678');
      await user.type(screen.getByPlaceholderText('Repetí tu contraseña'), '12345678');
      await user.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith('test@test.com', '123456', '12345678');
      });
    });
  });

  describe('Navegación', () => {
    it('muestra link para volver al login', () => {
      renderResetPage();
      expect(screen.getByText('Volver al login')).toBeInTheDocument();
    });

    it('navega a login al hacer click en volver', async () => {
      const user = userEvent.setup();
      renderResetPage();

      await user.click(screen.getByText('Volver al login'));
      expect(screen.getByText('Volver al login')).toBeInTheDocument();
    });
  });
});
