import React, { useState, useMemo } from "react";

/* ================================================================
   ПРОПОЗИЦІЯ.БУД v1.3 — Київ і область
   Повна комерційна пропозиція: лід-форма, обкладинка, діаграми,
   графік робіт, графік оплат, умови, друк/PDF.
   ⚠️ ДЕМО-ДАНІ — ціни та виконавці орієнтовні.
   ================================================================ */

/* ---- DATA ---- */
const REGIONS = [
  { id: "kyiv", name: "м. Київ", k: 1.0 },
  { id: "irpin", name: "Ірпінь / Буча", k: 0.97 },
  { id: "brovary", name: "Бровари", k: 0.96 },
  { id: "boryspil", name: "Бориспіль", k: 0.95 },
  { id: "vyshneve", name: "Вишневе / Крюківщина", k: 0.96 },
  { id: "obukhiv", name: "Обухів / Українка", k: 0.93 },
  { id: "oblast", name: "Інше, Київська обл.", k: 0.92 },
];
const TIERS = {
  econom: { name: "Економ", kWork: 0.85, kMat: 0.8 },
  standart: { name: "Стандарт", kWork: 1.0, kMat: 1.0 },
  premium: { name: "Преміум", kWork: 1.25, kMat: 1.9 },
};
const TIER_TABLE = [
  { row: "Стіни", econom: "Шпалери під фарбування", standart: "Шпаклівка + якісна фарба", premium: "Декоративні покриття, ідеальні площини" },
  { row: "Підлога", econom: "Ламінат 32 кл. · 350–500 грн/м²", standart: "Ламінат 33/вініл · 700–1000 грн/м²", premium: "Інженерна дошка · 2500+ грн/м²" },
  { row: "Плитка", econom: "Україна · 400–600 грн/м²", standart: "Україна/Польща · 800–1200 грн/м²", premium: "Іспанія/Італія · 2000+ грн/м²" },
  { row: "Санвузол", econom: "Cersanit, Kolo — базова лінійка", standart: "Grohe/Hansgrohe, інсталяція Geberit", premium: "Duravit, Hansgrohe Raindance, підігрів" },
  { row: "Двері", econom: "Ламіновані · 5–7 тис. грн", standart: "Шпоновані/фарбовані · 10–15 тис.", premium: "Приховані/масив · 25+ тис. грн" },
  { row: "Електрика", econom: "Мінімум точок, базова фурнітура", standart: "Schneider/Legrand, продуманий план", premium: "Розумний дім, дизайнерська серія" },
];
const STYLE_MODS = {
  "Сучасний": { mods: {}, note: "Базовий орієнтир — без надбавок." },
  "Мінімалізм": { mods: { paint: 1.15, doors: 1.2, ceil: 1.1 }, note: "Ідеально рівні площини, приховані двері — дорожча підготовка." },
  "Класика": { mods: { paint: 1.2, ceil: 1.15, doors: 1.1 }, note: "Молдинги, карнизи, фільонки — більше опоряджувальних робіт." },
  "Лофт": { mods: { walls: 0.85, paint: 0.9, ceil: 0.9 }, note: "Відкриті поверхні — економія на вирівнюванні." },
  "Скандинавський": { mods: { paint: 1.05 }, note: "Просте світле оздоблення, акцент на матеріалах підлоги." },
  "Джапанді": { mods: { paint: 1.1, flooring: 1.15, doors: 1.15 }, note: "Натуральні матеріали й точна геометрія." },
};
const SRC = {
  price: "https://www.rabotniki.ua/uk/price/kiev",
  otd: "https://www.rabotniki.ua/uk/otdelochnye-raboty",
  common: "https://www.rabotniki.ua/uk/obschestroitelnye-montazhnye-raboty",
  beton: "https://www.rabotniki.ua/uk/betonnye-raboty",
  fund: "https://www.rabotniki.ua/uk/fundament",
};

