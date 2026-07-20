import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { css } from "./styles.js";
import {
  BETA, REGIONS, TIERS, TIER_TABLE, STYLE_MODS, GROUPS,
  ROOM_TYPES, WALL_FIN, FLOOR_FIN, CEIL_FIN, newRoom, defaultRooms, buildAgg,
  FLAT_STAGES, HOUSE_STAGES, FLAT_OPTS, HOUSE_OPTS, OPT_GROUPS,
  BUDGETS, PAYMENT, INCLUDES, EXCLUDES, MATS, MATS_CHECKED, FURNITURE, FURN_GROUPS,
} from "./data.js";

const VILKA = 0.12, OVERLAP = 0.85;

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

function calc(mode, p, rooms, selections, live) {
  const region = REGIONS.find(x => x.id === p.region) || REGIONS[0];
  const tier = TIERS[p.tier];
  const style = STYLE_MODS[p.style] || STYLE_MODS["Сучасний"];
  const A = mode === "flat" ? buildAgg(rooms, p) : { total: p.area, baths: p.bathrooms };
  const stages = (mode === "flat" ? FLAT_STAGES : HOUSE_STAGES).filter(s => !(s.cond && !s.cond(p)));
  let wo = 0, betaCount = 0;
  const rows = stages.map(s => {
    const sk = style.mods[s.id] || 1;
    const items = s.items.map(it => {
      const qty = Math.round(it.q(A, p) * 10) / 10;
      if (!qty || qty <= 0) return null;
      const baseW = it.dynW ? it.dynW(p) : it.w;
      const { opts, def, lw } = buildOpts(it, live, baseW);
      const sel = selections[it.k] ?? def;
      const o = opts[Math.min(sel, opts.length - 1)];
      const pr = Math.round(o.price * tier.kWork * region.k * sk);
      const matOpts = it.mats ? MATS[it.mats] : null;
      const matDef = matOpts ? Math.min({ econom: 0, standart: 1, premium: 2 }[p.tier] ?? 1, matOpts.length - 1) : 0;
      const matSel = matOpts ? (selections["m:" + it.k] ?? matDef) : 0;
      const matChosen = matOpts ? matOpts[Math.min(matSel, matOpts.length - 1)] : null;
      const mt = matOpts ? Math.round(matChosen.price * region.k) : Math.round(it.m * tier.kMat * region.k * sk);
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
    return { id: s.id, group: s.grp, name: s.name, scope: s.scope, sk, items, weeks: wk, startWeek: sw,
      total: items.reduce((a, b) => a + b.total, 0), work: items.reduce((a, b) => a + b.work, 0), matSum: items.reduce((a, b) => a + b.matSum, 0) };
  }).filter(Boolean);
  const total = rows.reduce((a, r) => a + r.total, 0);
  const allItems = rows.flatMap(r => r.items);
  let low = allItems.reduce((a, i) => a + i.lowT, 0);
  let high = allItems.reduce((a, i) => a + i.highT, 0);
  low = Math.min(low, total * 0.98); high = Math.max(high, total * 1.02);
  const workSum = allItems.reduce((a, i) => a + i.work, 0);
  const liveWork = allItems.filter(i => i.lw).reduce((a, i) => a + i.work, 0);
  const conf = workSum ? Math.round((liveWork / workSum) * 100) : 0;
  const weeks = Math.round(rows.reduce((a, r) => a + r.weeks, 0) * OVERLAP);
  const budget = BUDGETS[mode].find(b => b.id === p.budget);
  const sd = Object.keys(style.mods).length ? Math.round((total / rows.reduce((a, r) => a + r.total / (r.sk || 1), 0) - 1) * 100) : 0;
  return { rows, total, region, tier, style, styleDelta: sd, low, high, conf, betaCount, A,
    perM2: Math.round(total / Math.max(A.total, 1)), weeks, months: Math.round((weeks / 4.33) * 10) / 10,
    budgetFit: budget ? low <= budget.max : true, budgetName: budget?.name || "", totalWeeks: Math.ceil(wo), itemCount: allItems.length };
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

const initF = { region: "kyiv", roomsCount: 2, bathrooms: 1, condition: "new", tier: "standart", style: "Сучасний", budget: "f3",
  floor: 5, lift: "pass", acCount: 1, openingCount: 1, ledLen: 6, partArea: 12, area: 65, opts: { slopes: true } };
const initH = { region: "kyiv", area: 150, floors: 2, roomsCount: 3, bathrooms: 2, condition: "new", tier: "standart", style: "Сучасний", budget: "h3", plot: 8, opts: {} };

export default function App() {
  const [mode, setMode] = useState("flat");
  const [flat, setFlat] = useState(initF);
  const [house, setHouse] = useState(initH);
  const [rooms, setRooms] = useState(() => defaultRooms(2, 1, 65));
  const [roomsCustom, setRoomsCustom] = useState(false);
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
        if (saved.m) setMode(saved.m);
        if (saved.d != null) setDetail(saved.d);
        if (saved.fo != null) setFurnOn(saved.fo);
        if (saved.sd) setStartDate(saved.sd);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("pb_state3", JSON.stringify({ v: 3, m: mode, f: flat, h: house, r: rooms, d: detail, fo: furnOn, sd: startDate })); } catch {}
  }, [mode, flat, house, rooms, detail, furnOn, startDate]);

  useEffect(() => { fetch("/price-history.json").then(x => x.ok ? x.json() : null).then(h => { if (Array.isArray(h) && h.length > 1) setHist(h); }).catch(() => {}); }, []);
  useEffect(() => { fetch("/prices.json").then(r => r.ok ? r.json() : null).then(d => { if (d?.updated && Object.keys(d.works || {}).length) setLive(d); }).catch(() => {}); }, []);

  const p = mode === "flat" ? flat : house;
  const setP = (k, v) => {
    (mode === "flat" ? setFlat : setHouse)(s => ({ ...s, [k]: v }));
    if (mode === "flat" && !roomsCustom && ["roomsCount", "bathrooms", "area"].includes(k)) {
      const next = { ...flat, [k]: v };
      setRooms(defaultRooms(next.roomsCount, next.bathrooms, next.area));
    }
  };
  const toggleOpt = id => setP("opts", { ...p.opts, [id]: !p.opts[id] });
  const r = useMemo(() => calc(mode, p, rooms, sel, live), [mode, p, rooms, sel, live]);

  const tierIdx = { econom: 0, standart: 1, premium: 2 }[p.tier] ?? 1;
  const furnRows = useMemo(() => {
    if (!furnOn) return [];
    return FURNITURE.map(f => {
      const fp = { ...p, rooms: p.roomsCount, windowsCount: r.A.wins || 3 };
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
    for (const t of Object.keys(TIERS)) out[t] = calc(mode, { ...p, tier: t }, rooms, sel, live).total;
    return out;
  }, [mode, p, rooms, sel, live]);

  // Дельта ціни кожної опції: калькуляція з опцією і без
  const optDeltas = useMemo(() => {
    const out = {};
    const list = (mode === "flat" ? FLAT_OPTS : HOUSE_OPTS).filter(o => !o.onlyCond || o.onlyCond === p.condition);
    for (const o of list) {
      const on = p.opts[o.id] ?? (o.def && p.condition === "new");
      const totalWith = on ? r.total : calc(mode, { ...p, opts: { ...p.opts, [o.id]: true } }, rooms, sel, live).total;
      const totalWithout = on ? calc(mode, { ...p, opts: { ...p.opts, [o.id]: false } }, rooms, sel, live).total : r.total;
      out[o.id] = Math.max(totalWith - totalWithout, 0);
    }
    return out;
  }, [mode, p, rooms, sel, live, r.total]);

  const mk = 1 + (admin ? margin : 0) / 100;
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

  const shareLink = () => {
    try {
      const payload = { v: 3, m: mode, f: flat, h: house, r: rooms, d: detail, fo: furnOn, sd: startDate };
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

  const exportXlsx = () => {
    const wsData = [
      ["ПРОПОЗИЦІЯ.БУД — Кошторис" + (BETA ? " (БЕТА)" : ""), "", "", "", "", "", ""],
      [mode === "flat" ? `Ремонт ${r.A.total} м², кімнат: ${rooms.filter(x => x.type !== "bath" && x.type !== "wc" && x.type !== "hall" && x.type !== "balcony").length}` : `Будинок ${p.area} м²`, r.region.name, r.tier.name, p.style, "", "", today],
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
  const usedGroups = [...new Set(r.rows.map(x => x.group))];
  const updRoom = (id, patch) => { setRoomsCustom(true); setRooms(rs => rs.map(x => x.id === id ? { ...x, ...patch } : x)); };
  const delRoom = id => { setRoomsCustom(true); setRooms(rs => rs.filter(x => x.id !== id)); };
  const addRoom = t => { setRoomsCustom(true); setRooms(rs => [...rs, newRoom(t)]); };

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
            ? [{ id: "obj", t: "Обʼєкт" }, { id: "rooms", t: "Кімнати" }, { id: "opts", t: "Роботи" }, { id: "style", t: "Стиль і бюджет" }]
            : [{ id: "obj", t: "Будинок" }, { id: "opts", t: "Роботи" }, { id: "style", t: "Стиль і бюджет" }];
          const stepId = STEPS[Math.min(step, STEPS.length - 1)].id;
          const goto = i => { setStep(Math.max(0, Math.min(i, STEPS.length - 1))); window.scrollTo({ top: 0, behavior: "smooth" }); };
          const next = () => step >= STEPS.length - 1 ? (setView("lead"), window.scrollTo(0, 0)) : goto(step + 1);
          return (<>
          {step === 0 && <div className="hero">
            <h1>{mode === "flat" ? "Ремонт під ключ — з ціною одразу" : "Будинок — з ціною та строком одразу"}</h1>
            <p>{mode === "flat" ? "Кошторис рахується по кожній кімнаті окремо" : "Кожен параметр змінює розрахунок у реальному часі"}</p>
            {live ? <div className="badge live">роботи: ціни rabotniki.ua від {live.updated} · матеріали: орієнтовні</div>
              : <div className="badge demo">демо · ціни орієнтовні</div>}
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

          <div className="wsteps no-print">
            {STEPS.map((s, i) => <button key={s.id} className={"wstep" + (i === step ? " on" : "") + (i < step ? " done" : "")} onClick={() => goto(i)}>
              <span className="wn">{i < step ? "✓" : i + 1}</span>{s.t}</button>)}
          </div>

          <div className="grid">
            <div style={{ display: "grid", gap: 16 }}>

              {stepId === "obj" && <>
                <div className="card"><div className="ch"><span className="cn">{mode === "flat" ? "Обʼєкт" : "Будинок"}</span><h2>Де і що ремонтуємо</h2></div>
                  <div className="cb">
                    <div className="g2">
                      <label className="f">Локація
                        <select value={p.region} onChange={e => setP("region", e.target.value)}>
                          {REGIONS.map(x => <option key={x.id} value={x.id}>{x.name}{x.k !== 1 ? ` (−${Math.round((1 - x.k) * 100)}%)` : ""}</option>)}</select></label>
                      {mode === "flat"
                        ? <label className="f">Поверх / ліфт
                            <div style={{ display: "flex", gap: 8 }}>
                              <input type="number" min="1" max="30" value={p.floor} onChange={e => setP("floor", +e.target.value)} style={{ width: 70 }} />
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

              {stepId === "rooms" && <div className="card"><div className="ch"><span className="cn">Кімнати</span><h2>{rooms.length} кімнат · {r.A.total} м²</h2></div>
                <div className="cb">
                  <label className="f">Загальна площа
                    <div className="rr"><input type="range" min="30" max="180" step="5" value={p.area} onChange={e => setP("area", +e.target.value)} /><span className="rv">{p.area} м²</span></div></label>
                  <div className="g2">
                    <label className="f">Кімнат<div className="chips">{[1, 2, 3, 4, 5].map(n => <button key={n} className={"chip" + (p.roomsCount === n ? " on" : "")} onClick={() => setP("roomsCount", n)}>{n}</button>)}</div></label>
                    <label className="f">Санвузлів<div className="chips">{[1, 2, 3].map(n => <button key={n} className={"chip" + (p.bathrooms === n ? " on" : "")} onClick={() => setP("bathrooms", n)}>{n}</button>)}</div></label>
                  </div>
                  {roomsCustom && <span className="hint">⚠️ Кімнати налаштовані вручну — слайдери вище більше не перегенеровують список</span>}
                  <button className="tl" onClick={() => setDetail(d => !d)}>{detail ? "Згорнути кімнати ↑" : "Налаштувати кожну кімнату окремо ↓"}</button>
                  {detail && (<>
                    <div style={{ display: "grid", gap: 10 }}>
                      {rooms.map(rm => {
                        const t = ROOM_TYPES[rm.type];
                        return <div className="roomcard" key={rm.id}>
                          <div className="roomhead"><span>{t.emoji}</span><span className="rn">{t.name}</span>
                            <button className="rdel" onClick={() => delRoom(rm.id)} title="Видалити">✕</button></div>
                          <div className="rrow">
                            <label className="rf">Площа, м²<input type="number" min="1" max="80" step="0.5" value={rm.area} onChange={e => updRoom(rm.id, { area: +e.target.value })} /></label>
                            <label className="rf">Висота, м<input type="number" min="2.3" max="4" step="0.05" value={rm.h} onChange={e => updRoom(rm.id, { h: +e.target.value })} /></label>
                            <label className="rf">Вікон<input type="number" min="0" max="6" value={rm.win} onChange={e => updRoom(rm.id, { win: +e.target.value })} /></label>
                            <label className="rf">Дверей<input type="number" min="0" max="4" value={rm.doors} onChange={e => updRoom(rm.id, { doors: +e.target.value })} /></label>
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
                                {o.hint && <div className="od">{o.hint}</div>}
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
                <div className="card"><div className="ch"><span className="cn">＋</span><h2>Комплектація меблями</h2></div>
                  <div className="cb">
                    <div className={"optbox" + (furnOn ? " on" : "")} onClick={() => setFurnOn(v => !v)} style={{ maxWidth: 480 }}>
                      <div className="cbx">{furnOn ? "✓" : ""}</div>
                      <div style={{ flex: 1 }}><div className="ot">Додати меблі, техніку й декор</div>
                        <div className="od">Окремим підсумком. Деталі — у пропозиції.</div></div>
                      {furnOn && <span className="odelta">+{fmtM(furnTotal)}</span>}
                    </div>
                  </div></div>
              </>}

              {stepId === "style" && <div className="card"><div className="ch"><span className="cn">§</span><h2>Бюджет, рівень і стиль</h2></div>
                <div className="cb">
                  <div className="g2">
                    <label className="f">Бюджет<select value={p.budget} onChange={e => setP("budget", e.target.value)}>
                      {BUDGETS[mode].map(b => <option key={b.id} value={b.id}>{b.name} грн</option>)}</select></label>
                    <label className="f">Бажаний старт робіт<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
                  </div>
                  <label className="f">Рівень оздоблення
                    <div className="chips">{Object.entries(TIERS).map(([id, t]) => <button key={id} className={"chip acc" + (p.tier === id ? " on" : "")} onClick={() => setP("tier", id)}>{t.name}</button>)}</div>
                    <button className="tl" onClick={() => setShowT(s => !s)}>{showT ? "Сховати ↑" : "Порівняти рівні ↓"}</button>
                    {showT && <div className="tt"><div className="ttr h"><div></div><div>Економ</div><div>Стандарт</div><div>Преміум</div></div>
                      {TIER_TABLE.map(t => <div className="ttr" key={t.row}><div>{t.row}</div><div>{t.econom}</div><div>{t.standart}</div><div>{t.premium}</div></div>)}</div>}</label>
                  <label className="f">Стиль
                    <div className="chips">{Object.keys(STYLE_MODS).map(s => <button key={s} className={"chip" + (p.style === s ? " on" : "")} onClick={() => setP("style", s)}>{s}</button>)}</div>
                    <div className="sn"><b>{p.style}{r.styleDelta ? ` · ${r.styleDelta > 0 ? "+" : ""}${r.styleDelta}%` : ""}:</b> {STYLE_MODS[p.style].note}</div></label>
                </div></div>}

              <div className="wnav no-print">
                {step > 0 ? <button className="btn" onClick={() => goto(step - 1)}>← Назад</button> : <span />}
                <button className="btn blue" onClick={next}>{step >= STEPS.length - 1 ? "До пропозиції →" : "Далі →"}</button>
              </div>
            </div>

            <div className="rail no-print">
              <div className="live">
                <div className="lk"><span className="dot" />{r.region.name} · {r.itemCount} позицій</div>
                <div className="lv">{fmtM(lowA)} — <em>{fmtM(highA)}</em></div>
                <div className="ls">{fmt(r.perM2 * mk)} грн/м² · ~{r.months} міс.</div>
                <div className="lr"><span>Роботи</span><span>{fmtM(r.rows.reduce((a, x) => a + x.work, 0) * mk)}</span></div>
                <div className="lr"><span>Матеріали</span><span>{fmtM(r.rows.reduce((a, x) => a + x.matSum, 0) * mk)}</span></div>
                {furnOn && <div className="lr"><span>Комплектація</span><span>{fmtM(furnTotal)}</span></div>}
                {furnOn && <div className="lr" style={{ fontWeight: 600 }}><span>Разом з меблями</span><span>{fmtM(r.total * mk + furnTotal)}</span></div>}
                {Object.keys(TIERS).filter(t => t !== p.tier).map(t => (
                  <div className="lr" key={t} style={{ cursor: "pointer" }} onClick={() => setP("tier", t)}>
                    <span>якби {TIERS[t].name}</span><span>{fmtM(cmp[t] * mk)}</span></div>))}
                <button className="livebtn" onClick={() => { setView("lead"); window.scrollTo(0, 0); }}>Сформувати пропозицію →</button>
              </div>
              <div className={"fc " + (r.budgetFit ? "ok" : "no")}>
                {r.budgetFit ? <>✓ Вписується у «{r.budgetName}»</> : <>⚠ Перевищує «{r.budgetName}»</>}</div>
              <button className="sharebtn" onClick={shareLink}>{shared ? "✓ Посилання скопійовано" : "🔗 Поділитись розрахунком"}</button>
            </div>
          </div>

          <div className="mobilebar no-print">
            <div className="mb-sum"><span className="mb-v">{fmtM(lowA)} — {fmtM(highA)}</span><span className="mb-s">{fmt(r.perM2 * mk)} грн/м² · ~{r.months} міс</span></div>
            <button className="mb-btn" onClick={next}>{step >= STEPS.length - 1 ? "Пропозиція →" : "Далі →"}</button>
          </div>
          </>);
        })()}

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

        {view === "lead" && <div className="leadwrap"><h2>Майже готово</h2><p>Залиште контакт — отримайте PDF з розрахунком</p>
          <div className="card"><div className="cb">
            <label className="f">Ім'я<input type="text" value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} placeholder="Олександр" /></label>
            <label className="f">Телефон / Telegram<input type="tel" value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))} placeholder="+380..." /></label>
            <label className="f">Коментар<input type="text" value={lead.msg} onChange={e => setLead(l => ({ ...l, msg: e.target.value }))} placeholder="Необов'язково" /></label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setView("form")}>← Назад</button>
              <button className="btn blue" style={{ flex: 1 }} onClick={() => {
                const optNames = OPTS.filter(o => p.opts[o.id]).map(o => o.name).join(", ");
                const payload = {
                  name: lead.name, phone: lead.phone, msg: lead.msg,
                  summary: `${mode === "flat" ? "Ремонт" : "Будинок"} ${Math.round(r.A.total)} м², ${r.region.name} · ${r.tier.name} · ${p.style}`,
                  estimate: `${fmtM(r.low * mk)} — ${fmtM(r.high * mk)} грн · ~${r.months} міс`,
                  furniture: furnOn ? `+ ${fmtM(furnTotal)} грн` : "",
                  options: optNames,
                };
                fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
                  .then(x => x.json()).then(d => setLeadSent(d.ok ? "ok" : "fail")).catch(() => setLeadSent("fail"));
                setView("sheet"); window.scrollTo(0, 0);
              }} disabled={!lead.name.trim() || !lead.phone.trim()}>Отримати пропозицію →</button>
            </div>
            <span className="hint">Ваші дані бачить тільки команда</span>
          </div></div></div>}

        {view === "sheet" && <div className="sheet">
          <div className="cover">
            <div className="ceye">Комерційна пропозиція{BETA ? " · бета" : ""}</div>
            <h1>{mode === "flat" ? `Ремонт ${Math.round(r.A.total)} м² під ключ` : `Будинок ${p.area} м²`}</h1>
            <div className="csub">{mode === "flat" ? `${rooms.filter(x => !ROOM_TYPES[x.type].wet && x.type !== "hall" && x.type !== "balcony" && x.type !== "wardrobe").length} кімн. · ${r.A.baths} с/в` : `${p.roomsCount} спал. · ${p.bathrooms} с/в`} · {r.tier.name} · {p.style}</div>
            <div className="cmeta">{r.region.name} · {today} · {r.itemCount} позицій кошторису</div>
          </div>



          <div className="snums">
            <div className="sn2"><div className="k">Вартість · ринкова вилка</div><div className="v">{fmtM(r.low * mk)} — <em>{fmtM(r.high * mk)}</em></div></div>
            <div className="sn2"><div className="k">Грн / м²</div><div className="v"><em>{fmt(r.perM2 * mk)}</em></div></div>
            <div className="sn2"><div className="k">Строк</div><div className="v"><em>{r.months}</em> міс.</div>
              <div className="k" style={{ marginTop: 4 }}>старт {fmtD(sDate)} → здача ≈ {fmtD(finishDate)}</div></div>
          </div>

          <div className="confstrip">
            <span className="timeline">📅 старт {fmtD(sDate)} → здача ≈ {fmtD(finishDate)} · {r.weeks} тижнів</span>
            {r.conf > 0 && <span className="confb">✓ {r.conf}% вартості робіт — живі ринкові ціни (rabotniki.ua{live ? ", " + live.updated : ""})</span>}
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
            <button className={"fchip" + (!grpFilter ? " on" : "")} onClick={() => setGrpFilter(null)}>Всі етапи</button>
            {usedGroups.map(g => <button key={g} className={"fchip" + (grpFilter === g ? " on" : "")} onClick={() => setGrpFilter(grpFilter === g ? null : g)}>{GROUPS[g]}</button>)}
            <button className="fchip x" onClick={() => { const all = {}; r.rows.forEach(x => all[x.id] = true); setOpn(Object.keys(opn).length === r.rows.length ? {} : all); }}>
              {Object.keys(opn).length === r.rows.length ? "Згорнути все" : "Розгорнути все"}</button>
          </div>

          {shownRows.map(st => <div key={st.id} className={"stage" + (opn[st.id] ? " open" : "")}>
            <div className="sth" onClick={() => setOpn(o => ({ ...o, [st.id]: !o[st.id] }))}>
              <span className="st-caret">▸</span>
              <span className="st-grp">{GROUPS[st.group]}</span>
              <span className="st-name">{st.name}</span>
              {st.sk !== 1 && <span className="st-badge">{st.sk > 1 ? "+" : ""}{Math.round((st.sk - 1) * 100)}%</span>}
              {st.weeks > 0 && <span className="st-wk">{st.weeks}т</span>}
              <span className="st-tot">{fmt(st.total * mk)}</span></div>
            {opn[st.id] && <div className="stb"><div className="scope">{st.scope}</div>
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
                {it.matChosen && <div className="srcline">{it.matChosen.note ? it.matChosen.note + " · " : ""}<a href={it.matChosen.url} target="_blank" rel="noreferrer">Епіцентр →</a> · перевірено {MATS_CHECKED}</div>}
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
            <p className="hint" style={{ marginBottom: 14 }}>Окремий підсумок — не входить у вартість ремонту. Ціни — орієнтир Епіцентр, {MATS_CHECKED}.</p>
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

          <div className="instal">
            <span>У розстрочку:</span>
            {[6, 12, 24].map(m => <button key={m} className={"fchip" + (instM === m ? " on" : "")} onClick={() => setInstM(m)}>{m} міс</button>)}
            <span className="instv">≈ <b>{fmt(Math.round((r.total * mk + (furnOn ? furnTotal : 0)) / instM))}</b> грн/міс</span>
            <span className="hint">· без урахування % банку</span>
          </div>

          <div className="paysec"><h3>Графік оплат</h3>
            {PAYMENT.map((ps, i) => <div className="prow" key={i}><span className="ppct">{ps.pct}%</span>
              <div className="pbody"><div className="plbl">{ps.label}</div><div className="pdesc">{ps.desc}</div>
                <div className="psum">{fmtM(Math.round(r.total * mk * ps.pct / 100))} грн</div></div></div>)}
          </div>

          <div className="inex"><h3>Що входить / не входить</h3>
            <ul className="inc">{INCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul>
            <ul className="exc">{EXCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul></div>

          <div className="nextsteps"><h3>Що далі</h3>
            <div className="steps">
              {[["1", "Дзвінок", "менеджер звʼяжеться протягом робочого дня"],
                ["2", "Замір", "безкоштовний виїзд на обʼєкт"],
                ["3", "Точний кошторис", "з фіксацією цін у договорі"],
                ["4", "Старт робіт", "з фотозвітами на кожному етапі"]].map(([n, t, d]) => (
                <div className="step" key={n}><span className="stepn">{n}</span><div><div className="stept">{t}</div><div className="stepd">{d}</div></div></div>))}
            </div>
          </div>



          <div className="terms"><h3>Умови</h3>
            Попередня оцінка, не є офертою. Точний кошторис — після заміру. {live ? `Розцінки на роботи — середньоринкові за даними rabotniki.ua станом на ${live.updated}; матеріали — орієнтовно (Епіцентр, ${MATS_CHECKED}).` : `Ціни станом на ${today}.`} {BETA ? "Версія БЕТА: частина розцінок очікує перевірки експертом (позначені β)." : ""} Пропозиція дійсна 14 днів. Гарантія — 24 місяці.</div>

          <div className="sf"><p className="note">ПРОПОЗИЦІЯ.БУД · {today} · {lead.name || "—"} · {lead.phone || "—"}{leadSent === "ok" && <span style={{ color: "var(--ok)" }}> · ✓ заявку передано команді</span>}</p>
            <div className="actions no-print">
              <button className="btn" onClick={() => { setView("form"); window.scrollTo(0, 0); }}>← Параметри</button>
              <button className="btn" onClick={exportXlsx}>Excel ↓</button>
              <button className="btn blue" onClick={() => { const all = {}; r.rows.forEach(x => all[x.id] = true); setOpn(all); setTimeout(() => window.print(), 150); }}>Зберегти PDF</button>
            </div></div>
        </div>}
      </div>
    </div>
  );
}
