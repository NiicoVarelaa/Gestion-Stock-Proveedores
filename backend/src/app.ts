import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { requestIdMiddleware } from './middlewares/requestId';
import { authMiddleware } from './middlewares/auth';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import supplierRoutes from './routes/supplier.routes';
import productRoutes from './routes/product.routes';
import stockMovementRoutes from './routes/stock-movement.routes';
import { env } from './config/env';

const app: express.Application = express();

app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));
app.use(requestIdMiddleware);
app.use(morgan(':method :url :status :response-time ms - :res[x-request-id]'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/suppliers', authMiddleware, supplierRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/stock-movements', authMiddleware, stockMovementRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.id,
  });
});

app.use(errorHandler);

export default app;
