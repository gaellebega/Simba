import { Router } from 'express';
import { db, createId, hashPassword } from '../store.js';
import { signToken, requireAuth } from '../middleware/auth.js';

export const router = Router();

/* POST /api/auth/login */
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return res.status(401).json({ error: 'Account not found.' });
  if (user.passwordHash !== hashPassword(password)) return res.status(401).json({ error: 'Invalid password.' });

  const token = signToken(user);
  const { passwordHash: _, ...safe } = user;
  res.json({ ok: true, token, user: safe });
});

/* POST /api/auth/register */
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

  const user = {
    id: createId('user'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || '',
    role: 'customer',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);

  const token = signToken(user);
  const { passwordHash: _, ...safe } = user;
  res.status(201).json({ ok: true, token, user: safe });
});

/* POST /api/auth/forgot-password */
router.post('/forgot-password', (req, res) => {
  const { email, newPassword } = req.body || {};
  if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password are required.' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const idx = db.users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) return res.status(404).json({ error: 'No account found with that email.' });

  db.users[idx] = { ...db.users[idx], passwordHash: hashPassword(newPassword) };
  res.json({ ok: true, message: 'Password updated successfully.' });
});

/* GET /api/auth/me */
router.get('/me', requireAuth, (req, res) => {
  const { passwordHash: _, ...safe } = req.user;
  res.json(safe);
});
