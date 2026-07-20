// data.js — v3.0 БЕТА. Модель "квартира = список кімнат" + повний WBS.
// ver:false = позиція очікує перевірки експерта (показуємо бейдж β).
// w = робота грн/од (кураторська), m = матеріал грн/од. live = ключ живих цін rabotniki.

export const BETA = true;

/* Пресети-сценарії: один тап — готова конфігурація */
export const PRESETS = [
  { id: "rent", name: "Під оренду", hint: "економно й практично", apply: { tier: "econom", style: "Сучасний", opts: { slopes: true } } },
  { id: "self", name: "Для себе", hint: "збалансований стандарт", apply: { tier: "standart", style: "Сучасний", opts: { slopes: true, ac: true, hiddenCurtain: true } } },
  { id: "sale", name: "Під продаж", hint: "виглядає дорого, коштує розумно", apply: { tier: "standart", style: "Мінімалізм", opts: { slopes: true, led: true } } },
];

/* Обсяг ремонту: які групи етапів включати */
export const SCOPES = [
  { id: "full", name: "Під ключ", grps: null },
  { id: "rough", name: "Тільки чорнові", grps: ["prep", "demolition", "walls", "rough", "engineering", "logistics"] },
  { id: "finish", name: "Тільки чистові", grps: ["prep", "finish", "complete", "logistics"] },
  { id: "bathroom", name: "Тільки санвузол", grps: null, wetOnly: true, exclude: ["windows", "entry"] },
];

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

/* ---------- КІМНАТИ ---------- */
// pts = типова к-сть електроточок (β — перевірити в експерта)
export const ROOM_TYPES = {
  kitchen:  { name: "Кухня",          defA: 12, pts: 13, wet: false, tileFloor: true,  emoji: "🍳" },
  living:   { name: "Вітальня",       defA: 18, pts: 10, wet: false, tileFloor: false, emoji: "🛋️" },
  bedroom:  { name: "Спальня",        defA: 14, pts: 8,  wet: false, tileFloor: false, emoji: "🛏️" },
  kids:     { name: "Дитяча",         defA: 12, pts: 8,  wet: false, tileFloor: false, emoji: "🧸" },
  office:   { name: "Кабінет",        defA: 9,  pts: 7,  wet: false, tileFloor: false, emoji: "💻" },
  bath:     { name: "Санвузол",       defA: 4,  pts: 4,  wet: true,  tileFloor: true,  emoji: "🛁" },
  wc:       { name: "Гостьовий WC",   defA: 2,  pts: 2,  wet: true,  tileFloor: true,  emoji: "🚽" },
  hall:     { name: "Коридор",        defA: 8,  pts: 5,  wet: false, tileFloor: true,  emoji: "🚪" },
  wardrobe: { name: "Гардеробна",     defA: 3,  pts: 2,  wet: false, tileFloor: false, emoji: "👔" },
  balcony:  { name: "Балкон/лоджія",  defA: 4,  pts: 2,  wet: false, tileFloor: false, emoji: "🌤️" },
};
export const WALL_FIN = { paint: "Фарбування", wallpaper: "Шпалери", decor: "Декоративна штукатурка" };
export const FLOOR_FIN = { lam: "Ламінат/вініл", parquet: "Інженерна дошка", tile: "Плитка" };
export const CEIL_FIN = { stretch: "Натяжна", gk: "ГКЛ", paint: "Шпаклівка по плиті" };

export const newRoom = (type, over = {}) => ({
  id: Math.random().toString(36).slice(2, 8),
  type,
  area: ROOM_TYPES[type].defA,
  h: 2.7,
  win: type === "bath" || type === "wc" || type === "wardrobe" || type === "hall" ? 0 : 1,
  doors: type === "hall" ? 0 : 1,
  walls: "paint",
  floor: ROOM_TYPES[type].tileFloor && (type === "bath" || type === "wc") ? "tile" : "lam",
  ceil: "stretch",
  heatFloor: type === "bath",
  ...over,
});

// Типовий набір кімнат від параметрів (для швидкого режиму)
export function defaultRooms(nRooms, nBaths, targetArea) {
  const rooms = [newRoom("kitchen"), newRoom("hall")];
  if (nRooms >= 2) rooms.push(newRoom("living"));
  for (let i = 0; i < Math.max(nRooms - (nRooms >= 2 ? 1 : 0), 1); i++) rooms.push(newRoom("bedroom"));
  for (let i = 0; i < nBaths; i++) rooms.push(newRoom(i === 0 ? "bath" : "wc"));
  const sum = rooms.reduce((a, r) => a + r.area, 0);
  const k = targetArea / sum;
  rooms.forEach(r => { r.area = Math.max(Math.round(r.area * k), 2); });
  return rooms;
}

/* ---------- АГРЕГАТИ З КІМНАТ ---------- */
const per = (r) => 4 * Math.sqrt(r.area * 1.05); // периметр ≈, м
const wallsGross = (r) => per(r) * r.h;
const wallsNet = (r) => Math.max(wallsGross(r) - r.win * 1.8 - r.doors * 1.9, 0);

export function buildAgg(rooms, p) {
  const A = {
    total: 0, wallsPlaster: 0, wallsPaint: 0, wallsWallpaper: 0, wallsDecor: 0,
    tileWalls: 0, floorLam: 0, floorParquet: 0, floorTile: 0, wetFloor: 0,
    ceilStretch: 0, ceilGk: 0, ceilPaint: 0, pts: 0, wins: 0, doors: 0,
    plinth: 0, heatFloor: 0, baths: 0, kitchens: 0, balconies: 0, balconyArea: 0, perim: 0,
  };
  for (const r of rooms) {
    if (r.type === "balcony") { A.balconies++; A.balconyArea += r.area; continue; } // балкон — окремий блок
    const t = ROOM_TYPES[r.type];
    A.total += r.area;
    A.perim += per(r);
    A.pts += t.pts;
    A.wins += r.win;
    A.doors += r.doors;
    if (t.wet) { A.baths++; A.tileWalls += wallsNet(r); A.wetFloor += r.area; A.floorTile += r.area; }
    else {
      A.wallsPlaster += wallsNet(r);
      if (r.walls === "paint") A.wallsPaint += wallsNet(r);
      if (r.walls === "wallpaper") A.wallsWallpaper += wallsNet(r);
      if (r.walls === "decor") A.wallsDecor += wallsNet(r) * 0.35 + 0.65 * wallsNet(r) * 0; // декор = акцентні ~35%, решта фарба
      if (r.walls === "decor") A.wallsPaint += wallsNet(r) * 0.65;
      if (r.floor === "lam") { A.floorLam += r.area; A.plinth += per(r); }
      if (r.floor === "parquet") { A.floorParquet += r.area; A.plinth += per(r); }
      if (r.floor === "tile") { A.floorTile += r.area; A.plinth += per(r); }
    }
    A.wallsPlaster += t.wet ? 0 : 0; // санвузли штукатуряться цементною — окремо нижче
    if (r.ceil === "stretch") A.ceilStretch += r.area;
    if (r.ceil === "gk") A.ceilGk += r.area;
    if (r.ceil === "paint") A.ceilPaint += r.area;
    if (r.heatFloor) A.heatFloor += r.area * 0.8;
    if (r.type === "kitchen") A.kitchens++;
  }
  A.wetWallsPlaster = A.tileWalls; // цементна штукатурка під плитку
  Object.keys(A).forEach(k => A[k] = Math.round(A[k] * 10) / 10);
  return A;
}

