import { Router } from 'express';
import { db, createId, slugify } from '../store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const router = Router();

/* GET /api/products */
router.get('/', (req, res) => {
  const { branch, category, search, limit = 50, offset = 0 } = req.query;
  let result = [...db.products];

  if (branch) result = result.filter((p) => (p.stockByBranch?.[branch] || 0) > 0);
  if (category && category !== 'all') result = result.filter((p) => p.categoryName === category);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
  }

  const total = result.length;
  result = result.slice(Number(offset), Number(offset) + Number(limit));
  res.json({ total, products: result });
});

/* GET /api/products/featured */
router.get('/featured', (req, res) => {
  const { branch } = req.query;
  let result = [...db.products];
  if (branch) result = result.filter((p) => (p.stockByBranch?.[branch] || 0) > 0);
  result = result.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0)).slice(0, 12);
  res.json(result);
});

/* GET /api/products/categories */
router.get('/categories', (_req, res) => res.json(db.categories));

/* GET /api/products/:id */
router.get('/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

/* POST /api/products — admin only */
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { name, description, price, image, categoryId, stockByBranch, featured, unit } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Name and price are required.' });

  const category = db.categories.find((c) => c.id === categoryId);
  const sbb = stockByBranch || {};
  const product = {
    id: createId('product'),
    name: name.trim(),
    slug: slugify(name),
    description: description?.trim() || '',
    price: Number(price),
    image: image?.trim() || '',
    unit: unit || 'pcs',
    categoryId: categoryId || db.categories[0]?.id,
    categoryName: category?.name || 'General',
    stockByBranch: sbb,
    branchIds: Object.entries(sbb).filter(([, q]) => Number(q) > 0).map(([id]) => id),
    totalStock: Object.values(sbb).reduce((s, v) => s + Number(v || 0), 0),
    featured: Boolean(featured),
    trendingScore: 50,
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(product);
  res.status(201).json(product);
});

/* PUT /api/products/:id — admin only */
router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const sbb = req.body.stockByBranch || db.products[idx].stockByBranch;
  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    stockByBranch: sbb,
    branchIds: Object.entries(sbb).filter(([, q]) => Number(q) > 0).map(([id]) => id),
    totalStock: Object.values(sbb).reduce((s, v) => s + Number(v || 0), 0),
  };
  res.json(db.products[idx]);
});

/* DELETE /api/products/:id — admin only */
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products.splice(idx, 1);
  res.json({ ok: true });
});
