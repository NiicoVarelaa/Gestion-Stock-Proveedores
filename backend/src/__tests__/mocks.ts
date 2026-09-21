import { vi } from 'vitest';

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
    findMany: vi.fn(),
  },
  supplier: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
  },
  stockMovement: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  passwordReset: {
    findFirst: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
  $queryRaw: vi.fn(),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

vi.mock('../config/database', () => ({
  prisma: mockPrisma,
}));

vi.mock('../config/mailer', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('../config/cloudinary', () => ({
  cloudinary: {
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

export { mockPrisma };
