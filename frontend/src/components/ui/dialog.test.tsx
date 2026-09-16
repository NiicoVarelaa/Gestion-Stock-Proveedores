import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './dialog';

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>Abrir</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Título del diálogo</DialogTitle>
          <DialogDescription>Descripción del diálogo</DialogDescription>
        </DialogHeader>
        <div>Contenido</div>
        <DialogFooter>
          <button>Cerrar</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('no muestra contenido del dialog inicialmente', () => {
    render(<DialogDemo />);
    expect(screen.queryByText('Título del diálogo')).not.toBeInTheDocument();
  });

  it('muestra dialog al hacer click en trigger', async () => {
    const user = userEvent.setup();
    render(<DialogDemo />);
    await user.click(screen.getByRole('button', { name: /abrir/i }));
    await waitFor(() => {
      expect(screen.getByText('Título del diálogo')).toBeInTheDocument();
    });
  });

  it('muestra descripción en el dialog', async () => {
    const user = userEvent.setup();
    render(<DialogDemo />);
    await user.click(screen.getByRole('button', { name: /abrir/i }));
    await waitFor(() => {
      expect(screen.getByText('Descripción del diálogo')).toBeInTheDocument();
    });
  });

  it('muestra contenido del dialog', async () => {
    const user = userEvent.setup();
    render(<DialogDemo />);
    await user.click(screen.getByRole('button', { name: /abrir/i }));
    await waitFor(() => {
      expect(screen.getByText('Contenido')).toBeInTheDocument();
    });
  });
});
