// data.js — УСІ дані застосунку. Логіка в App.jsx цей файл не дублює.
// Ціни: curated = кураторська оцінка (використовується, поки нема live-даних rabotniki).

export const REGIONS = [
  { id: "kyiv", name: "м. Київ", k: 1 },
  { id: "irpin", name: "Ірпінь / Буча", k: 0.97 },
  { id: "brovary", name: "Бровари", k: 0.96 },
  { id: "boryspil", name: "Бориспіль", k: 0.95 },
  { id: "vyshneve", name: "Вишневе / Крюківщина", k: 0.96 },
  { id: "obukhiv", name: "Обухів / Українка", k: 0.93 },
  { id: "oblast", name: "Інше, Київська обл.", k: 0.92 },
];

export const TIERS = {
  econom: { name: "Економ", kWork: 0.85, kMat: 0.8 },
  standart: { name: "Стандарт", kWork: 1, kMat: 1 },
  premium: { name: "Преміум", kWork: 1.25, kMat: 1.9 },
};

export const TIER_TABLE = [
  { row: "Стіни", econom: "Шпалери під фарбування", standart: "Шпаклівка + якісна фарба", premium: "Декоративні покриття" },
  { row: "Підлога", econom: "Ламінат 32 кл.", standart: "Ламінат 33 / вініл", premium: "Інженерна дошка" },
  { row: "Плитка", econom: "Україна · 400–600", standart: "Україна/Польща · 800–1200", premium: "Іспанія/Італія · 2000+" },
  { row: "Санвузол", econom: "Cersanit, Kolo", standart: "Grohe, Geberit", premium: "Duravit, Hansgrohe" },
  { row: "Двері", econom: "Ламіновані · 5–7т", standart: "Шпоновані · 10–15т", premium: "Масив/приховані · 25+" },
  { row: "Електрика", econom: "Мінімум точок", standart: "Schneider/Legrand", premium: "Розумний дім" },
];

export const STYLE_MODS = {
  "Сучасний": { mods: {}, note: "Базовий орієнтир." },
  "Мінімалізм": { mods: { paint: 1.15, doors: 1.2, ceil: 1.1 }, note: "Ідеальні площини, приховані двері." },
  "Класика": { mods: { paint: 1.2, ceil: 1.15, doors: 1.1 }, note: "Молдинги, карнизи, фільонки." },
  "Лофт": { mods: { walls: 0.85, paint: 0.9, ceil: 0.9 }, note: "Відкриті поверхні — економія." },
  "Скандинавський": { mods: { paint: 1.05 }, note: "Світле оздоблення." },
  "Джапанді": { mods: { paint: 1.1, flooring: 1.15, doors: 1.15 }, note: "Натуральні матеріали." },
};

export const SRC = {
  price: "https://www.rabotniki.ua/uk/price/kiev",
  otd: "https://www.rabotniki.ua/uk/otdelochnye-raboty",
  common: "https://www.rabotniki.ua/uk/obschestroitelnye-montazhnye-raboty",
  beton: "https://www.rabotniki.ua/uk/betonnye-raboty",
  fund: "https://www.rabotniki.ua/uk/fundament",
};

// Групи етапів (для фільтрів у пропозиції)
export const GROUPS = {
  logistics: "Логістика",
  demolition: "Демонтаж",
  rough: "Чорнові",
  engineering: "Інженерія",
  finish: "Чистові",
  extra: "Опції",
};

// Хелпери обсягів. ceilH — висота стелі, м.
export const wallArea = (p) => Math.round(p.area * 2.6 * ((p.ceilH || 2.7) / 2.7));
export const floorsUp = (p) => Math.max((p.floor || 1) - 1, 0);

