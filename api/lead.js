// api/lead.js — приймає заявку з сайту і надсилає у Telegram.
// Токен і chat_id живуть у змінних середовища Vercel (Settings → Environment Variables),
// ніколи не потрапляють у код на GitHub чи в браузер клієнта.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    const b = req.body || {};
    const name = String(b.name || "").slice(0, 100).trim();
    const phone = String(b.phone || "").slice(0, 50).trim();
    if (!name || !phone) return res.status(400).json({ ok: false, error: "name and phone required" });

    const esc = (s) => String(s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));

    const lines = [
      "🔔 <b>Новий лід — ПРОПОЗИЦІЯ.БУД</b>",
      "",
      `👤 ${esc(name)} · ${esc(phone)}`,
      `🏠 ${esc(b.summary || "")}`,
      `💰 Оцінка: ${esc(b.estimate || "—")}`,
    ];
    if (b.furniture) lines.push(`🛋 Комплектація: ${esc(b.furniture)}`);
    if (b.options) lines.push(`➕ Опції: ${esc(b.options)}`);
    if (b.msg) lines.push(`💬 «${esc(String(b.msg).slice(0, 300))}»`);
    lines.push("", `🕐 ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`);

    let tgOk = false, dbOk = false;
    // Канал 1: Telegram (якщо налаштовано)
    if (token && chatId) {
      try {
        const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" }),
        });
        tgOk = (await tg.json()).ok === true;
      } catch {}
    }
    // Канал 2: Supabase (якщо налаштовано) — журнал лідів
    const sbUrl = process.env.SUPABASE_URL, sbKey = process.env.SUPABASE_SERVICE_KEY;
    if (sbUrl && sbKey) {
      try {
        const ins = await fetch(`${sbUrl}/rest/v1/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: sbKey, Authorization: `Bearer ${sbKey}`, Prefer: "return=minimal" },
          body: JSON.stringify({ name, phone, msg: b.msg || "", summary: b.summary || "", estimate: b.estimate || "", furniture: b.furniture || "", options: b.options || "" }),
        });
        dbOk = ins.ok;
      } catch {}
    }
    if (!tgOk && !dbOk) return res.status(502).json({ ok: false, error: "no channel delivered" });
    return res.status(200).json({ ok: true, tg: tgOk, db: dbOk });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "internal" });
  }
}
