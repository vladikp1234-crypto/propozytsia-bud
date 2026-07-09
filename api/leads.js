// api/leads.js — журнал лідів для режиму фірми (?admin=1).
// Захист: секретний ключ ADMIN_KEY (env Vercel). Дані читаються service-ключем Supabase,
// який ніколи не покидає сервер.

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });
  const adminKey = process.env.ADMIN_KEY;
  const sbUrl = process.env.SUPABASE_URL, sbKey = process.env.SUPABASE_SERVICE_KEY;
  if (!adminKey || !sbUrl || !sbKey) return res.status(200).json({ ok: false, configured: false });
  if ((req.query.key || "") !== adminKey) return res.status(403).json({ ok: false, error: "wrong key" });
  try {
    const r = await fetch(`${sbUrl}/rest/v1/leads?select=*&order=created_at.desc&limit=300`, {
      headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` },
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    const rows = await r.json();
    return res.status(200).json({ ok: true, rows });
  } catch { return res.status(500).json({ ok: false }); }
}