/* ---------- ПОВНИЙ WBS ---------- */
// q(A,p) → кількість; 0 = позиція не показується.
// cond: 'old'|'new'|'partial' обмеження; opt: ключ глобальної опції.
const isOld = p => p.condition === "old";
const notPartial = p => p.condition !== "partial";

export const GROUPS = {
  prep: "Підготовка", demolition: "Демонтаж", walls: "Стіни", rough: "Чорнові",
  engineering: "Інженерія", finish: "Чистові", complete: "Комплектація", extra: "Опції", logistics: "Логістика",
};

export const FLAT_STAGES = [
  { id: "prep", grp: "prep", name: "Етап 0 · Підготовка та організація", weeks: () => 1,
    scope: "Обмір, обстеження, проєкт, захист місць загального користування.",
    items: [
      { k: "measure", n: "Обмір квартири з планом", u: "об'єкт", q: () => 1, w: 2500, m: 0, ver: false },
      { k: "survey", n: "Технічне обстеження (стяжка/штукатурка/електрика)", u: "об'єкт", q: (A, p) => isOld(p) ? 1 : 0, w: 3500, m: 0, ver: false },
      { k: "design", n: "Дизайн-проєкт", u: "м²", q: (A, p) => p.opts?.design ? A.total : 0, w: 900, m: 0, ver: false, opt: "design" },
      { k: "protect", n: "Захист МЗК: плівка ліфт/коридор", u: "компл", q: () => 1, w: 1500, m: 1200, ver: false },
      { k: "temp_el", n: "Тимчасове освітлення й щиток на час робіт", u: "компл", q: () => 1, w: 2000, m: 1800, ver: false },
    ] },
  { id: "demo", grp: "demolition", name: "Етап 1 · Демонтаж", weeks: (A) => 1 + A.total / 80, cond: isOld,
    scope: "Пошарове зняття старого оздоблення, демонтаж обладнання, вивіз.",
    items: [
      { k: "d_wallp", n: "Зняття шпалер/фарби зі стін", u: "м²", q: A => A.wallsPlaster, w: 60, m: 5, ver: false },
      { k: "d_tile_w", n: "Демонтаж плитки зі стін", u: "м²", q: A => A.tileWalls, w: 120, m: 0, ver: false },
      { k: "d_tile_f", n: "Демонтаж плитки з підлоги", u: "м²", q: A => A.floorTile, w: 110, m: 0, ver: false },
      { k: "d_screed", n: "Демонтаж стяжки (до 5 см)", u: "м²", q: (A, p) => p.opts?.dScreed ? A.total : 0, w: 180, m: 0, ver: false, opt: "dScreed" },
      { k: "d_floor", n: "Демонтаж підлогового покриття", u: "м²", q: A => A.floorLam + A.floorParquet, w: 55, m: 0, ver: false },
      { k: "d_plinth", n: "Демонтаж плінтусів", u: "м.п.", q: A => A.plinth, w: 20, m: 0, ver: false },
      { k: "d_doors", n: "Демонтаж дверних блоків", u: "шт", q: A => A.doors, w: 350, m: 0, ver: false },
      { k: "d_part_gk", n: "Знесення перегородок ГК/цегла", u: "м²", q: (A, p) => p.opts?.dPartitions ? Math.round(A.total * 0.15) : 0, w: 260, m: 0, ver: false, opt: "dPartitions" },
      { k: "d_san", n: "Демонтаж сантехніки (ванна/унітаз/умивальник)", u: "компл", q: A => A.baths, w: 1800, m: 0, ver: false },
      { k: "d_rad", n: "Демонтаж радіаторів із заглушками", u: "шт", q: (A, p) => (p.roomsCount || 2) + 1, w: 550, m: 100, ver: false },
      { k: "d_el", n: "Демонтаж старої електрофурнітури/проводки", u: "об'єкт", q: () => 1, w: 3500, m: 0, ver: false },
      { k: "d_bags", n: "Збір сміття в мішки + спуск", u: "мішок", q: A => Math.round(A.total * 1.6), w: 45, m: 12, ver: false },
      { k: "d_cont", n: "Контейнер вивозу будсміття 8м³", u: "шт", q: A => Math.max(1, Math.round(A.total / 40)), w: 3800, m: 0, ver: false },
    ] },
  { id: "partitions", grp: "walls", name: "Етап 2 · Стіни та перегородки", weeks: () => 1.5,
    scope: "Нові перегородки, прорізи, штроби, закладні.",
    items: [
      { k: "gk_part", n: "Перегородка ГКЛ 2 шари + мінвата", u: "м²", q: (A, p) => p.opts?.partitions ? (p.partArea || 12) : 0, w: 650, m: 560, ver: true, live: "gk_partition", opt: "partitions" },
      { k: "block_part", n: "Кладка перегородок газоблок 100мм", u: "м²", q: (A, p) => p.opts?.blockPart ? Math.round(A.total * 0.15) : 0, w: 520, m: 480, ver: false, opt: "blockPart" },
      { k: "opening", n: "Проріз у ненесучій стіні + перемичка", u: "шт", q: (A, p) => p.opts?.opening ? (p.openingCount || 1) : 0, w: 6500, m: 2800, ver: false, opt: "opening" },
      { k: "chase_conc", n: "Штробіння: бетон", u: "м.п.", q: A => Math.round(A.pts * 2.2), w: 160, m: 0, ver: false },
      { k: "chase_soft", n: "Штробіння: цегла/газоблок", u: "м.п.", q: A => Math.round(A.pts * 1.3), w: 90, m: 0, ver: false },
      { k: "mount_pts", n: "Закладні під важке у ГК (ТВ/бойлер)", u: "шт", q: (A, p) => p.opts?.partitions ? 2 : 0, w: 350, m: 180, ver: false },
    ] },
  { id: "windows", grp: "rough", name: "Етап 3 · Вікна, підвіконня, відкоси", weeks: () => 1,
    scope: "У новобудові вікна вже встановлені забудовником — доробляються відкоси й підвіконня.",
    items: [
      { k: "win_new", n: "Вікно МП з демонтажем і монтажем", u: "шт", q: (A, p) => isOld(p) && p.opts?.windows ? A.wins : 0, w: 3600, m: 9800, ver: true, mats: "windows", opt: "windows" },
      { k: "sill", n: "Підвіконня", u: "шт", q: (A, p) => (isOld(p) && p.opts?.windows) || (!isOld(p) && p.opts?.slopes) ? A.wins : 0, w: 650, m: 1100, ver: false },
      { k: "slopes", n: "Відкоси (штукатурні/сендвіч)", u: "вікно", q: (A, p) => p.condition === "new" ? (p.opts?.slopes !== false ? A.wins : 0) : (p.opts?.windows ? A.wins : 0), w: 1900, m: 1250, ver: false, live: "slopes" },
      { k: "win_adjust", n: "Регулювання фурнітури вікон забудовника", u: "шт", q: (A, p) => p.condition === "new" ? A.wins : 0, w: 350, m: 0, ver: false },
      { k: "balc_block", n: "Балконний блок (двері+вікно)", u: "шт", q: (A, p) => isOld(p) && p.opts?.windows ? A.balconies : 0, w: 4800, m: 14500, ver: false },
    ] },
  { id: "entry", grp: "rough", name: "Етап 3б · Вхідні двері", weeks: () => 0.3,
    scope: "У новобудові двері забудовника часто міняють на посилені.",
    items: [
      { k: "entry_door", n: "Вхідні двері з монтажем", u: "шт", q: (A, p) => p.opts?.entryDoor ? 1 : 0, w: 3200, m: 14500, ver: true, mats: "entry", opt: "entryDoor" },
    ] },
  { id: "electro", grp: "engineering", name: "Етап 4 · Електромонтаж", weeks: (A) => 1.5 + A.pts / 40,
    scope: "Кабель по групах, підрозетники, щиток, слабострум, заземлення.",
    items: [
      { k: "cable15", n: "Кабель 3×1.5 (освітлення)", u: "м.п.", q: A => Math.round(A.pts * 3.2), w: 45, m: 32, ver: false },
      { k: "cable25", n: "Кабель 3×2.5 (розетки)", u: "м.п.", q: A => Math.round(A.pts * 4.1), w: 48, m: 45, ver: false },
      { k: "cable46", n: "Кабель 3×4/6 (плита, духовка)", u: "м.п.", q: A => A.kitchens * 18, w: 60, m: 78, ver: false },
      { k: "socket_box", n: "Підрозетник: бетон", u: "шт", q: A => Math.round(A.pts * 0.8), w: 120, m: 15, ver: false },
      { k: "socket_box_gk", n: "Підрозетник: гіпсокартон", u: "шт", q: A => Math.round(A.pts * 0.2), w: 70, m: 18, ver: false },
      { k: "junction", n: "Розподільча коробка з розключенням", u: "шт", q: A => Math.round(A.pts / 6), w: 380, m: 90, ver: false },
      { k: "panel", n: "Щиток: корпус + автомати + УЗО (по групах)", u: "група", q: A => Math.max(6, Math.round(A.pts / 5)), w: 650, m: 850, ver: false },
      { k: "ground", n: "Перевірка/організація заземлення", u: "об'єкт", q: () => 1, w: 2800, m: 900, ver: false },
      { k: "lan", n: "Слабострум: інтернет/ТБ точка", u: "шт", q: A => Math.round(A.pts * 0.12) + 2, w: 380, m: 260, ver: false },
      { k: "fan_out", n: "Вивід під витяжний вентилятор санвузла", u: "шт", q: A => A.baths, w: 550, m: 380, ver: false },
      { k: "ac_route", n: "Траса кондиціонера (штроба+фреон+дренаж)", u: "компл", q: (A, p) => p.opts?.ac ? (p.acCount || 1) : 0, w: 3400, m: 2700, ver: true, opt: "ac" },
      { k: "led_niche", n: "LED-підсвітка ніш/кухні (профіль+стрічка+БЖ)", u: "м.п.", q: (A, p) => p.opts?.led ? (p.ledLen || 6) : 0, w: 450, m: 520, ver: false, opt: "led" },
    ] },
  { id: "plumb", grp: "engineering", name: "Етап 5 · Сантехнічна розводка", weeks: (A) => 1 + A.baths * 0.7,
    scope: "Стояки (за станом), колекторна розводка, каналізація, інсталяції, гідроізоляція випробуванням.",
    items: [
      { k: "risers", n: "Заміна стояків води (погодження з ЖЕК)", u: "стояк", q: (A, p) => isOld(p) && p.opts?.risers ? 2 : 0, w: 4500, m: 3200, ver: false, opt: "risers" },
      { k: "water_pts", n: "Розводка води колекторна", u: "точка", q: A => A.baths * 6 + A.kitchens * 3, w: 950, m: 720, ver: false },
      { k: "filters", n: "Фільтри грубого очищення + редуктори", u: "компл", q: () => 1, w: 1400, m: 2200, ver: false },
      { k: "meters", n: "Перенос лічильників з опломбуванням", u: "шт", q: (A, p) => isOld(p) ? 2 : 0, w: 1200, m: 800, ver: false },
      { k: "sewer_pts", n: "Каналізація ПВХ 50/110", u: "точка", q: A => A.baths * 4 + A.kitchens * 2, w: 650, m: 420, ver: false },
      { k: "install_wc", n: "Інсталяція під підвісний унітаз", u: "шт", q: A => A.baths, w: 2800, m: 0, ver: false },
      { k: "shower_trap", n: "Трап для душу в підлозі", u: "шт", q: (A, p) => p.opts?.showerTrap ? 1 : 0, w: 3200, m: 2400, ver: false, opt: "showerTrap" },
      { k: "towel", n: "Полотенцесушитель (перенос/новий)", u: "шт", q: A => A.baths, w: 2200, m: 4500, ver: false },
      { k: "wash_pts", n: "Підводки: пральна/ПММ/фільтр питної", u: "точка", q: A => 2 + A.kitchens, w: 850, m: 480, ver: false },
      { k: "rad_move", n: "Радіатори: заміна (вторинка) / перенос (новобуд)", u: "шт", q: (A, p) => (isOld(p) && p.opts?.radiators) || (p.condition === "new" && p.opts?.radMove) ? (p.roomsCount || 2) + 1 : 0, w: 2300, m: 5600, ver: true, mats: "radiators", live: "radiators" },
      { k: "pressure", n: "Гідровипробування системи", u: "об'єкт", q: () => 1, w: 1500, m: 0, ver: false },
    ] },
  { id: "vent", grp: "engineering", name: "Етап 6 · Вентиляція та клімат", weeks: () => 0.5,
    scope: "Вентканали, клапани, повітропровід витяжки.",
    items: [
      { k: "vent_check", n: "Ревізія/чистка вентканалів", u: "канал", q: A => A.baths + A.kitchens, w: 650, m: 0, ver: false },
      { k: "back_valve", n: "Зворотний клапан на витяжку", u: "шт", q: A => A.baths + A.kitchens, w: 350, m: 420, ver: false },
      { k: "duct", n: "Повітропровід кухонної витяжки", u: "м.п.", q: A => A.kitchens * 3, w: 380, m: 320, ver: false },
    ] },
  { id: "screed", grp: "rough", name: "Етап 7 · Підлога чорнова", weeks: (A) => 0.8 + A.total / 120, cond: notPartial,
    scope: "Гідроізоляція мокрих зон, демпфер, стяжка, тепла підлога, наливна.",
    items: [
      { k: "hydro", n: "Гідроізоляція обмазувальна (мокрі зони + 20см стіни)", u: "м²", q: A => Math.round(A.wetFloor * 1.5), w: 190, m: 165, ver: true, live: "hydroizol" },
      { k: "damper", n: "Демпферна стрічка по периметру", u: "м.п.", q: A => Math.round(A.perim), w: 15, m: 12, ver: false },
      { k: "screed_semi", n: "Стяжка напівсуха з маяками", u: "м²", q: A => A.total, w: 280, m: 220, ver: true, live: "screed" },
      { k: "self_level", n: "Наливна самовирівнювальна (фініш)", u: "м²", q: A => A.floorLam + A.floorParquet, w: 120, m: 140, ver: false },
      { k: "heat_cable", n: "Тепла підлога: мат/кабель + терморегулятор", u: "м²", q: A => A.heatFloor, w: 580, m: 920, ver: true, mats: "heatfloor", live: "heat_floor" },
      { k: "floor_sound", n: "Шумоізоляція підлоги", u: "м²", q: (A, p) => p.opts?.sound ? A.total : 0, w: 320, m: 380, ver: false, opt: "sound" },
    ] },
  { id: "plaster", grp: "rough", name: "Етап 8 · Штукатурка", weeks: (A) => 1 + A.wallsPlaster / 120, cond: notPartial,
    scope: "Гіпсова по маяках у житлових, цементна у мокрих зонах.",
    items: [
      { k: "plaster_g", n: "Штукатурка гіпсова по маяках", u: "м²", q: A => Math.round(A.wallsPlaster), w: 340, m: 180, ver: true, live: "walls_plaster" },
      { k: "plaster_c", n: "Штукатурка цементна (мокрі зони)", u: "м²", q: A => Math.round(A.wetWallsPlaster), w: 380, m: 210, ver: false },
      { k: "mesh", n: "Армувальна сітка при шарі >3см", u: "м²", q: A => Math.round(A.wallsPlaster * 0.15), w: 60, m: 45, ver: false },
      { k: "primer", n: "Ґрунтування (2 проходи)", u: "м²", q: A => Math.round((A.wallsPlaster + A.wetWallsPlaster) * 2), w: 22, m: 14, ver: true, live: "walls_primer" },
    ] },
  { id: "ceil", grp: "finish", name: "Етап 9 · Стелі (по кімнатах)", weeks: () => 1.2,
    scope: "Тип стелі обирається для кожної кімнати. Доплати за складність — окремими рядками.",
    items: [
      { k: "ceil_stretch", n: "Натяжна стеля (мат/сатин)", u: "м²", q: A => A.ceilStretch, w: 240, m: 220, ver: true, mats: "ceiling", live: "ceiling" },
      { k: "ceil_corners", n: "Натяжна: кути/обводи/вирізи", u: "шт", q: A => Math.round(A.ceilStretch / 4), w: 90, m: 20, ver: false },
      { k: "ceil_curt", n: "Прихований карниз у натяжній", u: "м.п.", q: (A, p) => p.opts?.hiddenCurtain ? A.wins * 2 : 0, w: 650, m: 480, ver: false, opt: "hiddenCurtain" },
      { k: "ceil_gk1", n: "Стеля ГКЛ один рівень", u: "м²", q: A => A.ceilGk, w: 480, m: 320, ver: false },
      { k: "ceil_slab", n: "Шпаклівка стелі по плиті під фарбування", u: "м²", q: A => A.ceilPaint, w: 380, m: 110, ver: false },
    ] },
  { id: "paint", grp: "finish", name: "Етап 10 · Малярні роботи (по кімнатах)", weeks: (A) => 1.5 + A.wallsPaint / 150,
    scope: "Шпаклівка старт+фініш, шліфування, фарбування/шпалери/декоративка за вибором кімнати.",
    items: [
      { k: "putty", n: "Шпаклівка старт+фініш+шліфування", u: "м²", q: A => Math.round(A.wallsPlaster * 0.95), w: 300, m: 100, ver: true, live: "putty" },
      { k: "paint2", n: "Фарбування у 2 шари", u: "м²", q: A => Math.round(A.wallsPaint), w: 175, m: 120, ver: true, mats: "paint", live: "painting" },
      { k: "wallpaper", n: "Поклейка шпалер", u: "м²", q: A => Math.round(A.wallsWallpaper), w: 200, m: 220, ver: true, mats: "wallpaper", live: "wallpaper" },
      { k: "decor_pl", n: "Декоративна штукатурка (акцент ~35% стін кімнати)", u: "м²", q: A => Math.round(A.wallsDecor), w: 780, m: 620, ver: false, mats: "decor", live: "decor_plaster" },
      { k: "moldings", n: "Молдинги/карнизи полімерні", u: "м.п.", q: (A, p) => p.style === "Класика" ? Math.round(A.perim * 0.8) : 0, w: 220, m: 180, ver: false },
    ] },
  { id: "tile", grp: "finish", name: "Етап 11 · Плиткові роботи", weeks: (A) => 0.8 + A.tileWalls / 40,
    scope: "Стіни/підлога мокрих зон, фартух, запили 45°, лючки, затирка.",
    items: [
      { k: "tile_w", n: "Плитка: стіни санвузлів", u: "м²", q: A => Math.round(A.tileWalls), w: 920, m: 950, ver: true, mats: "tile", live: "tile" },
      { k: "tile_f", n: "Плитка: підлога (санвузли/кухня/коридор)", u: "м²", q: A => Math.round(A.floorTile), w: 880, m: 920, ver: true, mats: "tile", live: "tile" },
      { k: "apron", n: "Фартух кухні", u: "м²", q: A => A.kitchens * 5, w: 980, m: 1000, ver: true, mats: "tile", live: "tile" },
      { k: "miter45", n: "Запил країв під 45°", u: "м.п.", q: A => Math.round(A.tileWalls * 0.25), w: 260, m: 0, ver: false },
      { k: "epoxy", n: "Затирка епоксидна (доплата)", u: "м²", q: (A, p) => p.tier === "premium" ? Math.round(A.tileWalls + A.floorTile) : 0, w: 140, m: 160, ver: false },
      { k: "hatch", n: "Ревізійний лючок прихований", u: "шт", q: A => A.baths, w: 850, m: 1200, ver: false },
    ] },
  { id: "floorfin", grp: "finish", name: "Етап 12 · Підлога чистова (по кімнатах)", weeks: () => 1,
    scope: "Покриття за вибором кімнати, поріжки, плінтус.",
    items: [
      { k: "lam", n: "Ламінат/вініл з підкладкою", u: "м²", q: A => Math.round(A.floorLam), w: 270, m: 780, ver: true, mats: "floorcover", live: "laminate" },
      { k: "parquet", n: "Інженерна дошка на клей", u: "м²", q: A => Math.round(A.floorParquet), w: 550, m: 2850, ver: false },
      { k: "thresholds", n: "Поріжки/стики", u: "шт", q: A => A.doors, w: 250, m: 220, ver: false },
      { k: "plinth", n: "Плінтус з установкою", u: "м.п.", q: A => Math.round(A.plinth), w: 130, m: 145, ver: true, mats: "plinth", live: "plinth" },
    ] },
  { id: "doors", grp: "finish", name: "Етап 13 · Двері міжкімнатні", weeks: () => 0.8,
    scope: "Блоки з коробкою, добори, фурнітура.",
    items: [
      { k: "door_std", n: "Дверний блок зі встановленням", u: "шт", q: A => A.doors, w: 3200, m: 9000, ver: true, mats: "doors", live: "doors_install" },
      { k: "door_hw", n: "Врізка фурнітури/замків", u: "шт", q: A => A.doors, w: 450, m: 650, ver: false },
    ] },
  { id: "bath_fit", grp: "complete", name: "Етап 14 · Санвузли комплектація", weeks: (A) => A.baths * 0.8,
    scope: "Ванна/душова, унітаз, умивальник, змішувачі, дзеркало, аксесуари.",
    items: [
      { k: "bath_set", n: "Комплект сантехніки з монтажем", u: "сануз.", q: A => A.baths, w: 17000, m: 55000, ver: true, mats: "bath" },
    ] },
  { id: "kitchen_fit", grp: "complete", name: "Етап 15 · Кухонна зона (будівельна частина)", weeks: () => 0.4,
    scope: "Виводи по проєкту кухні, підключення техніки, врізка мийки.",
    items: [
      { k: "kitchen_pts", n: "Виводи під техніку за проєктом кухні", u: "компл", q: A => A.kitchens, w: 3800, m: 1200, ver: false },
      { k: "kitchen_conn", n: "Підключення: варильна/духовка/ПММ/мийка/витяжка", u: "компл", q: A => A.kitchens, w: 4200, m: 800, ver: false },
    ] },
  { id: "el_fin", grp: "finish", name: "Етап 16 · Фінішна електрика та світло", weeks: () => 0.8,
    scope: "Фурнітура, світильники, карнизи.",
    items: [
      { k: "sockets_fin", n: "Установка розеток/вимикачів", u: "шт", q: A => A.pts, w: 90, m: 180, ver: false },
      { k: "spots", n: "Точкові світильники", u: "шт", q: A => Math.round(A.total / 3), w: 180, m: 350, ver: false },
      { k: "chand", n: "Люстри/підвіси", u: "шт", q: (A, p) => (p.roomsCount || 2) + 1, w: 450, m: 0, ver: false },
      { k: "curtain_rail", n: "Карнизи для штор", u: "шт", q: A => A.wins, w: 380, m: 650, ver: false },
    ] },
  { id: "balcony", grp: "extra", name: "Етап 17 · Балкон/лоджія", weeks: () => 1,
    scope: "Окремий міні-кошторис: засклення, утеплення, обшивка.",
    items: [
      { k: "b_glaze", n: "Засклення металопластик", u: "м²", q: A => A.balconies ? Math.round(A.balconyArea * 1.3) : 0, w: 850, m: 2400, ver: false },
      { k: "b_insul", n: "Утеплення ППС + фольга (підлога/стіни/стеля)", u: "м²", q: A => A.balconies ? Math.round(A.balconyArea * 3.2) : 0, w: 380, m: 320, ver: false },
      { k: "b_clad", n: "Обшивка (панелі/вагонка)", u: "м²", q: A => A.balconies ? Math.round(A.balconyArea * 2.6) : 0, w: 420, m: 380, ver: false },
      { k: "b_heat", n: "Тепла підлога електро", u: "м²", q: A => A.balconies ? Math.round(A.balconyArea * 0.8) : 0, w: 580, m: 920, ver: false },
      { k: "b_el", n: "Електроточки балкона", u: "шт", q: A => A.balconies * 3, w: 680, m: 460, ver: false },
    ] },
  { id: "final", grp: "complete", name: "Етап 18 · Здача об'єкта", weeks: () => 0.5,
    scope: "Клінінг, доробки, акт і гарантія.",
    items: [
      { k: "cleaning", n: "Будівельний клінінг", u: "м²", q: A => A.total, w: 85, m: 15, ver: false },
      { k: "punch", n: "Дрібні доробки за списком", u: "об'єкт", q: () => 1, w: 3000, m: 500, ver: false },
    ] },
  { id: "logistics", grp: "logistics", name: "Наскрізне · Логістика", weeks: () => 0,
    scope: "Доставка, підйом, захист виконаних робіт. Залежить від поверху й ліфта.",
    items: [
      { k: "delivery", n: "Доставка матеріалів", u: "рейс", q: A => Math.max(3, Math.round(A.total / 18)), w: 1200, m: 0, ver: false },
      { k: "lift_up", n: "Підйом матеріалів", u: "м²·пов", q: (A, p) => p.lift !== "cargo" && (p.floor || 1) > 1 ? Math.round(A.total * ((p.floor || 1) - 1) * 0.6) : 0, w: 0, m: 0, ver: false, dynW: p => p.lift === "pass" ? 9 : 24 },
      { k: "protect_done", n: "Захист виконаних робіт плівкою", u: "м²", q: A => Math.round(A.total * 0.6), w: 25, m: 18, ver: false },
    ] },
];

