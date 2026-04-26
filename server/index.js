import express from 'express';
import cors from 'cors';
import { router as authRouter } from './routes/auth.js';
import { router as productsRouter } from './routes/products.js';
import { router as ordersRouter } from './routes/orders.js';
import { router as aiRouter } from './routes/ai.js';
import { router as branchesRouter } from './routes/branches.js';
import { initStore } from './store.js';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Simba API', version: '1.0.0' }));

app.use('/api/auth',     authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders',   ordersRouter);
app.use('/api/ai',       aiRouter);
app.use('/api/branches', branchesRouter);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await initStore();
  app.listen(PORT, () => {
    console.log(`\n  Simba API  →  http://localhost:${PORT}`);
    console.log(`  Health     →  http://localhost:${PORT}/api/health\n`);
  });
}

start();
