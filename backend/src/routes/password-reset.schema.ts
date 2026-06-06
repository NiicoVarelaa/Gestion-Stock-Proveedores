import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
  }),
});

export const verifyCodeSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    code: z.string().length(6, 'El código debe tener 6 dígitos'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    code: z.string().length(6, 'El código debe tener 6 dígitos'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