/* Глобальні опції (не прив'язані до кімнат) */
export const OPT_GROUPS = { eng: "Інженерія", constr: "Конструктив", decor: "Оздоблення і сервіс" };
export const FLAT_OPTS = [
  { id: "ac", grp: "eng", name: "Кондиціонер", hint: "траса під монтаж", qty: { key: "acCount", unit: "шт", min: 1, max: 6, def: 1 } },
  { id: "radiators", grp: "eng", name: "Заміна радіаторів", hint: "", onlyCond: "old", rec: "old" },
  { id: "radMove", grp: "eng", name: "Перенос радіаторів", hint: "стоять від забудовника", onlyCond: "new" },
  { id: "risers", grp: "eng", name: "Заміна стояків", hint: "будинки до ~1990 р.", onlyCond: "old", rec: "old" },
  { id: "showerTrap", grp: "eng", name: "Душ із трапом у підлозі", hint: "замість піддона" },
  { id: "sound", grp: "eng", name: "Шумоізоляція підлоги", hint: "" },
  { id: "windows", grp: "constr", name: "Заміна вікон", hint: "з відкосами й підвіконнями", onlyCond: "old" },
  { id: "slopes", grp: "constr", name: "Відкоси та підвіконня", hint: "вікна вже стоять від забудовника", onlyCond: "new", def: true, rec: "new" },
  { id: "entryDoor", grp: "constr", name: "Вхідні двері", hint: "заміна" },
  { id: "partitions", grp: "constr", name: "Нові перегородки ГКЛ", hint: "", qty: { key: "partArea", unit: "м²", min: 2, max: 60, def: 12 } },
  { id: "opening", grp: "constr", name: "Новий проріз у стіні", hint: "ненесуча", qty: { key: "openingCount", unit: "шт", min: 1, max: 5, def: 1 } },
  { id: "dScreed", grp: "constr", name: "Демонтаж стяжки", hint: "якщо стара зруйнована", onlyCond: "old" },
  { id: "dPartitions", grp: "constr", name: "Знесення перегородок", hint: "", onlyCond: "old" },
  { id: "design", grp: "decor", name: "Дизайн-проєкт", hint: "плани + візуалізації" },
  { id: "hiddenCurtain", grp: "decor", name: "Приховані карнизи", hint: "у натяжній стелі · авто: по вікнах" },
  { id: "led", grp: "decor", name: "LED-підсвітка", hint: "ніші, кухня", qty: { key: "ledLen", unit: "м.п.", min: 2, max: 30, def: 6 } },
];

