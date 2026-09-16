import { render, screen } from '@testing-library/react';
import { ProductImage, ProductImageWithFallback } from './ProductImage';

describe('ProductImage', () => {
  it('muestra imagen cuando src es proporcionado', () => {
    render(<ProductImage src="https://example.com/img.png" alt="Producto" />);
    const img = screen.getByRole('img', { name: 'Producto' });
    expect(img).toHaveAttribute('src', 'https://example.com/img.png');
  });

  it('muestra fallback con icono cuando src es null', () => {
    const { container } = render(<ProductImage src={null} alt="Producto" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('muestra fallback con icono cuando src es undefined', () => {
    const { container } = render(<ProductImage src={undefined} alt="Producto" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('ProductImageWithFallback', () => {
  it('muestra imagen cuando src es proporcionado', () => {
    render(<ProductImageWithFallback src="https://example.com/img.png" alt="Producto" />);
    expect(screen.getByRole('img', { name: 'Producto' })).toBeInTheDocument();
  });

  it('muestra solo fallback cuando src es null', () => {
    const { container } = render(<ProductImageWithFallback src={null} alt="Producto" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