const FLAT_STAGES = [
  { id: "demo", name: "Демонтаж", icon: "🔨", onlyIf: (p) => p.condition === "old", weeks: () => 1.5,
    scope: "Зняття старих покриттів (шпалери, плитка, штукатурка, підлога), демонтаж старої сантехніки та електроточок, вивіз будівельного сміття",
    items: [
      { label: "Демонтаж старого оздоблення + вивіз", unit: "м²", qty: (p) => p.area,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 550, mat: 150 },
          { name: "Бригада «ДемонтажПро» · 4.9★", src: "rabotniki.ua · демо", url: SRC.common, price: 490, mat: 150 },
        ] },
    ] },
  { id: "walls", name: "Стіни: штукатурка", icon: "🧱", skipIf: (p) => p.condition === "partial", weeks: () => 3,
    scope: "Штукатурка стін по маяках (машинна або ручна), ґрунтування поверхонь у 2 шари, підготовка під шпаклівку",
    items: [
      { label: "Штукатурка стін по маяках", unit: "м²", qty: (p) => Math.round(p.area * 2.6),
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 320, mat: 170 },
          { name: "Машинна штукатурка «МехШтук» · 4.8★", src: "rabotniki.ua · демо", url: SRC.otd, price: 260, mat: 190 },
          { name: "Майстер Олег В. · 5.0★", src: "rabotniki.ua · демо", url: SRC.otd, price: 360, mat: 170 },
        ] },
      { label: "Ґрунтування", unit: "м²", qty: (p) => Math.round(p.area * 2.6),
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 35, mat: 25 }] },
    ] },
  { id: "floor", name: "Стяжка підлоги", icon: "⬜", skipIf: (p) => p.condition === "partial", weeks: () => 1.5,
    scope: "Напівсуха або мокра стяжка з армуванням, вирівнювання до ±2мм на 2м правила, гідроізоляція мокрих зон",
    items: [
      { label: "Стяжка напівсуха", unit: "м²", qty: (p) => p.area,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.beton, price: 260, mat: 210 },
          { name: "«СтяжкаКомплекс» механізована · 4.9★", src: "rabotniki.ua · демо", url: SRC.beton, price: 230, mat: 230 },
        ] },
    ] },
  { id: "electro", name: "Електромонтаж", icon: "⚡", weeks: () => 2.5,
    scope: "Штробування, прокладання кабелю NYM/ВВГнг, встановлення підрозетників, збірка розподільного щитка, заземлення",
    items: [
      { label: "Електроточка (розетка/вимикач/вивід)", unit: "шт", qty: (p) => 8 + p.rooms * 7 + p.bathrooms * 3,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 650, mat: 450 },
          { name: "«ЕлектроДім» з проєктом · 4.9★", src: "rabotniki.ua · демо", url: SRC.price, price: 720, mat: 430 },
          { name: "Майстер Ігор К. · 4.7★", src: "rabotniki.ua · демо", url: SRC.price, price: 560, mat: 450 },
        ] },
      { label: "Збірка щитка", unit: "шт", qty: () => 1,
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 6500, mat: 5500 }] },
    ] },
  { id: "plumb", name: "Сантехнічна розводка", icon: "🚿", weeks: () => 1.5,
    scope: "Розводка гарячої/холодної води (PPR/PEX), каналізації (ПВХ), підключення стояків, гідроіспитання",
    items: [
      { label: "Розводка води й каналізації", unit: "сануз.", qty: (p) => p.bathrooms,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 14000, mat: 11000 },
          { name: "«АкваМонтаж» · 4.8★", src: "rabotniki.ua · демо", url: SRC.price, price: 12500, mat: 11500 },
        ] },
      { label: "Точки кухні", unit: "компл.", qty: () => 1,
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 5000, mat: 3600 }] },
    ] },
  { id: "ceil", name: "Стелі", icon: "🔲", weeks: () => 1.5,
    scope: "Натяжна стеля або гіпсокартонна конструкція з малярною підготовкою, вирізи під освітлення",
    items: [
      { label: "Стеля (натяжна / ГК)", unit: "м²", qty: (p) => Math.round(p.area * 0.92),
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 340, mat: 420 },
          { name: "«СтеляСервіс» натяжні · 4.9★", src: "rabotniki.ua · демо", url: SRC.otd, price: 280, mat: 460 },
        ] },
    ] },
  { id: "tile", name: "Плиткові роботи", icon: "🔷", weeks: () => 2.5,
    scope: "Гідроізоляція мокрих зон, укладання настінної та підлогової плитки, затирка швів, фартух кухні",
    items: [
      { label: "Плитка: санвузли (стіни + підлога)", unit: "м²", qty: (p) => p.bathrooms * 24,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 850, mat: 900 },
          { name: "Плиточник Андрій М. · 5.0★", src: "rabotniki.ua · демо", url: SRC.otd, price: 950, mat: 900 },
        ] },
      { label: "Фартух кухні", unit: "м²", qty: () => 5,
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 950, mat: 1000 }] },
    ] },
  { id: "paint", name: "Шпаклівка та фарбування", icon: "🎨", weeks: () => 3,
    scope: "Фінішна шпаклівка під фарбування (2–3 шари), шліфування, ґрунтування, фарбування у 2 шари",
    items: [
      { label: "Шпаклівка стін під фарбування", unit: "м²", qty: (p) => Math.round(p.area * 2.3),
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 260, mat: 90 },
          { name: "Маляр Світлана П. · 4.9★", src: "rabotniki.ua · демо", url: SRC.otd, price: 290, mat: 85 },
        ] },
      { label: "Фарбування у 2 шари", unit: "м²", qty: (p) => Math.round(p.area * 2.3),
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 160, mat: 110 }] },
    ] },
  { id: "flooring", name: "Підлогове покриття", icon: "🪵", weeks: () => 1.5,
    scope: "Укладання ламінату/вінілу/паркетної дошки з підкладкою, монтаж плінтуса, порогів",
    items: [
      { label: "Укладання покриття", unit: "м²", qty: (p) => Math.round(p.area * 0.88),
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 250, mat: 750 },
          { name: "«ПаркетГруп» · 4.8★", src: "rabotniki.ua · демо", url: SRC.otd, price: 300, mat: 780 },
        ] },
      { label: "Плінтус", unit: "м.п.", qty: (p) => Math.round(p.area * 0.9),
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 90, mat: 130 }] },
    ] },
  { id: "doors", name: "Двері міжкімнатні", icon: "🚪", weeks: () => 1,
    scope: "Встановлення дверних блоків з коробкою, наличниками, доборами, фурнітурою",
    items: [
      { label: "Дверний блок зі встановленням", unit: "шт", qty: (p) => p.rooms + p.bathrooms,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 3200, mat: 8500 },
          { name: "Фабричні + монтаж · демо", src: "виробник · демо", url: SRC.price, price: 2800, mat: 9500 },
        ] },
    ] },
  { id: "bath", name: "Комплектація санвузлів", icon: "🛁", weeks: (p) => p.bathrooms,
    scope: "Встановлення ванни/душової, унітазу, раковини, змішувачів, дзеркала, аксесуарів, підключення",
    items: [
      { label: "Сантехніка та монтаж (комплект)", unit: "сануз.", qty: (p) => p.bathrooms,
        opts: [
          { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 16000, mat: 52000 },
          { name: "«АкваМонтаж» комплект · 4.8★", src: "rabotniki.ua · демо", url: SRC.price, price: 14500, mat: 54000 },
        ] },
    ] },
  { id: "final", name: "Фінішні роботи", icon: "✨", weeks: () => 1,
    scope: "Встановлення розеток/вимикачів, світильників, карнизів, клінінг після ремонту",
    items: [
      { label: "Фурнітура, світло, клінінг", unit: "м²", qty: (p) => p.area,
        opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 190, mat: 55 }] },
    ] },
];