/* ================= КВАРТИРА ================= */
export const FLAT_STAGES = [
  {
    id: "logistics", group: "logistics", name: "Логістика та підйом", weeks: () => 0.5,
    onlyIf: (p) => p.lift !== "cargo" && (p.floor || 1) > 1,
    scope: "Підйом матеріалів і винос сміття без вантажного ліфта. Розраховано від поверху, площі та типу ліфта.",
    items: [
      { key: "lift_up", label: "Підйом матеріалів", unit: "м²·пов", qty: (p) => p.area * floorsUp(p),
        curated: { price: p => (p.lift === "pass" ? 8 : 22), mat: () => 0 } },
      { key: "trash_down", label: "Спуск і винос сміття", unit: "м²·пов", qty: (p) => (p.condition === "old" ? p.area * floorsUp(p) : Math.round(p.area * floorsUp(p) * 0.4)),
        curated: { price: p => (p.lift === "pass" ? 5 : 14), mat: () => 0 } },
    ],
  },
  {
    id: "demo", group: "demolition", name: "Демонтаж", weeks: () => 1.5, onlyIf: (p) => p.condition === "old",
    scope: "Зняття старих покриттів (шпалери, плитка, підлога), демонтаж старої сантехніки й електрофурнітури, збір сміття в мішки.",
    items: [
      { key: "demo_full", label: "Демонтаж старого оздоблення", unit: "м²", qty: (p) => p.area, curated: { price: () => 480, mat: () => 60 } },
      { key: "demo_trash", label: "Вивіз сміття (контейнер)", unit: "конт.", qty: (p) => Math.max(1, Math.round(p.area / 45)), curated: { price: () => 3500, mat: () => 0 } },
    ],
  },
  {
    id: "partitions", group: "rough", name: "Перегородки (гіпсокартон)", weeks: () => 1.5, onlyIf: (p) => p.opts?.partitions,
    scope: "Каркасні перегородки з ГКЛ з шумоізоляцією мінватою, у два шари з кожного боку.",
    items: [
      { key: "gk_wall", label: "Перегородка ГКЛ з шумоізоляцією", unit: "м²", qty: (p) => Math.round(p.area * 0.25), live: "gk_partition", curated: { price: () => 650, mat: () => 550 } },
    ],
  },
  {
    id: "walls", group: "rough", name: "Штукатурка стін", weeks: () => 3, skipIf: (p) => p.condition === "partial",
    scope: "Штукатурка по маяках (ручна або машинна), ґрунтування у 2 шари.",
    items: [
      { key: "plaster", label: "Штукатурка по маяках", unit: "м²", qty: wallArea, live: "walls_plaster", curated: { price: () => 330, mat: () => 175 } },
      { key: "primer", label: "Ґрунтування", unit: "м²", qty: wallArea, live: "walls_primer", curated: { price: () => 38, mat: () => 26 } },
    ],
  },
  {
    id: "floor", group: "rough", name: "Стяжка підлоги", weeks: () => 1.5, skipIf: (p) => p.condition === "partial",
    scope: "Напівсуха стяжка з армуванням, гідроізоляція мокрих зон, маяки.",
    items: [
      { key: "screed", label: "Стяжка напівсуха", unit: "м²", qty: (p) => p.area, live: "screed", curated: { price: () => 270, mat: () => 215 } },
      { key: "hydro", label: "Гідроізоляція мокрих зон", unit: "м²", qty: (p) => p.bathrooms * 6 + 4, live: "hydroizol", curated: { price: () => 180, mat: () => 160 } },
    ],
  },
  {
    id: "windows", group: "rough", name: "Вікна та підвіконня", weeks: () => 1, onlyIf: (p) => p.opts?.windows,
    scope: "Заміна металопластикових вікон з демонтажем старих, підвіконня, зовнішні відливи, оздоблення відкосів.",
    items: [
      { key: "win_block", label: "Вікно МП з монтажем", unit: "шт", qty: (p) => p.windowsCount || p.rooms + 1, curated: { price: () => 3500, mat: () => 9500 } },
      { key: "win_slope", label: "Відкоси та підвіконня", unit: "вікно", qty: (p) => p.windowsCount || p.rooms + 1, live: "slopes", curated: { price: () => 1800, mat: () => 1200 } },
    ],
  },
  {
    id: "entry_door", group: "rough", name: "Вхідні двері", weeks: () => 0.5, onlyIf: (p) => p.opts?.entryDoor,
    scope: "Заміна вхідних дверей: демонтаж, монтаж, піна, оздоблення прорізу.",
    items: [
      { key: "entry", label: "Вхідні двері з монтажем", unit: "шт", qty: () => 1, curated: { price: () => 3000, mat: () => 14000 } },
    ],
  },
  {
    id: "electro", group: "engineering", name: "Електромонтаж", weeks: () => 2.5,
    scope: "Штробування, кабель ВВГнг, підрозетники, розводка на точки, збірка щитка, заземлення. Точка = розетка/вимикач/вивід світла.",
    items: [
      { key: "el_point", label: "Електроточка (повний цикл)", unit: "шт", qty: (p) => 8 + p.rooms * 7 + p.bathrooms * 3, curated: { price: () => 680, mat: () => 460 } },
      { key: "el_panel", label: "Збірка та підключення щитка", unit: "шт", qty: () => 1, curated: { price: () => 6800, mat: () => 5800 } },
      { key: "el_ac", label: "Траса кондиціонера", unit: "шт", qty: (p) => p.opts?.ac ? (p.acCount || 1) : 0, onlyOpt: "ac", curated: { price: () => 3200, mat: () => 2600 } },
    ],
  },
  {
    id: "plumb", group: "engineering", name: "Сантехнічна розводка", weeks: () => 1.5,
    scope: "Розводка води PPR/PEX і каналізації ПВХ по точках, колектор, гідроіспитання.",
    items: [
      { key: "pl_bath", label: "Розводка: санвузол (комплект точок)", unit: "сануз.", qty: (p) => p.bathrooms, curated: { price: () => 14500, mat: () => 11500 } },
      { key: "pl_kitchen", label: "Точки кухні (мийка/ПММ)", unit: "компл.", qty: () => 1, curated: { price: () => 5200, mat: () => 3700 } },
      { key: "pl_rad", label: "Заміна радіаторів", unit: "шт", qty: (p) => p.opts?.radiators ? p.rooms + 1 : 0, onlyOpt: "radiators", live: "radiators", curated: { price: () => 2200, mat: () => 5500 } },
    ],
  },
  {
    id: "heatfloor", group: "engineering", name: "Тепла підлога", weeks: () => 1, onlyIf: (p) => p.opts?.heatFloor,
    scope: "Електрична тепла підлога у санвузлах, кухні та коридорі (~25% площі), терморегулятори.",
    items: [
      { key: "hf", label: "Тепла підлога електрична", unit: "м²", qty: (p) => Math.round(p.area * 0.25), live: "heat_floor", curated: { price: () => 550, mat: () => 900 } },
    ],
  },
  {
    id: "soundproof", group: "rough", name: "Шумоізоляція", weeks: () => 1.5, onlyIf: (p) => p.opts?.sound,
    scope: "Шумоізоляція стін до сусідів: каркас, мінвата, мембрана, ГКЛ.",
    items: [
      { key: "sp", label: "Шумоізоляція стін", unit: "м²", qty: (p) => Math.round(wallArea(p) * 0.3), curated: { price: () => 750, mat: () => 850 } },
    ],
  },
  {
    id: "ceil", group: "finish", name: "Стелі", weeks: () => 1.5,
    scope: "Натяжна стеля або ГК конструкція за рівнем, вирізи під освітлення.",
    items: [
      { key: "ceiling", label: "Стеля (натяжна / ГК)", unit: "м²", qty: (p) => Math.round(p.area * 0.92), live: "ceiling", curated: { price: () => 350, mat: () => 430 } },
    ],
  },
  {
    id: "tile", group: "finish", name: "Плиткові роботи", weeks: () => 2.5,
    scope: "Укладання плитки: санвузли (стіни+підлога), фартух кухні, затирка.",
    items: [
      { key: "tile_bath", label: "Плитка: санвузли", unit: "м²", qty: (p) => p.bathrooms * 24, live: "tile", curated: { price: () => 880, mat: () => 920 } },
      { key: "tile_apron", label: "Фартух кухні", unit: "м²", qty: () => 5, live: "tile", curated: { price: () => 960, mat: () => 1000 } },
    ],
  },
  {
    id: "paint", group: "finish", name: "Шпаклівка та фарбування", weeks: () => 3,
    scope: "Фінішна шпаклівка 2–3 шари, шліфування, ґрунт, фарбування у 2 шари АБО поклейка шпалер.",
    items: [
      { key: "putty", label: "Шпаклівка під фарбування", unit: "м²", qty: (p) => Math.round(wallArea(p) * 0.88), live: "putty", curated: { price: () => 270, mat: () => 95 } },
      { key: "paintwork", label: "Фарбування у 2 шари", unit: "м²", qty: (p) => p.wallFinish === "wallpaper" ? 0 : Math.round(wallArea(p) * 0.88), live: "painting", curated: { price: () => 170, mat: () => 115 } },
      { key: "wallpaper", label: "Поклейка шпалер", unit: "м²", qty: (p) => p.wallFinish === "wallpaper" ? Math.round(wallArea(p) * 0.88) : 0, live: "wallpaper", curated: { price: () => 190, mat: () => 210 } },
      { key: "decor_plaster", label: "Декоративна штукатурка (акцентні стіни)", unit: "м²", qty: (p) => p.opts?.decorPlaster ? Math.round(wallArea(p) * 0.12) : 0, onlyOpt: "decorPlaster", live: "decor_plaster", curated: { price: () => 750, mat: () => 600 } },
    ],
  },
  {
    id: "flooring", group: "finish", name: "Підлогове покриття", weeks: () => 1.5,
    scope: "Укладання покриття з підкладкою, плінтус, пороги.",
    items: [
      { key: "floorcover", label: "Укладання покриття", unit: "м²", qty: (p) => Math.round(p.area * 0.88), live: "laminate", curated: { price: () => 260, mat: () => 760 } },
      { key: "plinth", label: "Плінтус", unit: "м.п.", qty: (p) => Math.round(p.area * 0.9), live: "plinth", curated: { price: () => 120, mat: () => 140 } },
    ],
  },
  {
    id: "doors", group: "finish", name: "Двері міжкімнатні", weeks: () => 1,
    scope: "Дверні блоки з коробкою, наличниками, доборами, фурнітурою.",
    items: [
      { key: "door_block", label: "Дверний блок зі встановленням", unit: "шт", qty: (p) => p.rooms + p.bathrooms, live: "doors_install", curated: { price: () => 3100, mat: () => 8800 } },
    ],
  },
  {
    id: "bath", group: "finish", name: "Комплектація санвузлів", weeks: (p) => p.bathrooms,
    scope: "Ванна/душова, унітаз (інсталяція), раковина, змішувачі, дзеркало, аксесуари, підключення.",
    items: [
      { key: "bath_set", label: "Сантехніка та монтаж (комплект)", unit: "сануз.", qty: (p) => p.bathrooms, curated: { price: () => 16500, mat: () => 53000 } },
    ],
  },
  {
    id: "final", group: "finish", name: "Фінішні роботи", weeks: () => 1,
    scope: "Розетки, вимикачі, світильники, карнизи, дрібний монтаж, клінінг після ремонту.",
    items: [
      { key: "final_fit", label: "Фурнітура, світло, клінінг", unit: "м²", qty: (p) => p.area, curated: { price: () => 195, mat: () => 58 } },
    ],
  },
];

