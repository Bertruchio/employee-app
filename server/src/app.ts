import path from 'path';
import express from 'express';
import cors from 'cors';
import { createRouter } from './routes/index';
import { errorMiddleware } from './middleware/error.middleware';
import { seedDatabase } from './db/seed';
import db from './db/database';
import { ENV } from './config/env';

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/api', createRouter(db));
app.use(errorMiddleware);

if (ENV.NODE_ENV === 'production') {
  const clientDist = path.resolve(process.cwd(), 'client', 'dist');
  app.use(express.static(clientDist));
  app.use((_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

if (ENV.NODE_ENV !== 'test') seedDatabase(db);

export default app;
