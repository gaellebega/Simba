import { Router } from 'express';
import { db, createId, slugify } from '../store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const router = Router();

router.get('/', (_req, res) => res.json(db.branches));

router.get('/:id', (req, res) => {
  const branch = db.branches.find((b) => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: 'Branch not found' });
  res.json(branch);
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { name, location, contact, region, status } = req.body;
  if (!name || !location) return res.status(400).json({ error: 'Name and location required.' });
  const branch = { id: createId('branch'), name: name.trim(), location: location.trim(), contact: contact || '', region: region || 'Kigali', status: status || 'active' };
  db.branches.push(branch);
  res.status(201).json(branch);
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const idx = db.branches.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Branch not found' });
  db.branches[idx] = { ...db.branches[idx], ...req.body };
  res.json(db.branches[idx]);
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const idx = db.branches.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Branch not found' });
  db.branches.splice(idx, 1);
  res.json({ ok: true });
});
