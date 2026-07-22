import React, { useState, useMemo, useEffect } from "react";
import { css } from "./styles.js";
import {
  BETA, REGIONS, TIERS, TIER_TABLE, GROUPS, FOUNDATIONS, WALLS, ROOFS, HEATING,
  ROOM_TYPES, WALL_FIN, FLOOR_FIN, CEIL_FIN, newRoom, defaultRooms, defaultHouseRooms, buildAgg,
  FLAT_STAGES, HOUSE_STAGES, FLAT_OPTS, HOUSE_OPTS, OPT_GROUPS, PRESETS, SCOPES,
  BUDGETS, PAYMENT, INCLUDES, EXCLUDES, MATS, FURNITURE, FURN_GROUPS,
} from "./data.js";

const VILKA = 0.12, OVERLAP = 0.85;

// ⬇️ ВАШІ ДАНІ — відредагуйте цей блок (єдине місце)
const CONTACTS = {
  company: 'ФОП Прізвище Імʼя',          // ← ваша назва / ФОП
  phone: '+380 XX XXX XX XX',            // ← телефон
  email: 'hello@propozytsia-bud.com',    // ← email
  city: 'Київ та Київська область',
};

function buildOpts(it, live, baseW) {
  const lw = it.live && live?.works?.[it.live];
  if (lw) return {
    opts: [
      { name: "Мінімальна ринкова", price: lw.min, tag: "live", info: lw },
      { name: "Середньоринкова", price: lw.price, tag: "live", info: lw },
      { name: "Верхній сегмент", price: lw.max, tag: "live", info: lw },
    ], def: 1, lw,
  };
  return { opts: [{ name: "Оцінка ПРОПОЗИЦІЯ.БУД", price: baseW, tag: "est" }], def: 0, lw: null };
}

function calc(mode, p, rooms, selections, live, excl = {}, lmat = null) {
  const region = REGIONS.find(x => x.id === p.region) || REGIONS[0];
  const tier = TIERS[p.tier];
  const scope = mode === "flat" ? (SCOPES.find(s => s.id === (p.scope || "full")) || SCOPES[0]) : SCOPES[0];
  const useRooms = scope.wetOnly ? rooms.filter(rm => ROOM_TYPES[rm.type]?.wet) : rooms;
  const A = buildAgg(useRooms, p);
  const stages = (mode === "flat" ? FLAT_STAGES : HOUSE_STAGES)
    .filter(s => !(s.cond && !s.cond(p)))
    .filter(s => !scope.grps || scope.grps.includes(s.grp))
    .filter(s => !(scope.exclude || []).includes(s.id));
  let wo = 0, betaCount = 0;
  const rows = stages.map(s => {
    const sk = 1;
    const items = s.items.map(it => {
      const qty = Math.round(it.q(A, p) * 10) / 10;
      if (!qty || qty <= 0) return null;
      const baseW = it.dynW ? it.dynW(p) : it.w;
      const baseM = it.dynM ? it.dynM(p) : it.m;
      const kwMul = it.kw ? it.kw(p) : 1;
      const kmMul = it.km ? it.km(p) : 1;
      const { opts, def, lw } = buildOpts(it, live, baseW);
      const sel = selections[it.k] ?? def;
      const o = opts[Math.min(sel, opts.length - 1)];
      const pr = Math.round(o.price * tier.kWork * region.k * sk * kwMul);
      // Каталог матеріалів: живі ціни Епіцентру мають пріоритет над кураторськими
      const liveCat = it.mats && lmat?.cats?.[it.mats];
      const matOpts = it.mats
        ? MATS[it.mats].map((m, i) => {
            const L = liveCat && liveCat[i];
            return L ? { ...m, price: L.price, url: L.url || m.url, live: true, liveName: L.name, count: L.count } : m;
          })
        : null;
      const matDef = matOpts ? Math.min({ econom: 0, standart: 1, premium: 2 }[p.tier] ?? 1, matOpts.length - 1) : 0;
      const matSel = matOpts ? (selections["m:" + it.k] ?? matDef) : 0;
      const matChosen = matOpts ? matOpts[Math.min(matSel, matOpts.length - 1)] : null;
      const mt = matOpts ? Math.round(matChosen.price * region.k) : Math.round(baseM * tier.kMat * region.k * sk * kmMul);
      const total = qty * (pr + mt);
      let lowT, highT;
      if (lw) {
        lowT = qty * (Math.round(lw.min * tier.kWork * region.k * sk) + mt);
        highT = qty * (Math.round(lw.max * tier.kWork * region.k * sk) + mt);
      } else { lowT = total * (1 - VILKA); highT = total * (1 + VILKA); }
      if (!it.ver) betaCount++;
      return { key: it.k, label: it.n, unit: it.u, qty, opts, sel, lw, liveKey: it.live || null, ver: it.ver !== false,
        matOpts, matSel, matChosen, price: pr, mat: mt, work: qty * pr, matSum: qty * mt, total, lowT, highT };
    }).filter(Boolean);
    if (!items.length) return null;
    const wk = Math.round((s.weeks(A, p) || 0) * Math.sqrt(Math.max(A.total, 20) / (mode === "flat" ? 60 : 150)) * 10) / 10;
    const sw = wo; wo += wk * OVERLAP;
    return { id: s.id, group: s.grp, name: s.name, scope: s.scope, sk, items, weeks: wk, startWeek: sw, off: !!excl[s.id],
      total: items.reduce((a, b) => a + b.total, 0), work: items.reduce((a, b) => a + b.work, 0), matSum: items.reduce((a, b) => a + b.matSum, 0) };
  }).filter(Boolean);
  const onRows = rows.filter(x => !x.off);
  const total = onRows.reduce((a, r) => a + r.total, 0);
  const allItems = onRows.flatMap(r => r.items);
  let low = allItems.reduce((a, i) => a + i.lowT, 0);
  let high = allItems.reduce((a, i) => a + i.highT, 0);
  low = Math.min(low, total * 0.98); high = Math.max(high, total * 1.02);
  const workSum = allItems.reduce((a, i) => a + i.work, 0);
  const liveWork = allItems.filter(i => i.lw).reduce((a, i) => a + i.work, 0);
  const conf = workSum ? Math.round((liveWork / workSum) * 100) : 0;
  const weeks = Math.round(onRows.reduce((a, r) => a + r.weeks, 0) * OVERLAP);
  const budget = BUDGETS[mode].find(b => b.id === p.budget);
  return { rows, total, region, tier, low, high, conf, betaCount, A,
    perM2: Math.round(total / Math.max(A.total, 1)), weeks, months: Math.round((weeks / 4.33) * 10) / 10,
    budgetFit: budget ? low <= budget.max : true, budgetName: budget?.name || "", totalWeeks: Math.ceil(wo), itemCount: allItems.length };
}

// Числове поле: дозволяє порожнє значення під час введення (зручно на телефоні),
// на виході з поля повертає значення за замовчуванням, якщо залишили порожнім.
function NumInput({ value, onChange, def, min, max, step, style, className }) {
  const [txt, setTxt] = useState(value == null ? "" : String(value));
  useEffect(() => { setTxt(value == null ? "" : String(value)); }, [value]);
  return <input type="number" inputMode="decimal" className={className} style={style}
    value={txt} min={min} max={max} step={step}
    onFocus={e => e.target.select()}
    onChange={e => {
      const t = e.target.value;
      setTxt(t);
      if (t !== "") { const n = Number(t); if (!Number.isNaN(n)) onChange(n); }
    }}
    onBlur={() => {
      if (txt === "" || Number.isNaN(Number(txt))) {
        const d = def ?? min ?? 0;
        setTxt(String(d)); onChange(d);
      }
    }} />;
}

