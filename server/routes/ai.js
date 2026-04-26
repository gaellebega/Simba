import { Router } from 'express';
import { db } from '../store.js';

export const router = Router();

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function buildSystemPrompt(products, branchId) {
  const branch = branchId ? db.branches.find((b) => b.id === branchId) : null;
  const branchCtx = branch
    ? `The customer is shopping at the ${branch.name} branch (${branch.location}).`
    : 'No specific branch selected.';

  const catalog = products
    .slice(0, 80)
    .map((p) => {
      const stock = branch ? (p.stockByBranch?.[branch.id] || 0) : p.totalStock;
      return `${p.name} | ${p.categoryName} | ${p.price} RWF | stock:${stock}`;
    })
    .join('\n');

  return `You are the friendly AI shopping assistant for Simba Supermarket in Kigali, Rwanda.
${branchCtx}

Help customers find products, check availability, suggest alternatives.
Respond in the same language as the customer (English, Kinyarwanda, or French).
Keep responses under 120 words. Be warm and direct.
Only recommend products from the catalog. If stock:0, suggest an alternative.

CATALOG (name | category | price | stock):
${catalog}`;
}

function findMatchingProducts(reply, branchId) {
  const words = reply.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const branch = branchId ? db.branches.find((b) => b.id === branchId) : null;
  const scored = db.products.map((p) => {
    const n = p.name.toLowerCase();
    const c = p.categoryName.toLowerCase();
    const score = words.reduce((s, w) => s + (n.includes(w) ? 2 : 0) + (c.includes(w) ? 1 : 0), 0);
    const stock = branch ? (p.stockByBranch?.[branch.id] || 0) : p.totalStock;
    return { ...p, _score: score, _stock: stock };
  });
  return scored.filter((p) => p._score > 0 && p._stock > 0).sort((a, b) => b._score - a._score).slice(0, 6);
}

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set in server environment.');

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.6, max_tokens: 400 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callOllama(messages) {
  const base  = process.env.OLLAMA_URL   || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2';

  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  });

  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return data.message?.content?.trim() || '';
}

/* POST /api/ai/search */
router.post('/search', async (req, res) => {
  const { message, branchId, history = [] } = req.body || {};
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });

  const systemPrompt = buildSystemPrompt(db.products, branchId);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];

  let reply = '';
  let source = '';

  try {
    reply  = await callGroq(messages);
    source = 'groq';
  } catch (groqErr) {
    console.warn('Groq failed:', groqErr.message, '→ trying Ollama');
    try {
      reply  = await callOllama(messages);
      source = 'ollama';
    } catch (ollamaErr) {
      return res.status(502).json({
        error: `AI unavailable. Groq: ${groqErr.message}. Ollama: ${ollamaErr.message}`,
      });
    }
  }

  const matched = findMatchingProducts(reply, branchId);
  res.json({ ok: true, reply, matched, source });
});
