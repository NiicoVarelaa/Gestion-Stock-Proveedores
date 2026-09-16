import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

describe('Table', () => {
  it('renderiza tabla con estructura completa', () => {
    render(
      <Table data-testid="table">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Producto A</TableCell>
            <TableCell>$100</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('renderiza caption', () => {
    render(
      <Table>
        <TableCaption>Listado de productos</TableCaption>
        <TableBody />
      </Table>
    );
    expect(screen.getByText('Listado de productos')).toBeInTheDocument();
  });

  it('tiene data-slot en table', () => {
    render(<Table data-testid="table"><TableBody /></Table>);
    expect(screen.getByTestId('table')).toHaveAttribute('data-slot', 'table');
  });
});
