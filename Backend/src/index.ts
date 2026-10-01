import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import galleryRoutes from './routes/gallery';
import contentRoutes from './routes/content';
import uploadRoutes from './routes/upload';
import transparencyRoutes from './routes/transparency';
import signupRoutes from './routes/signup';
import { getRedisClient } from './utils/cache';
import { metricsMiddleware, metricsHandler } from './utils/metrics';
import db from './config/database';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app: Express = express();
const PORT = process.env.PORT || 5000;
app.disable('x-powered-by');
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(helmet());
app.use(apiLimiter);

// CORS configuration
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      const fallbackOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
        'http://localhost:3001',
      ];
      const origins = allowedOrigins.length > 0 ? allowedOrigins : fallbackOrigins;
      callback(null, !requestOrigin || origins.includes(requestOrigin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log('=== SERVER REQUEST ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  if (req.method === 'POST' || req.method === 'PUT') {
      console.log('Body keys:', Object.keys(req.body || {}));
  }
  console.log('====================');
  next();
});

// Metrics middleware
app.use(metricsMiddleware);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/transparency', transparencyRoutes);
app.use('/api/signup', signupRoutes);

// Health checks
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/detailed', async (_req: Request, res: Response) => {
  const result: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    components: {
      server: { status: 'ok' },
      database: { status: 'unknown' },
      redis: { status: 'unknown' },
    },
  };

  let isDegraded = false;

  // Check Database
  try {
    await new Promise<void>((resolve, reject) => {
      db.query('SELECT 1', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    result.components.database = { status: 'ok' };
  } catch (err: any) {
    isDegraded = true;
    result.components.database = { status: 'error', message: err?.message || String(err) };
  }

  // Check Redis
  try {
    const redis = await getRedisClient();
    if (redis && redis.isOpen) {
      await redis.ping();
      result.components.redis = { status: 'ok' };
    } else {
      result.components.redis = { status: 'disconnected' };
    }
  } catch (err: any) {
    result.components.redis = { status: 'error', message: err?.message || String(err) };
  }

  if (isDegraded) {
    result.status = 'degraded';
    return res.status(503).json(result);
  }

  return res.json(result);
});

// Prometheus metrics
app.get('/metrics', metricsHandler);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// Start server
app.listen(PORT, async () => {
  try {
    await getRedisClient();
    console.log('Redis connected (if available)');
  } catch (err) {
    // ignore
  }
  console.log(`
╔════════════════════════════════════╗
║  🏫 -Antares- Server Started       ║
║  🚀 Server running on port ${PORT}      ║
║  🔗 http://localhost:${PORT}          ║
╚════════════════════════════════════╝
  `);
});

export default app;
