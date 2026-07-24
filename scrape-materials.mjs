// scrape-materials.mjs v2 — щоденний збір реальних цін матеріалів з epicentrk.ua
// Результат: public/materials.json → { updated, cats: { <catKey>: [ {name, price, url, count}|null, ... ] } }
// Індекс у масиві = рівень (0 економ, 1 стандарт, 2 преміум) і збігається з MATS у data.js.
//
// v2 — виправлення за результатами першого прогону (12/32):
//  • alts: до 3 альтернативних запитів на рівень — якщо перший промахнувся
//  • div: конвертація роздрібної одиниці в одиницю кошторису
//    (фарба продається ВІДРАМИ — ділимо на покриття в м²; мат теплої підлоги — на площу комплекту)
//  • minCount: для дорогих категорій (двері, кондиціонери) достатньо 2 товарів у коридорі
//  • перевірка монотонності рівнів: якщо «преміум» вийшов дешевшим за «стандарт» —
//    рівень скидається в MISS (краще кураторська оцінка, ніж хибний рівень)
//
// ПРИНЦИП ЧЕСНОСТІ: якщо позицію не вдалося зібрати — вона НЕ підставляється,
// категорія лишається кураторською оцінкою з підписом «орієнтовно».

const BASE = "https://epicentrk.ua";
const DELAY_MS = 2200;
const FETCH_TIMEOUT_MS = 20000;   // жоден запит не висить довше 20 с
const MAX_RUNTIME_MS = 20 * 60 * 1000; // весь збір — не довше 20 хв
const T0 = Date.now();
const timeLeft = () => MAX_RUNTIME_MS - (Date.now() - T0);

