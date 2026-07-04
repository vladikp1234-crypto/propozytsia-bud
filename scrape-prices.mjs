// scrape-prices.mjs — щоденний збір середньоринкових цін з rabotniki.ua (Київ)
// Запускається GitHub Actions щоночі. Результат: public/prices.json
// Кожен ключ у MAPPING відповідає liveKey у App.jsx.

const CITY = "kiev";
const BASE = "https://www.rabotniki.ua/uk";
const DELAY_MS = 1800; // пауза між запитами — не навантажуємо сайт

// Категорія → роботи, які нас цікавлять.
// candidates: варіанти назв (беремо перший, що знайшовся на сторінці)
const MAPPING = {
  walls_plaster:   { cat: "shtukaturnye-raboty",        candidates: ["Ручна Маякова штукатурка (до 2 см)", "Стартова штукатурка (стіна по маяках або стеля під правило)"] },
  walls_plaster_m: { cat: "shtukaturnye-raboty",        candidates: ["Машинна штукатурка стін"] },
  walls_primer:    { cat: "shtukaturnye-raboty",        candidates: ["Грунтовка стін, стелі (1 шар) під штукатурку"] },
  screed:          { cat: "chernovye-raboty-po-polu",   candidates: ["Напівсуха стяжка", "Цементно-піщана стяжка до 5 см", "Цементно-піщана стяжка"] },
  electro_point:   { cat: "elektromontazhnye-raboty",   candidates: ["Установка розеток і вимикачів", "Монтаж розетки", "Установка розетки", "Електроточка"] },
  plumb_bath:      { cat: "santehnicheskie-raboty",     candidates: ["Розводка труб водопостачання", "Монтаж труб водопостачання", "Розводка води"] },
  ceiling:         { cat: "potolki",                    candidates: ["Монтаж натяжних стель", "Натяжна стеля", "Монтаж натяжної стелі"] },
  tile:            { cat: "plitochnye-raboty",          candidates: ["Укладання плитки на стіни", "Укладання плитки на підлогу", "Укладання керамічної плитки"] },
  putty:           { cat: "malyarnye-raboty",           candidates: ["Шпаклівка стін під фарбування", "Шпаклівка стін фінішна", "Шпаклівка стін"] },
  painting:        { cat: "malyarnye-raboty",           candidates: ["Фарбування стін (2 шари)", "Фарбування стін у два шари", "Фарбування стін"] },
  laminate:        { cat: "napolnye-pokrytiya",         candidates: ["Укладання ламінату", "Укладання ламінату на підкладку"] },
  plinth:          { cat: "napolnye-pokrytiya",         candidates: ["Монтаж плінтуса", "Установка плінтуса"] },
  doors_install:   { cat: "dveri",                      candidates: ["Встановлення міжкімнатних дверей", "Установка міжкімнатних дверей", "Монтаж дверей"] },
  demontazh:       { cat: "demontazh-nastennyh-pokrytiy", candidates: ["Демонтаж штукатурки", "Зняття шпалер", "Демонтаж настінних покриттів"] },
  // Будинок
  monolith:        { cat: "betonnye-raboty",            candidates: ["Заливка бетону", "Бетонування", "Монолітні роботи"] },
  masonry:         { cat: "kladochnye-raboty",          candidates: ["Кладка газоблоку", "Кладка стін з газоблоку", "Кладка газобетону"] },
  roofing:         { cat: "krovelnye-raboty",           candidates: ["Монтаж металочерепиці", "Покрівля з металочерепиці"] },
  facade_insul:    { cat: "fasadnye-raboty",            candidates: ["Утеплення фасаду пінопластом", "Утеплення фасаду", "Утеплення фасаду мінватою"] },
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

// Шукає в тексті блок:
//   <Назва роботи> ... Всього пропозицій: N ... Діапазон цін: A - B грн/од ... Середня ціна ... X ... грн/од
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
  return {
    count: num(m[1]),
    min: num(m[2]),
    max: num(m[3]),
    unit: (m[4] || "").trim() || null,
    price: num(m[5]),
  };
}

async function fetchCat(cat) {
  const url = `${BASE}/${cat}/${CITY}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "uk-UA,uk;q=0.9,en;q=0.5",
      "Referer": "https://www.rabotniki.ua/uk/price",
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const text = htmlToText(html);
  console.log(`  · HTTP ${res.status}, ${Math.round(html.length/1024)} KB, "Середня ціна" на сторінці: ${text.includes("Середня ціна") ? "так" : "НІ (можливо, блокування або інша структура)"}`);
  return text;
}

async function main() {
  // Групуємо ключі за категорією, щоб кожну сторінку тягнути один раз
  const byCat = {};
  for (const [key, cfg] of Object.entries(MAPPING)) {
    (byCat[cfg.cat] ||= []).push(key);
  }

  // Читаємо попередній файл, щоб не втрачати старі значення якщо щось не знайшлось
  let prev = { works: {} };
  try {
    const { readFileSync } = await import("node:fs");
    prev = JSON.parse(readFileSync("public/prices.json", "utf8"));
  } catch {}

  const works = { ...(prev.works || {}) };
  let found = 0, missed = 0;

  for (const [cat, keys] of Object.entries(byCat)) {
    let text;
    try {
      console.log(`→ ${cat}`);
      text = await fetchCat(cat);
    } catch (e) {
      console.error(`  ✗ fetch failed: ${e.message} (keeping previous values)`);
      continue;
    }
    for (const key of keys) {
      const { candidates } = MAPPING[key];
      let hit = null, hitName = null;
      for (const name of candidates) {
        hit = findWork(text, name);
        if (hit) { hitName = name; break; }
      }
      if (hit && hit.price > 0) {
        works[key] = {
          ...hit,
          name: hitName,
          cat,
          url: `${BASE}/${cat}/${CITY}`,
        };
        found++;
        console.log(`  ✓ ${key}: "${hitName}" = ${hit.price} грн (${hit.count} пропозицій)`);
      } else {
        missed++;
        console.warn(`  ⚠ ${key}: не знайдено (кандидати: ${candidates.join(" | ")})${works[key] ? " — лишаю старе значення " + works[key].price : ""}`);
      }
    }
    await sleep(DELAY_MS);
  }

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
    console.error("Жодної ціни не знайдено — можливо, змінилась структура сторінки.");
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