/* ================= БУДИНОК ================= */
const fpn = (p) => Math.round((p.area / p.floors) * 1.1);
export const HOUSE_STAGES = [
  { id: "prep", group: "rough", name: "Проєкт і підготовка", weeks: () => 4, scope: "Архітектурний проєкт, конструктив, геодезія, дозвільні документи.",
    items: [{ key: "design", label: "Проєктування", unit: "м²", qty: (p) => p.area, curated: { price: () => 660, mat: () => 150 } }] },
  { id: "well", group: "engineering", name: "Свердловина та вода", weeks: () => 1.5, onlyIf: (p) => p.opts?.well,
    scope: "Буріння свердловини 30–60 м, насосне обладнання, кесон, завод у будинок.",
    items: [{ key: "well_drill", label: "Свердловина під ключ", unit: "об'єкт", qty: () => 1, curated: { price: () => 45000, mat: () => 50000 } }] },
  { id: "septic", group: "engineering", name: "Септик / каналізація", weeks: () => 1, onlyIf: (p) => p.opts?.septic,
    scope: "Септик з монтажем, земляні роботи, підвід до будинку.",
    items: [{ key: "septic_set", label: "Септик під ключ", unit: "об'єкт", qty: () => 1, curated: { price: () => 35000, mat: () => 55000 } }] },
  { id: "gas", group: "engineering", name: "Підключення газу", weeks: () => 2, onlyIf: (p) => p.opts?.gas,
    scope: "Проєкт газифікації, врізка, труба до будинку, лічильник (без вартості ТУ).",
    items: [{ key: "gas_conn", label: "Газифікація під ключ", unit: "об'єкт", qty: () => 1, curated: { price: () => 30000, mat: () => 45000 } }] },
  { id: "found", group: "rough", name: "Фундамент", weeks: (p) => 4 + p.area / 120, scope: "Земляні роботи, опалубка, армування, бетонування, гідроізоляція.",
    items: [
      { key: "earth", label: "Земляні роботи", unit: "м²", qty: fpn, curated: { price: () => 460, mat: () => 255 } },
      { key: "monolith", label: "Монолітні роботи", unit: "м²", qty: fpn, live: "monolith", curated: { price: () => 1520, mat: () => 2420 } },
    ] },
  { id: "box", group: "rough", name: "Коробка", weeks: (p) => 8 + p.area / 80, scope: "Кладка стін (газоблок), армопояси, перекриття.",
    items: [
      { key: "masonry", label: "Кладка стін", unit: "м²", qty: (p) => p.area, live: "masonry", curated: { price: () => 1920, mat: () => 2620 } },
      { key: "slabs", label: "Перекриття", unit: "м²", qty: (p) => Math.round(p.area * 0.55), curated: { price: () => 1420, mat: () => 2320 } },
    ] },
  { id: "roof", group: "rough", name: "Покрівля", weeks: () => 4, scope: "Кроквяна система, гідро/пароізоляція, покриття, водостоки.",
    items: [{ key: "roof_full", label: "Покрівля повний цикл", unit: "м²", qty: (p) => Math.round(fpn(p) * 1.25), live: "roofing", curated: { price: () => 1320, mat: () => 1920 } }] },
  { id: "windows", group: "rough", name: "Вікна та вхідні двері", weeks: () => 2, scope: "Металопластикові вікна, вхідні двері, відкоси.",
    items: [{ key: "win_house", label: "Вікна + двері", unit: "м²", qty: (p) => p.area, curated: { price: () => 410, mat: () => 1420 } }] },
  { id: "facade", group: "finish", name: "Фасад", weeks: () => 5, scope: "Утеплення 150–200мм, армування, декоративна штукатурка.",
    items: [{ key: "facade_ins", label: "Утеплення + штукатурка", unit: "м²", qty: (p) => Math.round(p.area * 1.15), live: "facade_insul", curated: { price: () => 870, mat: () => 1120 } }] },
  { id: "mep", group: "engineering", name: "Інженерні мережі", weeks: () => 6, scope: "Електрика, опалення (котел/ТН), водопровід, каналізація по будинку.",
    items: [
      { key: "el_house", label: "Електрика по будинку", unit: "м²", qty: (p) => p.area, curated: { price: () => 720, mat: () => 620 } },
      { key: "heat_house", label: "Опалення, вода, каналізація", unit: "м²", qty: (p) => p.area, curated: { price: () => 1120, mat: () => 1320 } },
    ] },
  { id: "finish", group: "finish", name: "Внутрішнє оздоблення", weeks: (p) => ({ econom: 8, standart: 12, premium: 20 })[p.tier], scope: "Повний цикл: штукатурка, стяжка, шпаклівка, фарбування, плитка, підлога, двері.",
    items: [{ key: "int_finish", label: "Оздоблення під ключ", unit: "м²", qty: (p) => p.area, curated: { price: () => 3250, mat: () => 4350 } }] },
  { id: "bath", group: "finish", name: "Санвузли", weeks: (p) => p.bathrooms, scope: "Повна комплектація та встановлення сантехніки.",
    items: [{ key: "bath_house", label: "Сантехніка + монтаж", unit: "сануз.", qty: (p) => p.bathrooms, curated: { price: () => 18500, mat: () => 61000 } }] },
  { id: "yard", group: "extra", name: "Благоустрій", weeks: () => 3, onlyIf: (p) => p.opts?.yard,
    scope: "Вимощення навколо будинку, доріжки, базова огорожа по периметру ділянки.",
    items: [
      { key: "blind_area", label: "Вимощення", unit: "м.п.", qty: (p) => Math.round(4 * Math.sqrt(fpn(p)) * 1.1), curated: { price: () => 650, mat: () => 750 } },
      { key: "fence", label: "Огорожа (профліст)", unit: "м.п.", qty: (p) => Math.round(4 * Math.sqrt((p.plot || 8) * 100)), curated: { price: () => 550, mat: () => 950 } },
    ] },
];

