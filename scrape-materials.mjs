// scrape-materials.mjs v1 — щоденний збір реальних цін матеріалів з epicentrk.ua
// Результат: public/materials.json → { updated, cats: { <catKey>: [ {name, price, url, count}, ... ] } }
// Індекс у масиві = рівень (0 економ, 1 стандарт, 2 преміум) і збігається з MATS у data.js.
//
// ПРИНЦИП ЧЕСНОСТІ: якщо позицію не вдалося зібрати — вона НЕ підставляється.
// Застаріле/вигадане краще не показувати: у застосунку така категорія лишається
// кураторською оцінкою з відповідним підписом.
//
// Композитні позиції (натяжна стеля, комплект сантехніки, вікна під замовлення)
// свідомо не мапляться — це не роздрібний SKU, ціна формується проєктно.

const BASE = "https://epicentrk.ua";
const DELAY_MS = 2500;

// catKey → рівні. band = [min, max] грн за одиницю: відсікає аксесуари й випадкові товари.
// unit — для перевірки: ціна за м²/шт/м.п. Пошук робимо тим самим запитом, що й посилання в UI.
const MAPPING = {
  floorcover: [
    { q: "ламінат 32 клас", band: [180, 700], unit: "м²" },
    { q: "ламінат 33 клас", band: [350, 1400], unit: "м²" },
    { q: "вініловий ламінат SPC", band: [500, 2200], unit: "м²" },
    { q: "інженерна дошка дуб", band: [1200, 6000], unit: "м²" },
  ],
  tile: [
    { q: "плитка керамічна для стін", band: [150, 900], unit: "м²" },
    { q: "плитка Cersanit", band: [400, 1800], unit: "м²" },
    { q: "керамограніт 600х1200", band: [900, 4000], unit: "м²" },
  ],
  paint: [
    { q: "фарба інтер'єрна водоемульсійна", band: [40, 260], unit: "м²" },
    { q: "фарба Sniezka інтер'єрна", band: [60, 400], unit: "м²" },
    { q: "фарба Tikkurila інтер'єрна", band: [120, 900], unit: "м²" },
  ],
  wallpaper: [
    { q: "шпалери паперові", band: [50, 400], unit: "м²" },
    { q: "шпалери флізелінові", band: [100, 800], unit: "м²" },
    { q: "шпалери під фарбування", band: [100, 800], unit: "м²" },
  ],
  doors: [
    { q: "двері міжкімнатні ламіновані", band: [2000, 9000], unit: "шт" },
    { q: "двері міжкімнатні шпоновані", band: [5000, 20000], unit: "шт" },
    { q: "двері міжкімнатні приховані", band: [12000, 60000], unit: "шт" },
  ],
  plinth: [
    { q: "плінтус МДФ", band: [40, 350], unit: "м.п." },
    { q: "плінтус дюрополімер", band: [80, 600], unit: "м.п." },
  ],
  entry: [
    { q: "двері вхідні квартирні", band: [5000, 20000], unit: "шт" },
    { q: "двері вхідні з терморозривом", band: [12000, 45000], unit: "шт" },
  ],
  heatfloor: [
    { q: "нагрівальний мат тепла підлога", band: [300, 2000], unit: "м²" },
    { q: "інфрачервона плівка тепла підлога", band: [250, 1600], unit: "м²" },
  ],
  radiators: [
    { q: "радіатор сталевий панельний", band: [1500, 9000], unit: "шт" },
    { q: "радіатор біметалевий", band: [2000, 14000], unit: "шт" },
  ],
  decor: [
    { q: "декоративна штукатурка короїд", band: [150, 900], unit: "м²" },
    { q: "венеціанська штукатурка", band: [400, 2500], unit: "м²" },
  ],
  ac_unit: [
    { q: "кондиціонер спліт-система 09", band: [10000, 30000], unit: "шт" },
    { q: "кондиціонер інверторний 09", band: [16000, 50000], unit: "шт" },
    { q: "кондиціонер Daikin", band: [30000, 120000], unit: "шт" },
  ],
  boiler: [
    { q: "бойлер 80 л", band: [3500, 14000], unit: "шт" },
    { q: "бойлер сухий тен 100 л", band: [6000, 25000], unit: "шт" },
    { q: "водонагрівач проточний", band: [8000, 60000], unit: "шт" },
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      "Accept-Language": "uk-UA,uk;q=0.9",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.text();
}

// Стратегія 1: JSON-LD (найнадійніше, якщо є)
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

// Стратегія 2: інлайн-дані/розмітка (data-price, itemprop, "price":N)
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

async function collect(entry) {
  const url = `${BASE}/ua/search/?q=${encodeURIComponent(entry.q)}`;
  const html = await fetchPage(url);
  let items = fromJsonLd(html);
  let via = "json-ld";
  if (items.length < 3) { items = fromMarkup(html); via = "markup"; }

  const [lo, hi] = entry.band;
  const inBand = items.filter((x) => x.price >= lo && x.price <= hi);
  if (inBand.length < 3) {
    return { ok: false, reason: `знайдено ${items.length} товарів, у діапазоні ${lo}–${hi}: ${inBand.length}`, via, sample: items.slice(0, 5).map(x => `${x.name} = ${x.price}`) };
  }
  const price = median(inBand.map((x) => x.price));
  // репрезентативний товар — найближчий до медіани
  const rep = inBand.reduce((a, b) => (Math.abs(b.price - price) < Math.abs(a.price - price) ? b : a));
  return {
    ok: true, via,
    data: {
      name: rep.name,
      price,
      count: inBand.length,
      url: rep.url && rep.url.startsWith("http") ? rep.url : url,
    },
  };
}

const main = async () => {
  const cats = {};
  let found = 0, missed = 0;
  const misses = [];

  for (const [key, tiers] of Object.entries(MAPPING)) {
    const row = [];
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      try {
        const r = await collect(t);
        if (r.ok) {
          row[i] = r.data;
          found++;
          console.log(`✓ ${key}[${i}] «${t.q}» → ${r.data.price} грн/${t.unit} (${r.data.count} товарів, ${r.via})`);
        } else {
          row[i] = null;
          missed++;
          misses.push(`${key}[${i}] «${t.q}» — ${r.reason}`);
          console.log(`MISS ${key}[${i}] «${t.q}» — ${r.reason} [${r.via}]`);
          if (r.sample?.length) console.log(`     приклади: ${r.sample.join(" | ")}`);
        }
      } catch (e) {
        row[i] = null;
        missed++;
        misses.push(`${key}[${i}] «${t.q}» — помилка: ${e.message}`);
        console.log(`MISS ${key}[${i}] «${t.q}» — помилка: ${e.message}`);
      }
      await sleep(DELAY_MS);
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
