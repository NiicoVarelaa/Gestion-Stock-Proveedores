import { describe, it, expect, beforeEach, vi } from 'vitest';
import { z } from 'zod';

describe('validate middleware', () => {
  let validate: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('../middlewares/validate');
    validate = mod.validate;
  });

  it('pasa si la validación es exitosa', () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
    });

    const req = { body: { name: 'test' }, params: {}, query: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('retorna 400 si la validación falla', () => {
    const schema = z.object({
      body: z.object({ name: z.string().min(3) }),
    });

    const req = { body: { name: 'ab' }, params: {}, query: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errors: expect.any(Object),
      })
    );
  });

  it('valida parámetros de ruta', () => {
    const schema = z.object({
      params: z.object({ id: z.string().uuid() }),
    });

    const req = { body: {}, params: { id: 'not-a-uuid' }, query: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('valida query params', () => {
    const schema = z.object({
      query: z.object({ page: z.coerce.number().positive() }),
    });

    const req = { body: {}, params: {}, query: { page: 'abc' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