const fpn = (p) => Math.round((p.area / p.floors) * 1.1);
const HOUSE_STAGES = [
  { id: "prep", name: "Проєкт і підготовка", icon: "📐", weeks: () => 4, scope: "Архітектурний проєкт, конструктив, геодезія, дозвільна документація",
    items: [{ label: "Проєктування", unit: "м²", qty: (p) => p.area, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.common, price: 650, mat: 150 }] }] },
  { id: "found", name: "Фундамент", icon: "⛏️", weeks: (p) => 4 + p.area / 120, scope: "Земляні роботи, опалубка, армування, бетонування, гідроізоляція",
    items: [
      { label: "Земляні роботи", unit: "м²", qty: fpn, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.fund, price: 450, mat: 250 }] },
      { label: "Монолітні роботи", unit: "м²", qty: fpn, opts: [
        { name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.fund, price: 1500, mat: 2400 },
        { name: "Монолітники зі своєю опалубкою · 4.8★", src: "rabotniki.ua · демо", url: SRC.beton, price: 1350, mat: 2450 },
      ] },
    ] },
  { id: "box", name: "Коробка: стіни та перекриття", icon: "🧱", weeks: (p) => 8 + p.area / 80, scope: "Кладка несучих та перегородочних стін, армопояси, монтаж перекриттів",
    items: [
      { label: "Кладка стін (газоблок)", unit: "м²", qty: (p) => p.area, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.common, price: 1900, mat: 2600 }] },
      { label: "Перекриття та армопояси", unit: "м²", qty: (p) => Math.round(p.area * 0.55), opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.beton, price: 1400, mat: 2300 }] },
    ] },
  { id: "roof", name: "Покрівля", icon: "🏠", weeks: () => 4, scope: "Мауерлат, кроквяна система, гідро/паро ізоляція, покрівельний матеріал, водостоки",
    items: [{ label: "Кроквяна система + покриття", unit: "м²", qty: (p) => Math.round(fpn(p) * 1.25), opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.common, price: 1300, mat: 1900 }] }] },
  { id: "windows", name: "Вікна та двері", icon: "🪟", weeks: () => 2, scope: "Металопластикові/алюмінієві вікна, вхідні двері, монтаж, відкоси",
    items: [{ label: "Вікна + вхідні двері", unit: "м²", qty: (p) => p.area, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 400, mat: 1400 }] }] },
  { id: "facade", name: "Фасад та утеплення", icon: "🧊", weeks: () => 5, scope: "Утеплення мінватою/пінопластом 150–200мм, армування сіткою, декоративна штукатурка",
    items: [{ label: "Утеплення + декоративна штукатурка", unit: "м²", qty: (p) => Math.round(p.area * 1.15), opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 850, mat: 1100 }] }] },
  { id: "mep", name: "Інженерні мережі", icon: "⚙️", weeks: () => 6, scope: "Електрика, опалення (газ/ТН), водопровід, каналізація, вентиляція",
    items: [
      { label: "Електрика", unit: "м²", qty: (p) => p.area, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 700, mat: 600 }] },
      { label: "Опалення, вода, каналізація", unit: "м²", qty: (p) => p.area, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 1100, mat: 1300 }] },
    ] },
  { id: "finish", name: "Внутрішнє оздоблення", icon: "🎨", weeks: (p) => ({ econom: 8, standart: 12, premium: 20 })[p.tier], scope: "Штукатурка, шпаклівка, фарбування, плитка, підлога, двері, сантехніка — повний цикл",
    items: [{ label: "Оздоблення «під ключ»", unit: "м²", qty: (p) => p.area, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.otd, price: 3200, mat: 4300 }] }] },
  { id: "bath", name: "Санвузли", icon: "🛁", weeks: (p) => p.bathrooms, scope: "Повна комплектація та встановлення сантехніки, дзеркал, аксесуарів",
    items: [{ label: "Сантехніка та монтаж", unit: "сануз.", qty: (p) => p.bathrooms, opts: [{ name: "Середньоринкова, Київ", src: "rabotniki.ua", url: SRC.price, price: 18000, mat: 60000 }] }] },
];

const BUDGETS = {
  flat: [
    { id: "f1", name: "до 700 тис. грн", max: 700000 },
    { id: "f2", name: "0,7 – 1,2 млн грн", max: 1200000 },
    { id: "f3", name: "1,2 – 2 млн грн", max: 2000000 },
    { id: "f4", name: "2 – 3,5 млн грн", max: 3500000 },
    { id: "f5", name: "понад 3,5 млн грн", max: Infinity },
  ],
  house: [
    { id: "h1", name: "до 3 млн грн", max: 3000000 },
    { id: "h2", name: "3 – 5 млн грн", max: 5000000 },
    { id: "h3", name: "5 – 8 млн грн", max: 8000000 },
    { id: "h4", name: "8 – 12 млн грн", max: 12000000 },
    { id: "h5", name: "понад 12 млн грн", max: Infinity },
  ],
};
const PAYMENT_SCHEDULE = [
  { pct: 30, label: "Аванс", desc: "Перед початком робіт: закупівля матеріалів і мобілізація" },
  { pct: 25, label: "Чорнові роботи", desc: "Після завершення прихованих робіт (електрика, сантехніка, стяжка, штукатурка)" },
  { pct: 25, label: "Чистові роботи", desc: "Після плитки, фарбування, підлоги, стелі" },
  { pct: 15, label: "Фінішний етап", desc: "Двері, сантехніка, світло, дрібниці" },
  { pct: 5, label: "Здача об'єкта", desc: "Після прийомки та усунення зауважень" },
];
const INCLUDES = [
  "Усі зазначені в кошторисі роботи та матеріали",
  "Доставка основних матеріалів на об'єкт",
  "Вивіз будівельного сміття",
  "Контроль якості на кожному етапі",
  "Фотофіксація ходу робіт",
  "Прибирання після завершення",
];
const EXCLUDES = [
  "Меблі та побутова техніка",
  "Кухонний гарнітур",
  "Перепланування з узгодженням у БТІ",
  "Кондиціонування (за окремим кошторисом)",
  "Балкон/лоджія (за окремим кошторисом)",
  "Зовнішні роботи (вхідні двері під'їзду, тамбур)",
];
const VILKA = 0.12, OVERLAP = 0.85, DEMO = true;
const STYLES = Object.keys(STYLE_MODS);

/* ---- ENGINE ---- */
function calc(mode, p, selections) {
  const stages = (mode === "flat" ? FLAT_STAGES : HOUSE_STAGES).filter(
    (s) => !(s.onlyIf && !s.onlyIf(p)) && !(s.skipIf && s.skipIf(p))
  );
  const region = REGIONS.find((x) => x.id === p.region) || REGIONS[0];
  const tier = TIERS[p.tier];
  const style = STYLE_MODS[p.style] || STYLE_MODS["Сучасний"];
  let weekOffset = 0;

  const rows = stages.map((s) => {
    const styleK = style.mods[s.id] || 1;
    const items = s.items.map((it, ii) => {
      const key = `${s.id}:${ii}`;
      const sel = selections[key] ?? 0;
      const opt = it.opts[Math.min(sel, it.opts.length - 1)];
      const qty = it.qty(p);
      const price = Math.round(opt.price * tier.kWork * region.k * styleK);
      const mat = Math.round(opt.mat * tier.kMat * region.k * styleK);
      return { key, label: it.label, unit: it.unit, qty, opts: it.opts, sel,
        price, mat, work: qty * price, matSum: qty * mat, total: qty * (price + mat) };
    });
    const weeks = Math.round(s.weeks(p) * (mode === "flat" ? Math.sqrt(p.area / 60) : Math.sqrt(p.area / 150)) * 10) / 10;
    const startWeek = weekOffset;
    weekOffset += weeks * OVERLAP;
    return {
      id: s.id, name: s.name, icon: s.icon, scope: s.scope, styleK, items, weeks, startWeek,
      total: items.reduce((a, b) => a + b.total, 0),
      work: items.reduce((a, b) => a + b.work, 0),
      matSum: items.reduce((a, b) => a + b.matSum, 0),
    };
  });

  const total = rows.reduce((a, r) => a + r.total, 0);
  const weeks = Math.round(rows.reduce((a, r) => a + r.weeks, 0) * OVERLAP);
  const budget = BUDGETS[mode].find((b) => b.id === p.budget);
  const styleDelta = Object.keys(style.mods).length
    ? Math.round((rows.reduce((a, r) => a + r.total, 0) / rows.reduce((a, r) => a + r.total / (r.styleK || 1), 0) - 1) * 100) : 0;
  return {
    rows, total, region, tier, style, styleDelta,
    low: total * (1 - VILKA), high: total * (1 + VILKA),
    perM2: Math.round(total / p.area),
    weeks, months: Math.round((weeks / 4.33) * 10) / 10,
    budgetFit: budget ? total * (1 - VILKA) <= budget.max : true,
    budgetName: budget?.name || "",
    totalWeeks: Math.ceil(weekOffset),
  };
}

