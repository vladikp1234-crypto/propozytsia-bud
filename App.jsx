import React, { useState, useMemo, useEffect } from "react";
import { REGIONS, TIERS, TIER_TABLE, STYLE_MODS, GROUPS, FLAT_STAGES, HOUSE_STAGES, FLAT_OPTS, HOUSE_OPTS, BUDGETS, PAYMENT, INCLUDES, EXCLUDES, MATS, MATS_CHECKED, FURNITURE, FURN_GROUPS } from "./data.js";

const VILKA = 0.12, OVERLAP = 0.85;

/* Будує варіанти цін для позиції: live → 3 реальні точки ринку, інакше кураторська оцінка */
function buildOpts(it, live, p) {
  const cur = { price: it.curated.price(p), mat: it.curated.mat(p) };
  const lw = it.live && live?.works?.[it.live];
  if (lw) {
    return {
      opts: [
        { name: "Мінімальна ринкова", price: lw.min, mat: cur.mat, tag: "live", info: lw },
        { name: "Середньоринкова", price: lw.price, mat: cur.mat, tag: "live", info: lw },
        { name: "Верхній сегмент", price: lw.max, mat: cur.mat, tag: "live", info: lw },
      ],
      def: 1, live: lw,
    };
  }
  return { opts: [{ name: "Оцінка ПРОПОЗИЦІЯ.БУД", price: cur.price, mat: cur.mat, tag: "est" }], def: 0, live: null };
}

function calc(mode, p, selections, live) {
  const stages = (mode === "flat" ? FLAT_STAGES : HOUSE_STAGES).filter(
    (s) => !(s.onlyIf && !s.onlyIf(p)) && !(s.skipIf && s.skipIf(p))
  );
  const region = REGIONS.find((x) => x.id === p.region) || REGIONS[0];
  const tier = TIERS[p.tier];
  const style = STYLE_MODS[p.style] || STYLE_MODS["Сучасний"];
  let wo = 0;
  const rows = stages.map((s) => {
    const sk = style.mods[s.id] || 1;
    const items = s.items
      .map((it) => {
        const qty = it.qty(p);
        if (!qty) return null;
        const { opts, def, live: lw } = buildOpts(it, live, p);
        const key = it.key;
        const sel = selections[key] ?? def;
        const o = opts[Math.min(sel, opts.length - 1)];
        const pr = Math.round(o.price * tier.kWork * region.k * sk);
        // Матеріали: якщо у позиції є каталог варіантів — ціна матеріалу береться з обраного
        // варіанта (× регіон), а рівень оздоблення лише задає варіант за замовчуванням.
        const matOpts = it.mats ? MATS[it.mats] : null;
        const matDef = matOpts ? Math.min({ econom: 0, standart: 1, premium: 2 }[p.tier] ?? 1, matOpts.length - 1) : 0;
        const matSel = matOpts ? (selections["m:" + key] ?? matDef) : 0;
        const matChosen = matOpts ? matOpts[Math.min(matSel, matOpts.length - 1)] : null;
        const mt = matOpts
          ? Math.round(matChosen.price * region.k)
          : Math.round(o.mat * tier.kMat * region.k * sk);
        const total = qty * (pr + mt);
        // Вилка позиції: live → реальний ринковий розкид min..max; інакше ±12%
        let lowT, highT;
        if (lw) {
          const prL = Math.round(lw.min * tier.kWork * region.k * sk);
          const prH = Math.round(lw.max * tier.kWork * region.k * sk);
          lowT = qty * (prL + mt); highT = qty * (prH + mt);
        } else { lowT = total * (1 - VILKA); highT = total * (1 + VILKA); }
        return { key, label: it.label, unit: it.unit, qty, opts, sel, lw, matOpts, matSel, matChosen, price: pr, mat: mt, work: qty * pr, matSum: qty * mt, total, lowT, highT };
      })
      .filter(Boolean);
    if (!items.length) return null;
    const wk = Math.round(s.weeks(p) * (mode === "flat" ? Math.sqrt(p.area / 60) : Math.sqrt(p.area / 150)) * 10) / 10;
    const sw = wo; wo += wk * OVERLAP;
    return { id: s.id, group: s.group, name: s.name, scope: s.scope, sk, items, weeks: wk, startWeek: sw,
      total: items.reduce((a, b) => a + b.total, 0), work: items.reduce((a, b) => a + b.work, 0), matSum: items.reduce((a, b) => a + b.matSum, 0) };
  }).filter(Boolean);
  const total = rows.reduce((a, r) => a + r.total, 0);
  const allItems = rows.flatMap(r2 => r2.items);
  let low = allItems.reduce((a, i) => a + i.lowT, 0);
  let high = allItems.reduce((a, i) => a + i.highT, 0);
  low = Math.min(low, total * 0.98); high = Math.max(high, total * 1.02);
  const workSum = allItems.reduce((a, i) => a + i.work, 0);
  const liveWork = allItems.filter(i => i.lw).reduce((a, i) => a + i.work, 0);
  const conf = workSum ? Math.round((liveWork / workSum) * 100) : 0;
  const weeks = Math.round(rows.reduce((a, r) => a + r.weeks, 0) * OVERLAP);
  const budget = BUDGETS[mode].find((b) => b.id === p.budget);
  const sd = Object.keys(style.mods).length ? Math.round((total / rows.reduce((a, r) => a + r.total / (r.sk || 1), 0) - 1) * 100) : 0;
  return { rows, total, region, tier, style, styleDelta: sd, low, high, conf,
    perM2: Math.round(total / p.area), weeks, months: Math.round((weeks / 4.33) * 10) / 10,
    budgetFit: budget ? low <= budget.max : true, budgetName: budget?.name || "", totalWeeks: Math.ceil(wo) };
}

const fmt = (n) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtM = (n) => (n >= 1e6 ? (n / 1e6).toFixed(2).replace(".", ",") + "\u00a0млн" : fmt(n));

