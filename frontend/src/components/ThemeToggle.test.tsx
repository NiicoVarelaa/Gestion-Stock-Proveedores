import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

function renderWithTheme(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('renderiza el botón', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('cicla entre system → light → dark → system', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button.getAttribute('title')).toContain('system');

    await user.click(button);
    expect(button.getAttribute('title')).toContain('light');

    await user.click(button);
    expect(button.getAttribute('title')).toContain('dark');

    await user.click(button);
    expect(button.getAttribute('title')).toContain('system');
  });

  it('persiste el tema en localStorage', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('aplica clase dark en el html', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
