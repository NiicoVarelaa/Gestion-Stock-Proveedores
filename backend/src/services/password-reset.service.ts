import { prisma } from '../config/database';
import { sendPasswordResetEmail } from '../config/mailer';
import { NotFoundError, BusinessError } from '../utils/errors';
import bcrypt from 'bcrypt';

const CODE_EXPIRATION_MS = 10 * 60 * 1000;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class PasswordResetService {
  async requestReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MS);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    await sendPasswordResetEmail(user.email, user.name, code);
  }

  async verifyCode(email: string, code: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError('Usuario no encontrado');

    const reset = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!reset) throw new BusinessError('Código inválido o expirado');

    return { userId: user.id };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError('Usuario no encontrado');

    const reset = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!reset) throw new BusinessError('Código inválido o expirado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { used: true },
      }),
    ]);
  }
}
