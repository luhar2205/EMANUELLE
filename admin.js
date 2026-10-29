const crypto = require('crypto');
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const same = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };
module.exports = async (req, res) => {
  const pw = process.env.ADMIN_PASSWORD || '';
  if (!pw || !same(String(req.headers['x-admin-password'] || ''), pw)) return res.status(401).json({ error: 'Senha incorreta' });
  const base = `${process.env.SUPABASE_URL}/rest/v1/rsvp`, K = process.env.SUPABASE_SERVICE_KEY;
  const H = { apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': 'application/json' };
  const uuid = /^[0-9a-f-]{36}$/i;
  if (req.method === 'GET') {
    const r = await fetch(`${base}?select=*&order=created_at.desc`, { headers: H });
    return res.status(r.ok ? 200 : 500).json(r.ok ? await r.json() : { error: 'Erro ao ler' });
  }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (req.method === 'DELETE') {
    const id = req.query.id; if (!uuid.test(id)) return res.status(400).json({ error: 'id inválido' });
    const r = await fetch(`${base}?id=eq.${id}`, { method: 'DELETE', headers: H });
    return res.status(r.ok ? 200 : 500).json({ ok: r.ok });
  }
  if (req.method === 'PATCH') {
    if (!uuid.test(b.id)) return res.status(400).json({ error: 'id inválido' });
    const name = String(b.name || '').trim(), phone = String(b.phone || '').replace(/\D/g, '');
    if (name.length < 5 || phone.length < 10 || !['presente', 'ausente'].includes(b.status)) return res.status(400).json({ error: 'Dados inválidos' });
    const r = await fetch(`${base}?id=eq.${b.id}`, { method: 'PATCH', headers: H, body: JSON.stringify({ name, phone, name_norm: norm(name), phone_norm: phone, status: b.status, note: String(b.note || '').slice(0, 300) || null }) });
    return res.status(r.ok ? 200 : r.status === 409 ? 409 : 500).json({ ok: r.ok });
  }
  res.status(405).end();
};
