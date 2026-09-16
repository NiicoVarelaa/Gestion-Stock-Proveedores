import { cn } from './utils';

describe('cn', () => {
  it('combina dos clases simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resuelve conflictos de Tailwind', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('maneja undefined y null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('retorna string vacío sin argumentos', () => {
    expect(cn()).toBe('');
  });

  it('maneja clases condicionales', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });

  it('maneja clases condicionales falsas', () => {
    const isActive = false;
    expect(cn('base', isActive && 'active')).toBe('base');
  });
});