// band = [min, max] грн за РОЗДРІБНУ одиницю (до div). div — дільник → грн за одиницю кошторису.
const MAPPING = {
  // v3: Епіцентр перенаправляє «категорійні» запити на сторінки без даних товарів —
  // тому проблемні слоти переведені на БРЕНДОВІ запити, які лишаються на пошуку з JSON-LD.
  floorcover: [
    { q: "ламінат 32 клас", alts: ["ламінат 8 мм"], band: [180, 700] },
    { q: "ламінат 33 клас", alts: ["ламінат 33 клас 10 мм"], band: [350, 1400] },
    { q: "вінілова підлога Arbiton", alts: ["кварцвініл Arbiton", "підлога SPC Ceramin", "вінілова підлога LVT"], band: [400, 2200] },
    { q: "інженерна дошка дуб", alts: ["паркетна дошка дуб"], band: [1200, 6000] },
  ],
  tile: [
    { q: "плитка Golden Tile", alts: ["плитка Атем", "плитка InterCerama"], band: [150, 900] },
    { q: "плитка Cersanit", alts: ["керамограніт 60х60"], band: [400, 1800] },
    { q: "керамограніт Cerrad", alts: ["плитка Paradyz", "керамограніт Opoczno", "плитка Allore"], band: [700, 4000], minCount: 2 },
  ],
  // Фарба: відро ≈ 35 м² у 2 шари → div: 35. Брендові запити.
  paint: [
    { q: "фарба Sniezka Eko", alts: ["Sniezka Barwy Natury", "фарба Polifarb"], band: [400, 2500], div: 35 },
    { q: "Sniezka Satynowa", alts: ["фарба Sniezka Duo", "фарба Kompozit"], band: [600, 4000], div: 35 },
    { q: "Tikkurila Euro Smart 2", alts: ["фарба Tikkurila Harmony 9", "Tikkurila Euro Power 9"], band: [1500, 9000], div: 35, minCount: 2 },
  ],
  wallpaper: [
    { q: "шпалери паперові", band: [50, 400] },
    { q: "шпалери флізелінові", alts: ["шпалери вінілові на флізеліновій основі"], band: [100, 800] },
    { q: "шпалери вінілові гарячого тиснення", alts: ["шпалери метрові вінілові", "шпалери Sintra"], band: [450, 2000], minCount: 2 },
  ],
  doors: [
    { q: "двері міжкімнатні ламіновані", alts: ["двері міжкімнатні екошпон"], band: [2000, 9000] },
    { q: "двері Darumi", alts: ["двері Папа Карло", "двері Rodos"], band: [4000, 20000], minCount: 2 },
    { q: "двері міжкімнатні фарбовані", alts: ["двері міжкімнатні білі емаль", "двері прихованого монтажу"], band: [8000, 60000], minCount: 2 },
  ],
  plinth: [
    { q: "плінтус МДФ", alts: ["плінтус підлоговий МДФ 2.4"], band: [40, 350] },
    { q: "плінтус Arbiton", alts: ["плінтус Salag", "плінтус Cezar"], band: [60, 700] },
  ],
  entry: [
    { q: "двері вхідні квартирні", alts: ["двері вхідні металеві"], band: [5000, 22000], minCount: 2 },
    { q: "двері Straj", alts: ["двері Qdoors", "двері вхідні Патріот Термо"], band: [12000, 48000], minCount: 2 },
  ],
  // Мат теплої підлоги: брендові комплекти, div = площа комплекту
  heatfloor: [
    { q: "нагрівальний мат In-Therm", alts: ["нагрівальний мат Ryxon", "мат Hemstedt"], band: [1200, 9000], div: 3 },
    { q: "тепла підлога Fenix", alts: ["нагрівальний мат Devi", "мат Woks"], band: [2000, 14000], div: 5, minCount: 2 },
  ],
  radiators: [
    { q: "радіатор сталевий панельний", band: [1500, 9000] },
    { q: "радіатор біметалевий", alts: ["радіатор біметалічний 500"], band: [2000, 14000] },
  ],
  decor: [
    { q: "декоративна штукатурка короїд", band: [150, 900] },
    { q: "венеціанська штукатурка", alts: ["декоративна штукатурка ефект бетону"], band: [400, 2500], minCount: 2 },
  ],
  ac_unit: [
    { q: "кондиціонер Midea 09", alts: ["кондиціонер Gree 09", "кондиціонер TCL 26"], band: [7000, 32000], minCount: 2 },
    { q: "кондиціонер Gree інвертор", alts: ["кондиціонер Midea інвертор", "кондиціонер Panasonic інвертор"], band: [15000, 55000], minCount: 2 },
    { q: "кондиціонер Daikin", alts: ["кондиціонер Mitsubishi Electric"], band: [28000, 130000], minCount: 2 },
  ],
  boiler: [
    { q: "бойлер Atlantic", alts: ["водонагрівач Atlantic Opro", "бойлер Gorenje"], band: [3500, 15000], minCount: 2 },
    { q: "бойлер Atlantic Steatite", alts: ["водонагрівач Ariston Velis", "бойлер сухий тен Ardesto"], band: [6000, 26000], minCount: 2 },
    { q: "бойлер непрямого нагріву", alts: ["водонагрівач Drazice", "бак непрямого нагріву 120"], band: [15000, 80000], minCount: 2 },
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

async function fetchPage(url) {
  const ctrl = new AbortController();
  const tm = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const res = await fetch(url, {
    signal: ctrl.signal,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      "Accept-Language": "uk-UA,uk;q=0.9",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  clearTimeout(tm);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.text();
}

function fromJsonLd(html) {
  const out = [];
  const blocks = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const b of blocks) {
    const raw = b.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
    let data;
    try { data = JSON.parse(raw); } catch { continue; }
    const walk = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(walk);
      const t = node["@type"];
      if (t === "Product" || (Array.isArray(t) && t.includes("Product"))) {
        const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers;
        const price = Number(offer?.price ?? offer?.lowPrice);
        if (price > 0 && node.name) out.push({ name: String(node.name).slice(0, 90), price, url: node.url || node["@id"] || "" });
      }
      Object.values(node).forEach(walk);
    };
    walk(data);
  }
  return out;
}

function fromMarkup(html) {
  const out = [];
  const patterns = [
    /"name"\s*:\s*"([^"]{5,90})"[\s\S]{0,400}?"price"\s*:\s*"?(\d[\d\s.,]*)"?/g,
    /data-product-name="([^"]{5,90})"[\s\S]{0,300}?data-price="(\d[\d\s.,]*)"/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const price = Number(String(m[2]).replace(/[\s,]/g, "").replace(/\.(?=\d{3}\b)/g, ""));
      if (price > 0) out.push({ name: m[1].slice(0, 90), price, url: "" });
      if (out.length > 400) break;
    }
    if (out.length) break;
  }
  return out;
}

