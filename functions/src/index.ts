import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { verifyToken } from './middleware/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import stockRoutes from './routes/stock';
import analyticsRoutes from './routes/analytics';

const app = express();

// Apply CORS
app.use(cors({ origin: true }));
app.use(express.json());

// Main authentication middleware
app.use(verifyToken);

// Register Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/stock', stockRoutes);
app.use('/analytics', analyticsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export const api = functions.https.onRequest(app);