/* ---- Опції (чекбокси у детальному режимі) ---- */
export const FLAT_OPTS = [
  { id: "windows", name: "Заміна вікон", hint: "з відкосами й підвіконнями" },
  { id: "entryDoor", name: "Вхідні двері", hint: "заміна" },
  { id: "heatFloor", name: "Тепла підлога", hint: "санвузли, кухня, коридор" },
  { id: "ac", name: "Кондиціонер", hint: "траса під монтаж" },
  { id: "radiators", name: "Заміна радіаторів", hint: "" },
  { id: "sound", name: "Шумоізоляція", hint: "стіни до сусідів" },
  { id: "partitions", name: "Нові перегородки", hint: "гіпсокартон" },
  { id: "decorPlaster", name: "Декоративна штукатурка", hint: "акцентні стіни" },
];
export const HOUSE_OPTS = [
  { id: "well", name: "Свердловина", hint: "якщо нема центральної води" },
  { id: "septic", name: "Септик", hint: "якщо нема каналізації" },
  { id: "gas", name: "Підключення газу", hint: "" },
  { id: "yard", name: "Благоустрій", hint: "вимощення + огорожа" },
];

export const BUDGETS = {
  flat: [
    { id: "f1", name: "до 700 тис.", max: 7e5 }, { id: "f2", name: "0,7–1,2 млн", max: 12e5 },
    { id: "f3", name: "1,2–2 млн", max: 2e6 }, { id: "f4", name: "2–3,5 млн", max: 35e5 },
    { id: "f5", name: "3,5+ млн", max: Infinity },
  ],
  house: [
    { id: "h1", name: "до 3 млн", max: 3e6 }, { id: "h2", name: "3–5 млн", max: 5e6 },
    { id: "h3", name: "5–8 млн", max: 8e6 }, { id: "h4", name: "8–12 млн", max: 12e6 },
    { id: "h5", name: "12+ млн", max: Infinity },
  ],
};

export const PAYMENT = [
  { pct: 30, label: "Аванс", desc: "Закупівля матеріалів" },
  { pct: 25, label: "Чорнові", desc: "Електрика, сантехніка, стяжка, штукатурка" },
  { pct: 25, label: "Чистові", desc: "Плитка, фарбування, підлога" },
  { pct: 15, label: "Фініш", desc: "Двері, сантехніка, світло" },
  { pct: 5, label: "Здача", desc: "Прийомка" },
];

export const INCLUDES = ["Усі роботи та матеріали за кошторисом", "Доставка матеріалів", "Вивіз сміття", "Контроль якості", "Фотофіксація", "Прибирання"];
export const EXCLUDES = ["Меблі та техніка", "Кухонний гарнітур", "Перепланування з БТІ", "Дизайн-проєкт", "Балкон / лоджія (окремо)"];
