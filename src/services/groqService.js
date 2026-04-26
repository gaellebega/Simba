const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function askAI(message, _products, branch, history = []) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        branchId: branch?.id || null,
        history: history.slice(-10),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, reply: null, matched: [], error: err.error || `Server error ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, reply: data.reply, matched: data.matched || [], source: data.source };
  } catch (e) {
    return {
      ok: false,
      reply: null,
      matched: [],
      error: 'Cannot reach the Simba API server. Make sure it is running on port 4000.',
    };
  }
}