async function tryQuery(q, entry) {
  const url = `${BASE}/ua/search/?q=${encodeURIComponent(q)}`;
  const html = await fetchPage(url);
  let items = fromJsonLd(html);
  let via = "json-ld";
  if (items.length < 3) { const m = fromMarkup(html); if (m.length > items.length) { items = m; via = "markup"; } }
  const [lo, hi] = entry.band;
  const need = entry.minCount || 3;
  const inBand = items.filter((x) => x.price >= lo && x.price <= hi);
  if (inBand.length < need) {
    return { ok: false, reason: `«${q}»: товарів ${items.length}, у коридорі ${lo}–${hi}: ${inBand.length} (треба ${need})`, via,
      sample: items.slice(0, 4).map((x) => `${x.name.slice(0, 45)}=${x.price}`) };
  }
  const retail = median(inBand.map((x) => x.price));
  const div = entry.div || 1;
  const rep = inBand.reduce((a, b) => (Math.abs(b.price - retail) < Math.abs(a.price - retail) ? b : a));
  return { ok: true, via, data: {
    name: rep.name, price: Math.round((retail / div) * 100) / 100, retail, count: inBand.length,
    url: rep.url && rep.url.startsWith("http") ? rep.url : url,
  } };
}

async function collect(entry) {
  const queries = [entry.q, ...(entry.alts || [])];
  const fails = [];
  for (const q of queries) {
    if (timeLeft() < 60_000) { fails.push({ reason: `«${q}»: пропущено — вичерпано ліміт часу прогону` }); break; }
    try {
      const r = await tryQuery(q, entry);
      if (r.ok) return r;
      fails.push(r);
    } catch (e) { fails.push({ reason: `«${q}»: помилка ${e.message}` }); }
    await sleep(DELAY_MS);
  }
  return { ok: false, reason: fails.map((f) => f.reason).join(" | "), sample: fails.flatMap((f) => f.sample || []).slice(0, 5) };
}

const main = async () => {
  const cats = {};
  let found = 0, missed = 0;
  const misses = [];

  for (const [key, tiers] of Object.entries(MAPPING)) {
    const row = [];
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      const r = await collect(t);
      if (r.ok) {
        row[i] = r.data; found++;
        console.log(`✓ ${key}[${i}] → ${r.data.price} грн/од (роздріб ${r.data.retail}, ${r.data.count} тов., ${r.via})`);
      } else {
        row[i] = null; missed++;
        misses.push(`${key}[${i}] — ${r.reason}`);
        console.log(`MISS ${key}[${i}] — ${r.reason}`);
        if (r.sample?.length) console.log(`     приклади: ${r.sample.join(" | ")}`);
      }
      await sleep(DELAY_MS);
    }
    // Монотонність рівнів: преміум не може бути дешевшим за стандарт більш ніж на 10%
    for (let i = 1; i < row.length; i++) {
      if (row[i] && row[i - 1] && row[i].price < row[i - 1].price * 0.9) {
        misses.push(`${key}[${i}] — інверсія рівнів (${row[i].price} < ${row[i - 1].price}), скинуто`);
        console.log(`SANITY ${key}[${i}] — рівень дешевший за попередній (${row[i].price} < ${row[i - 1].price}) → MISS`);
        row[i] = null; found--; missed++;
      }
    }
    if (row.some(Boolean)) cats[key] = row;
  }

  const out = {
    updated: new Date().toISOString().slice(0, 10),
    source: "epicentrk.ua",
    stats: { found, missed, total: found + missed },
    cats,
  };

  const { writeFileSync, mkdirSync } = await import("node:fs");
  mkdirSync("public", { recursive: true });
  writeFileSync("public/materials.json", JSON.stringify(out, null, 2));

  console.log(`\nПідсумок: ${found} зібрано, ${missed} не знайдено.`);
  if (misses.length) {
    console.log("\n=== ПОТРЕБУЮТЬ НАЛАШТУВАННЯ (скинь цей блок Клоду) ===");
    misses.forEach((m) => console.log("  " + m));
  }
};

main().catch((e) => { console.error("Фатальна помилка:", e); process.exit(1); });