function useCount(v) {
  const [d, setD] = useState(v);
  useEffect(() => {
    if (typeof requestAnimationFrame === "undefined") { setD(v); return; }
    const s = d, e = v, t0 = performance.now(), dur = 350;
    if (Math.abs(e - s) < 1) { setD(e); return; }
    let raf;
    const f = t => { const k = Math.min((t - t0) / dur, 1); setD(s + (e - s) * (k * (2 - k))); if (k < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [v]); // eslint-disable-line
  return d;
}

const fmt = n => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtM = n => n >= 1e6 ? (n / 1e6).toFixed(2).replace(".", ",") + "\u00a0млн" : fmt(n);

const initF = { region: "kyiv", roomsCount: 2, bathrooms: 1, condition: "new", tier: "standart", budget: "f3",
  floor: 5, lift: "pass", acCount: 1, openingCount: 1, ledLen: 6, partArea: 12, area: 65, scope: "full", opts: { slopes: true } };
const initH = { region: "kyiv", area: 150, floors: 2, roomsCount: 3, bathrooms: 2, tier: "standart", budget: "h3", plot: 8,
  foundation: "strip", walls: "aerobloc", roof: "metal", heating: "gas", opts: { well: true, septic: true } };

export default function App() {
  const [mode, setMode] = useState("house");
  const [flat, setFlat] = useState(initF);
  const [house, setHouse] = useState(initH);
  const [rooms, setRooms] = useState(() => defaultRooms(2, 1, 65));
  const [hrooms, setHrooms] = useState(() => defaultHouseRooms(3, 2, 150, 2));
  const [roomsCustom, setRoomsCustom] = useState(false);
  const [preset, setPreset] = useState(null);
  const [lastChange, setLastChange] = useState(null);
  const [showBudget, setShowBudget] = useState(false);
  const snapRef = React.useRef(null);
  const [view, setView] = useState("form");
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState(false);
  const [sel, setSel] = useState({});
  const [opn, setOpn] = useState({});
  const [grpFilter, setGrpFilter] = useState(null);
  const [showT, setShowT] = useState(false);
  const [lead, setLead] = useState({ name: "", phone: "", msg: "" });
  const [live, setLive] = useState(null);
  const [hist, setHist] = useState(null);
  const [lmat, setLmat] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [margin, setMargin] = useState(0);
  const [leadsRows, setLeadsRows] = useState(null);
  const [leadsErr, setLeadsErr] = useState(null);
  const [leadSent, setLeadSent] = useState(null);
  const [startDate, setStartDate] = useState(() => new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10));
  const [instM, setInstM] = useState(12);
  const [showCmp, setShowCmp] = useState(false);
  const [shared, setShared] = useState(false);
  const [furnOn, setFurnOn] = useState(false);
  const [furnSel, setFurnSel] = useState({});
  const excl = {}; // «зроблю сам» вилучено на прохання замовника
  const [q, setQ] = useState("");
  const [usd, setUsd] = useState(null);
  const [usdDate, setUsdDate] = useState(null);
  const [variants, setVariants] = useState(() => { try { return JSON.parse(localStorage.getItem("pb_variants") || "[]"); } catch { return []; } });

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get("admin") === "1") { setAdmin(true); const m = +localStorage.getItem("pb_margin"); if (m) setMargin(m); }
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("pb_margin", String(margin)); } catch {} }, [margin]);

  useEffect(() => {
    try {
      let saved = null;
      if (window.location.hash.startsWith("#c=")) saved = JSON.parse(decodeURIComponent(escape(atob(window.location.hash.slice(3)))));
      else { const ls = localStorage.getItem("pb_state3"); if (ls) saved = JSON.parse(ls); }
      if (saved && saved.v === 3) {
        if (saved.f) setFlat(x => ({ ...x, ...saved.f }));
        if (saved.h) setHouse(x => ({ ...x, ...saved.h }));
        if (saved.r) { setRooms(saved.r); setRoomsCustom(true); }
        if (saved.hr) { setHrooms(saved.hr); setRoomsCustom(true); }
        if (saved.m) setMode(saved.m);
        if (saved.d != null) setDetail(saved.d);
        if (saved.fo != null) setFurnOn(saved.fo);
        if (saved.sd) setStartDate(saved.sd);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("pb_state3", JSON.stringify({ v: 3, m: mode, f: flat, h: house, r: rooms, hr: hrooms, d: detail, fo: furnOn, sd: startDate, ex: excl })); } catch {}
  }, [mode, flat, house, rooms, hrooms, detail, furnOn, startDate, excl]);

  useEffect(() => {
    fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json")
      .then(x => x.ok ? x.json() : null).then(d => { const r0 = d?.[0]?.rate; if (r0 > 10 && r0 < 200) { setUsd(r0); const ed = d[0].exchangedate; if (ed) setUsdDate(ed); } }).catch(() => {});
  }, []);
  useEffect(() => { fetch("/price-history.json").then(x => x.ok ? x.json() : null).then(h => { if (Array.isArray(h) && h.length > 1) setHist(h); }).catch(() => {}); }, []);
  useEffect(() => { fetch("/materials.json").then(x => x.ok ? x.json() : null).then(d => { if (d?.updated && d.cats) setLmat(d); }).catch(() => {}); }, []);
  useEffect(() => { fetch("/prices.json").then(r => r.ok ? r.json() : null).then(d => { if (d?.updated && Object.keys(d.works || {}).length) setLive(d); }).catch(() => {}); }, []);

  const p = mode === "flat" ? flat : house;
  // Слайдери ЗАВЖДИ впливають на список кімнат — навіть після ручного налаштування.
  // Ручні площі/оздоблення зберігаються: кімнати додаються/видаляються, площі масштабуються.
  const syncRooms = (next, k) => setARooms(rs => {
    let out = [...rs];
    if (k === "roomsCount") {
      const living = out.filter(x => !ROOM_TYPES[x.type].wet && !["hall", "balcony", "wardrobe", "kitchen"].includes(x.type));
      const want = Math.max(next.roomsCount, 1); // «N-кімнатна» = N кімнат + кухня окремо
      if (living.length > want) {
        const drop = living.slice(want).map(x => x.id);
        out = out.filter(x => !drop.includes(x.id));
      } else if (living.length < want) {
        for (let i = living.length; i < want; i++) out.push(newRoom("bedroom"));
      }
    }
    if (k === "bathrooms") {
      const wet = out.filter(x => ROOM_TYPES[x.type].wet);
      const want = Math.max(next.bathrooms, 1);
      if (wet.length > want) {
        const drop = wet.slice(want).map(x => x.id);
        out = out.filter(x => !drop.includes(x.id));
      } else if (wet.length < want) {
        for (let i = wet.length; i < want; i++) out.push(newRoom(i === 0 ? "bath" : "wc"));
      }
    }
    if (k === "area") {
      const sum = out.reduce((a, x) => a + (x.area || 0), 0) || 1;
      const kf = next.area / sum;
      out = out.map(x => ({ ...x, area: Math.max(Math.round(x.area * kf * 10) / 10, 1.5) }));
    }
    return out;
  });

  const setP = (k, v) => {
    if (["tier", "opts"].includes(k)) setPreset(null);
    snapRef.current = { p: { ...p }, rooms: aRooms.map(x => ({ ...x })), k, v };
    (mode === "flat" ? setFlat : setHouse)(s => ({ ...s, [k]: v }));
    if (["roomsCount", "bathrooms", "area"].includes(k)) syncRooms({ ...p, [k]: v }, k);
  };

  const applyPreset = pr => {
    setFlat(s => ({ ...s, tier: pr.apply.tier, opts: { ...pr.apply.opts } }));
    setPreset(pr.id);
  };
  const toggleOpt = id => setP("opts", { ...p.opts, [id]: !p.opts[id] });
  const aRooms = mode === "flat" ? rooms : hrooms;
  const setARooms = mode === "flat" ? setRooms : setHrooms;
  const r = useMemo(() => calc(mode, p, aRooms, sel, live, excl, lmat), [mode, p, aRooms, sel, live, excl, lmat]);

  const tierIdx = { econom: 0, standart: 1, premium: 2 }[p.tier] ?? 1;
  const furnRows = useMemo(() => {
    if (!furnOn) return [];
    return FURNITURE.map(f => {
      const fp = { ...p, rooms: roomStats.living, bathrooms: r.A.baths, windowsCount: r.A.wins || 3 };
      const defQty = f.qty(fp);
      const s = furnSel[f.id] || {};
      const on = s.on ?? defQty > 0;
      const qty = s.qty ?? Math.max(defQty, 1);
      const ti = s.tier ?? tierIdx;
      return { ...f, on, qty, ti, price: f.t[ti], total: on ? qty * f.t[ti] : 0 };
    });
  }, [furnOn, furnSel, p, tierIdx, r.A]);
  const furnTotal = furnRows.reduce((a, x) => a + x.total, 0);
  const setFurn = (id, patch) => setFurnSel(s => ({ ...s, [id]: { ...(s[id] || {}), ...patch } }));

  const cmp = useMemo(() => {
    const out = {};
    for (const t of Object.keys(TIERS)) out[t] = calc(mode, { ...p, tier: t }, aRooms, sel, live, excl, lmat).total;
    return out;
  }, [mode, p, rooms, sel, live]);

  // Дельта ціни кожної опції: калькуляція з опцією і без
  const optDeltas = useMemo(() => {
    const out = {};
    const list = (mode === "flat" ? FLAT_OPTS : HOUSE_OPTS).filter(o => !o.onlyCond || o.onlyCond === p.condition);
    for (const o of list) {
      const on = p.opts[o.id] ?? (o.def && p.condition === "new");
      const totalWith = on ? r.total : calc(mode, { ...p, opts: { ...p.opts, [o.id]: true } }, aRooms, sel, live, excl, lmat).total;
      const totalWithout = on ? calc(mode, { ...p, opts: { ...p.opts, [o.id]: false } }, aRooms, sel, live, excl, lmat).total : r.total;
      out[o.id] = Math.max(totalWith - totalWithout, 0);
    }
    return out;
  }, [mode, p, rooms, sel, live, r.total]);

  // ── Порадник бюджету: рахує реальну економію кожного варіанта і сортує за вигодою ──
  const budgetAdvice = useMemo(() => {
    const b = BUDGETS[mode].find(x => x.id === p.budget);
    if (!b || b.max === Infinity) return null;
    const over = r.low - b.max;
    if (over <= 0) return null;
    const T = patch => calc(mode, { ...p, ...patch }, patch.__rooms || aRooms, sel, live, excl, lmat).low;
    const cands = [];
    const push = (label, why, patch) => {
      const save = r.low - T(patch);
      if (save > 1000) cands.push({ label, why, save, patch });
    };
    // 1) рівень оздоблення
    if (p.tier === "premium") push("Рівень: преміум → стандарт",
      "Стандарт — це якісні матеріали середнього сегмента: та сама надійність, різниця здебільшого в бренді сантехніки та класі покриттів. На міцність і довговічність будинку це не впливає, а економія суттєва.",
      { tier: "standart" });
    if (p.tier !== "econom") push("Рівень: → економ",
      "Економ-матеріали цілком надійні й виглядають охайно — просто без преміальних брендів. Плитку, сантехніку чи двері завжди можна замінити на дорожчі пізніше, коли з'явиться бюджет; це не потребує переробок.",
      { tier: "econom" });
    // 2) опції — від найдорожчої, з поясненням
    const optWhy = {
      basement: "Підвал — найдорожча опція: подвоює земляні роботи й фундамент. Більшість функцій (комора, техприміщення, котельня) можна винести на перший поверх або в окрему споруду значно дешевше.",
      mansard: "Житлова мансарда потребує утеплення скатів і пароізоляції. Горище можна зробити холодним зараз, а утеплити й переобладнати під кімнату пізніше — коробка від цього не змінюється.",
      recuperator: "Рекуператор економить на опаленні, але окупається роками. Звичайна припливно-витяжна вентиляція забезпечує свіже повітря; рекуператор легко додати згодом — під нього достатньо передбачити місце.",
      panoramic: "Панорамне засклення — це передусім естетика. Звичайні великі вікна дають достатньо світла й коштують у рази менше; на комфорт проживання майже не впливає.",
      terrace: "Терасу зручно добудувати окремим етапом уже після заселення — вона не пов'язана з коробкою будинку й не блокує інші роботи.",
      garage: "Гараж можна замінити навісом (карпорт) — він захищає авто й коштує в кілька разів дешевше. Повноцінний гараж легко прибудувати пізніше.",
      well: "Якщо поруч є центральний водопровід — підключення до нього дешевше за свердловину. Свердловину має сенс бурити лише там, де централізованої води немає.",
      ac: "Кондиціонування можна встановити після заселення — головне зараз передбачити траси в стінах. Це знімає суму обладнання з початкового кошторису.",
      dewater: "Водозниження потрібне лише за високого рівня ґрунтових вод — якщо геологія цього не показала, опцію можна прибрати без ризику.",
      yard: "Благоустрій (доріжки, огорожа, газон) — завершальний етап, який зазвичай роблять уже після новосілля, часто поетапно й частково власними силами.",
      winter: "Зимове будівництво з тимчасовим опаленням дорожче. Якщо можна зсунути графік на теплий сезон — ця стаття витрат зникає.",
      septic: "Якщо поруч є центральна каналізація — підключення дешевше за септик.",
    };
    const optList = (mode === "flat" ? FLAT_OPTS : HOUSE_OPTS).filter(o => !o.onlyCond || o.onlyCond === p.condition);
    for (const o of optList) {
      const on = p.opts[o.id] ?? (o.def && p.condition === "new");
      if (!on) continue;
      push(`Відмовитись: ${o.name}`, optWhy[o.id] || "Цю опцію можна додати пізніше окремим етапом — вона не пов'язана з основною коробкою будинку.", { opts: { ...p.opts, [o.id]: false } });
    }
    // 3) конструктив (будинок)
    if (mode === "house") {
      if (p.roof !== "metal") push("Покрівля → металочерепиця",
        "Металочерепиця — найпоширеніше покриття в Україні: надійна, перевірена, дешевша в монтажі за керамічну чи фальцеву. Прослужить десятиліття; переплата за преміум-покрівлю на функцію не впливає.",
        { roof: "metal" });
      if (p.heating === "heatpump") push("Опалення → газовий котел",
        "Тепловий насос дешевший в експлуатації, але дуже дорогий на старті й окупається роками. Газовий котел — стандарт для України: значно дешевше обладнання, а перейти на насос можна згодом.",
        { heating: "gas" });
      if (p.walls !== "aerobloc") push("Стіни → газоблок 375 мм",
        "Газоблок — оптимум ціни й тепла для приватного будинку: тепліший за цеглу, дешевший, швидший у кладці. Міцності для 1–3 поверхів більш ніж достатньо.",
        { walls: "aerobloc" });
      if (p.foundation === "slab") push("Фундамент → стрічковий",
        "Стрічковий монолітний фундамент — класика для більшості ґрунтів і дешевший за утеплену плиту. Обирати його варто, якщо геологія не вимагає саме плити.",
        { foundation: "strip" });
    }
    // 4) кімнати — покриття та оздоблення
    if (aRooms.some(x => x.floor === "parquet")) {
      push("Підлога: інженерна дошка → вініл/ламінат",
        "Сучасний вініл візуально майже не відрізнити від дерева, він тепліший на дотик і в 3 рази дешевший за інженерну дошку. Дошку можна покласти пізніше в кількох ключових кімнатах.",
        { __rooms: aRooms.map(x => x.floor === "parquet" ? { ...x, floor: "lam" } : x) });
    }
    if (aRooms.some(x => x.walls === "decor")) {
      push("Стіни: декоративна штукатурка → фарбування",
        "Якісне фарбування виглядає чисто й сучасно. Декоративну штукатурку можна зробити пізніше на одній акцентній стіні — це недорого і не потребує переробок.",
        { __rooms: aRooms.map(x => x.walls === "decor" ? { ...x, walls: "paint" } : x) });
    }
    if (aRooms.some(x => x.heatFloor)) {
      push("Прибрати теплу підлогу в частині кімнат",
        "Тепла підлога приємна, але в спальнях і підсобних приміщеннях без неї цілком комфортно з радіаторами. Достатньо лишити її у ванних і на кухні.",
        { __rooms: aRooms.map(x => (ROOM_TYPES[x.type].wet || x.type === "kitchen") ? x : { ...x, heatFloor: false }) });
    }
    cands.sort((a, c) => c.save - a.save);
    // мінімальний набір, що закриває перевищення
    const plan = []; let acc = 0;
    for (const c of cands) { if (acc >= over) break; plan.push(c); acc += c.save; }
    return { over, cands: cands.slice(0, 6), plan, covered: acc >= over, budgetName: b.name };
  }, [mode, p, aRooms, sel, live, excl, lmat, r.low]);

  const applyAdvice = c => {
    if (c.patch.__rooms) { setARooms(c.patch.__rooms); setRoomsCustom(true); }
    const { __rooms, ...rest } = c.patch;
    if (Object.keys(rest).length) (mode === "flat" ? setFlat : setHouse)(s => ({ ...s, ...rest }));
  };

  // Пояснення зміни ціни: рахує РЕАЛЬНУ дельту між попереднім і новим станом
  // та знаходить позиції кошторису, що змінились найбільше — це і є причина.
  const explainDelta = (prevP, prevRooms, label) => {
    const before = calc(mode, prevP, prevRooms, sel, live, excl, lmat);
    const after = r;
    const delta = after.total - before.total;
    if (Math.abs(delta) < 500) return null;
    const bMap = {}; before.rows.flatMap(x => x.items).forEach(i => { bMap[i.key] = i; });
    const diffs = [];
    after.rows.flatMap(x => x.items).forEach(i => {
      const b = bMap[i.key];
      const d = i.total - (b ? b.total : 0);
      if (Math.abs(d) > 300) diffs.push({ label: i.label, d, qBefore: b?.qty || 0, qAfter: i.qty, unit: i.unit });
    });
    Object.values(bMap).forEach(b => { if (!after.rows.flatMap(x => x.items).find(i => i.key === b.key) && b.total > 300) diffs.push({ label: b.label, d: -b.total, qBefore: b.qty, qAfter: 0, unit: b.unit }); });
    diffs.sort((a, c) => Math.abs(c.d) - Math.abs(a.d));
    return { label, delta, drivers: diffs.slice(0, 4) };
  };

  const mk = 1 + (admin ? margin : 0) / 100;
  useEffect(() => {
    const s = snapRef.current;
    if (!s) return;
    snapRef.current = null;
    const labels = { area: "площа", roomsCount: "кількість кімнат", bathrooms: "санвузли", tier: "рівень оздоблення",
      foundation: "фундамент", walls: "матеріал стін", roof: "покрівля", heating: "опалення", floors: "поверховість", region: "регіон", acCount: "кондиціонери" };
    const nm = s.k === "room" ? (Object.keys(s.v)[0] === "area" ? "площа кімнати" : Object.keys(s.v)[0] === "h" ? "висота стелі" : Object.keys(s.v)[0] === "win" ? "вікна" : Object.keys(s.v)[0] === "walls" ? "оздоблення стін" : Object.keys(s.v)[0] === "floor" ? "покриття підлоги" : Object.keys(s.v)[0] === "ceil" ? "стеля" : Object.keys(s.v)[0] === "heatFloor" ? "тепла підлога" : "кімната") : (labels[s.k] || s.k);
    const ex = explainDelta(s.p, s.rooms, nm);
    if (ex) setLastChange({ ...ex, t: Date.now() });
  }, [r.total]); // eslint-disable-line

  const roomStats = useMemo(() => ({
    total: aRooms.length,
    living: aRooms.filter(x => !ROOM_TYPES[x.type].wet && !["hall", "balcony", "wardrobe", "kitchen", "boilerroom", "garage", "terraceR"].includes(x.type)).length,
    wet: aRooms.filter(x => ROOM_TYPES[x.type].wet).length,
  }), [aRooms]);
  const lowA = useCount(r.low * mk), highA = useCount(r.high * mk);
  const today = new Date().toLocaleDateString("uk-UA");
  const fmtD = d => d.toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });
  const sDate = new Date(startDate + "T00:00:00");
  const finishDate = new Date(+sDate + (r?.weeks || 0) * 7 * 864e5);
  const stageDate = w => new Date(+sDate + w * 7 * 864e5).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

  const trend = key => {
    if (!hist || hist.length < 2 || !key) return null;
    const last = hist[hist.length - 1];
    const cutoff = new Date(+new Date(last.date) - 30 * 864e5).toISOString().slice(0, 10);
    let base = hist[0];
    for (const h of hist) { if (h.date <= cutoff) base = h; else break; }
    const a = base.w?.[key], b = last.w?.[key];
    if (!a || !b || base.date === last.date) return null;
    const d = Math.round(((b - a) / a) * 100);
    return d === 0 ? null : d;
  };

  const saveVariant = () => {
    const name = window.prompt("Назва варіанта:", "Варіант " + (variants.length + 1));
    if (!name) return;
    const v = { id: Date.now(), name, m: mode, f: flat, h: house, r: aRooms, fo: furnOn, savedAt: new Date().toISOString().slice(0, 10) };
    const next = [...variants, v].slice(-6);
    setVariants(next);
    try { localStorage.setItem("pb_variants", JSON.stringify(next)); } catch {}
  };
  const delVariant = id => {
    const next = variants.filter(v => v.id !== id);
    setVariants(next);
    try { localStorage.setItem("pb_variants", JSON.stringify(next)); } catch {}
  };
  const restoreVariant = v => {
    setMode(v.m); if (v.f) setFlat(v.f); if (v.h) setHouse(v.h);
    if (v.r) { (v.m === "flat" ? setRooms : setHrooms)(v.r); setRoomsCustom(true); }
    setFurnOn(!!v.fo); setView("form"); setStep(0); window.scrollTo(0, 0);
  };
  const variantCalc = v => calc(v.m, v.m === "flat" ? v.f : v.h, v.r || aRooms, {}, live, {}, lmat);

  // Номер документа: детермінований від конфігурації і дати
  const docNo = useMemo(() => {
    const s = JSON.stringify({ p, rooms: rooms.map(x => [x.type, x.area]) });
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
    const d = new Date();
    return `ПБ-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(h).padStart(3, "0")}`;
  }, [p, rooms]);
  const validUntil = new Date(Date.now() + 14 * 864e5).toLocaleDateString("uk-UA");
  const [qr, setQr] = useState(null);
  useEffect(() => {
    if (view !== "sheet") return;
    try {
      const payload = { v: 3, m: mode, f: flat, h: house, r: rooms, hr: hrooms, d: detail, fo: furnOn, sd: startDate, ex: excl };
      const url = window.location.origin + "/#c=" + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      import("qrcode").then(Q => Q.toDataURL(url, { margin: 0, width: 120, color: { dark: "#1A1C20", light: "#FFFFFF" } })).then(setQr).catch(() => {});
    } catch {}
  }, [view]); // eslint-disable-line

  const shareLink = () => {
    try {
      const payload = { v: 3, m: mode, f: flat, h: house, r: rooms, d: detail, fo: furnOn, sd: startDate, ex: excl };
      const hash = "#c=" + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      navigator.clipboard.writeText(window.location.origin + window.location.pathname + hash);
      window.history.replaceState(null, "", hash);
      setShared(true); setTimeout(() => setShared(false), 2500);
    } catch {}
  };

  const loadLeads = () => {
    let key = "";
    try { key = localStorage.getItem("pb_admin_key") || ""; } catch {}
    if (!key) { key = window.prompt("Введіть ключ доступу до лідів (ADMIN_KEY):") || ""; if (!key) return; try { localStorage.setItem("pb_admin_key", key); } catch {} }
    setView("leads"); setLeadsRows(null); setLeadsErr(null); window.scrollTo(0, 0);
    fetch("/api/leads?key=" + encodeURIComponent(key)).then(x => x.json()).then(d => {
      if (d.ok) setLeadsRows(d.rows);
      else { setLeadsErr(d.configured === false ? "Журнал не налаштовано." : "Невірний ключ."); try { localStorage.removeItem("pb_admin_key"); } catch {} }
    }).catch(() => setLeadsErr("Помилка зʼєднання."));
  };

  const exportXlsx = async () => {
    const XLSX = await import("xlsx");
    const wsData = [
      ["ПРОПОЗИЦІЯ.БУД — Кошторис" + (BETA ? " (БЕТА)" : ""), "", "", "", "", "", ""],
      [mode === "flat" ? `Ремонт ${r.A.total} м², кімнат: ${roomStats.living}` : `Будинок ${p.area} м²`, r.region.name, r.tier.name, "", "", today],
      [],
      ["Етап", "Позиція", "К-сть", "Од.", "Робота грн/од", "Матеріал грн/од", "Разом грн"],
    ];
    r.rows.forEach(st => st.items.forEach((it, i) => wsData.push([
      i === 0 ? st.name : "", it.label + (it.matChosen ? " · " + it.matChosen.name : "") + (it.ver ? "" : " [β]"),
      it.qty, it.unit, Math.round(it.price * mk), Math.round(it.mat * mk), Math.round(it.total * mk)])));
    wsData.push([]);
    wsData.push(["", "", "", "", "Роботи:", "", Math.round(r.rows.reduce((a, x) => a + x.work, 0) * mk)]);
    wsData.push(["", "", "", "", "Матеріали:", "", Math.round(r.rows.reduce((a, x) => a + x.matSum, 0) * mk)]);
    wsData.push(["", "", "", "", "РАЗОМ:", "", Math.round(r.total * mk)]);
    if (furnOn) {
      wsData.push([]); wsData.push(["КОМПЛЕКТАЦІЯ", "", "", "", "", "", ""]);
      furnRows.filter(f => f.on).forEach(f => wsData.push(["", f.name, f.qty, f.unit, "", f.price, f.total]));
      wsData.push(["", "", "", "", "Разом комплектація:", "", furnTotal]);
    }
    wsData.push([]);
    wsData.push(["Вилка (ринковий розкид):", "", "", "", "", "", `${Math.round(r.low * mk)} — ${Math.round(r.high * mk)}`]);
    wsData.push(["Строк:", "", "", "", "", "", `${r.months} міс (${r.weeks} тижнів)`]);
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 30 }, { wch: 48 }, { wch: 8 }, { wch: 9 }, { wch: 14 }, { wch: 15 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Кошторис");
    XLSX.writeFile(wb, `koshtorys-${Math.round(r.A.total)}m2-${today.replace(/\./g, "-")}.xlsx`);
  };

  const swM = m => { setMode(m); setView("form"); setStep(0); setSel({}); setOpn({}); setGrpFilter(null); };
  const OPTS = (mode === "flat" ? FLAT_OPTS : HOUSE_OPTS).filter(o => !o.onlyCond || o.onlyCond === p.condition);
  const shownRows = grpFilter ? r.rows.filter(x => x.group === grpFilter) : r.rows;
  const ql = q.trim().toLowerCase();
  const displayRows = ql
    ? shownRows.map(st => ({ ...st, items: st.items.filter(i => i.label.toLowerCase().includes(ql)) })).filter(st => st.items.length)
    : shownRows;
  const usedGroups = [...new Set(r.rows.map(x => x.group))];
  const updRoom = (id, patch) => {
    snapRef.current = { p: { ...p }, rooms: aRooms.map(x => ({ ...x })), k: "room", v: patch };
    setRoomsCustom(true);
    setARooms(rs => rs.map(x => x.id === id ? { ...x, ...patch } : x));
  };
  const delRoom = id => { setRoomsCustom(true); setARooms(rs => rs.filter(x => x.id !== id)); };
  const addRoom = t => { setRoomsCustom(true); setARooms(rs => [...rs, newRoom(t, mode === "house" ? { lvl: 1 } : {})]); };

  return (
    <div className="app"><style>{css}</style>
      {BETA && <div className="betabar no-print">v3.0 <b>БЕТА</b> · повний кошторис · {r.itemCount} позицій · структура очікує перевірки експерта · позначка <b>β</b> = розцінка неперевірена</div>}
      <div className="topbar no-print"><div className="tb">
        <div className="logo">ПРОПОЗИЦІЯ<span>.БУД</span></div>
        <div className="mode">
          <button className={mode === "flat" ? "on" : ""} onClick={() => swM("flat")}>Ремонт квартири</button>
          <button className={mode === "house" ? "on" : ""} onClick={() => swM("house")}>Будинок з нуля</button>
        </div>
      </div></div>

      <div className="wrap">
        {view === "form" && (() => {
          const STEPS = mode === "flat"
            ? [{ id: "obj", t: "Обʼєкт і бюджет" }, { id: "rooms", t: "Кімнати" }, { id: "opts", t: "Роботи" }, { id: "style", t: "Рівень" }]
            : [{ id: "obj", t: "Будинок і бюджет" }, { id: "constr", t: "Конструктив" }, { id: "rooms", t: "Приміщення" }, { id: "opts", t: "Роботи" }, { id: "style", t: "Рівень" }];
          const stepId = STEPS[Math.min(step, STEPS.length - 1)].id;
          const optsChosen = OPTS.filter(o => p.opts[o.id] ?? (o.def && p.condition === "new")).length;
          const goto = i => { setStep(Math.max(0, Math.min(i, STEPS.length - 1))); window.scrollTo({ top: 0, behavior: "smooth" }); };
          const next = () => step >= STEPS.length - 1 ? (setView("sheet"), window.scrollTo(0, 0)) : goto(step + 1);
          return (<>
          {step === 0 && <div className="hero">
            <h1>{mode === "flat" ? "Ремонт під ключ — з ціною одразу" : "Будинок — з ціною та строком одразу"}</h1>
            <p>{mode === "flat" ? "Кошторис рахується по кожній кімнаті окремо" : "Кожен параметр змінює розрахунок у реальному часі"}</p>
            {live ? <div className="badge live">роботи: ціни rabotniki.ua від {live.updated} · матеріали: орієнтовні</div>
              : <div className="badge demo">демо · ціни орієнтовні</div>}
            <div className="dimline" />
            <div className="howit">
              <span><b>1</b> Параметри обʼєкта</span><span className="ha">→</span>
              <span><b>2</b> Жива ціна одразу</span><span className="ha">→</span>
              <span><b>3</b> Пропозиція + PDF</span>
            </div>
          </div>}

          {admin && <div className="adminbar no-print">
            <span className="ab-t">🔧 Режим фірми</span><span>Націнка:</span>
            <input type="range" min="0" max="40" value={margin} onChange={e => setMargin(+e.target.value)} style={{ width: 140 }} />
            <b>{margin}%</b>
            <span className="hint">непомітно для клієнта</span>
            <button className="btn" style={{ marginLeft: "auto" }} onClick={loadLeads}>📋 Ліди</button>
          </div>}

          {budgetAdvice && <div className="budgbanner no-print" onClick={() => setShowBudget(true)}>
            <span className="bb-i">⚠️</span>
            <span className="bb-t">Перевищення бюджету «{budgetAdvice.budgetName}» на <b>{fmtM(budgetAdvice.over * mk)} грн</b></span>
            <span className="bb-b">Як зменшити →</span>
          </div>}

          <div className="wsteps no-print">
            {STEPS.map((s, i) => <button key={s.id} className={"wstep" + (i === step ? " on" : "") + (i < step ? " done" : "")} onClick={() => goto(i)}>
              <span className="wn">{i < step ? "✓" : i + 1}</span>{s.t}{s.id === "opts" && optsChosen > 0 ? ` · ${optsChosen}` : ""}</button>)}
          </div>

          <div className="grid">
            <div style={{ display: "grid", gap: 16 }}>

              {stepId === "obj" && <>
                <div className="card"><div className="ch"><span className="cn">Бюджет</span><h2>Скільки плануєте витратити</h2></div>
                  <div className="cb">
                    <label className="f">Орієнтовний бюджет
                      <div className="chips">
                        {BUDGETS[mode].map(b => <button key={b.id} className={"chip acc" + (p.budget === b.id ? " on" : "")} onClick={() => setP("budget", b.id)}>{b.name}</button>)}
                      </div>
                      <span className="hint">Розрахунок покаже, чи вписується проєкт, і як залишитись у межах</span></label>
                    <label className="f">Бажаний старт робіт<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ maxWidth: 200 }} /></label>
                  </div></div>

                {mode === "flat" && <div className="card"><div className="ch"><span className="cn">Сценарій</span><h2>З чого почнемо</h2></div>
                  <div className="cb">
                    <label className="f">Готові сценарії <span className="hint">один тап — типова конфігурація, все можна змінити</span>
                      <div className="chips">
                        {PRESETS.map(pr => <button key={pr.id} className={"chip acc" + (preset === pr.id ? " on" : "")} title={pr.hint}
                          onClick={() => applyPreset(pr)}>{pr.name}</button>)}
                      </div></label>
                    <label className="f">Обсяг ремонту
                      <div className="chips">
                        {SCOPES.map(s => <button key={s.id} className={"chip acc" + ((p.scope || "full") === s.id ? " on" : "")} onClick={() => setP("scope", s.id)}>{s.name}</button>)}
                      </div>
                      {(p.scope || "full") === "bathroom" && <span className="hint">Рахуються лише мокрі зони (санвузли) з вашого списку кімнат</span>}
                      {(p.scope || "full") === "finish" && <span className="hint">Припускаємо, що чорнові роботи вже виконані</span>}</label>
                  </div></div>}
                <div className="card"><div className="ch"><span className="cn">{mode === "flat" ? "Обʼєкт" : "Будинок"}</span><h2>Де і що ремонтуємо</h2></div>
                  <div className="cb">
                    <div className="g2">
                      <label className="f">Локація
                        <select value={p.region} onChange={e => setP("region", e.target.value)}>
                          {REGIONS.map(x => <option key={x.id} value={x.id}>{x.name}{x.k !== 1 ? ` (−${Math.round((1 - x.k) * 100)}%)` : ""}</option>)}</select></label>
                      {mode === "flat"
                        ? <label className="f">Поверх / ліфт
                            <div style={{ display: "flex", gap: 8 }}>
                              <NumInput value={p.floor} def={1} min={1} max={30} onChange={v => setP("floor", v)} style={{ width: 70 }} />
                              <select value={p.lift} onChange={e => setP("lift", e.target.value)}>
                                <option value="cargo">Вантажний ліфт</option><option value="pass">Пасажирський</option><option value="none">Без ліфта</option>
                              </select>
                            </div></label>
                        : <label className="f">Спалень
                            <div className="chips">{[1, 2, 3, 4, 5].map(n => <button key={n} className={"chip" + (p.roomsCount === n ? " on" : "")} onClick={() => setP("roomsCount", n)}>{n}</button>)}</div></label>}
                    </div>
                    {mode === "house" && (<>
                      <label className="f">Площа<div className="rr"><input type="range" min="80" max="300" step="5" value={p.area} onChange={e => setP("area", +e.target.value)} /><span className="rv">{p.area} м²</span></div></label>
                      <div className="g2">
                        <label className="f">Поверхів<div className="chips">{[1, 2, 3].map(n => <button key={n} className={"chip" + (p.floors === n ? " on" : "")} onClick={() => setP("floors", n)}>{n}</button>)}</div></label>
                        <label className="f">Санвузлів<div className="chips">{[1, 2, 3].map(n => <button key={n} className={"chip" + (p.bathrooms === n ? " on" : "")} onClick={() => setP("bathrooms", n)}>{n}</button>)}</div></label>
                      </div>
                    </>)}
                  </div></div>
                {mode === "flat" && <div className="card"><div className="ch"><span className="cn">Стан</span><h2>Стан квартири</h2></div>
                  <div className="cb"><div className="cond">
                    {[{ id: "new", t: "Новобудова «сіра коробка»", d: "Вікна, радіатори і вхідні двері вже встановлені забудовником" },
                      { id: "old", t: "Вторинка зі старим ремонтом", d: "Повний демонтаж по шарах, заміна комунікацій" },
                      { id: "partial", t: "Часткова готовність", d: "Штукатурка і стяжка вже є — пропускаємо" }].map(o => (
                      <div key={o.id} className={"opt" + (p.condition === o.id ? " on" : "")} onClick={() => setP("condition", o.id)}>
                        <div className="rd" /><div><div className="ot">{o.t}</div><div className="od">{o.d}</div></div></div>))}
                    {p.condition === "new" && <div className="condnote">ℹ️ У новобудові <b>вікна та радіатори вже стоять</b> — у кошторисі лише відкоси, підвіконня та (за бажанням) перенос радіаторів.</div>}
                  </div></div></div>}
              </>}

              {stepId === "constr" && <div className="card"><div className="ch"><span className="cn">Конструктив</span><h2>З чого будуємо</h2></div>
                <div className="cb">
                  <label className="f">Фундамент <span className="hint">тип обирається за результатами геології</span>
                    <div className="chips">{Object.entries(FOUNDATIONS).map(([k, v]) => <button key={k} className={"chip acc" + (p.foundation === k ? " on" : "")} onClick={() => setP("foundation", k)}>{v.name}</button>)}</div>
                    <span className="hint">{(FOUNDATIONS[p.foundation] || FOUNDATIONS.strip).note}</span></label>
                  <label className="f">Матеріал стін
                    <div className="chips">{Object.entries(WALLS).map(([k, v]) => <button key={k} className={"chip acc" + (p.walls === k ? " on" : "")} onClick={() => setP("walls", k)}>{v.name}</button>)}</div>
                    <span className="hint">{(WALLS[p.walls] || WALLS.aerobloc).note}{(WALLS[p.walls] || WALLS.aerobloc).ins ? ` · утеплення ${(WALLS[p.walls] || WALLS.aerobloc).ins} мм` : " · утеплення в складі стіни"}</span></label>
                  <label className="f">Покрівля
                    <div className="chips">{Object.entries(ROOFS).map(([k, v]) => <button key={k} className={"chip acc" + (p.roof === k ? " on" : "")} onClick={() => setP("roof", k)}>{v.name}</button>)}</div>
                    <span className="hint">{(ROOFS[p.roof] || ROOFS.metal).note}</span></label>
                  <label className="f">Опалення
                    <div className="chips">{Object.entries(HEATING).map(([k, v]) => <button key={k} className={"chip acc" + (p.heating === k ? " on" : "")} onClick={() => setP("heating", k)}>{v.name}</button>)}</div>
                    <span className="hint">{(HEATING[p.heating] || HEATING.gas).note}</span></label>
                  <div className="condnote">Площа забудови ≈ {Math.round((p.area / (p.floors || 1)) * 1.1)} м² · периметр ≈ {Math.round(4 * Math.sqrt((p.area / (p.floors || 1)) * 1.1))} м · зовнішні стіни ≈ {Math.round(4 * Math.sqrt((p.area / (p.floors || 1)) * 1.1) * 2.9 * (p.floors || 1) * 0.85)} м² — з цього рахуються обсяги</div>
                </div></div>}

              {stepId === "rooms" && <div className="card"><div className="ch"><span className="cn">{mode === "house" ? "Приміщення" : "Кімнати"}</span><h2>{roomStats.living} кімн. · {roomStats.wet} с/в · {r.A.total} м²</h2></div>
                <div className="cb">
                  <label className="f">{mode === "house" ? "Житлова площа (сума приміщень)" : "Загальна площа"}
                    <div className="rr"><input type="range" min={mode === "house" ? 60 : 30} max={mode === "house" ? 400 : 180} step="5" value={p.area} onChange={e => setP("area", +e.target.value)} /><span className="rv">{p.area} м²</span></div></label>
                  <div className="g2">
                    <label className="f">Кімнат<div className="chips">{[1, 2, 3, 4, 5].map(n => <button key={n} className={"chip" + (p.roomsCount === n ? " on" : "")} onClick={() => setP("roomsCount", n)}>{n}</button>)}</div></label>
                    <label className="f">Санвузлів<div className="chips">{[1, 2, 3].map(n => <button key={n} className={"chip" + (p.bathrooms === n ? " on" : "")} onClick={() => setP("bathrooms", n)}>{n}</button>)}</div></label>
                  </div>
                  <button className="tl" onClick={() => setDetail(d => !d)}>{detail ? "Згорнути кімнати ↑" : "Налаштувати кожну кімнату окремо ↓"}</button>
                  {detail && (<>
                    <div style={{ display: "grid", gap: 10 }}>
                      {aRooms.map((rm, ri) => {
                        const t = ROOM_TYPES[rm.type];
                        const sameType = aRooms.filter(x => x.type === rm.type);
                        const label = sameType.length > 1 ? `${t.name} ${sameType.indexOf(rm) + 1}` : t.name;
                        return <div className="roomcard" key={rm.id}>
                          <div className="roomhead"><span>{t.emoji}</span><span className="rn">{label}</span>
                            <button className="rdel" onClick={() => delRoom(rm.id)} title="Видалити">✕</button></div>
                          <div className="rrow">
                            {mode === "house" && (p.floors || 1) > 1 && <label className="rf">Поверх
                              <select value={rm.lvl || 1} onChange={e => updRoom(rm.id, { lvl: +e.target.value })} style={{ width: 68 }}>
                                {Array.from({ length: p.floors || 1 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}</select></label>}
                            <label className="rf">Площа, м²<NumInput value={rm.area} def={ROOM_TYPES[rm.type].defA} min={1} max={120} step={0.5} onChange={v => updRoom(rm.id, { area: v })} /></label>
                            <label className="rf">Висота, м<NumInput value={rm.h} def={2.7} min={2.3} max={4} step={0.05} onChange={v => updRoom(rm.id, { h: v })} /></label>
                            <label className="rf">Вікон<NumInput value={rm.win} def={0} min={0} max={6} onChange={v => updRoom(rm.id, { win: v })} /></label>
                            <label className="rf">Дверей<NumInput value={rm.doors} def={0} min={0} max={4} onChange={v => updRoom(rm.id, { doors: v })} /></label>
                          </div>
                          {!t.wet && rm.type !== "balcony" && <div className="rrow">
                            <label className="rf">Стіни<select value={rm.walls} onChange={e => updRoom(rm.id, { walls: e.target.value })}>
                              {Object.entries(WALL_FIN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                            <label className="rf">Підлога<select value={rm.floor} onChange={e => updRoom(rm.id, { floor: e.target.value })}>
                              {Object.entries(FLOOR_FIN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                            <label className="rf">Стеля<select value={rm.ceil} onChange={e => updRoom(rm.id, { ceil: e.target.value })}>
                              {Object.entries(CEIL_FIN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                            <label className="rf" style={{ justifyContent: "end" }}>Тепла підлога
                              <div className={"optbox" + (rm.heatFloor ? " on" : "")} style={{ padding: "5px 9px" }} onClick={() => updRoom(rm.id, { heatFloor: !rm.heatFloor })}>
                                <div className="cbx">{rm.heatFloor ? "✓" : ""}</div></div></label>
                          </div>}
                          {t.wet && <span className="hint">Мокра зона: плитка, цементна штукатурка, гідроізоляція — автоматично</span>}
                        </div>;
                      })}
                    </div>
                    <div className="addroom">
                      {Object.entries(ROOM_TYPES).map(([k, t]) => <button key={k} onClick={() => addRoom(k)}>+ {t.emoji} {t.name}</button>)}
                    </div>
                  </>)}
                  <span className="roomsum">Разом: {r.A.total} м² · стін під оздоблення ≈ {Math.round(r.A.wallsPlaster)} м² · електроточок ≈ {r.A.pts}</span>
                </div></div>}

              {stepId === "opts" && <>
                <div className="card"><div className="ch"><span className="cn">Роботи</span><h2>Додаткові роботи</h2></div>
                  <div className="cb">
                    {Object.entries(OPT_GROUPS).map(([gk, gname]) => {
                      const list = OPTS.filter(o => (o.grp || "eng") === gk);
                      if (!list.length) return null;
                      return <div key={gk}>
                        <div className="ogcap">{gname}</div>
                        <div className="optgrid">
                          {list.map(o => {
                            const on = p.opts[o.id] ?? (o.def && p.condition === "new");
                            const d = optDeltas[o.id] || 0;
                            const qv = o.qty ? (p[o.qty.key] || o.qty.def) : null;
                            return <div key={o.id} className={"optbox" + (on ? " on" : "")} onClick={() => setP("opts", { ...p.opts, [o.id]: !on })}>
                              <div className="cbx">{on ? "✓" : ""}</div>
                              <div style={{ flex: 1 }}>
                                <div className="ot">{o.name}{o.rec === p.condition && <span className="recb">рекомендовано</span>}</div>
                                {o.hint && <div className="od">{o.hint}{o.unitHint && <span className="uhint"> · {o.unitHint}</span>}</div>}
                                {on && o.qty && <div className="oqty" onClick={e => e.stopPropagation()}>
                                  <button onClick={() => setP(o.qty.key, Math.max((qv || o.qty.def) - 1, o.qty.min))}>−</button>
                                  <span>{qv} {o.qty.unit}</span>
                                  <button onClick={() => setP(o.qty.key, Math.min((qv || o.qty.def) + 1, o.qty.max))}>+</button>
                                </div>}
                              </div>
                              {d > 0 && <span className="odelta">+{fmtM(d * mk)}</span>}
                            </div>;
                          })}
                        </div>
                      </div>;
                    })}
                  </div></div>
                <div className="card"><div className="ch"><span className="cn">＋</span><h2>Меблі, техніка й декор</h2></div>
                  <div className="cb">
                    <div className={"optbox" + (furnOn ? " on" : "")} onClick={() => setFurnOn(v => !v)} style={{ maxWidth: 480 }}>
                      <div className="cbx">{furnOn ? "✓" : ""}</div>
                      <div style={{ flex: 1 }}><div className="ot">Додати до розрахунку</div>
                        <div className="od">Окремим підсумком — не змішується з будівництвом</div></div>
                      {furnOn && <span className="odelta">+{fmtM(furnTotal)}</span>}
                    </div>
                  </div></div>
              </>}

              {stepId === "style" && <div className="card"><div className="ch"><span className="cn">§</span><h2>Рівень оздоблення</h2></div>
                <div className="cb">
                  <label className="f">Рівень оздоблення
                    <div className="chips">{Object.entries(TIERS).map(([id, t]) => <button key={id} className={"chip acc" + (p.tier === id ? " on" : "")} onClick={() => setP("tier", id)}>{t.name}</button>)}</div>
                    <button className="tl" onClick={() => setShowT(s => !s)}>{showT ? "Сховати ↑" : "Порівняти рівні ↓"}</button>
                    {showT && <div className="tt"><div className="ttr h"><div></div><div>Економ</div><div>Стандарт</div><div>Преміум</div></div>
                      {TIER_TABLE.map(t => <div className="ttr" key={t.row}><div>{t.row}</div><div>{t.econom}</div><div>{t.standart}</div><div>{t.premium}</div></div>)}</div>}</label>
                </div></div>}

              <div className="wnav no-print">
                {step > 0 ? <button className="btn" onClick={() => goto(step - 1)}>← Назад</button> : <span />}
                <button className="btn blue" onClick={next}>{step >= STEPS.length - 1 ? "До кошторису →" : "Далі →"}</button>
              </div>
            </div>

            <div className="rail no-print">
              <div className="live">
                <div className="lk"><span className="dot" />{r.region.name} · {r.itemCount} позицій</div>
                <div className="lv">{fmtM(lowA)} — <em>{fmtM(highA)}</em></div>
                <div className="ls">{fmt(r.perM2 * mk)} грн/м² · ~{r.months} міс.</div>
                {usd && <div className="usdline">≈ ${fmt(r.low * mk / usd)}–${fmt(r.high * mk / usd)} <span className="usdrate">курс НБУ {usd.toFixed(2)} ₴/${usdDate ? " · " + usdDate : ""}</span></div>}
                {lastChange && <div className="whychange" key={lastChange.t}>
                  <div className="wc-h">{lastChange.delta > 0 ? "▲" : "▼"} {lastChange.delta > 0 ? "+" : "−"}{fmtM(Math.abs(lastChange.delta) * mk)} грн — {lastChange.label}</div>
                  {lastChange.drivers.map((d, i) => <div className="wc-d" key={i}>
                    {d.d > 0 ? "+" : "−"}{fmt(Math.abs(d.d) * mk)} · {d.label}
                    {d.qBefore !== d.qAfter && <span className="wc-q"> ({fmt(d.qBefore)}→{fmt(d.qAfter)} {d.unit})</span>}
                  </div>)}
                </div>}
                <div className="lr"><span>Роботи</span><span>{fmtM(r.rows.reduce((a, x) => a + x.work, 0) * mk)}</span></div>
                <div className="lr"><span>Матеріали</span><span>{fmtM(r.rows.reduce((a, x) => a + x.matSum, 0) * mk)}</span></div>
                {furnOn && <div className="lr"><span>Комплектація</span><span>{fmtM(furnTotal)}</span></div>}
                {furnOn && <div className="lr" style={{ fontWeight: 600 }}><span>Разом з меблями</span><span>{fmtM(r.total * mk + furnTotal)}</span></div>}
                {Object.keys(TIERS).filter(t => t !== p.tier).map(t => (
                  <div className="lr" key={t} style={{ cursor: "pointer" }} onClick={() => setP("tier", t)}>
                    <span>якби {TIERS[t].name}</span><span>{fmtM(cmp[t] * mk)}</span></div>))}
                <button className="livebtn" onClick={() => { setView("sheet"); window.scrollTo(0, 0); }}>Показати кошторис →</button>
              </div>
              <div className={"fc " + (r.budgetFit ? "ok" : "no")}>
                {r.budgetFit ? <>✓ Вписується у «{r.budgetName}»</> : <>⚠ Перевищує «{r.budgetName}» на {fmtM(budgetAdvice?.over || 0)} грн</>}</div>
              {budgetAdvice && <button className="adv-open" onClick={() => setShowBudget(true)}>💡 Як зменшити вартість →</button>}
              <button className="sharebtn" onClick={shareLink}>{shared ? "✓ Посилання скопійовано" : "🔗 Поділитись розрахунком"}</button>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="sharebtn" style={{ flex: 1 }} onClick={saveVariant}>💾 Зберегти варіант</button>
                {variants.length > 0 && <button className="sharebtn" style={{ flex: 1 }} onClick={() => { setView("variants"); window.scrollTo(0, 0); }}>⇄ Варіанти ({variants.length})</button>}
              </div>
            </div>
          </div>

          {step === 0 && <div className="ground no-print">
            <div className="whyus">
              {[["📡", "Живі ринкові розцінки", "вартість робіт оновлюється щоночі з rabotniki.ua, джерело вказане в кожній позиції"],
                ["🧾", "Повний перелік робіт", "від геології та документів до введення в експлуатацію — нічого не «забувається»"],
                ["📐", "Обсяги з геометрії", "площі стін, покрівлі, периметр рахуються з ваших параметрів, а не з середніх по ринку"],
                ["🧮", "Excel і PDF", "кошторис вивантажується для власних розрахунків і коригування"]].map(([i, t, d]) => (
                <div className="wu" key={t}><span className="wu-i">{i}</span><div><div className="wu-t">{t}</div><div className="wu-d">{d}</div></div></div>))}
            </div>
            <div className="faq">
              <h3>Методика розрахунку</h3>
              {[["Звідки беруться ціни?", "Вартість робіт — середньоринкові дані з rabotniki.ua (Київ), збираються щоночі; у кожній позиції видно джерело, кількість пропозицій і дату. Ціни матеріалів збираються з epicentrk.ua. Позиції без ринкового джерела позначені β — це експертна оцінка, яка уточнюється."],
                ["Наскільки точний результат?", "Це попередній розрахунок з ринковою вилкою «мінімум — максимум», а не фіксована ціна. Реальна вартість залежить від геології, складності проєкту, сезону та кваліфікації бригади."],
                ["Як рахуються обсяги?", "З геометрії обʼєкта: площа забудови, периметр, площа зовнішніх стін і покрівлі виводяться з площі та поверховості; для квартири — з площі кожної кімнати окремо. Тому зміна будь-якого параметра одразу змінює кошторис."],
                ["Що не враховано?", "Вартість ділянки, меблі й техніка (окремий блок), нестандартні архітектурні рішення, подорожчання матеріалів під час будівництва та непередбачені роботи — на них зазвичай закладають резерв 10–15%."],
                ["Чому геологія стоїть до фундаменту?", "Тип фундаменту визначається ґрунтом і рівнем ґрунтових вод. Помилка тут найдорожча: переробити фундамент під готовою коробкою неможливо. Тому геологія — в Етапі 0."],
                ["Чи можна користуватись для власних розрахунків?", "Так — кошторис вивантажується в Excel з усіма позиціями, обсягами та цінами за одиницю, тож його можна коригувати під свої розцінки."]].map(([qq, aa]) => (
                <details key={qq}><summary>{qq}</summary><p>{aa}</p></details>))}
            </div>
          </div>}

          {showBudget && budgetAdvice && <div className="modal-bg no-print" onClick={() => setShowBudget(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-h">
                <div>
                  <div className="modal-t">Як залишитись у бюджеті</div>
                  <div className="modal-s">Перевищення «{budgetAdvice.budgetName}» на <b>{fmtM(budgetAdvice.over * mk)} грн</b>. Ось як його прибрати — від найвигіднішого. Оберіть, що для вас не критично:</div>
                </div>
                <button className="modal-x" onClick={() => setShowBudget(false)}>✕</button>
              </div>
              {budgetAdvice.plan.length > 0 && <div className="modal-plan">
                ★ Достатньо {budgetAdvice.plan.length === 1 ? "одного кроку нижче" : `${budgetAdvice.plan.length} кроків нижче`}, щоб вписатись{budgetAdvice.covered ? "" : ". Якщо цього замало — розгляньте менший обсяг або площу."}
              </div>}
              <div className="modal-list">
                {budgetAdvice.cands.map((c, i) => <div className={"madv" + (budgetAdvice.plan.includes(c) ? " key" : "")} key={i}>
                  <div className="madv-top">
                    {budgetAdvice.plan.includes(c) && <span className="madv-star">★</span>}
                    <span className="madv-t">{c.label}</span>
                    <span className="madv-s">−{fmtM(c.save * mk)} грн</span>
                  </div>
                  <div className="madv-w">{c.why}</div>
                  <button className="madv-b" onClick={() => { applyAdvice(c); if (c.save >= budgetAdvice.over) setShowBudget(false); }}>Застосувати цей варіант</button>
                </div>)}
              </div>
              <div className="modal-foot">Це поради, а не обов'язкові дії — застосовуйте лише те, що прийнятне для вас. Усе можна повернути.</div>
            </div>
          </div>}

          <div className="mobilebar no-print">
            <div className="mb-sum"><span className="mb-v">{fmtM(lowA)} — {fmtM(highA)}</span><span className="mb-s">{fmt(r.perM2 * mk)} грн/м² · ~{r.months} міс</span></div>
            <button className="mb-btn" onClick={next}>{step >= STEPS.length - 1 ? "Кошторис →" : "Далі →"}</button>
          </div>
          </>);
        })()}

        {view === "variants" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontFamily: "Unbounded", fontSize: 20 }}>Порівняння варіантів</h2>
            <button className="btn" onClick={() => setView("form")}>← Назад</button>
          </div>
          <div className="vgrid">
            <div className="vcard current">
              <div className="vname">Поточний</div>
              <div className="vsum">{fmtM(r.low * mk)} — {fmtM(r.high * mk)}</div>
              <div className="vmeta">{Math.round(r.A.total)} м² · {r.tier.name}</div>
              <div className="vmeta">{r.months} міс · {r.itemCount} позицій{furnOn ? ` · меблі +${fmtM(furnTotal)}` : ""}</div>
            </div>
            {variants.map(v => {
              const vc = variantCalc(v);
              return <div className="vcard" key={v.id}>
                <div className="vname">{v.name} <span className="hint">· {v.savedAt}</span></div>
                <div className="vsum">{fmtM(vc.low * mk)} — {fmtM(vc.high * mk)}</div>
                <div className="vmeta">{Math.round(vc.A.total)} м² · {vc.tier.name}</div>
                <div className="vmeta">{vc.months} міс · {vc.itemCount} позицій</div>
                <div className="vdelta">{vc.total > r.total ? "+" : "−"}{fmtM(Math.abs(vc.total - r.total) * mk)} до поточного</div>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  <button className="btn" style={{ flex: 1 }} onClick={() => restoreVariant(v)}>Відкрити</button>
                  <button className="btn" onClick={() => delVariant(v.id)}>🗑</button>
                </div>
              </div>;
            })}
          </div>
          <p className="hint" style={{ marginTop: 14 }}>Зберігається до 6 варіантів на цьому пристрої. Розрахунки оновлюються за актуальними цінами.</p>
        </div>}

        {view === "leads" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontFamily: "Unbounded", fontSize: 20 }}>Журнал лідів</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={loadLeads}>Оновити</button>
              <button className="btn" onClick={() => setView("form")}>← Назад</button>
            </div>
          </div>
          {leadsErr && <div className="fc no">{leadsErr}</div>}
          {!leadsErr && !leadsRows && <div className="hint">Завантаження…</div>}
          {leadsRows && leadsRows.length === 0 && <div className="hint">Поки що жодного ліда.</div>}
          {leadsRows && leadsRows.length > 0 && <div className="card" style={{ overflowX: "auto" }}>
            <table className="ltable">
              <thead><tr><th>Дата</th><th>Імʼя</th><th>Контакт</th><th>Обʼєкт</th><th>Оцінка</th><th>Коментар</th></tr></thead>
              <tbody>
                {leadsRows.map(l => <tr key={l.id}>
                  <td>{new Date(l.created_at).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                  <td><b>{l.name}</b></td>
                  <td><a href={"tel:" + l.phone}>{l.phone}</a></td>
                  <td>{l.summary}{l.options ? " · " + l.options : ""}{l.furniture ? " · меблі " + l.furniture : ""}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{l.estimate}</td>
                  <td>{l.msg}</td>
                </tr>)}
              </tbody>
            </table>
          </div>}
        </div>}


        {view === "sheet" && <div className="sheet">
          <div className="cover">
            <div className="dochead">
              <div className="dh-l">
                <div className="dh-no">№ {docNo}</div>
                <div className="dh-d">видано {today} · дійсна до {validUntil}</div>
              </div>
              {qr && <div className="dh-qr"><img src={qr} alt="QR" /><span>інтерактивна версія</span></div>}
            </div>
            {BETA && <div className="stamp">БЕТА · очікує перевірки експерта</div>}
            <div className="ceye">Попередній розрахунок вартості</div>
            <h1>{mode === "flat" ? `Ремонт ${Math.round(r.A.total)} м²` : `Будинок ${p.area} м², ${p.floors} пов.`}</h1>
            <div className="csub">{roomStats.living} кімн. · {r.A.baths} с/в · {aRooms.length} приміщень · {r.tier.name}</div>
            <div className="cmeta">{r.region.name} · {today} · {r.itemCount} позицій кошторису</div>
          </div>



          <div className="snums">
            <div className="sn2"><div className="k">Вартість · ринкова вилка</div><div className="v">{fmtM(r.low * mk)} — <em>{fmtM(r.high * mk)}</em></div></div>
            <div className="sn2"><div className="k">Грн / м²{usd ? " · $ екв." : ""}</div><div className="v"><em>{fmt(r.perM2 * mk)}</em>{usd && <span className="usdsm"> ≈ ${fmt(r.perM2 * mk / usd)}</span>}</div></div>
            <div className="sn2"><div className="k">Строк</div><div className="v"><em>{r.months}</em> міс.</div>
              <div className="k" style={{ marginTop: 4 }}>старт {fmtD(sDate)} → здача ≈ {fmtD(finishDate)}</div></div>
          </div>

          <div className="confstrip">
            <span className="timeline">📅 старт {fmtD(sDate)} → здача ≈ {fmtD(finishDate)} · {r.weeks} тижнів</span>
            {r.conf > 0 && <span className="confb">✓ {r.conf}% вартості робіт — живі ринкові ціни (rabotniki.ua{live ? ", " + live.updated : ""})</span>}
            {lmat && <span className="confb">✓ матеріали: живі ціни Епіцентру, {lmat.updated}</span>}
            {BETA && r.betaCount > 0 && <span className="vchip" title="Розцінки очікують перевірки експерта">β {r.betaCount} позицій неперевірено</span>}
            <button className="tl" onClick={() => setShowCmp(s => !s)}>{showCmp ? "Сховати порівняння ↑" : "Порівняти рівні ↓"}</button>
          </div>
          {showCmp && <div className="cmp">
            {Object.entries(TIERS).map(([t, tv]) => <div key={t} className={"cmpc" + (t === p.tier ? " on" : "")} onClick={() => setP("tier", t)}>
              <div className="cmpn">{tv.name}{t === p.tier ? " · обрано" : ""}</div>
              <div className="cmpv">{fmtM(cmp[t] * mk)} грн</div>
              <div className="cmpd">{t === p.tier ? "\u00a0" : (cmp[t] > cmp[p.tier] ? "+" : "−") + fmtM(Math.abs(cmp[t] - cmp[p.tier]) * mk) + " грн"}</div>
            </div>)}
          </div>}



          <div className="filterbar no-print">
            <input className="searchin" value={q} onChange={e => setQ(e.target.value)} placeholder="🔎 Пошук: плитка, кабель, двері…" />
            <button className={"fchip" + (!grpFilter ? " on" : "")} onClick={() => setGrpFilter(null)}>Всі етапи</button>
            {usedGroups.map(g => <button key={g} className={"fchip" + (grpFilter === g ? " on" : "")} onClick={() => setGrpFilter(grpFilter === g ? null : g)}>{GROUPS[g]}</button>)}
            <button className="fchip x" onClick={() => { const all = {}; r.rows.forEach(x => all[x.id] = true); setOpn(Object.keys(opn).length === r.rows.length ? {} : all); }}>
              {Object.keys(opn).length === r.rows.length ? "Згорнути все" : "Розгорнути все"}</button>
          </div>

          {displayRows.map(st => <div key={st.id} className={"stage" + ((opn[st.id] || ql) ? " open" : "") + (st.off ? " off" : "")}>
            <div className="sth" onClick={() => setOpn(o => ({ ...o, [st.id]: !o[st.id] }))}>
              <span className="st-caret">▸</span>
              <span className="st-grp">{GROUPS[st.group]}</span>
              <span className="st-name">{st.name.replace(/^Етап \d+[аб]? · /, "").replace("Наскрізне · ", "")}</span>
              {st.sk !== 1 && <span className="st-badge">{st.sk > 1 ? "+" : ""}{Math.round((st.sk - 1) * 100)}%</span>}
              {st.weeks > 0 && <span className="st-wk">{st.weeks}т</span>}
              <span className="st-tot">{st.off ? <s>{fmt(st.total * mk)}</s> : fmt(st.total * mk)}</span></div>
            {(opn[st.id] || ql) && <div className="stb"><div className="scope">{st.scope}</div>
              {st.items.map(it => <div className="item" key={it.key}>
                <div className="itop"><span className="ilbl">{it.label}{!it.ver && <span className="vchip" title="Розцінка очікує перевірки експерта">β</span>}</span><span className="iqty">{fmt(it.qty)} {it.unit} · <b>{fmt(it.total * mk)} грн</b></span></div>
                <div className="segrow">
                  <span className="seglbl">Робота</span>
                  {it.opts.length > 1 ? (<>
                    <div className="seg">
                      {it.opts.map((o, oi) => {
                        const pw = Math.round(o.price * r.tier.kWork * r.region.k * (st.sk || 1) * mk);
                        const short = o.name.replace("Мінімальна ринкова", "Мінімальна").replace("Середньоринкова", "Середня").replace("Верхній сегмент", "Верхня");
                        return <button key={oi} className={"segbtn" + (it.sel === oi ? " on" : "")} onClick={() => setSel(s => ({ ...s, [it.key]: oi }))}>
                          <span className="sgn">{short}</span><span className="sgp">{fmt(pw)}</span></button>;
                      })}
                    </div>
                    <span className="unitlbl">грн/{it.unit}</span>
                  </>) : (
                    <span className="sp1">{fmt(it.price * mk)} грн/{it.unit} <span className="hint">· кураторська оцінка</span></span>
                  )}
                </div>
                {it.lw && <div className="srcline"><a href={it.lw.url} target="_blank" rel="noreferrer">rabotniki.ua</a> · {it.lw.count} пропозицій · «{it.lw.name}» · <span className="livetag">● live {live?.updated}</span>{(() => { const t = trend(it.liveKey); return t ? <span className={"trnd " + (t > 0 ? "up" : "dn")}> {t > 0 ? "▲" : "▼"} {Math.abs(t)}% за 30 дн</span> : null; })()}</div>}
                <div className="segrow">
                  <span className="seglbl">Матеріал</span>
                  {it.matOpts ? (<>
                    <div className="seg">
                      {it.matOpts.map((m, mi) => <button key={mi} className={"segbtn" + (it.matSel === mi ? " on" : "")} onClick={() => setSel(s => ({ ...s, ["m:" + it.key]: mi }))}>
                        <span className="sgn">{m.name}</span><span className="sgp">{fmt(Math.round(m.price * r.region.k * mk))}</span></button>)}
                    </div>
                    <span className="unitlbl">грн/{it.unit}</span>
                  </>) : (
                    <span className="sp1">{fmt(it.mat * mk)} грн/{it.unit} <span className="hint">· орієнтовно</span></span>
                  )}
                </div>
                {it.matChosen && <div className="srcline">{it.matChosen.note ? it.matChosen.note + " · " : ""}<a href={it.matChosen.url} target="_blank" rel="noreferrer">Епіцентр →</a>{it.matChosen.live
                  ? <> · «{it.matChosen.liveName}» · {it.matChosen.count} товарів · <span className="livetag">● live {lmat?.updated}</span></>
                  : <> · орієнтовна оцінка, уточнюється при закупівлі</>}</div>}
              </div>)}
            </div>}
          </div>)}

          <div className={"fc " + (r.budgetFit ? "ok" : "no")} style={{ borderRadius: 0, padding: "14px 28px", borderBottom: "1px solid var(--line)" }}>
            {r.budgetFit ? <>✓ Вписується у «{r.budgetName}»</> : <>⚠ Перевищує «{r.budgetName}»</>}</div>

          {furnOn && <div className="furntotals">
            <span>Ремонт: <b>{fmtM(r.total * mk)}</b> грн</span>
            <span>Комплектація: <b>{fmtM(furnTotal)}</b> грн</span>
            <span className="ft-sum">Разом: <b>{fmtM(r.total * mk + furnTotal)}</b> грн</span>
          </div>}

          {furnOn && <div className="furnsec">
            <h3>Комплектація меблями, технікою та декором</h3>
            <p className="hint" style={{ marginBottom: 14 }}>Окремий підсумок — не входить у вартість ремонту. Ціни — орієнтовні оцінки рівня Епіцентр/Центр меблів; уточнюються при закупівлі.</p>
            {FURN_GROUPS.map(g => {
              const items = furnRows.filter(f => f.group === g);
              if (!items.length) return null;
              const gTotal = items.reduce((a, x) => a + x.total, 0);
              return <div className="fgroup" key={g}>
                <div className="fghead"><span>{g}</span><span className="fgsum">{gTotal ? fmt(gTotal) + " грн" : "—"}</span></div>
                {items.map(f => <div className={"frow" + (f.on ? "" : " off")} key={f.id}>
                  <div className="fcheck" onClick={() => setFurn(f.id, { on: !f.on })}>{f.on ? "✓" : ""}</div>
                  <div className="fph"><img src={"/furniture/" + f.id + ".jpg"} alt="" onError={e => { e.target.style.display = "none"; }} /><span>{f.ph}</span></div>
                  <div className="fbody"><div className="fname">{f.name}</div>
                    <div className="srcline" style={{ margin: 0 }}><a href={f.url} target="_blank" rel="noreferrer">Епіцентр →</a></div></div>
                  <div className="fqty no-print">
                    <button onClick={() => setFurn(f.id, { qty: Math.max(f.qty - 1, 1) })}>−</button>
                    <span>{f.qty} {f.unit}</span>
                    <button onClick={() => setFurn(f.id, { qty: f.qty + 1 })}>+</button>
                  </div>
                  <div className="seg fseg">
                    {["Економ", "Стандарт", "Преміум"].map((tn, ti2) => <button key={ti2} className={"segbtn" + (f.ti === ti2 ? " on" : "")} onClick={() => setFurn(f.id, { tier: ti2 })}>
                      <span className="sgn">{tn}</span><span className="sgp">{fmt(f.t[ti2])}</span></button>)}
                  </div>
                  <div className="ftot">{f.on ? fmt(f.total) : "—"}</div>
                </div>)}
              </div>;
            })}
            <div className="furnsum">Разом комплектація: <b>{fmt(furnTotal)} грн</b></div>
          </div>}



          <div className="inex"><h3>Що враховано в розрахунку</h3>
            <ul className="inc">{INCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul>
            <ul className="exc">{EXCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul></div>



          <div className="terms"><h3>Умови</h3>
            Це попередній розрахунок вартості, а не комерційна пропозиція та не оферта. Точні цифри визначаються проєктом, геологією та фактичними обсягами. {live ? `Вартість робіт — середньоринкові дані rabotniki.ua станом на ${live.updated}. ` : ""}{lmat ? `Матеріали — epicentrk.ua станом на ${lmat.updated}. ` : "Матеріали — орієнтовні оцінки. "}{BETA ? "Версія БЕТА: частина розцінок позначена β. " : ""}Рекомендований резерв на непередбачені роботи — 10–15%.</div>

          <div className="sf"><p className="note">ПРОПОЗИЦІЯ.БУД · {today} · {lead.name || "—"} · {lead.phone || "—"}{leadSent === "ok" && <span style={{ color: "var(--ok)" }}> · ✓ заявку передано команді</span>}</p>
            <div className="actions no-print">
              <button className="btn" onClick={() => { setView("form"); window.scrollTo(0, 0); }}>← Параметри</button>
              <button className="btn" onClick={exportXlsx}>Excel ↓</button>
              <button className="btn blue" onClick={() => { const all = {}; r.rows.forEach(x => all[x.id] = true); setOpn(all); setTimeout(() => window.print(), 150); }}>Зберегти PDF</button>
            </div></div>
        </div>}
      </div>

      <footer className="footer no-print">
        <div className="ft">
          <div>
            <div className="ft-logo">ПРОПОЗИЦІЯ<span>.БУД</span></div>
            <div className="ft-sub">Калькулятор вартості будівництва та ремонту</div>
          </div>
          <div className="ft-col">
            <div className="ft-h">Контакти</div>
            <a href={"tel:" + CONTACTS.phone.replace(/\s/g, "")}>{CONTACTS.phone}</a>
            <a href={"mailto:" + CONTACTS.email}>{CONTACTS.email}</a>
            <span>{CONTACTS.city}</span>
          </div>
          <div className="ft-col">
            <div className="ft-h">Джерела даних</div>
            <span>Роботи — rabotniki.ua (Київ)</span>
            <span>Матеріали — epicentrk.ua</span>
            <span>Оновлення — щоночі</span>
          </div>
        </div>
        <div className="ft-legal">© {new Date().getFullYear()} ПРОПОЗИЦІЯ.БУД · {CONTACTS.company} · Всі права захищені. Розцінки на роботи: rabotniki.ua (публічні дані) · Матеріали: орієнтир Епіцентр.</div>
      </footer>
    </div>
  );
}
