import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card', () => {
  it('renderiza Card con contenido', () => {
    render(<Card data-testid="card">Contenido</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('renderiza CardHeader', () => {
    render(
      <Card>
        <CardHeader data-testid="header">Header</CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renderiza CardTitle', () => {
    render(<CardTitle data-testid="title">Título</CardTitle>);
    expect(screen.getByTestId('title')).toHaveTextContent('Título');
  });

  it('renderiza CardDescription', () => {
    render(<CardDescription data-testid="desc">Descripción</CardDescription>);
    expect(screen.getByTestId('desc')).toHaveTextContent('Descripción');
  });

  it('renderiza CardContent', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renderiza CardFooter', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('tiene data-slot="card"', () => {
    render(<Card data-testid="card" />);
    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
  });
});
