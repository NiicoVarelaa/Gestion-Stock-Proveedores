import nodemailer from 'nodemailer';
import { env } from './env';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export async function sendPasswordResetEmail(email: string, name: string, code: string) {
  await transporter.sendMail({
    from: `"StockFlow" <${env.smtpUser}>`,
    to: email,
    subject: 'Recuperar contraseña - StockFlow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Recuperar contraseña</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Usá el siguiente código:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
        </div>
        <p>Este código expira en <strong>10 minutos</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este cambio, ignorá este email.</p>
      </div>
    `,
  });
}
