import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, BusinessError, ValidationError } from '../utils/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('crea error con statusCode y isOperational', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('NotFoundError', () => {
    it('tiene statusCode 404', () => {
      const error = new NotFoundError('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    it('usa mensaje por defecto', () => {
      const error = new NotFoundError();
      expect(error.message).toBe('Resource not found');
    });
  });

  describe('BusinessError', () => {
    it('tiene statusCode 400', () => {
      const error = new BusinessError('Business rule violated');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('tiene statusCode 422', () => {
      const error = new ValidationError('Invalid data');
      expect(error.statusCode).toBe(422);
      expect(error.isOperational).toBe(true);
    });
  });
});
