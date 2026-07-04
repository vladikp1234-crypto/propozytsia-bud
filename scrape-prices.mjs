// scrape-prices.mjs v3 — щоденний збір середньоринкових цін з rabotniki.ua (Київ)
// Результат: public/prices.json. Ключі = liveKey у App.jsx.
// ВАЖЛИВО: композитні позиції (електроточка, демонтаж "під ключ", сантех-розводка)
// свідомо НЕ мапляться — rabotniki цінує їх погранульно, і підстановка
// однієї суб-роботи занизила б кошторис. Вони лишаються на кураторських оцінках.

const CITY = "kiev";
const BASE = "https://www.rabotniki.ua/uk";
const DELAY_MS = 1800;

// key → список джерел; кожне джерело = категорія + варіанти назв роботи.
// Береться перший збіг. Порядок джерел = пріоритет.
const MAPPING = {
  walls_plaster: [{ cat: "shtukaturnye-raboty", candidates: ["Ручна Маякова штукатурка (до 2 см)", "Стартова штукатурка (стіна по маяках або стеля під правило)"] }],
  walls_plaster_m: [{ cat: "shtukaturnye-raboty", candidates: ["Машинна штукатурка стін"] }],
  walls_primer: [{ cat: "shtukaturnye-raboty", candidates: ["Грунтовка стін, стелі (1 шар) під штукатурку"] }],
  screed: [{ cat: "chernovye-raboty-po-polu", candidates: ["Напівсуха стяжка", "Цементно-піщана стяжка до 5 см", "Цементно-піщана стяжка"] }],
  ceiling: [
    { cat: "natyazhnye-potolki", candidates: ["Монтаж натяжних стель", "Монтаж натяжної стелі", "Натяжна стеля"] },
    { cat: "potolki", candidates: ["Монтаж натяжних стель", "Натяжна стеля"] },
    { cat: "montazh-gipsokartona", candidates: ["Монтаж стелі з гіпсокартону (1 рівень)", "Стеля з гіпсокартону в один рівень", "Монтаж гіпсокартонної стелі"] },
  ],
  tile: [{ cat: "plitochnye-raboty", candidates: ["Укладання плитки на стіни", "Укладання плитки на підлогу", "Укладання керамічної плитки"] }],
  putty: [{ cat: "malyarnye-raboty", candidates: ["Підготовка бетонної стіни під фарбування або шпалери", "Підготовка г. к. стіни під фарбування або шпалери"] }],
  painting: [{ cat: "malyarnye-raboty", candidates: ["Фарбування стін (2 шари)", "Фарбування стін"] }],
  laminate: [{ cat: "napolnye-pokrytiya", candidates: ["Укладання ламінату"] }],
  plinth: [{ cat: "napolnye-pokrytiya", candidates: ["Монтаж плінтуса", "Установка плінтуса"] }],
  doors_install: [{ cat: "dveri", candidates: ["Встановлення міжкімнатних дверей", "Установка міжкімнатних дверей"] }],
  // Будинок
  monolith: [{ cat: "betonnye-raboty", candidates: ["Заливка фундаменту", "Бетонування фундаменту", "Заливка бетону", "Бетонування"] }],
  masonry: [{ cat: "kladochnye-raboty", candidates: ["Кладка стін з газобетону", "Кладка газобетонних блоків", "Кладка газоблоку", "Кладка газоблока"] }],
  roofing: [{ cat: "krovelnye-raboty", candidates: ["Монтаж покрівлі з металочерепиці", "Монтаж металочерепиці", "Укладання металочерепиці"] }],
  facade_insul: [{ cat: "fasadnye-raboty", candidates: ["Утеплення фасаду пінопластом", "Утеплення фасаду", "Утеплення фасаду мінватою"] }],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n");
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const num = (s) => parseInt(String(s).replace(/[\s\u00a0]/g, ""), 10);

function findWork(text, name) {
  const re = new RegExp(
    escRe(name) +
      "[\\s\\S]{0,260}?Всього пропозицій:\\s*([\\d\\s\\u00a0]+)" +
      "[\\s\\S]{0,160}?Діапазон цін:\\s*([\\d\\s\\u00a0]+)-\\s*([\\d\\s\\u00a0]+)\\s*грн\\/?([^\\s\\n]*)" +
      "[\\s\\S]{0,160}?Середня ціна\\s*([\\d\\s\\u00a0]+)\\s*грн",
    "i"
  );
  const m = text.match(re);
  if (!m) return null;
  return { count: num(m[1]), min: num(m[2]), max: num(m[3]), unit: (m[4] || "").trim() || null, price: num(m[5]) };
}

const pageCache = new Map();
async function fetchCat(cat) {
  if (pageCache.has(cat)) return pageCache.get(cat);
  const url = `${BASE}/${cat}/${CITY}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "uk-UA,uk;q=0.9,en;q=0.5",
      "Referer": "https://www.rabotniki.ua/uk/price",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const text = htmlToText(html);
  console.log(`  · ${cat}: HTTP ${res.status}, ${Math.round(html.length / 1024)} KB, "Середня ціна": ${text.includes("Середня ціна") ? "є" : "НЕМАЄ"}`);
  pageCache.set(cat, text);
  await sleep(DELAY_MS);
  return text;
}

async function main() {
  let prev = { works: {} };
  try {
    const { readFileSync } = await import("node:fs");
    prev = JSON.parse(readFileSync("public/prices.json", "utf8"));
  } catch {}

  const works = {};
  let found = 0, missed = 0;

  for (const [key, sources] of Object.entries(MAPPING)) {
    let hit = null, hitName = null, hitCat = null;
    for (const { cat, candidates } of sources) {
      let text;
      try {
        text = await fetchCat(cat);
      } catch (e) {
        console.error(`  ✗ ${key}: fetch ${cat} failed: ${e.message}`);
        continue;
      }
      for (const name of candidates) {
        hit = findWork(text, name);
        if (hit && hit.price > 0) { hitName = name; hitCat = cat; break; }
        hit = null;
      }
      if (hit) break;
    }
    if (hit) {
      works[key] = { ...hit, name: hitName, cat: hitCat, url: `${BASE}/${hitCat}/${CITY}` };
      found++;
      console.log(`  ✓ ${key}: "${hitName}" = ${hit.price} грн (${hit.count} пропозицій)`);
    } else if (prev.works && prev.works[key]) {
      // лишаємо старе значення, тільки якщо ключ досі в MAPPING
      works[key] = prev.works[key];
      missed++;
      console.warn(`  ⚠ ${key}: не знайдено — лишаю попереднє значення ${prev.works[key].price}`);
    } else {
      missed++;
      console.warn(`  ⚠ ${key}: не знайдено`);
    }
  }
  // Ключі, видалені з MAPPING (напр. electro_point), сюди не потрапляють — стають кураторськими у застосунку.

  const out = {
    updated: new Date().toISOString().slice(0, 10),
    city: CITY,
    source: "rabotniki.ua",
    stats: { found, missed, total: Object.keys(MAPPING).length },
    works,
  };

  const { writeFileSync, mkdirSync } = await import("node:fs");
  mkdirSync("public", { recursive: true });
  writeFileSync("public/prices.json", JSON.stringify(out, null, 2));
  console.log(`\nГотово: ${found} знайдено, ${missed} пропущено → public/prices.json`);

  if (found === 0) {
    console.error("Жодної ціни не знайдено — можливо, змінилась структура сторінки або блокування.");
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
