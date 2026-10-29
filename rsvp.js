const DEAD = Date.parse('2026-11-23T23:59:59-03:00');
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (b.site) return res.status(200).json({ ok: true }); // honeypot
  if (Date.now() > DEAD) return res.status(403).json({ error: 'closed' });
  const name = String(b.name || '').trim().slice(0, 120);
  let phone = String(b.phone || '').replace(/\D/g, '');
  if (phone.length >= 12 && phone.startsWith('55')) phone = phone.slice(2);
  const status = b.status, note = String(b.note || '').trim().slice(0, 300);
  if (name.length < 5 || name.split(/\s+/).length < 2) return res.status(400).json({ error: 'Informe seu nome completo.' });
  if (phone.length < 10 || phone.length > 11) return res.status(400).json({ error: 'Informe um telefone válido com DDD.' });
  if (!['presente', 'ausente'].includes(status)) return res.status(400).json({ error: 'Escolha uma resposta.' });
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rsvp`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ name, phone, name_norm: norm(name), phone_norm: phone, status, note: note || null })
  });
  if (r.status === 409) return res.status(409).json({ error: 'duplicate' });
  if (!r.ok) return res.status(500).json({ error: 'Erro ao salvar. Tente novamente.' });
  res.status(200).json({ ok: true });
};
