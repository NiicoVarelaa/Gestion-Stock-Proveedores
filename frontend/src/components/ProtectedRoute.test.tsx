import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '@/store/auth.store';

vi.mock('@/services/api');

function renderWithAuth(ui: React.ReactNode, isAuthenticated: boolean, initialized: boolean) {
  useAuthStore.setState({ isAuthenticated, initialized });
  return render(
    <MemoryRouter>
      <ProtectedRoute>{ui}</ProtectedRoute>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra spinner cuando no está inicializado', () => {
    renderWithAuth(<div>Contenido</div>, false, false);
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirige a login cuando no está autenticado', () => {
    renderWithAuth(<div>Contenido</div>, false, true);
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });

  it('muestra children cuando está autenticado', () => {
    renderWithAuth(<div>Contenido protegido</div>, true, true);
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});
