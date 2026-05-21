import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { authMiddleware } from './middlewares/auth';
import authRoutes from './routes/auth.routes';
import supplierRoutes from './routes/supplier.routes';
import productRoutes from './routes/product.routes';
import stockMovementRoutes from './routes/stock-movement.routes';

const app: express.Application = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/suppliers', authMiddleware, supplierRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/stock-movements', authMiddleware, stockMovementRoutes);

app.use(errorHandler);

export default app;