export const BUDGETS = {
  flat: [
    { id: "f1", name: "до 700 тис.", max: 7e5 }, { id: "f2", name: "0,7–1,2 млн", max: 12e5 },
    { id: "f3", name: "1,2–2 млн", max: 2e6 }, { id: "f4", name: "2–3,5 млн", max: 35e5 },
    { id: "f5", name: "3,5+ млн", max: Infinity },
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
export const EXCLUDES = ["Меблі та техніка (окремо у Комплектації)", "Кухонний гарнітур", "Погодження перепланування з БТІ", "Авторський нагляд (окремо)"];


/* ---------- перенесено з v2 без змін ---------- */
export const SRC = {
  price: "https://www.rabotniki.ua/uk/price/kiev",
  otd: "https://www.rabotniki.ua/uk/otdelochnye-raboty",
  common: "https://www.rabotniki.ua/uk/obschestroitelnye-montazhnye-raboty",
  beton: "https://www.rabotniki.ua/uk/betonnye-raboty",
  fund: "https://www.rabotniki.ua/uk/fundament",
};

const EP = (q) => "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent(q);
export const MATS_CHECKED = "07.2026";
export const MATS = {
  floorcover: [
    { name: "Ламінат 32 клас", note: "спальні, низька прохідність", price: 420, url: "https://epicentrk.ua/ua/shop/laminat/" },
    { name: "Ламінат 33 клас", note: "кухня, коридор", price: 780, url: "https://epicentrk.ua/ua/shop/laminat/" },
    { name: "Вініл SPC (вологостійкий)", note: "вся квартира, тепла підлога", price: 1150, url: EP("вініловий ламінат SPC") },
    { name: "Інженерна дошка", note: "преміум, натуральне дерево", price: 2800, url: EP("інженерна дошка дуб") },
  ],
  tile: [
    { name: "Плитка Україна", note: "Атем, Golden Tile", price: 550, url: EP("керамічна плитка") },
    { name: "Польща / Іспанія", note: "Cersanit, Opoczno", price: 1050, url: EP("плитка Cersanit") },
    { name: "Керамограніт преміум", note: "великий формат", price: 2100, url: EP("керамограніт 600х1200") },
  ],
  paint: [
    { name: "Фарба економ", note: "укр. виробники", price: 90, url: EP("фарба інтерєрна") },
    { name: "Sniezka / Eskaro", note: "оптимум", price: 130, url: EP("фарба Sniezka") },
    { name: "Tikkurila / Caparol", note: "преміум, мийна", price: 220, url: EP("фарба Tikkurila") },
  ],
  wallpaper: [
    { name: "Паперові шпалери", note: "", price: 120, url: EP("шпалери паперові") },
    { name: "Флізелінові", note: "стандарт", price: 260, url: EP("шпалери флізелінові") },
    { name: "Під фарбування + фарба", note: "", price: 310, url: EP("шпалери під фарбування") },
  ],
  ceiling: [
    { name: "Натяжна матова", note: "", price: 380, url: EP("натяжна стеля") },
    { name: "Натяжна сатин / контури", note: "", price: 520, url: EP("натяжна стеля сатин") },
    { name: "ГК під фарбування", note: "з малярною підготовкою", price: 610, url: EP("гіпсокартон стельовий") },
  ],
  doors: [
    { name: "Ламіновані", note: "", price: 6500, url: EP("двері міжкімнатні ламіновані") },
    { name: "Шпоновані / фарбовані", note: "стандарт", price: 12500, url: EP("двері міжкімнатні шпон") },
    { name: "Приховані / масив", note: "преміум", price: 28000, url: EP("приховані двері") },
  ],
  bath: [
    { name: "Комплект економ", note: "Cersanit, Kolo, Lidz", price: 38000, url: EP("унітаз підвісний Cersanit") },
    { name: "Комплект стандарт", note: "Grohe, Geberit, Ravak", price: 62000, url: EP("інсталяція Geberit") },
    { name: "Комплект преміум", note: "Duravit, Hansgrohe", price: 145000, url: EP("змішувач Hansgrohe") },
  ],
  plinth: [
    { name: "МДФ плінтус", note: "", price: 110, url: EP("плінтус МДФ") },
    { name: "Дюрополімер", note: "вологостійкий, під фарбування", price: 210, url: EP("плінтус дюрополімер") },
  ],
  windows: [
    { name: "Стандарт 5-камерний", note: "", price: 8500, url: EP("металопластикові вікна") },
    { name: "Енергоефективне (i-скло)", note: "", price: 12500, url: EP("енергозберігаючі вікна") },
  ],
  entry: [
    { name: "Стандарт (метал/МДФ)", note: "", price: 12000, url: EP("вхідні двері квартира") },
    { name: "Посилені з терморозривом", note: "", price: 22000, url: EP("вхідні двері терморозрив") },
  ],
  heatfloor: [
    { name: "Нагрівальний мат", note: "під плитку", price: 850, url: EP("нагрівальний мат тепла підлога") },
    { name: "Інфрачервона плівка", note: "під ламінат", price: 700, url: EP("інфрачервона тепла підлога") },
  ],
  radiators: [
    { name: "Сталеві панельні", note: "", price: 4800, url: EP("радіатор сталевий панельний") },
    { name: "Біметалеві", note: "", price: 6500, url: EP("радіатор біметалевий") },
  ],
  decor: [
    { name: "Короїд / камінцева", note: "", price: 450, url: EP("декоративна штукатурка короїд") },
    { name: "Венеціанська / мікроцемент", note: "преміум", price: 1100, url: EP("венеціанська штукатурка") },
  ],
};

export const FURN_GROUPS = ["Кухня", "Спальня", "Вітальня", "Санвузол", "Передпокій", "Кабінет", "Освітлення", "Текстиль і декор"];
const spalen = (p) => Math.max((p.rooms || 2) - 1, 1);
export const FURNITURE = [
  // Кухня
  { id: "kitchen_set", group: "Кухня", name: "Кухонний гарнітур зі стільницею", unit: "пог.м", qty: () => 3, t: [8000, 15000, 32000], ph: "🍳", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("кухонний гарнітур") },
  { id: "sink_mixer", group: "Кухня", name: "Мийка + змішувач", unit: "компл.", qty: () => 1, t: [3500, 7500, 18000], ph: "🚰", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("кухонна мийка") },
  { id: "hood", group: "Кухня", name: "Витяжка", unit: "шт", qty: () => 1, t: [3000, 7000, 16000], ph: "🌀", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("витяжка кухонна") },
  { id: "hob_oven", group: "Кухня", name: "Варильна поверхня + духовка", unit: "компл.", qty: () => 1, t: [10000, 20000, 45000], ph: "🔥", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("варильна поверхня духова шафа") },
  { id: "fridge", group: "Кухня", name: "Холодильник", unit: "шт", qty: () => 1, t: [14000, 28000, 65000], ph: "🧊", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("холодильник") },
  { id: "dishwasher", group: "Кухня", name: "Посудомийна машина", unit: "шт", qty: () => 1, t: [11000, 18000, 35000], ph: "🍽️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("посудомийна машина 45") },
  { id: "microwave", group: "Кухня", name: "Мікрохвильовка + чайник + дрібна техніка", unit: "компл.", qty: () => 1, t: [3500, 7000, 15000], ph: "☕", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("мікрохвильова піч") },
  { id: "dining", group: "Кухня", name: "Стіл + стільці", unit: "компл.", qty: () => 1, t: [6000, 14000, 38000], ph: "🪑", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("обідній стіл стільці") },
  // Спальня
  { id: "bed", group: "Спальня", name: "Ліжко", unit: "шт", qty: spalen, t: [7000, 16000, 40000], ph: "🛏️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("ліжко двоспальне") },
  { id: "mattress", group: "Спальня", name: "Матрац", unit: "шт", qty: spalen, t: [5000, 12000, 30000], ph: "💤", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("матрац ортопедичний") },
  { id: "wardrobe", group: "Спальня", name: "Шафа / гардероб", unit: "шт", qty: spalen, t: [8000, 18000, 45000], ph: "🚪", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("шафа купе") },
  { id: "nightstands", group: "Спальня", name: "Тумби приліжкові (пара)", unit: "компл.", qty: spalen, t: [2500, 5500, 14000], ph: "🕯️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("тумба приліжкова") },
  { id: "dresser", group: "Спальня", name: "Комод + дзеркало", unit: "компл.", qty: () => 1, t: [4500, 9500, 24000], ph: "🪞", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("комод спальня") },
  // Вітальня
  { id: "sofa", group: "Вітальня", name: "Диван", unit: "шт", qty: () => 1, t: [12000, 26000, 70000], ph: "🛋️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("диван кутовий") },
  { id: "armchair", group: "Вітальня", name: "Крісло", unit: "шт", qty: () => 1, t: [4000, 9000, 25000], ph: "💺", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("крісло мʼяке") },
  { id: "coffee_table", group: "Вітальня", name: "Журнальний стіл", unit: "шт", qty: () => 1, t: [2000, 5000, 14000], ph: "🫖", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("журнальний столик") },
  { id: "tv_unit", group: "Вітальня", name: "TV-тумба / стінка", unit: "шт", qty: () => 1, t: [4000, 9500, 26000], ph: "📺", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("тумба під телевізор") },
  { id: "tv", group: "Вітальня", name: "Телевізор", unit: "шт", qty: () => 1, t: [12000, 25000, 60000], ph: "🖥️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("телевізор 55") },
  { id: "shelving", group: "Вітальня", name: "Стелаж / полиці", unit: "шт", qty: () => 1, t: [2500, 6000, 16000], ph: "📚", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("стелаж") },
  { id: "rug", group: "Вітальня", name: "Килим", unit: "шт", qty: () => 1, t: [2500, 6500, 20000], ph: "🧶", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("килим 200х300") },
  // Санвузол
  { id: "washer", group: "Санвузол", name: "Пральна машина", unit: "шт", qty: () => 1, t: [11000, 19000, 38000], ph: "🌊", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("пральна машина") },
  { id: "dryer", group: "Санвузол", name: "Сушильна машина", unit: "шт", qty: () => 0, t: [15000, 24000, 42000], ph: "🌪️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("сушильна машина") },
  { id: "bath_mirror", group: "Санвузол", name: "Дзеркало-шафа з підсвіткою", unit: "шт", qty: (p) => p.bathrooms, t: [2500, 6000, 15000], ph: "🪞", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("дзеркало ванна підсвітка") },
  { id: "bath_acc", group: "Санвузол", name: "Аксесуари (тримачі, гачки, кошик)", unit: "компл.", qty: (p) => p.bathrooms, t: [1200, 3000, 8000], ph: "🧴", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("аксесуари для ванної") },
  // Передпокій
  { id: "hall_wardrobe", group: "Передпокій", name: "Шафа / вішалка", unit: "шт", qty: () => 1, t: [5000, 11000, 28000], ph: "🧥", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("шафа передпокій") },
  { id: "shoe_rack", group: "Передпокій", name: "Взуттєвниця + пуф", unit: "компл.", qty: () => 1, t: [1800, 4000, 10000], ph: "👟", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("взуттєвниця") },
  { id: "hall_mirror", group: "Передпокій", name: "Дзеркало", unit: "шт", qty: () => 1, t: [1200, 3000, 9000], ph: "🪞", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("дзеркало настінне") },
  // Кабінет
  { id: "desk", group: "Кабінет", name: "Стіл письмовий", unit: "шт", qty: () => 0, t: [3000, 7000, 18000], ph: "🖊️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("стіл письмовий") },
  { id: "office_chair", group: "Кабінет", name: "Крісло робоче", unit: "шт", qty: () => 0, t: [2500, 6500, 18000], ph: "🪑", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("крісло офісне") },
  // Освітлення
  { id: "chandeliers", group: "Освітлення", name: "Люстри / стельові світильники", unit: "шт", qty: (p) => (p.rooms || 2) + 1, t: [1500, 4000, 12000], ph: "💡", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("люстра стельова") },
  { id: "lamps", group: "Освітлення", name: "Бра / торшери / настільні", unit: "шт", qty: (p) => p.rooms || 2, t: [800, 2200, 7000], ph: "🕯️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("бра настінне") },
  { id: "led", group: "Освітлення", name: "LED-підсвітка (ніші, кухня)", unit: "компл.", qty: () => 1, t: [1500, 3500, 9000], ph: "✨", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("led стрічка комплект") },
  // Текстиль і декор
  { id: "curtains", group: "Текстиль і декор", name: "Штори + карнизи + тюль", unit: "вікно", qty: (p) => p.windowsCount || (p.rooms || 2) + 1, t: [2000, 4500, 12000], ph: "🪟", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("штори блекаут") },
  { id: "bedding", group: "Текстиль і декор", name: "Постільні комплекти + ковдри", unit: "спальня", qty: spalen, t: [1500, 3500, 9000], ph: "🛌", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("постільна білизна комплект") },
  { id: "decor_set", group: "Текстиль і декор", name: "Декор: подушки, пледи, вази, картини", unit: "компл.", qty: () => 1, t: [3000, 7000, 20000], ph: "🖼️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("декор для дому") },
  { id: "plants", group: "Текстиль і декор", name: "Рослини + кашпо", unit: "компл.", qty: () => 1, t: [1000, 2500, 7000], ph: "🪴", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("вазон кашпо") },
];

/* ---------- БУДИНОК (v2-структура, конвертовано у v3-схему) ---------- */
const fpn = (p) => Math.round(((p.area || 150) / (p.floors || 2)) * 1.1);
export const HOUSE_OPTS = [
  { id: "well", grp: "eng", name: "Свердловина", hint: "якщо нема центральної води" },
  { id: "septic", grp: "eng", name: "Септик", hint: "якщо нема каналізації" },
  { id: "gas", grp: "eng", name: "Підключення газу", hint: "" },
  { id: "yard", grp: "constr", name: "Благоустрій", hint: "вимощення + огорожа" },
];
export const HOUSE_STAGES = [
  { id: "prep", grp: "prep", name: "Проєкт і підготовка", weeks: () => 4, scope: "Архітектура, конструктив, геодезія.",
    items: [{ k: "h_design", n: "Проєктування", u: "м²", q: (A, p) => p.area, w: 660, m: 150, ver: false }] },
  { id: "well", grp: "engineering", name: "Свердловина та вода", weeks: () => 1.5,
    scope: "Буріння 30–60 м, насос, кесон.", items: [{ k: "h_well", n: "Свердловина під ключ", u: "об'єкт", q: (A, p) => p.opts?.well ? 1 : 0, w: 45000, m: 50000, ver: false, opt: "well" }] },
  { id: "septic", grp: "engineering", name: "Септик / каналізація", weeks: () => 1,
    scope: "Септик з монтажем.", items: [{ k: "h_septic", n: "Септик під ключ", u: "об'єкт", q: (A, p) => p.opts?.septic ? 1 : 0, w: 35000, m: 55000, ver: false, opt: "septic" }] },
  { id: "gas", grp: "engineering", name: "Підключення газу", weeks: () => 2,
    scope: "Проєкт, врізка, труба, лічильник.", items: [{ k: "h_gas", n: "Газифікація під ключ", u: "об'єкт", q: (A, p) => p.opts?.gas ? 1 : 0, w: 30000, m: 45000, ver: false, opt: "gas" }] },
  { id: "found", grp: "rough", name: "Фундамент", weeks: (A, p) => 4 + (p.area || 150) / 120, scope: "Земляні, опалубка, армування, бетон.",
    items: [
      { k: "h_earth", n: "Земляні роботи", u: "м²", q: (A, p) => fpn(p), w: 460, m: 255, ver: false },
      { k: "h_monolith", n: "Монолітні роботи", u: "м²", q: (A, p) => fpn(p), w: 1520, m: 2420, ver: true, live: "monolith" },
    ] },
  { id: "box", grp: "rough", name: "Коробка", weeks: (A, p) => 8 + (p.area || 150) / 80, scope: "Кладка, армопояси, перекриття.",
    items: [
      { k: "h_masonry", n: "Кладка стін", u: "м²", q: (A, p) => p.area, w: 1920, m: 2620, ver: true, live: "masonry" },
      { k: "h_slabs", n: "Перекриття", u: "м²", q: (A, p) => Math.round(p.area * 0.55), w: 1420, m: 2320, ver: false },
    ] },
  { id: "roof", grp: "rough", name: "Покрівля", weeks: () => 4, scope: "Кроквяна система, ізоляція, покриття.",
    items: [
      { k: "h_roof_fr", n: "Кроквяна система + ізоляція", u: "м²", q: (A, p) => Math.round(fpn(p) * 1.25), w: 980, m: 1350, ver: false },
      { k: "h_roof_cv", n: "Покриття (металочерепиця)", u: "м²", q: (A, p) => Math.round(fpn(p) * 1.25), w: 340, m: 570, ver: true, live: "roofing" },
    ] },
  { id: "windows", grp: "rough", name: "Вікна та вхідні двері", weeks: () => 2, scope: "МП вікна, двері, відкоси.",
    items: [{ k: "h_wins", n: "Вікна + двері", u: "м²", q: (A, p) => p.area, w: 410, m: 1420, ver: false }] },
  { id: "facade", grp: "finish", name: "Фасад", weeks: () => 5, scope: "Утеплення 150–200мм, штукатурка.",
    items: [{ k: "h_facade", n: "Утеплення + штукатурка", u: "м²", q: (A, p) => Math.round(p.area * 1.15), w: 870, m: 1120, ver: true, live: "facade_insul" }] },
  { id: "mep", grp: "engineering", name: "Інженерні мережі", weeks: () => 6, scope: "Електрика, опалення, вода, каналізація.",
    items: [
      { k: "h_el", n: "Електрика по будинку", u: "м²", q: (A, p) => p.area, w: 720, m: 620, ver: false },
      { k: "h_heat", n: "Опалення, вода, каналізація", u: "м²", q: (A, p) => p.area, w: 1120, m: 1320, ver: false },
    ] },
  { id: "finish", grp: "finish", name: "Внутрішнє оздоблення", weeks: (A, p) => ({ econom: 8, standart: 12, premium: 20 })[p.tier] || 12, scope: "Повний цикл оздоблення.",
    items: [{ k: "h_fin", n: "Оздоблення під ключ", u: "м²", q: (A, p) => p.area, w: 3250, m: 4350, ver: false }] },
  { id: "bath", grp: "complete", name: "Санвузли", weeks: (A, p) => p.bathrooms || 2, scope: "Комплектація та монтаж.",
    items: [{ k: "h_bath", n: "Сантехніка + монтаж", u: "сануз.", q: (A, p) => p.bathrooms || 2, w: 18500, m: 61000, ver: true, mats: "bath" }] },
  { id: "yard", grp: "extra", name: "Благоустрій", weeks: () => 3, scope: "Вимощення, огорожа.",
    items: [
      { k: "h_blind", n: "Вимощення", u: "м.п.", q: (A, p) => p.opts?.yard ? Math.round(4 * Math.sqrt(fpn(p)) * 1.1) : 0, w: 650, m: 750, ver: false, opt: "yard" },
      { k: "h_fence", n: "Огорожа (профліст)", u: "м.п.", q: (A, p) => p.opts?.yard ? Math.round(4 * Math.sqrt((p.plot || 8) * 100)) : 0, w: 550, m: 950, ver: false, opt: "yard" },
    ] },
];
BUDGETS.house = [
  { id: "h1", name: "до 3 млн", max: 3e6 }, { id: "h2", name: "3–5 млн", max: 5e6 },
  { id: "h3", name: "5–8 млн", max: 8e6 }, { id: "h4", name: "8–12 млн", max: 12e6 },
  { id: "h5", name: "12+ млн", max: Infinity },
];
