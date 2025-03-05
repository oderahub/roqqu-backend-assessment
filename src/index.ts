import express from 'express';
import cors from 'cors';
import { limiter } from './utils/limiter';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.routes';
import addressRoutes from './routes/address.routes';
import postRoutes from './routes/post.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(limiter);
app.use(
  morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }),
);
app.disable('x-powered-by');

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/', addressRoutes);
app.use('/', postRoutes);

app.use(errorMiddleware);

const shutdown = async (): Promise<void> => {
  logger.info('Shutting down server...');
  await AppDataSource.destroy();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      });
    })
    .catch((error) => {
      logger.error('Database initialization error:', error);
      process.exit(1);
    });
}

export default app;
