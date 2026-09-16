import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renderiza el texto', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('aplica variante default por defecto', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toHaveAttribute('data-variant', 'default');
  });

  it('aplica variante secondary', () => {
    render(<Badge variant="secondary">Secundario</Badge>);
    expect(screen.getByText('Secundario')).toHaveAttribute('data-variant', 'secondary');
  });

  it('aplica variante destructive', () => {
    render(<Badge variant="destructive">Peligro</Badge>);
    expect(screen.getByText('Peligro')).toHaveAttribute('data-variant', 'destructive');
  });

  it('aplica className personalizado', () => {
    render(<Badge className="custom">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('custom');
  });
});