const fmt = (n) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtM = (n) => (n >= 1000000 ? (n / 1000000).toFixed(2).replace(".", ",") + " млн" : fmt(n));
const COLORS = ["#2B4BD7", "#E8590C", "#1F7A38", "#9333EA", "#DC2626", "#0891B2", "#CA8A04", "#6366F1", "#059669", "#D946EF", "#EA580C", "#4F46E5"];

/* ---- STYLES ---- */
const css = `
:root{--bg:#EFECE5;--panel:#FBFAF7;--ink:#191B1F;--muted:#75787E;--line:#DCD8CE;
--blue:#2B4BD7;--blue-soft:#E8ECFB;--ok:#1F7A38;--ok-soft:#E9F4EC;--warn-soft:#FBEEE6;--warn:#C2410C}
*{box-sizing:border-box;margin:0;padding:0}
.app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased}
.laser{height:2px;background:linear-gradient(90deg,var(--blue) 0 60%,transparent 60% 62%,var(--blue) 62%)}
.topbar{position:sticky;top:0;z-index:40;background:var(--panel);border-bottom:1px solid var(--line)}
.tb{max-width:1060px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.logo{font-family:'Unbounded';font-weight:800;font-size:17px;letter-spacing:-.3px}.logo span{color:var(--blue)}
.mode{display:flex;border:1px solid var(--ink);border-radius:999px;overflow:hidden}
.mode button{font-family:'Manrope';font-weight:600;font-size:13px;padding:9px 20px;border:none;background:transparent;cursor:pointer;color:var(--ink)}
.mode button.on{background:var(--ink);color:var(--panel)}
.wrap{max-width:1060px;margin:0 auto;padding:36px 20px 120px}
.hero{margin-bottom:30px;max-width:660px}
.hero h1{font-family:'Unbounded';font-weight:600;font-size:clamp(22px,4vw,34px);line-height:1.15;letter-spacing:-.5px;margin-bottom:10px}
.hero p{color:var(--muted);font-size:15px;line-height:1.55}
.demob{display:inline-flex;align-items:center;gap:8px;margin-top:14px;background:var(--warn-soft);color:var(--warn);
font-family:'IBM Plex Mono';font-size:11px;font-weight:600;letter-spacing:.4px;padding:6px 12px;border-radius:6px;text-transform:uppercase}
.grid{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.pnl{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.ph{display:flex;align-items:center;gap:12px;padding:16px 22px;border-bottom:1px solid var(--line)}
.pn{font-family:'IBM Plex Mono';font-size:11px;font-weight:600;color:var(--blue);background:var(--blue-soft);padding:4px 9px;border-radius:5px}
.ph h2{font-size:15px;font-weight:700}
.pb{padding:20px 22px;display:grid;gap:18px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:560px){.g2{grid-template-columns:1fr}}
label.f{display:grid;gap:8px;font-size:13px;font-weight:600}
.hint{font-weight:500;color:var(--muted);font-size:12px;line-height:1.5}
select,input[type=number],input[type=text],input[type=tel],input[type=email]{font-family:'IBM Plex Mono';font-size:14px;padding:11px 12px;border:1px solid var(--line);
background:#fff;border-radius:9px;width:100%;color:var(--ink)}
select:focus,input:focus{outline:2px solid var(--blue);outline-offset:0;border-color:var(--blue)}
.rr{display:flex;align-items:center;gap:14px}
input[type=range]{flex:1;accent-color:var(--blue)}
.rv{font-family:'IBM Plex Mono';font-weight:600;font-size:16px;min-width:84px;text-align:right}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font-family:'Manrope';font-weight:600;font-size:13px;padding:9px 15px;border:1px solid var(--line);background:#fff;
border-radius:999px;cursor:pointer;color:var(--ink);transition:all .12s}
.chip:hover{border-color:var(--ink)}
.chip.on{background:var(--ink);border-color:var(--ink);color:#fff}
.chip.acc.on{background:var(--blue);border-color:var(--blue)}
.cond{display:grid;gap:10px}
.cond .opt{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--line);border-radius:11px;padding:13px 15px;cursor:pointer;background:#fff}
.cond .opt.on{border-color:var(--blue);background:var(--blue-soft)}
.cond .rd{width:16px;height:16px;border-radius:50%;border:2px solid var(--muted);margin-top:2px;flex-shrink:0}
.cond .opt.on .rd{border-color:var(--blue);background:var(--blue);box-shadow:inset 0 0 0 3px var(--blue-soft)}
.cond .ot{font-weight:700;font-size:13.5px}
.cond .od{font-size:12.5px;color:var(--muted);margin-top:2px}
.sn{background:var(--blue-soft);border-radius:9px;padding:10px 13px;font-size:12px;line-height:1.5}
.sn b{color:var(--blue)}
.tl{font-size:12px;font-weight:700;color:var(--blue);background:none;border:none;cursor:pointer;text-decoration:underline;padding:0;font-family:'Manrope';justify-self:start}
.tt{border:1px solid var(--line);border-radius:11px;overflow:hidden;font-size:11.5px;background:#fff}
.ttr{display:grid;grid-template-columns:80px 1fr 1fr 1fr;border-bottom:1px solid var(--line)}
.ttr:last-child{border-bottom:none}
.ttr.h{background:var(--bg);font-family:'IBM Plex Mono';font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)}
.ttr>div{padding:8px 10px;border-right:1px solid var(--line);line-height:1.45}
.ttr>div:last-child{border-right:none}
.ttr>div:first-child{font-weight:700;background:var(--bg)}
@media(max-width:680px){.ttr{grid-template-columns:70px 1fr 1fr 1fr;font-size:10px}}
/* live rail */
.rail{position:sticky;top:82px;display:grid;gap:14px}
.live{background:var(--ink);color:#fff;border-radius:14px;padding:20px 22px}
.lk{font-size:12px;color:#9a9da4;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.dot{width:7px;height:7px;border-radius:50%;background:#41d97e;animation:pulse 1.6s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.lv{font-family:'IBM Plex Mono';font-weight:600;font-size:clamp(19px,2.4vw,23px);line-height:1.3}
.lv em{font-style:normal;color:#7D96FF}
.ls{font-family:'IBM Plex Mono';font-size:12px;color:#9a9da4;margin-top:6px}
.lr{display:flex;justify-content:space-between;font-size:12.5px;padding:7px 0;border-top:1px solid #33353b;font-family:'IBM Plex Mono'}
.lr:first-of-type{margin-top:12px}
.livebtn{width:100%;margin-top:16px;font-family:'Unbounded';font-weight:600;font-size:13px;background:var(--blue);color:#fff;
border:none;border-radius:10px;padding:15px;cursor:pointer;transition:filter .15s}
.livebtn:hover{filter:brightness(1.12)}
.fc{border-radius:14px;padding:13px 16px;font-size:12.5px;font-weight:600;line-height:1.45}
.fc.ok{background:var(--ok-soft);color:var(--ok)}
.fc.no{background:var(--warn-soft);color:var(--warn)}
/* lead form */
.leadwrap{max-width:520px;margin:0 auto}
.leadwrap h2{font-family:'Unbounded';font-weight:600;font-size:22px;margin-bottom:6px}
.leadwrap p{color:var(--muted);font-size:14px;margin-bottom:22px;line-height:1.55}
.leadwrap .pnl{padding:0}
/* sheet */
.sheet{background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.cover{padding:40px 30px;border-bottom:2px solid var(--ink);text-align:center}
.cover .ceye{font-family:'IBM Plex Mono';font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);margin-bottom:12px}
.cover h1{font-family:'Unbounded';font-weight:800;font-size:clamp(20px,3.6vw,30px);letter-spacing:-.4px;margin-bottom:8px}
.cover .csub{color:var(--muted);font-size:14px}
.cover .cmeta{margin-top:16px;font-family:'IBM Plex Mono';font-size:11.5px;color:var(--muted)}
.snums{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid var(--ink)}
@media(max-width:640px){.snums{grid-template-columns:1fr}}
.sn2{padding:22px 28px;border-right:1px solid var(--line)}
.sn2:last-child{border-right:none}
.sn2 .k{font-size:11.5px;color:var(--muted);margin-bottom:5px}
.sn2 .v{font-family:'IBM Plex Mono';font-weight:600;font-size:clamp(17px,2.6vw,21px)}
.sn2 .v em{font-style:normal;color:var(--blue)}
/* breakdown chart */
.breakdown{padding:24px 28px;border-bottom:1px solid var(--line)}
.breakdown h3{font-size:14px;font-weight:700;margin-bottom:14px}
.bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.bar-label{font-size:11.5px;font-weight:600;min-width:140px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:560px){.bar-label{min-width:90px;max-width:110px;font-size:10.5px}}
.bar-track{flex:1;height:22px;background:#EFECE5;border-radius:6px;overflow:hidden;position:relative}
.bar-fill{height:100%;border-radius:6px;transition:width .4s}
.bar-val{font-family:'IBM Plex Mono';font-size:11px;font-weight:600;min-width:80px;text-align:right}
/* gantt */
.gantt{padding:24px 28px;border-bottom:1px solid var(--line);overflow-x:auto}
.gantt h3{font-size:14px;font-weight:700;margin-bottom:14px}
.gantt-grid{display:grid;gap:6px}
.g-row{display:flex;align-items:center;gap:10px}
.g-label{font-size:11px;font-weight:600;min-width:120px;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:560px){.g-label{min-width:80px;max-width:100px;font-size:10px}}
.g-track{flex:1;height:20px;position:relative;min-width:200px}
.g-bar{position:absolute;height:100%;border-radius:5px;top:0;display:flex;align-items:center;padding-left:6px;font-family:'IBM Plex Mono';font-size:9px;color:#fff;font-weight:600;overflow:hidden;white-space:nowrap}
.g-weeks{position:absolute;top:0;left:0;width:100%;height:100%;display:flex}
.g-weekline{border-right:1px solid var(--line);flex:1}
/* stages drill-down */
.stage{border-bottom:1px solid var(--line)}.stage:last-of-type{border-bottom:none}
.sth{display:flex;align-items:center;gap:10px;padding:14px 26px;cursor:pointer;user-select:none;transition:background .12s}
.sth:hover{background:#F5F3EE}
.st-icon{font-size:16px;width:24px;text-align:center}
.st-caret{width:18px;height:18px;border-radius:5px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;
font-size:10px;color:var(--muted);transition:transform .15s;flex-shrink:0;background:#fff}
.stage.open .st-caret{transform:rotate(90deg);border-color:var(--blue);color:var(--blue)}
.st-name{font-weight:700;font-size:13px;flex:1}
.st-badge{font-family:'IBM Plex Mono';font-size:9.5px;color:var(--blue);background:var(--blue-soft);border-radius:5px;padding:2px 7px}
.st-weeks{font-family:'IBM Plex Mono';font-size:11px;color:var(--muted);min-width:52px;text-align:right}
.st-total{font-family:'IBM Plex Mono';font-weight:600;font-size:13px;min-width:100px;text-align:right}
.stb{background:#F7F5F0;border-top:1px solid var(--line);padding:14px 26px 18px;display:grid;gap:16px}
.stb .scope{font-size:12px;color:var(--muted);line-height:1.5;padding-bottom:10px;border-bottom:1px dashed var(--line)}
.item .i-top{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;margin-bottom:8px;flex-wrap:wrap}
.item .i-label{font-weight:700}.item .i-qty{font-family:'IBM Plex Mono';color:var(--muted)}
.optlist{display:grid;gap:7px}
.oc{display:flex;align-items:center;gap:11px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 13px;cursor:pointer;transition:border-color .12s}
.oc.on{border-color:var(--blue);background:var(--blue-soft)}
.oc .orad{width:14px;height:14px;border-radius:50%;border:2px solid var(--muted);flex-shrink:0}
.oc.on .orad{border-color:var(--blue);background:var(--blue);box-shadow:inset 0 0 0 2.5px var(--blue-soft)}
.oc .oname{font-weight:700;font-size:12px;flex:1;min-width:100px}
.oc .osrc{font-size:10.5px;color:var(--muted)}.oc .osrc a{color:var(--blue);text-decoration:underline;font-weight:600}
.oc .oprice{font-family:'IBM Plex Mono';font-size:11px;text-align:right;white-space:nowrap}.oc .oprice b{font-size:12px}
@media(max-width:620px){.oc{flex-wrap:wrap}.oc .oprice{width:100%;text-align:left;padding-left:25px}}
/* payment */
.paysec{padding:24px 28px;border-bottom:1px solid var(--line)}
.paysec h3{font-size:14px;font-weight:700;margin-bottom:14px}
.pay-row{display:flex;gap:14px;margin-bottom:10px;align-items:flex-start}
.pay-pct{font-family:'IBM Plex Mono';font-weight:600;font-size:14px;min-width:48px;color:var(--blue)}
.pay-body .pay-label{font-weight:700;font-size:13px}.pay-body .pay-desc{font-size:12px;color:var(--muted);margin-top:2px}
.pay-body .pay-sum{font-family:'IBM Plex Mono';font-size:12px;font-weight:600;margin-top:3px}
/* includes */
.inex{padding:24px 28px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:560px){.inex{grid-template-columns:1fr}}
.inex h3{font-size:14px;font-weight:700;margin-bottom:10px;grid-column:1/-1}
.inex ul{list-style:none;font-size:12.5px;line-height:1.65}
.inex .inc li::before{content:'✓ ';color:var(--ok);font-weight:700}
.inex .exc li::before{content:'✕ ';color:var(--warn);font-weight:700}
/* renders */
.renders{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}
@media(max-width:640px){.renders{grid-template-columns:1fr}}
.rph{aspect-ratio:16/9;border-right:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--muted);
background:repeating-linear-gradient(-45deg,transparent,transparent 14px,rgba(43,75,215,.045) 14px,rgba(43,75,215,.045) 28px)}
.rph:last-child{border-right:none}
.rph .t{font-family:'IBM Plex Mono';font-size:11px;text-transform:uppercase;letter-spacing:.6px}
.rph .d{font-size:11.5px}
/* footer */
.sf{padding:20px 28px;display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--line)}
.sf .note{font-size:10.5px;color:var(--muted);max-width:500px;line-height:1.55}
.actions{display:flex;gap:10px}
.btn{font-family:'Manrope';font-weight:700;font-size:13px;padding:11px 18px;border-radius:9px;cursor:pointer;border:1px solid var(--ink);background:#fff;color:var(--ink)}
.btn.blue{background:var(--blue);border-color:var(--blue);color:#fff;font-family:'Unbounded';font-weight:600;font-size:12.5px}
.terms{padding:22px 28px;border-bottom:1px solid var(--line);font-size:12px;color:var(--muted);line-height:1.6}
.terms h3{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:10px}
@media print{.no-print{display:none!important}.app{background:#fff}.wrap{padding:0;max-width:100%}.sheet{border:none;border-radius:0}
.topbar,.laser{display:none}.cover{padding:30px 20px}.snums,.breakdown,.gantt,.stage,.paysec,.inex,.terms,.renders,.sf{break-inside:avoid}
.sth{pointer-events:none}.stb{display:block!important}}
`;

