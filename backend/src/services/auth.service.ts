import { prisma } from '../config/database';
import { AppError } from '../utils/errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export class AuthService {
  async register(email: string, password: string, name: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('El email ya está registrado', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Credenciales inválidas', 401);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new AppError('Credenciales inválidas', 401);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }
}

export function setAuthCookie(res: any, token: string) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function clearAuthCookie(res: any) {
  res.clearCookie('auth_token', { path: '/' });
}
