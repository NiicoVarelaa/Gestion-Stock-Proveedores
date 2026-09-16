import { render, screen } from '@testing-library/react';
import { FormFieldError } from './FormFieldError';

describe('FormFieldError', () => {
  it('no renderiza nada cuando no hay error', () => {
    const { container } = render(<FormFieldError />);
    expect(container.firstChild).toBeNull();
  });

  it('no renderiza nada cuando error no tiene message', () => {
    const { container } = render(<FormFieldError error={{ type: 'required', message: '' }} />);
    expect(container.firstChild).toBeNull();
  });

  it('muestra el mensaje de error', () => {
    render(<FormFieldError error={{ type: 'required', message: 'Campo requerido' }} />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  it('aplica clases de estilo correctas', () => {
    render(<FormFieldError error={{ type: 'min', message: 'Mínimo 8 caracteres' }} />);
    const el = screen.getByText('Mínimo 8 caracteres');
    expect(el).toHaveClass('text-sm', 'text-red-500');
  });
});