const css = `
:root{--bg:#F4F2ED;--card:#FFF;--ink:#1A1C20;--sub:#6B6E75;--line:#E8E5DE;--acc:#1D3FCC;--acc2:#EEF0FA;--ok:#1A6B2E;--oks:#E7F3EB;--wrn:#B93D08;--wrns:#FDF0E8}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg)}
.app{min-height:100vh;font-family:'Manrope',sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;background:var(--bg);background-image:radial-gradient(ellipse 80% 60% at 0% 30%,rgba(29,63,204,.04),transparent 70%),radial-gradient(ellipse 60% 50% at 100% 70%,rgba(29,63,204,.03),transparent 70%)}
.topbar{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.tb{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.logo{font-family:'Unbounded';font-weight:800;font-size:16px}.logo span{color:var(--acc)}
.mode{display:flex;background:var(--bg);border-radius:999px;padding:3px;gap:2px}
.mode button{font-family:'Manrope';font-weight:600;font-size:12.5px;padding:8px 18px;border:none;background:transparent;border-radius:999px;cursor:pointer;color:var(--sub)}
.mode button.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.1)}
.wrap{max-width:1080px;margin:0 auto;padding:40px 24px 120px}
.hero{margin-bottom:28px;max-width:620px}
.hero h1{font-family:'Unbounded';font-weight:600;font-size:clamp(21px,3.8vw,32px);line-height:1.2;margin-bottom:10px}
.hero p{color:var(--sub);font-size:14.5px;line-height:1.6}
.badge{display:inline-flex;align-items:center;gap:7px;margin-top:14px;font-family:'IBM Plex Mono';font-size:10.5px;font-weight:600;padding:5px 11px;border-radius:6px;text-transform:uppercase;letter-spacing:.3px}
.badge.demo{background:var(--wrns);color:var(--wrn)}.badge.live{background:var(--oks);color:var(--ok)}
.detail-tgl{display:flex;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:4px;gap:3px;margin-bottom:18px;width:fit-content}
.detail-tgl button{font-family:'Manrope';font-weight:700;font-size:12.5px;padding:9px 18px;border:none;background:transparent;border-radius:9px;cursor:pointer;color:var(--sub)}
.detail-tgl button.on{background:var(--acc);color:#fff}
.grid{display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.ch{display:flex;align-items:center;gap:10px;padding:16px 22px;border-bottom:1px solid var(--line)}
.cn{font-family:'IBM Plex Mono';font-size:10.5px;font-weight:600;color:var(--acc);background:var(--acc2);padding:3px 8px;border-radius:6px}
.ch h2{font-size:14.5px;font-weight:700}
.cb{padding:20px 22px;display:grid;gap:18px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
@media(max-width:560px){.g2,.g3{grid-template-columns:1fr}}
label.f{display:grid;gap:7px;font-size:13px;font-weight:600}
.hint{font-weight:500;color:var(--sub);font-size:11.5px;line-height:1.5}
select,input[type=number],input[type=text],input[type=tel]{font-family:'IBM Plex Mono';font-size:13.5px;padding:10px 12px;border:1px solid var(--line);background:#fff;border-radius:10px;width:100%;color:var(--ink)}
select:focus,input:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--acc2)}
.rr{display:flex;align-items:center;gap:14px}
input[type=range]{flex:1;accent-color:var(--acc)}
.rv{font-family:'IBM Plex Mono';font-weight:600;font-size:15px;min-width:80px;text-align:right}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{font-family:'Manrope';font-weight:600;font-size:12.5px;padding:8px 14px;border:1.5px solid var(--line);background:#fff;border-radius:999px;cursor:pointer;color:var(--sub);transition:all .12s}
.chip:hover{border-color:var(--ink);color:var(--ink)}
.chip.on{background:var(--ink);border-color:var(--ink);color:#fff}
.chip.acc.on{background:var(--acc);border-color:var(--acc)}
.optgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media(max-width:560px){.optgrid{grid-template-columns:1fr}}
.optbox{display:flex;gap:10px;align-items:flex-start;border:1.5px solid var(--line);border-radius:11px;padding:11px 13px;cursor:pointer;background:#fff;transition:all .12s}
.optbox:hover{border-color:var(--ink)}
.optbox.on{border-color:var(--acc);background:var(--acc2)}
.optbox .cbx{width:16px;height:16px;border-radius:5px;border:2px solid var(--line);margin-top:1px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff}
.optbox.on .cbx{border-color:var(--acc);background:var(--acc)}
.optbox .ot{font-weight:700;font-size:12.5px}.optbox .od{font-size:11px;color:var(--sub)}
.cond{display:grid;gap:8px}
.cond .opt{display:flex;gap:12px;align-items:flex-start;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;cursor:pointer;background:#fff}
.cond .opt.on{border-color:var(--acc);background:var(--acc2)}
.cond .rd{width:15px;height:15px;border-radius:50%;border:2px solid var(--line);margin-top:2px;flex-shrink:0}
.cond .opt.on .rd{border-color:var(--acc);background:var(--acc);box-shadow:inset 0 0 0 3px var(--acc2)}
.cond .ot{font-weight:700;font-size:13px}.cond .od{font-size:12px;color:var(--sub);margin-top:2px}
.sn{background:var(--acc2);border-radius:10px;padding:10px 13px;font-size:11.5px;line-height:1.55}
.sn b{color:var(--acc)}
.tl{font-size:11.5px;font-weight:700;color:var(--acc);background:none;border:none;cursor:pointer;text-decoration:underline;padding:0}
.tt{border:1px solid var(--line);border-radius:10px;overflow:hidden;font-size:11px;background:#fff}
.ttr{display:grid;grid-template-columns:76px 1fr 1fr 1fr;border-bottom:1px solid var(--line)}.ttr:last-child{border-bottom:none}
.ttr.h{background:var(--bg);font-family:'IBM Plex Mono';font-size:9.5px;text-transform:uppercase;color:var(--sub)}
.ttr>div{padding:8px 9px;border-right:1px solid var(--line)}.ttr>div:last-child{border-right:none}.ttr>div:first-child{font-weight:700;background:var(--bg)}
.rail{position:sticky;top:80px;display:grid;gap:12px}
.live{background:var(--ink);color:#fff;border-radius:16px;padding:22px}
.lk{font-size:11px;color:#888;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.dot{width:6px;height:6px;border-radius:50%;background:#34d399;animation:pls 1.6s infinite}
@keyframes pls{0%,100%{opacity:1}50%{opacity:.3}}
.lv{font-family:'IBM Plex Mono';font-weight:600;font-size:clamp(18px,2.2vw,22px)}
.lv em{font-style:normal;color:#93A8FF}
.ls{font-family:'IBM Plex Mono';font-size:11.5px;color:#777;margin-top:5px}
.lr{display:flex;justify-content:space-between;font-size:12px;padding:6px 0;border-top:1px solid #2a2c31;font-family:'IBM Plex Mono';color:#aaa}
.lr span:last-child{color:#ddd}.lr:first-of-type{margin-top:10px}
.livebtn{width:100%;margin-top:14px;font-family:'Unbounded';font-weight:600;font-size:12.5px;background:var(--acc);color:#fff;border:none;border-radius:10px;padding:14px;cursor:pointer}
.livebtn:hover{filter:brightness(1.15)}
.fc{border-radius:12px;padding:12px 14px;font-size:12px;font-weight:600;line-height:1.5}
.fc.ok{background:var(--oks);color:var(--ok)}.fc.no{background:var(--wrns);color:var(--wrn)}
.leadwrap{max-width:480px;margin:0 auto}.leadwrap h2{font-family:'Unbounded';font-weight:600;font-size:22px;margin-bottom:6px}.leadwrap>p{color:var(--sub);font-size:14px;margin-bottom:20px}
.sheet{background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.cover{padding:44px 32px 36px;text-align:center;background:linear-gradient(180deg,var(--acc2),var(--card))}
.ceye{font-family:'IBM Plex Mono';font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:var(--sub);margin-bottom:12px}
.cover h1{font-family:'Unbounded';font-weight:700;font-size:clamp(19px,3.4vw,28px);margin-bottom:8px}
.csub{color:var(--sub);font-size:13.5px}.cmeta{margin-top:14px;font-family:'IBM Plex Mono';font-size:11px;color:var(--sub)}
.snums{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
@media(max-width:640px){.snums{grid-template-columns:1fr}}
.sn2{padding:22px 28px;border-right:1px solid var(--line)}.sn2:last-child{border-right:none}
.sn2 .k{font-size:11px;color:var(--sub);margin-bottom:5px;text-transform:uppercase}
.sn2 .v{font-family:'IBM Plex Mono';font-weight:600;font-size:clamp(16px,2.4vw,20px)}.sn2 .v em{font-style:normal;color:var(--acc)}
.breakdown{padding:28px 28px 20px;border-bottom:1px solid var(--line)}
.breakdown h3,.gantt h3{font-size:13.5px;font-weight:700;margin-bottom:16px}
.brow{display:flex;align-items:center;gap:12px;margin-bottom:7px}
.blbl{font-size:11.5px;font-weight:600;min-width:130px;max-width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sub)}
@media(max-width:560px){.blbl{min-width:80px;max-width:100px;font-size:10.5px}}
.btrack{flex:1;height:20px;background:var(--bg);border-radius:6px;overflow:hidden}
.bfill{height:100%;border-radius:6px;background:var(--acc)}
.bval{font-family:'IBM Plex Mono';font-size:11px;min-width:90px;text-align:right;color:var(--sub)}
.gantt{padding:28px 28px 20px;border-bottom:1px solid var(--line);overflow-x:auto}
.gg{display:grid;gap:5px}.gr{display:flex;align-items:center;gap:12px}
.glbl{font-size:11px;font-weight:600;min-width:110px;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sub)}
@media(max-width:560px){.glbl{min-width:70px;max-width:95px;font-size:10px}}
.gtrack{flex:1;height:18px;position:relative;min-width:180px}
.gbar{position:absolute;height:100%;border-radius:5px;display:flex;align-items:center;padding-left:6px;font-family:'IBM Plex Mono';font-size:9px;color:#fff;font-weight:600;white-space:nowrap;background:var(--ink);opacity:.75}
.gmeta{margin-top:8px;font-family:'IBM Plex Mono';font-size:10.5px;color:var(--sub)}
.filterbar{display:flex;gap:7px;flex-wrap:wrap;align-items:center;padding:14px 28px;border-bottom:1px solid var(--line)}
.fchip{font-family:'Manrope';font-weight:600;font-size:11.5px;padding:6px 12px;border:1.5px solid var(--line);background:#fff;border-radius:999px;cursor:pointer;color:var(--sub)}
.fchip.on{background:var(--ink);border-color:var(--ink);color:#fff}
.fchip.x{margin-left:auto;border-style:dashed}
.stage{border-bottom:1px solid var(--line)}.stage:last-of-type{border-bottom:none}
.sth{display:flex;align-items:center;gap:10px;padding:14px 28px;cursor:pointer;user-select:none}
.sth:hover{background:var(--bg)}
.st-caret{font-size:10px;color:var(--sub);transition:transform .15s;width:16px}.stage.open .st-caret{transform:rotate(90deg);color:var(--acc)}
.st-grp{font-family:'IBM Plex Mono';font-size:9px;color:var(--sub);background:var(--bg);border-radius:5px;padding:2px 7px;text-transform:uppercase}
.st-name{font-weight:700;font-size:13px;flex:1}
.st-badge{font-family:'IBM Plex Mono';font-size:9.5px;color:var(--acc);background:var(--acc2);border-radius:5px;padding:2px 7px}
.st-wk{font-family:'IBM Plex Mono';font-size:11px;color:var(--sub);min-width:50px;text-align:right}
.st-tot{font-family:'IBM Plex Mono';font-weight:600;font-size:13px;min-width:96px;text-align:right}
.stb{background:var(--bg);border-top:1px solid var(--line);padding:16px 28px 20px;display:grid;gap:14px}
.stb .scope{font-size:12px;color:var(--sub);line-height:1.5;padding-bottom:10px;border-bottom:1px dashed var(--line)}
.item .itop{display:flex;justify-content:space-between;gap:8px;font-size:12px;margin-bottom:8px;flex-wrap:wrap}
.item .ilbl{font-weight:700}.item .iqty{font-family:'IBM Plex Mono';color:var(--sub)}
.optlist{display:grid;gap:6px}
.oc{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--line);border-radius:10px;padding:10px 12px;cursor:pointer}
.oc:hover{border-color:var(--ink)}.oc.on{border-color:var(--acc);background:var(--acc2)}
.oc .orad{width:13px;height:13px;border-radius:50%;border:2px solid var(--line);flex-shrink:0}
.oc.on .orad{border-color:var(--acc);background:var(--acc);box-shadow:inset 0 0 0 2.5px var(--acc2)}
.oc .oname{font-weight:700;font-size:11.5px;flex:1;min-width:90px}
.oc .osrc{font-size:10px;color:var(--sub)}.oc .osrc a{color:var(--acc);font-weight:600}
.oc .oprice{font-family:'IBM Plex Mono';font-size:10.5px;text-align:right;white-space:nowrap;color:var(--sub)}.oc .oprice b{color:var(--ink)}
.oc .livetag{color:var(--ok);font-size:9px;margin-left:5px}
@media(max-width:620px){.oc{flex-wrap:wrap}.oc .oprice{width:100%;text-align:left;padding-left:24px}}
.item{padding:12px 0;border-bottom:1px dashed var(--line)}
.item:last-child{border-bottom:none;padding-bottom:0}
.segrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:7px}
.seglbl{font-size:10.5px;font-weight:700;color:var(--sub);min-width:62px;text-transform:uppercase;letter-spacing:.3px}
.seg{display:flex;gap:5px;flex-wrap:wrap}
.segbtn{display:grid;gap:1px;border:1.5px solid var(--line);border-radius:9px;padding:5px 11px;background:#fff;cursor:pointer;text-align:left;transition:all .1s}
.segbtn:hover{border-color:var(--ink)}
.segbtn.on{border-color:var(--acc);background:var(--acc2)}
.sgn{font-family:'Manrope';font-size:10px;font-weight:700;color:var(--sub)}
.segbtn.on .sgn{color:var(--acc)}
.sgp{font-family:'IBM Plex Mono';font-size:12px;font-weight:600;color:var(--ink)}
.unitlbl{font-family:'IBM Plex Mono';font-size:10px;color:var(--sub)}
.sp1{font-family:'IBM Plex Mono';font-size:12px;font-weight:600}
.srcline{font-size:10px;color:var(--sub);margin:5px 0 0 72px}
.srcline a{color:var(--acc);font-weight:600}
@media(max-width:560px){.srcline{margin-left:0}}
.matsec{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)}
.matlbl{font-size:11.5px;font-weight:700;margin-bottom:7px}
.matname{color:var(--acc);font-weight:600;font-size:11.5px}
.furntotals{display:flex;gap:22px;flex-wrap:wrap;justify-content:center;padding:14px 28px;border-top:1px solid var(--line);font-size:12.5px;color:var(--sub);font-family:'IBM Plex Mono'}
.furntotals b{color:var(--ink)}.furntotals .ft-sum b{color:var(--acc)}
.furnsec{padding:28px;border-bottom:1px solid var(--line)}
.furnsec h3{font-size:13.5px;font-weight:700;margin-bottom:8px}
.fgroup{margin-bottom:16px}
.fghead{display:flex;justify-content:space-between;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--sub);padding:8px 0;border-bottom:1px solid var(--line)}
.fgsum{font-family:'IBM Plex Mono';text-transform:none;letter-spacing:0}
.frow{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px dashed var(--line);flex-wrap:wrap}
.frow.off{opacity:.42}
.fcheck{width:18px;height:18px;border-radius:6px;border:2px solid var(--line);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;flex-shrink:0}
.frow:not(.off) .fcheck{border-color:var(--acc);background:var(--acc)}
.fph{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,var(--bg),var(--acc2));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;overflow:hidden;position:relative}
.fph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fbody{flex:1;min-width:150px}
.fname{font-weight:700;font-size:12.5px}
.fqty{display:flex;align-items:center;gap:6px;font-family:'IBM Plex Mono';font-size:11px}
.fqty button{width:22px;height:22px;border-radius:6px;border:1.5px solid var(--line);background:#fff;cursor:pointer;font-size:13px;line-height:1}
.fqty span{min-width:52px;text-align:center}
.fseg .segbtn{padding:4px 8px}
.ftot{font-family:'IBM Plex Mono';font-weight:600;font-size:12px;min-width:78px;text-align:right}
.furnsum{text-align:right;font-family:'IBM Plex Mono';font-size:13px;padding-top:12px}
.furnsum b{color:var(--acc)}
@media(max-width:720px){.frow{gap:8px}.fseg{width:100%;margin-left:30px}.ftot{margin-left:auto}}
.sharebtn{width:100%;font-family:'Manrope';font-weight:700;font-size:12px;padding:11px;border-radius:12px;border:1.5px dashed var(--line);background:transparent;color:var(--sub);cursor:pointer}
.sharebtn:hover{border-color:var(--acc);color:var(--acc)}
.confstrip{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 28px;border-bottom:1px solid var(--line)}
.confb{font-family:'IBM Plex Mono';font-size:11px;color:var(--ok);background:var(--oks);padding:5px 10px;border-radius:6px;font-weight:600}
.cmp{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid var(--line)}
@media(max-width:560px){.cmp{grid-template-columns:1fr}}
.cmpc{padding:16px 22px;border-right:1px solid var(--line);cursor:pointer;transition:background .1s}
.cmpc:last-child{border-right:none}.cmpc:hover{background:var(--bg)}
.cmpc.on{background:var(--acc2)}
.cmpn{font-size:11px;font-weight:700;color:var(--sub);text-transform:uppercase;letter-spacing:.3px}
.cmpc.on .cmpn{color:var(--acc)}
.cmpv{font-family:'IBM Plex Mono';font-weight:600;font-size:16px;margin-top:4px}
.cmpd{font-family:'IBM Plex Mono';font-size:10.5px;color:var(--sub);margin-top:2px}
.instal{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:14px 28px;border-bottom:1px solid var(--line);font-size:12px;font-weight:600}
.instv{font-family:'IBM Plex Mono';font-size:12px}
.nextsteps{padding:24px 28px;border-bottom:1px solid var(--line)}
.nextsteps h3{font-size:13.5px;font-weight:700;margin-bottom:14px}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:720px){.steps{grid-template-columns:1fr 1fr}}
.step{display:flex;gap:9px;align-items:flex-start}
.stepn{width:22px;height:22px;border-radius:50%;background:var(--acc);color:#fff;font-family:'IBM Plex Mono';font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stept{font-weight:700;font-size:12px}.stepd{font-size:11px;color:var(--sub);line-height:1.45}
.paysec{padding:28px;border-bottom:1px solid var(--line)}.paysec h3{font-size:13.5px;font-weight:700;margin-bottom:16px}
.prow{display:flex;gap:14px;margin-bottom:12px}
.ppct{font-family:'IBM Plex Mono';font-weight:600;font-size:13px;min-width:42px;color:var(--acc)}
.pbody .plbl{font-weight:700;font-size:12.5px}.pbody .pdesc{font-size:11.5px;color:var(--sub)}.pbody .psum{font-family:'IBM Plex Mono';font-size:11.5px;font-weight:600;margin-top:3px}
.inex{padding:28px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:560px){.inex{grid-template-columns:1fr}}
.inex h3{font-size:13.5px;font-weight:700;grid-column:1/-1}
.inex ul{list-style:none;font-size:12px;line-height:1.7;color:var(--sub)}
.inex .inc li::before{content:'\\2713  ';color:var(--ok);font-weight:700}.inex .exc li::before{content:'\\2715  ';color:var(--wrn);font-weight:700}
.renders{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}
@media(max-width:640px){.renders{grid-template-columns:1fr}}
.rph{aspect-ratio:16/9;border-right:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--sub);background:linear-gradient(135deg,var(--bg),var(--acc2))}
.rph:last-child{border-right:none}.rph .t{font-family:'IBM Plex Mono';font-size:10.5px;text-transform:uppercase}.rph .d{font-size:11px}
.terms{padding:24px 28px;border-bottom:1px solid var(--line);font-size:11.5px;color:var(--sub);line-height:1.6}
.terms h3{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:10px}
.sf{padding:20px 28px;display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}
.sf .note{font-size:10.5px;color:var(--sub);max-width:460px}
.actions{display:flex;gap:8px}
.btn{font-family:'Manrope';font-weight:700;font-size:12.5px;padding:10px 16px;border-radius:10px;cursor:pointer;border:1.5px solid var(--line);background:#fff;color:var(--ink)}
.btn:hover{border-color:var(--ink)}
.btn.blue{background:var(--acc);border-color:var(--acc);color:#fff;font-family:'Unbounded';font-weight:600;font-size:12px}
@media print{.no-print{display:none!important}.app{background:#fff}.wrap{padding:0;max-width:100%}.sheet{border:none;border-radius:0;box-shadow:none}.topbar{display:none}.snums,.breakdown,.gantt,.stage,.paysec,.inex,.terms,.renders,.sf{break-inside:avoid}}
`;

