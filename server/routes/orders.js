import { Router } from 'express';
import { db, createId } from '../store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const router = Router();

const ORDER_STATUSES = ['Pending', 'Processing', 'Delivered', 'Cancelled'];

/* POST /api/orders/create */
router.post('/create', requireAuth, (req, res) => {
  const { branchId, items, paymentMethod, momoNumber, pickupSlot, notes } = req.body || {};
  if (!branchId || !items?.length) return res.status(400).json({ error: 'Branch and items are required.' });

  const branch = db.branches.find((b) => b.id === branchId);
  if (!branch) return res.status(404).json({ error: 'Branch not found.' });

  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) return res.status(404).json({ error: `Product ${item.productId} not found.` });
    const stock = product.stockByBranch?.[branchId] || 0;
    if (stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name} at ${branch.name}.` });
    }
    orderItems.push({ productId: product.id, name: product.name, price: product.price, quantity: item.quantity });
    total += product.price * item.quantity;
  }

  /* Deduct stock */
  for (const item of orderItems) {
    const idx = db.products.findIndex((p) => p.id === item.productId);
    if (idx !== -1) {
      const sbb = { ...db.products[idx].stockByBranch, [branchId]: Math.max(0, (db.products[idx].stockByBranch[branchId] || 0) - item.quantity) };
      db.products[idx] = { ...db.products[idx], stockByBranch: sbb, totalStock: Object.values(sbb).reduce((s, v) => s + v, 0) };
    }
  }

  const order = {
    id: createId('order'),
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    branchId,
    branchName: branch.name,
    items: orderItems,
    total,
    paymentMethod: paymentMethod || 'momo',
    momoNumber: momoNumber || '',
    pickupSlot: pickupSlot || '',
    notes: notes || '',
    status: 'Pending',
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  res.status(201).json({ ok: true, order });
});

/* GET /api/orders/user — own orders */
router.get('/user', requireAuth, (req, res) => {
  const orders = db.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

/* GET /api/orders/all — admin/manager/staff */
router.get('/all', requireAuth, requireRole('admin', 'manager', 'staff'), (req, res) => {
  const { branchId, status } = req.query;
  let orders = [...db.orders];
  if (branchId) orders = orders.filter((o) => o.branchId === branchId);
  if (status && status !== 'all') orders = orders.filter((o) => o.status === status);
  if (req.user.role === 'staff') {
    orders = orders.filter((o) => o.assignedTo === req.user.id || o.assignedTo === null);
  }
  orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

/* PATCH /api/orders/:id/status */
router.patch('/:id/status', requireAuth, requireRole('admin', 'manager', 'staff'), (req, res) => {
  const { status } = req.body || {};
  if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found.' });
  db.orders[idx] = { ...db.orders[idx], status, updatedAt: new Date().toISOString() };
  res.json({ ok: true, order: db.orders[idx] });
});

/* PATCH /api/orders/:id/assign */
router.patch('/:id/assign', requireAuth, requireRole('admin', 'manager'), (req, res) => {
  const { staffId } = req.body || {};
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found.' });
  db.orders[idx] = { ...db.orders[idx], assignedTo: staffId || null, updatedAt: new Date().toISOString() };
  res.json({ ok: true, order: db.orders[idx] });
});

/* GET /api/orders/statuses */
router.get('/statuses', (_req, res) => res.json(ORDER_STATUSES));