const initFlat = { region: "kyiv", area: 65, rooms: 2, bathrooms: 1, condition: "new", tier: "standart", style: "Сучасний", budget: "f3" };
const initHouse = { region: "kyiv", area: 150, floors: 2, rooms: 3, bathrooms: 2, condition: "new", tier: "standart", style: "Сучасний", budget: "h3" };

export default function App() {
  const [mode, setMode] = useState("flat");
  const [flat, setFlat] = useState(initFlat);
  const [house, setHouse] = useState(initHouse);
  const [view, setView] = useState("form"); // form | lead | sheet
  const [sel, setSel] = useState({});
  const [open, setOpen] = useState({});
  const [showT, setShowT] = useState(false);
  const [lead, setLead] = useState({ name: "", phone: "", msg: "" });

  const p = mode === "flat" ? flat : house;
  const setP = (k, v) => (mode === "flat" ? setFlat : setHouse)((s) => ({ ...s, [k]: v }));
  const r = useMemo(() => calc(mode, p, sel), [mode, p, sel]);
  const today = new Date().toLocaleDateString("uk-UA");
  const sw = (m) => { setMode(m); setView("form"); setSel({}); setOpen({}); };

  const maxTotal = Math.max(...r.rows.map((x) => x.total));
  const totalW = r.totalWeeks;

  return (
    <div className="app">
      <style>{css}</style>
      <div className="laser no-print" />
      <div className="topbar no-print">
        <div className="tb">
          <div className="logo">ПРОПОЗИЦІЯ<span>.БУД</span></div>
          <div className="mode">
            <button className={mode === "flat" ? "on" : ""} onClick={() => sw("flat")}>Ремонт квартири</button>
            <button className={mode === "house" ? "on" : ""} onClick={() => sw("house")}>Будинок з нуля</button>
          </div>
        </div>
      </div>

      <div className="wrap">
        {/* ====== FORM ====== */}
        {view === "form" && (<>
          <div className="hero">
            <h1>{mode === "flat" ? "Ремонт квартири під ключ — з ціною одразу" : "Ваш будинок — з ціною та строком одразу"}</h1>
            <p>Кожен фільтр змінює розрахунок у реальному часі. У готовій пропозиції — деталі, графік, оплата.</p>
            {DEMO && <div className="demob">Демо-дані · ціни орієнтовні</div>}
          </div>
          <div className="grid">
            <div style={{ display: "grid", gap: 18 }}>
              <div className="pnl"><div className="ph"><span className="pn">01</span><h2>{mode === "flat" ? "Квартира" : "Будинок"}</h2></div>
                <div className="pb">
                  <div className="g2">
                    <label className="f">Локація <span className="hint">Київ — база, область — нижчі</span>
                      <select value={p.region} onChange={(e) => setP("region", e.target.value)}>
                        {REGIONS.map((x) => <option key={x.id} value={x.id}>{x.name} {x.k !== 1 ? `(−${Math.round((1 - x.k) * 100)}%)` : ""}</option>)}
                      </select></label>
                    <label className="f">{mode === "flat" ? "Кімнат" : "Спалень"}
                      <div className="chips">{[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} className={"chip" + (p.rooms === n ? " on" : "")} onClick={() => setP("rooms", n)}>{n}</button>))}</div></label>
                  </div>
                  <label className="f">Площа
                    <div className="rr"><input type="range" min={mode === "flat" ? 30 : 80} max={mode === "flat" ? 180 : 300} step="5"
                      value={p.area} onChange={(e) => setP("area", +e.target.value)} /><span className="rv">{p.area} м²</span></div></label>
                  {mode === "house" && <label className="f">Поверхів
                    <div className="chips">{[1, 2, 3].map((n) => (
                      <button key={n} className={"chip" + (p.floors === n ? " on" : "")} onClick={() => setP("floors", n)}>{n}</button>))}</div></label>}
                  <label className="f">Санвузлів
                    <div className="chips">{[1, 2, 3].map((n) => (
                      <button key={n} className={"chip" + (p.bathrooms === n ? " on" : "")} onClick={() => setP("bathrooms", n)}>{n}</button>))}</div></label>
                </div></div>
              {mode === "flat" && <div className="pnl"><div className="ph"><span className="pn">02</span><h2>Стан квартири зараз</h2></div>
                <div className="pb"><div className="cond">
                  {[
                    { id: "new", t: "Новобудова, «сіра коробка»", d: "Голі стіни, стояки, щиток. Повний цикл з нуля." },
                    { id: "old", t: "Вторинка зі старим ремонтом", d: "Спершу демонтаж, потім повний цикл." },
                    { id: "partial", t: "Часткова готовність", d: "Штукатурка і стяжка є — ці етапи зникають." },
                  ].map((o) => (
                    <div key={o.id} className={"opt" + (p.condition === o.id ? " on" : "")} onClick={() => setP("condition", o.id)}>
                      <div className="rd" /><div><div className="ot">{o.t}</div><div className="od">{o.d}</div></div></div>))}
                </div></div></div>}
              <div className="pnl"><div className="ph"><span className="pn">{mode === "flat" ? "03" : "02"}</span><h2>Бюджет, рівень і стиль</h2></div>
                <div className="pb">
                  <label className="f">Бюджетна вилка
                    <select value={p.budget} onChange={(e) => setP("budget", e.target.value)}>
                      {BUDGETS[mode].map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
                  <label className="f">Рівень оздоблення
                    <div className="chips">{Object.entries(TIERS).map(([id, t]) => (
                      <button key={id} className={"chip acc" + (p.tier === id ? " on" : "")} onClick={() => setP("tier", id)}>{t.name}</button>))}</div>
                    <button className="tl" onClick={() => setShowT((s) => !s)}>{showT ? "Сховати ↑" : "Чим відрізняються рівні? ↓"}</button>
                    {showT && <div className="tt"><div className="ttr h"><div></div><div>Економ</div><div>Стандарт</div><div>Преміум</div></div>
                      {TIER_TABLE.map((t) => <div className="ttr" key={t.row}><div>{t.row}</div><div>{t.econom}</div><div>{t.standart}</div><div>{t.premium}</div></div>)}</div>}
                  </label>
                  <label className="f">Стиль <span className="hint">впливає на ціну конкретних етапів</span>
                    <div className="chips">{STYLES.map((s) => (
                      <button key={s} className={"chip" + (p.style === s ? " on" : "")} onClick={() => setP("style", s)}>{s}</button>))}</div>
                    <div className="sn"><b>{p.style}{r.styleDelta ? ` · ${r.styleDelta > 0 ? "+" : ""}${r.styleDelta}% до вартості` : " · базовий"}: </b>{STYLE_MODS[p.style].note}</div>
                  </label>
                </div></div>
            </div>
            <div className="rail no-print">
              <div className="live">
                <div className="lk"><span className="dot" />Жива оцінка · {r.region.name}</div>
                <div className="lv">{fmtM(r.low)} — <em>{fmtM(r.high)}</em> грн</div>
                <div className="ls">≈ {fmt(r.perM2)} грн/м² · ~{r.months} міс.</div>
                <div className="lr"><span>Роботи</span><span>{fmtM(r.rows.reduce((a, x) => a + x.work, 0))}</span></div>
                <div className="lr"><span>Матеріали</span><span>{fmtM(r.rows.reduce((a, x) => a + x.matSum, 0))}</span></div>
                <div className="lr"><span>Стиль ({p.style})</span><span>{r.styleDelta ? (r.styleDelta > 0 ? "+" : "") + r.styleDelta + "%" : "база"}</span></div>
                <div className="lr"><span>Етапів</span><span>{r.rows.length}</span></div>
                <button className="livebtn" onClick={() => { setView("lead"); window.scrollTo(0, 0); }}>Сформувати пропозицію →</button>
              </div>
              <div className={"fc " + (r.budgetFit ? "ok" : "no")}>
                {r.budgetFit ? <>✓ Вписується у «{r.budgetName}»</> : <>⚠ Вище «{r.budgetName}». Менша площа чи рівень.</>}
              </div>
            </div>
          </div>
        </>)}

        {/* ====== LEAD CAPTURE ====== */}
        {view === "lead" && (
          <div className="leadwrap">
            <h2>Ваша пропозиція майже готова</h2>
            <p>Залиште контакт — і отримаєте готовий PDF з розрахунком, графіком і деталями. Ваші дані бачить тільки наша команда.</p>
            <div className="pnl"><div className="pb">
              <label className="f">Ім'я<input type="text" value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} placeholder="Олександр" /></label>
              <label className="f">Телефон або Telegram<input type="tel" value={lead.phone} onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))} placeholder="+380..." /></label>
              <label className="f">Коментар (необов'язково)<input type="text" value={lead.msg} onChange={(e) => setLead((l) => ({ ...l, msg: e.target.value }))} placeholder="Що важливо для вас?" /></label>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" onClick={() => setView("form")}>← Назад</button>
                <button className="btn blue" style={{ flex: 1 }} onClick={() => { setView("sheet"); window.scrollTo(0, 0); }}
                  disabled={!lead.name.trim() || !lead.phone.trim()}>
                  Отримати пропозицію →
                </button>
              </div>
              <span className="hint">Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних.</span>
            </div></div>
          </div>
        )}

        {/* ====== PROPOSAL SHEET ====== */}
        {view === "sheet" && (
          <div className="sheet">
            {/* Cover */}
            <div className="cover">
              <div className="ceye">Комерційна пропозиція{DEMO ? " · демо" : ""}</div>
              <h1>{mode === "flat" ? `Ремонт квартири ${p.area} м² під ключ` : `Будівництво будинку ${p.area} м²`}</h1>
              <div className="csub">{p.rooms} {mode === "flat" ? "кімнат" : "спалень"} · {p.bathrooms} санвуз. · {r.tier.name} · {p.style}</div>
              <div className="cmeta">{r.region.name} · {today} · КП-{String(Math.floor(Math.random() * 9000 + 1000))}</div>
            </div>

            {/* Key numbers */}
            <div className="snums">
              <div className="sn2"><div className="k">Вартість, вилка ±{VILKA * 100}%</div><div className="v">{fmtM(r.low)} — <em>{fmtM(r.high)}</em> грн</div></div>
              <div className="sn2"><div className="k">За квадратний метр</div><div className="v">≈ {fmt(r.perM2)} грн/м²</div></div>
              <div className="sn2"><div className="k">Строк виконання</div><div className="v">≈ <em>{r.months}</em> міс. ({r.weeks} тиж.)</div></div>
            </div>

            {/* Cost breakdown chart */}
            <div className="breakdown">
              <h3>Розподіл вартості по етапах</h3>
              {r.rows.map((st, i) => {
                const pct = (st.total / r.total) * 100;
                return (
                  <div className="bar-row" key={st.id}>
                    <span className="bar-label">{st.icon} {st.name}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${(st.total / maxTotal) * 100}%`, background: COLORS[i % COLORS.length] }} /></div>
                    <span className="bar-val">{fmt(st.total)} ({pct.toFixed(0)}%)</span>
                  </div>
                );
              })}
            </div>

            {/* Timeline / Gantt */}
            <div className="gantt">
              <h3>Графік виконання робіт</h3>
              <div className="gantt-grid">
                {r.rows.map((st, i) => {
                  const left = (st.startWeek / totalW) * 100;
                  const width = Math.max((st.weeks / totalW) * 100, 3);
                  return (
                    <div className="g-row" key={st.id}>
                      <span className="g-label">{st.icon} {st.name}</span>
                      <div className="g-track">
                        <div className="g-bar" style={{ left: `${left}%`, width: `${width}%`, background: COLORS[i % COLORS.length] }}>
                          {st.weeks} тиж.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono'", fontSize: 10, color: "var(--muted)" }}>
                Загальний строк з урахуванням паралельності: ≈ {r.weeks} тижнів ({r.months} міс.)
              </div>
            </div>

            {/* Hint */}
            <div style={{ padding: "10px 26px", borderBottom: "1px solid var(--line)" }} className="no-print">
              <span className="hint">Відкрийте етап → перегляньте обсяг робіт і оберіть виконавця. Ціна перераховується одразу.</span>
            </div>

            {/* Stage drill-down */}
            {r.rows.map((st) => (
              <div key={st.id} className={"stage" + (open[st.id] ? " open" : "")}>
                <div className="sth" onClick={() => setOpen((o) => ({ ...o, [st.id]: !o[st.id] }))}>
                  <span className="st-icon">{st.icon}</span>
                  <span className="st-caret">▸</span>
                  <span className="st-name">{st.name}</span>
                  {st.styleK !== 1 && <span className="st-badge">стиль {st.styleK > 1 ? "+" : ""}{Math.round((st.styleK - 1) * 100)}%</span>}
                  <span className="st-weeks">{st.weeks} тиж.</span>
                  <span className="st-total">{fmt(st.total)} грн</span>
                </div>
                {open[st.id] && (
                  <div className="stb">
                    <div className="scope">{st.scope}</div>
                    {st.items.map((it) => (
                      <div className="item" key={it.key}>
                        <div className="i-top">
                          <span className="i-label">{it.label}</span>
                          <span className="i-qty">{fmt(it.qty)} {it.unit} · разом {fmt(it.total)} грн</span>
                        </div>
                        <div className="optlist">
                          {it.opts.map((o, oi) => {
                            const on = it.sel === oi;
                            const pw = Math.round(o.price * r.tier.kWork * r.region.k * (st.styleK || 1));
                            const pm = Math.round(o.mat * r.tier.kMat * r.region.k * (st.styleK || 1));
                            return (
                              <div key={oi} className={"oc" + (on ? " on" : "")} onClick={() => setSel((s) => ({ ...s, [it.key]: oi }))}>
                                <div className="orad" />
                                <div style={{ flex: 1 }}>
                                  <div className="oname">{o.name}</div>
                                  <div className="osrc">джерело: <a href={o.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{o.src}</a></div>
                                </div>
                                <div className="oprice">робота <b>{fmt(pw)}</b> + мат. <b>{fmt(pm)}</b> грн/{it.unit}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Budget fit */}
            <div className={"fc " + (r.budgetFit ? "ok" : "no")} style={{ borderRadius: 0, padding: "15px 26px", borderBottom: "1px solid var(--line)" }}>
              {r.budgetFit ? <>✓ Розрахунок вписується у бюджет «{r.budgetName}».</>
                : <>⚠ Нижня межа перевищує бюджет «{r.budgetName}». Розгляньте меншу площу, рівень або поетапність.</>}
            </div>

            {/* Payment schedule */}
            <div className="paysec">
              <h3>Орієнтовний графік оплат</h3>
              {PAYMENT_SCHEDULE.map((ps, i) => (
                <div className="pay-row" key={i}>
                  <span className="pay-pct">{ps.pct}%</span>
                  <div className="pay-body">
                    <div className="pay-label">{ps.label}</div>
                    <div className="pay-desc">{ps.desc}</div>
                    <div className="pay-sum">≈ {fmtM(Math.round(r.total * ps.pct / 100))} грн</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Includes / Excludes */}
            <div className="inex">
              <h3>Що входить / не входить</h3>
              <ul className="inc">{INCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul>
              <ul className="exc">{EXCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>

            {/* Visualizations */}
            <div className="renders">
              <div className="rph"><span className="t">Візуалізація · {mode === "flat" ? "Вітальня" : "Екстер'єр"}</span><span className="d">Стиль: {p.style}</span></div>
              <div className="rph"><span className="t">Візуалізація · {mode === "flat" ? "Санвузол" : "Інтер'єр"}</span><span className="d">Рівень: {r.tier.name}</span></div>
            </div>

            {/* Terms */}
            <div className="terms">
              <h3>Умови та застереження</h3>
              Дана комерційна пропозиція є попередньою оцінкою вартості та строків і не є публічною офертою. Точний кошторис складається після огляду об'єкта, обмірів та узгодження проєктних рішень. Вартість матеріалів базується на усереднених ринкових цінах Києва та області станом на {today} і може змінюватись залежно від курсу та наявності. Строк дії пропозиції — 14 календарних днів з дати формування. Гарантія на виконані роботи — 24 місяці з моменту підписання акту приймання.
              {DEMO && <><br /><br /><b style={{ color: "var(--warn)" }}>УВАГА: ДЕМО-ВЕРСІЯ. Ціни та виконавці наведені для ілюстрації і не є реальною комерційною пропозицією.</b></>}
            </div>

            {/* Footer */}
            <div className="sf">
              <p className="note">Документ сформовано автоматично системою ПРОПОЗИЦІЯ.БУД · {today}<br />Клієнт: {lead.name || "—"} · {lead.phone || "—"}</p>
              <div className="actions no-print">
                <button className="btn" onClick={() => { setView("form"); window.scrollTo(0, 0); }}>← Параметри</button>
                <button className="btn blue" onClick={() => window.print()}>Зберегти PDF ↓</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