const initF = { region: "kyiv", area: 65, rooms: 2, bathrooms: 1, condition: "new", tier: "standart", style: "Сучасний", budget: "f3",
  floor: 5, lift: "pass", ceilH: 2.7, windowsCount: 3, acCount: 1, wallFinish: "paint", opts: {} };
const initH = { region: "kyiv", area: 150, floors: 2, rooms: 3, bathrooms: 2, condition: "new", tier: "standart", style: "Сучасний", budget: "h3",
  plot: 8, ceilH: 2.9, opts: {} };

export default function App() {
  const [mode, setMode] = useState("flat");
  const [flat, setFlat] = useState(initF);
  const [house, setHouse] = useState(initH);
  const [view, setView] = useState("form");
  const [detail, setDetail] = useState(false);
  const [sel, setSel] = useState({});
  const [opn, setOpn] = useState({});
  const [grpFilter, setGrpFilter] = useState(null);
  const [showT, setShowT] = useState(false);
  const [lead, setLead] = useState({ name: "", phone: "", msg: "" });
  const [live, setLive] = useState(null);

  // Відновлення стану: пріоритет — посилання (#c=...), потім localStorage
  useEffect(() => {
    try {
      let saved = null;
      if (window.location.hash.startsWith("#c=")) {
        saved = JSON.parse(decodeURIComponent(escape(atob(window.location.hash.slice(3)))));
      } else if (window.localStorage) {
        const ls = localStorage.getItem("pb_state");
        if (ls) saved = JSON.parse(ls);
      }
      if (saved) {
        if (saved.f) setFlat(x => ({ ...x, ...saved.f }));
        if (saved.h) setHouse(x => ({ ...x, ...saved.h }));
        if (saved.m) setMode(saved.m);
        if (saved.d != null) setDetail(saved.d);
        if (saved.fo != null) setFurnOn(saved.fo);
        if (saved.sd) setStartDate(saved.sd);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("pb_state", JSON.stringify({ m: mode, f: flat, h: house, d: detail, fo: furnOn, sd: startDate })); } catch {}
  }, [mode, flat, house, detail, furnOn, startDate]);

  useEffect(() => { fetch("/prices.json").then(r => r.ok ? r.json() : null).then(d => { if (d?.updated && Object.keys(d.works || {}).length) setLive(d); }).catch(() => {}); }, []);

  const [leadSent, setLeadSent] = useState(null); // null | "ok" | "fail"
  const [startDate, setStartDate] = useState(() => new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10));
  const [instM, setInstM] = useState(12);
  const [showCmp, setShowCmp] = useState(false);
  const [shared, setShared] = useState(false);
  const [furnOn, setFurnOn] = useState(false);
  const [furnSel, setFurnSel] = useState({}); // {id:{on,qty,tier}}

  const p = mode === "flat" ? flat : house;
  const setP = (k, v) => (mode === "flat" ? setFlat : setHouse)(s => ({ ...s, [k]: v }));
  const tierIdx = { econom: 0, standart: 1, premium: 2 }[p.tier] ?? 1;
  const furnRows = useMemo(() => {
    if (!furnOn) return [];
    return FURNITURE.map(f => {
      const defQty = f.qty(p);
      const s = furnSel[f.id] || {};
      const on = s.on ?? defQty > 0;
      const qty = s.qty ?? Math.max(defQty, 1);
      const ti = s.tier ?? tierIdx;
      return { ...f, on, qty, ti, price: f.t[ti], total: on ? qty * f.t[ti] : 0 };
    });
  }, [furnOn, furnSel, p, tierIdx]);
  const furnTotal = furnRows.reduce((a, x) => a + x.total, 0);
  const setFurn = (id, patch) => setFurnSel(s => ({ ...s, [id]: { ...(s[id] || {}), ...patch } }));

  const cmp = useMemo(() => {
    const out = {};
    for (const t of Object.keys(TIERS)) out[t] = calc(mode, { ...p, tier: t }, sel, live).total;
    return out;
  }, [mode, p, sel, live]);

  const fmtD = (d) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });
  const sDate = new Date(startDate + "T00:00:00");
  const finishDate = new Date(+sDate + (r?.weeks || 0) * 7 * 864e5);
  const stageDate = (w) => new Date(+sDate + w * 7 * 864e5).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

  const shareLink = () => {
    try {
      const payload = { m: mode, f: flat, h: house, d: detail, fo: furnOn, sd: startDate };
      const hash = "#c=" + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const url = window.location.origin + window.location.pathname + hash;
      navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", hash);
      setShared(true); setTimeout(() => setShared(false), 2500);
    } catch {}
  };
  const toggleOpt = (id) => setP("opts", { ...p.opts, [id]: !p.opts[id] });
  const r = useMemo(() => calc(mode, p, sel, live), [mode, p, sel, live]);
  const today = new Date().toLocaleDateString("uk-UA");
  const swM = (m) => { setMode(m); setView("form"); setSel({}); setOpn({}); setGrpFilter(null); };
  const maxT = Math.max(...r.rows.map(x => x.total));
  const OPTS = mode === "flat" ? FLAT_OPTS : HOUSE_OPTS;
  const shownRows = grpFilter ? r.rows.filter(x => x.group === grpFilter) : r.rows;
  const usedGroups = [...new Set(r.rows.map(x => x.group))];

  return (
    <div className="app"><style>{css}</style>
      <div className="topbar no-print"><div className="tb">
        <div className="logo">ПРОПОЗИЦІЯ<span>.БУД</span></div>
        <div className="mode">
          <button className={mode === "flat" ? "on" : ""} onClick={() => swM("flat")}>Ремонт квартири</button>
          <button className={mode === "house" ? "on" : ""} onClick={() => swM("house")}>Будинок з нуля</button>
        </div>
      </div></div>

      <div className="wrap">
        {view === "form" && (<>
          <div className="hero">
            <h1>{mode === "flat" ? "Ремонт під ключ — з ціною одразу" : "Будинок — з ціною та строком одразу"}</h1>
            <p>Кожен параметр змінює розрахунок у реальному часі</p>
            {live
              ? <div className="badge live">роботи: ціни rabotniki.ua від {live.updated} · матеріали: орієнтовні</div>
              : <div className="badge demo">демо · ціни орієнтовні</div>}
          </div>

          <div className="detail-tgl no-print">
            <button className={!detail ? "on" : ""} onClick={() => setDetail(false)}>Швидкий розрахунок</button>
            <button className={detail ? "on" : ""} onClick={() => setDetail(true)}>Детальний</button>
          </div>

          <div className="grid">
            <div style={{ display: "grid", gap: 16 }}>
              <div className="card"><div className="ch"><span className="cn">01</span><h2>{mode === "flat" ? "Квартира" : "Будинок"}</h2></div>
                <div className="cb">
                  <div className="g2">
                    <label className="f">Локація <span className="hint">Київ — база, область — дешевше</span>
                      <select value={p.region} onChange={e => setP("region", e.target.value)}>
                        {REGIONS.map(x => <option key={x.id} value={x.id}>{x.name}{x.k !== 1 ? ` (−${Math.round((1 - x.k) * 100)}%)` : ""}</option>)}</select></label>
                    <label className="f">{mode === "flat" ? "Кімнат" : "Спалень"}
                      <div className="chips">{[1, 2, 3, 4, 5].map(n => <button key={n} className={"chip" + (p.rooms === n ? " on" : "")} onClick={() => setP("rooms", n)}>{n}</button>)}</div></label>
                  </div>
                  <label className="f">Площа
                    <div className="rr"><input type="range" min={mode === "flat" ? 30 : 80} max={mode === "flat" ? 180 : 300} step="5" value={p.area} onChange={e => setP("area", +e.target.value)} /><span className="rv">{p.area} м²</span></div></label>
                  {mode === "house" && <label className="f">Поверхів
                    <div className="chips">{[1, 2, 3].map(n => <button key={n} className={"chip" + (p.floors === n ? " on" : "")} onClick={() => setP("floors", n)}>{n}</button>)}</div></label>}
                  <label className="f">Санвузлів
                    <div className="chips">{[1, 2, 3].map(n => <button key={n} className={"chip" + (p.bathrooms === n ? " on" : "")} onClick={() => setP("bathrooms", n)}>{n}</button>)}</div></label>

                  {detail && mode === "flat" && (<>
                    <div className="g3">
                      <label className="f">Поверх<input type="number" min="1" max="30" value={p.floor} onChange={e => setP("floor", +e.target.value)} /></label>
                      <label className="f">Ліфт
                        <select value={p.lift} onChange={e => setP("lift", e.target.value)}>
                          <option value="cargo">Вантажний</option><option value="pass">Пасажирський</option><option value="none">Немає</option>
                        </select></label>
                      <label className="f">Висота стель, м<input type="number" step="0.05" min="2.4" max="4" value={p.ceilH} onChange={e => setP("ceilH", +e.target.value)} /></label>
                    </div>
                    <span className="hint">Поверх і ліфт впливають на вартість підйому матеріалів — окремим рядком у кошторисі. Висота стель — на площу стін.</span>
                  </>)}
                  {detail && mode === "house" && (
                    <label className="f">Площа ділянки, соток<input type="number" min="2" max="60" value={p.plot} onChange={e => setP("plot", +e.target.value)} /></label>
                  )}
                </div></div>

              {mode === "flat" && <div className="card"><div className="ch"><span className="cn">02</span><h2>Стан квартири</h2></div>
                <div className="cb"><div className="cond">
                  {[{ id: "new", t: "Новобудова «сіра коробка»", d: "Повний цикл з нуля" },
                    { id: "old", t: "Вторинка зі старим ремонтом", d: "Додається демонтаж і вивіз" },
                    { id: "partial", t: "Часткова готовність", d: "Штукатурка і стяжка є" }].map(o => (
                    <div key={o.id} className={"opt" + (p.condition === o.id ? " on" : "")} onClick={() => setP("condition", o.id)}>
                      <div className="rd" /><div><div className="ot">{o.t}</div><div className="od">{o.d}</div></div></div>))}
                </div></div></div>}

              {detail && <div className="card"><div className="ch"><span className="cn">{mode === "flat" ? "03" : "02"}</span><h2>Додаткові роботи</h2></div>
                <div className="cb">
                  <div className="optgrid">
                    {OPTS.map(o => (
                      <div key={o.id} className={"optbox" + (p.opts[o.id] ? " on" : "")} onClick={() => toggleOpt(o.id)}>
                        <div className="cbx">{p.opts[o.id] ? "✓" : ""}</div>
                        <div><div className="ot">{o.name}</div>{o.hint && <div className="od">{o.hint}</div>}</div>
                      </div>))}
                  </div>
                  {mode === "flat" && p.opts.windows && <label className="f">Кількість вікон<input type="number" min="1" max="12" value={p.windowsCount} onChange={e => setP("windowsCount", +e.target.value)} /></label>}
                  {mode === "flat" && p.opts.ac && <label className="f">Кількість кондиціонерів<input type="number" min="1" max="6" value={p.acCount} onChange={e => setP("acCount", +e.target.value)} /></label>}
                  {mode === "flat" && <label className="f">Оздоблення стін
                    <div className="chips">
                      <button className={"chip" + (p.wallFinish === "paint" ? " on" : "")} onClick={() => setP("wallFinish", "paint")}>Фарбування</button>
                      <button className={"chip" + (p.wallFinish === "wallpaper" ? " on" : "")} onClick={() => setP("wallFinish", "wallpaper")}>Шпалери</button>
                    </div></label>}
                </div></div>}

              <div className="card"><div className="ch"><span className="cn">＋</span><h2>Комплектація меблями</h2></div>
                <div className="cb">
                  <div className={"optbox" + (furnOn ? " on" : "")} onClick={() => setFurnOn(v => !v)} style={{ maxWidth: 480 }}>
                    <div className="cbx">{furnOn ? "✓" : ""}</div>
                    <div><div className="ot">Додати меблі, техніку й декор</div>
                      <div className="od">Кухня, спальні, вітальня, освітлення, текстиль — окремим підсумком. Деталі налаштуєте у пропозиції.</div></div>
                  </div>
                  {furnOn && <span className="hint">У живій оцінці зʼявився рядок «Комплектація». Повний список з цінами й посиланнями — у сформованій пропозиції.</span>}
                </div></div>

              <div className="card"><div className="ch"><span className="cn">{detail ? (mode === "flat" ? "04" : "03") : (mode === "flat" ? "03" : "02")}</span><h2>Бюджет, рівень і стиль</h2></div>
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
                </div></div>
            </div>

            <div className="rail no-print">
              <div className="live">
                <div className="lk"><span className="dot" />{r.region.name}{detail ? " · детальний" : ""}</div>
                <div className="lv">{fmtM(r.low)} — <em>{fmtM(r.high)}</em></div>
                <div className="ls">{fmt(r.perM2)} грн/м² · ~{r.months} міс.</div>
                <div className="lr"><span>Роботи</span><span>{fmtM(r.rows.reduce((a, x) => a + x.work, 0))}</span></div>
                <div className="lr"><span>Матеріали</span><span>{fmtM(r.rows.reduce((a, x) => a + x.matSum, 0))}</span></div>
                <div className="lr"><span>Етапів</span><span>{r.rows.length}</span></div>
                {r.styleDelta !== 0 && <div className="lr"><span>{p.style}</span><span>{r.styleDelta > 0 ? "+" : ""}{r.styleDelta}%</span></div>}
                {furnOn && <div className="lr"><span>Комплектація</span><span>{fmtM(furnTotal)}</span></div>}
                {furnOn && <div className="lr" style={{ fontWeight: 600 }}><span>Разом з меблями</span><span>{fmtM(r.total + furnTotal)}</span></div>}
                {Object.keys(TIERS).filter(t => t !== p.tier).map(t => (
                  <div className="lr" key={t} style={{ cursor: "pointer" }} onClick={() => setP("tier", t)}>
                    <span>якби {TIERS[t].name}</span><span>{fmtM(cmp[t])}</span></div>))}
                <button className="livebtn" onClick={() => { setView("lead"); window.scrollTo(0, 0); }}>Сформувати пропозицію →</button>
              </div>
              <div className={"fc " + (r.budgetFit ? "ok" : "no")}>
                {r.budgetFit ? <>✓ Вписується у «{r.budgetName}»</> : <>⚠ Перевищує «{r.budgetName}»</>}</div>
              <button className="sharebtn" onClick={shareLink}>{shared ? "✓ Посилання скопійовано" : "🔗 Поділитись розрахунком"}</button>
            </div>
          </div>
        </>)}

        {view === "lead" && <div className="leadwrap"><h2>Майже готово</h2><p>Залиште контакт — отримайте PDF з розрахунком</p>
          <div className="card"><div className="cb">
            <label className="f">Ім'я<input type="text" value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} placeholder="Олександр" /></label>
            <label className="f">Телефон / Telegram<input type="tel" value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))} placeholder="+380..." /></label>
            <label className="f">Коментар<input type="text" value={lead.msg} onChange={e => setLead(l => ({ ...l, msg: e.target.value }))} placeholder="Необов'язково" /></label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setView("form")}>← Назад</button>
              <button className="btn blue" style={{ flex: 1 }} onClick={() => {
                const optNames = (mode === "flat" ? FLAT_OPTS : HOUSE_OPTS).filter(o => p.opts[o.id]).map(o => o.name).join(", ");
                const payload = {
                  name: lead.name, phone: lead.phone, msg: lead.msg,
                  summary: `${mode === "flat" ? "Ремонт" : "Будинок"} ${p.area} м², ${p.rooms}-кімн., ${r.region.name} · ${r.tier.name} · ${p.style}`,
                  estimate: `${fmtM(r.low)} — ${fmtM(r.high)} грн · ~${r.months} міс`,
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
            <div className="ceye">Комерційна пропозиція{live ? "" : " · демо"}</div>
            <h1>{mode === "flat" ? `Ремонт ${p.area} м² під ключ` : `Будинок ${p.area} м²`}</h1>
            <div className="csub">{p.rooms} {mode === "flat" ? "кімн." : "спал."} · {p.bathrooms} с/в · {r.tier.name} · {p.style}{mode === "flat" && detail ? ` · ${p.floor} пов.` : ""}</div>
            <div className="cmeta">{r.region.name} · {today}</div>
          </div>

          {furnOn && <div className="furntotals">
            <span>Ремонт: <b>{fmtM(r.total)}</b> грн</span>
            <span>Комплектація: <b>{fmtM(furnTotal)}</b> грн</span>
            <span className="ft-sum">Разом: <b>{fmtM(r.total + furnTotal)}</b> грн</span>
          </div>}

          <div className="snums">
            <div className="sn2"><div className="k">Вартість · ринкова вилка</div><div className="v">{fmtM(r.low)} — <em>{fmtM(r.high)}</em></div></div>
            <div className="sn2"><div className="k">Грн / м²</div><div className="v"><em>{fmt(r.perM2)}</em></div></div>
            <div className="sn2"><div className="k">Строк</div><div className="v"><em>{r.months}</em> міс.</div>
              <div className="k" style={{ marginTop: 4 }}>старт {fmtD(sDate)} → здача ≈ {fmtD(finishDate)}</div></div>
          </div>

          <div className="confstrip">
            {r.conf > 0 && <span className="confb">✓ {r.conf}% вартості робіт — живі ринкові ціни (rabotniki.ua{live ? ", " + live.updated : ""})</span>}
            <button className="tl" onClick={() => setShowCmp(s => !s)}>{showCmp ? "Сховати порівняння рівнів ↑" : "Порівняти рівні оздоблення ↓"}</button>
          </div>
          {showCmp && <div className="cmp">
            {Object.entries(TIERS).map(([t, tv]) => <div key={t} className={"cmpc" + (t === p.tier ? " on" : "")} onClick={() => setP("tier", t)}>
              <div className="cmpn">{tv.name}{t === p.tier ? " · обрано" : ""}</div>
              <div className="cmpv">{fmtM(cmp[t])} грн</div>
              <div className="cmpd">{t === p.tier ? "\u00a0" : (cmp[t] > cmp[p.tier] ? "+" : "−") + fmtM(Math.abs(cmp[t] - cmp[p.tier])) + " грн"}</div>
            </div>)}
          </div>}
          {mode === "house" && r.perM2 < Math.round(30081 * r.region.k) && <div className="fc no" style={{ borderRadius: 0, padding: "12px 28px" }}>
            ⚠ Розрахунок нижчий за офіційну опосередковану вартість будівництва для регіону (Мінрозвитку). Перевірте параметри — можливо, занижені обсяги.</div>}

          <div className="breakdown"><h3>Розподіл вартості</h3>
            {r.rows.map(st => <div className="brow" key={st.id}><span className="blbl">{st.name}</span>
              <div className="btrack"><div className="bfill" style={{ width: `${(st.total / maxT) * 100}%`, opacity: .15 + (st.total / maxT) * .85 }} /></div>
              <span className="bval">{fmt(st.total)} · {(st.total / r.total * 100).toFixed(0)}%</span></div>)}
          </div>

          <div className="gantt"><h3>Графік робіт</h3><div className="gg">
            {r.rows.map(st => <div className="gr" key={st.id}><span className="glbl">{st.name}</span>
              <div className="gtrack"><div className="gbar" style={{ left: `${(st.startWeek / r.totalWeeks) * 100}%`, width: `${Math.max((st.weeks / r.totalWeeks) * 100, 4)}%` }}>{stageDate(st.startWeek)}</div></div></div>)}
          </div><div className="gmeta">{r.weeks} тижнів ({r.months} міс.) · старт {fmtD(sDate)} · здача ≈ {fmtD(finishDate)} · дати орієнтовні</div></div>

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
              <span className="st-wk">{st.weeks}т</span><span className="st-tot">{fmt(st.total)}</span></div>
            {opn[st.id] && <div className="stb"><div className="scope">{st.scope}</div>
              {st.items.map(it => <div className="item" key={it.key}>
                <div className="itop"><span className="ilbl">{it.label}</span><span className="iqty">{fmt(it.qty)} {it.unit} · <b>{fmt(it.total)} грн</b></span></div>

                <div className="segrow">
                  <span className="seglbl">Робота</span>
                  {it.opts.length > 1 ? (<>
                    <div className="seg">
                      {it.opts.map((o, oi) => {
                        const pw = Math.round(o.price * r.tier.kWork * r.region.k * (st.sk || 1));
                        const short = o.name.replace("Мінімальна ринкова", "Мінімальна").replace("Середньоринкова", "Середня").replace("Верхній сегмент", "Верхня");
                        return <button key={oi} className={"segbtn" + (it.sel === oi ? " on" : "")} onClick={() => setSel(s => ({ ...s, [it.key]: oi }))}>
                          <span className="sgn">{short}</span><span className="sgp">{fmt(pw)}</span>
                        </button>;
                      })}
                    </div>
                    <span className="unitlbl">грн/{it.unit}</span>
                  </>) : (
                    <span className="sp1">{fmt(it.price)} грн/{it.unit} <span className="hint">· кураторська оцінка</span></span>
                  )}
                </div>
                {it.lw && <div className="srcline"><a href={it.lw.url} target="_blank" rel="noreferrer">rabotniki.ua</a> · {it.lw.count} пропозицій · «{it.lw.name}» · <span className="livetag">● live {live?.updated}</span></div>}

                <div className="segrow">
                  <span className="seglbl">Матеріал</span>
                  {it.matOpts ? (<>
                    <div className="seg">
                      {it.matOpts.map((m, mi) => <button key={mi} className={"segbtn" + (it.matSel === mi ? " on" : "")} onClick={() => setSel(s => ({ ...s, ["m:" + it.key]: mi }))}>
                        <span className="sgn">{m.name}</span><span className="sgp">{fmt(Math.round(m.price * r.region.k))}</span>
                      </button>)}
                    </div>
                    <span className="unitlbl">грн/{it.unit}</span>
                  </>) : (
                    <span className="sp1">{fmt(it.mat)} грн/{it.unit} <span className="hint">· орієнтовно</span></span>
                  )}
                </div>
                {it.matChosen && <div className="srcline">{it.matChosen.note ? it.matChosen.note + " · " : ""}<a href={it.matChosen.url} target="_blank" rel="noreferrer">Епіцентр →</a> · орієнтир, перевірено {MATS_CHECKED}</div>}
              </div>)}
            </div>}
          </div>)}

          <div className={"fc " + (r.budgetFit ? "ok" : "no")} style={{ borderRadius: 0, padding: "14px 28px", borderBottom: "1px solid var(--line)" }}>
            {r.budgetFit ? <>✓ Вписується у «{r.budgetName}»</> : <>⚠ Перевищує «{r.budgetName}»</>}</div>

          {furnOn && <div className="furnsec">
            <h3>Комплектація меблями, технікою та декором</h3>
            <p className="hint" style={{ marginBottom: 14 }}>Окремий підсумок — не входить у вартість ремонту. Знімайте позиції, змінюйте кількість і рівень. Ціни — орієнтир Епіцентр/Центр меблів, {MATS_CHECKED}. Фото товарів — за посиланням.</p>
            {FURN_GROUPS.map(g => {
              const items = furnRows.filter(f => f.group === g);
              if (!items.length) return null;
              const gTotal = items.reduce((a, x) => a + x.total, 0);
              return <div className="fgroup" key={g}>
                <div className="fghead"><span>{g}</span><span className="fgsum">{gTotal ? fmt(gTotal) + " грн" : "—"}</span></div>
                {items.map(f => <div className={"frow" + (f.on ? "" : " off")} key={f.id}>
                  <div className="fcheck" onClick={() => setFurn(f.id, { on: !f.on })}>{f.on ? "✓" : ""}</div>
                  <div className="fph"><img src={"/furniture/" + f.id + ".jpg"} alt="" onError={e => { e.target.style.display = "none"; }} /><span>{f.ph}</span></div>
                  <div className="fbody">
                    <div className="fname">{f.name}</div>
                    <div className="srcline" style={{ margin: 0 }}><a href={f.url} target="_blank" rel="noreferrer">Епіцентр →</a></div>
                  </div>
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

          <div className="paysec"><h3>Графік оплат</h3>
            {PAYMENT.map((ps, i) => <div className="prow" key={i}><span className="ppct">{ps.pct}%</span>
              <div className="pbody"><div className="plbl">{ps.label}</div><div className="pdesc">{ps.desc}</div>
                <div className="psum">{fmtM(Math.round(r.total * ps.pct / 100))} грн</div></div></div>)}
          </div>

          <div className="instal">
            <span>У розстрочку:</span>
            {[6, 12, 24].map(m => <button key={m} className={"fchip" + (instM === m ? " on" : "")} onClick={() => setInstM(m)}>{m} міс</button>)}
            <span className="instv">≈ <b>{fmt(Math.round((r.total + (furnOn ? furnTotal : 0)) / instM))}</b> грн/міс</span>
            <span className="hint">· рівними частинами, без урахування % банку</span>
          </div>

          <div className="inex"><h3>Що входить / не входить</h3>
            <ul className="inc">{INCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul>
            <ul className="exc">{EXCLUDES.map((x, i) => <li key={i}>{x}</li>)}</ul></div>

          <div className="renders">
            <div className="rph"><span className="t">{mode === "flat" ? "Вітальня" : "Екстер'єр"}</span><span className="d">{p.style}</span></div>
            <div className="rph"><span className="t">{mode === "flat" ? "Санвузол" : "Інтер'єр"}</span><span className="d">{r.tier.name}</span></div></div>

          <div className="nextsteps">
            <h3>Що далі</h3>
            <div className="steps">
              {[["1", "Дзвінок", "менеджер звʼяжеться протягом робочого дня"],
                ["2", "Замір", "безкоштовний виїзд на обʼєкт"],
                ["3", "Точний кошторис", "з фіксацією цін у договорі"],
                ["4", "Старт робіт", "з фотозвітами на кожному етапі"]].map(([n, t, d]) => (
                <div className="step" key={n}><span className="stepn">{n}</span><div><div className="stept">{t}</div><div className="stepd">{d}</div></div></div>))}
            </div>
          </div>

          <div className="terms"><h3>Умови</h3>
            Попередня оцінка, не є офертою. Точний кошторис — після огляду. {live ? `Розцінки на роботи — середньоринкові за даними rabotniki.ua станом на ${live.updated}; матеріали — орієнтовно.` : `Ціни станом на ${today}.`} Пропозиція дійсна 14 днів. Гарантія — 24 місяці.
            {!live && <><br /><b style={{ color: "var(--wrn)" }}>ДЕМО: ціни не перевірені.</b></>}</div>

          <div className="sf"><p className="note">ПРОПОЗИЦІЯ.БУД · {today} · {lead.name || "—"} · {lead.phone || "—"}{leadSent === "ok" && <span style={{ color: "var(--ok)" }}> · ✓ заявку передано команді</span>}</p>
            <div className="actions no-print">
              <button className="btn" onClick={() => { setView("form"); window.scrollTo(0, 0); }}>← Параметри</button>
              <button className="btn blue" onClick={() => window.print()}>Зберегти PDF</button>
            </div></div>
        </div>}
      </div>
    </div>
  );
}
