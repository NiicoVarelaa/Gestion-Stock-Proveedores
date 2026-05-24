import 'dotenv/config';
import { validateEnv, env } from './config/env';
import app from './app';
import { prisma } from './config/database';

validateEnv();

async function start() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});
