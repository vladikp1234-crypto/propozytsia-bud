export const css = `
/* ═══════════════════════════════════════════════════════════════════════
   ПРОПОЗИЦІЯ.БУД — «Папір»
   Одна система замість колишньої бази + темної теми + п'яти шарів латок.
   Принципи:
   · Тло величезне й нейтральне. Роздільник — повітря, не рамка.
   · Один акцент, і тільки для головної дії. Колір несе сенс, не прикрашає.
   · Сітка невидима: усе вирівняно по одній вертикалі, без коробок.
   · Рух повільний і рідкісний. CSS ніколи не ховає контент — це робить GSAP.
   ═══════════════════════════════════════════════════════════════════════ */

:root{
  /* Тло і папір. #F4F3EF усе ще різало очі на великому екрані — полотно
     опущено до справжнього теплого паперу, а «білі» поверхні більше не
     чисто-білі: саме пара чорне-на-#FFF і давала різь. Глибина лишається,
     бо --paper світліший за полотно; контраст поверхонь нікуди не зник. */
  --bg:#E9E6DD;
  --bg-soft:#E0DCD1;
  --paper:#F7F5F0;
  --deep:#1A1915;          /* маса: підвал, головна дія */

  /* Чорнило тепле, не крижане. На --bg: 14.1 / 6.9 / 4.8 : 1 */
  --ink:#1B1A16;
  --ink-2:#4A4840;
  --ink-3:#5F5C54;

  --line:#D6D1C4;
  --line-2:#C2BCAC;

  /* Акцент лише для стану «обрано» й посилань. Головну дію тримає чорне. */
  --acc:#1B3BD6;
  --acc-soft:#ECEFFD;

  --warn:#8E2F10;
  --warn-soft:#F7EDE8;
  --ok:#175731;
  --ok-soft:#EAF1EC;

  /* Шкала — 6 щаблів. Розсунута ще ширше: контраст розмірів і є
     ієрархія. Дрібне лишається дрібним, велике стає по-справжньому великим. */
  --t-micro:11px;
  --t-cap:13px;
  --t-body:16px;
  --t-emph:19px;
  --t-title:32px;
  --t-num:16px;

  /* Ритм. Строгий: 12 / 24 / 48 / 96 / 144. Усередині блоку — малі
     значення, між блоками — великі. Раніше вони були майже однакові,
     тому ніщо не групувалось і сторінка розсипалась. */
  --s1:12px; --s2:24px; --s3:48px; --s4:96px; --s5:144px;

  --r:3px;
  --r-lg:4px;
  --gut:40px;
  --col:1240px;

  --sans:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;

  --ease:cubic-bezier(.22,.61,.36,1);
}

/* ─── Скидання і база ─────────────────────────────────────────────── */
*{box-sizing:border-box;margin:0;padding:0}
html,body{max-width:100%;overflow-x:hidden}
body{background:var(--bg)}
::selection{background:var(--acc);color:#fff}

.app{
  min-height:100vh;
  background:var(--bg);
  color:var(--ink);
  font-family:var(--sans);
  font-size:var(--t-body);
  font-weight:500;
  line-height:1.65;
  letter-spacing:.005em;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  font-variant-numeric:tabular-nums;
}
.app,.wrap,.grid,.card,.live,.rail,.sheetwrap,.stepcol{min-width:0}

h1,h2,h3{font-weight:700;letter-spacing:-.02em;line-height:1.2}
a{color:var(--acc);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
button{font-family:inherit;color:inherit}
:focus-visible{outline:2px solid var(--acc);outline-offset:3px;border-radius:2px}

/* Дрібний моноширинний напис — надпис над блоком, одиниці, коди */
.cn,.ceye,.st-grp,.seglbl,.ogcap,.fghead,.lk,.cbx-h,.reggrp-t,.bd-h,.wc-h{
  font-family:var(--mono);
  font-size:var(--t-micro);
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:.12em;
  color:var(--ink-3);
}

/* ─── Геометричний мотив у тлі ──────────────────────────────────────
   Кілька волосяних ліній, що поволі дрейфують. Уся анімація — в GSAP. */
.fx{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.fx svg{position:absolute;inset:0;width:100%;height:100%}
.fx .fxline{stroke:var(--ink);stroke-width:1;fill:none;opacity:.045;vector-effect:non-scaling-stroke}
.fx .fxring{stroke:var(--acc);stroke-width:1;fill:none;opacity:.05;vector-effect:non-scaling-stroke}

/* ─── Смуга «бета» ─────────────────────────────────────────────────
   Це чесне застереження, а не прикраса: лишається, але тихо. */
.betabar{
  position:relative;z-index:2;
  background:transparent;
  border-bottom:1px solid var(--line);
  color:var(--ink-3);
  font-family:var(--mono);
  font-size:var(--t-micro);
  letter-spacing:.06em;
  text-align:center;
  padding:10px var(--gut);
}
.betabar b{color:var(--ink);font-weight:600}

/* ─── Шапка ────────────────────────────────────────────────────────── */
.topbar{position:sticky;top:0;z-index:40;background:var(--bg);border-bottom:1px solid transparent;transition:border-color .4s var(--ease)}
.topbar.stuck{border-bottom-color:var(--line)}
.tb{max-width:var(--col);margin:0 auto;padding:22px var(--gut);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.logo{font-size:var(--t-emph);font-weight:800;letter-spacing:-.03em}
.logo span{color:var(--ink-3);font-weight:500}
.mode{display:flex;gap:28px}
.mode button{
  background:none;border:none;padding:4px 0;cursor:pointer;
  font-size:var(--t-cap);font-weight:600;color:var(--ink-3);
  border-bottom:1.5px solid transparent;
  transition:color .3s var(--ease),border-color .3s var(--ease);
}
.mode button:hover{color:var(--ink)}
.mode button.on{color:var(--ink);border-bottom-color:var(--ink)}

/* ─── Полотно ──────────────────────────────────────────────────────── */
.wrap{position:relative;z-index:1;max-width:var(--col);margin:0 auto;padding:var(--s4) var(--gut) var(--s5)}

/* ─── Герой ────────────────────────────────────────────────────────
   Був: заголовок, під ним три окремі рядки, кожен у власній порожнечі.
   Став: щільний блок — заголовок, підзаголовок і один технічний рядок
   під спільною лінією. Порожнеча тепер навколо блоку, а не всередині. */
/* Герой на всю ширину вікна: знімок під текстом, градієнт зверху.
   Сторінка лишається світлою — темряву дає фотографія, і саме тому
   світле тло більше не сліпить: оку є на чому спинитись. */
.hero{
  position:relative;
  max-width:none;
  margin:calc(var(--s4) * -1) calc(50% - 50vw) var(--s4);
  padding:var(--s5) calc(50vw - 50% + var(--gut)) var(--s3);
  min-height:min(86vh,840px);
  display:flex;flex-direction:column;justify-content:flex-end;
  overflow:hidden;isolation:isolate;
  background:var(--deep);
}
.hero-media{position:absolute;inset:0;z-index:-1}
.hero-media img{width:100%;height:100%;object-fit:cover;object-position:50% 44%;display:block}
.hero-media::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(10,9,7,.24) 0%,rgba(10,9,7,.42) 42%,rgba(10,9,7,.86) 100%);
}
.hero-body{position:relative;width:100%;max-width:1000px}
.hblob,.dimline{display:none}

/* ─── Рівні оздоблення: три будинки замість трьох слів ───────────── */
.tiercards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:820px){.tiercards{grid-template-columns:1fr}}
.tiercard{
  display:grid;gap:0;padding:0;text-align:left;cursor:pointer;
  border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;
  background:var(--paper);
  transition:border-color .35s var(--ease),transform .35s var(--ease),box-shadow .35s var(--ease);
}
.tiercard:hover{transform:translateY(-2px);box-shadow:0 14px 34px -20px rgba(26,25,21,.42)}
.tiercard.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.tc-img{display:block;aspect-ratio:4/3;overflow:hidden;background:var(--bg-soft)}
.tc-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s var(--ease)}
.tiercard:hover .tc-img img{transform:scale(1.04)}
.tc-b{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:16px 18px}
.tc-n{font-size:var(--t-body);font-weight:700;color:var(--ink)}
.tc-p{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-2);white-space:nowrap}
.hero h1{
  font-size:clamp(46px,8.4vw,104px);
  font-weight:800;
  line-height:1.0;
  letter-spacing:-.045em;
  margin-bottom:var(--s2);
}
.hero h1 .hl{display:block;overflow:hidden;padding-bottom:.18em;margin-bottom:-.18em}
.hero h1 .hl>*{display:inline-block;will-change:transform}
/* Обидва рядки повним чорнилом. Сірий другий рядок виглядав вицвілим —
   ієрархію тут тримає порядок і розмір, а не блідість. */
.hero h1 em{font-style:normal;color:#FCFBF8}
.hero p{font-size:var(--t-emph);color:rgba(252,251,248,.86);line-height:1.5;max-width:44ch;font-weight:500}
.hero h1{color:#FCFBF8}
.hero .herometa{border-top-color:rgba(252,251,248,.28)}
.hero .howit{color:rgba(252,251,248,.82)}
.hero .howit b{color:rgba(252,251,248,.60)}
.hero .badge{color:rgba(252,251,248,.75)}

.herometa{
  display:flex;align-items:baseline;justify-content:space-between;gap:var(--s2);
  flex-wrap:wrap;margin-top:var(--s3);padding-top:var(--s1);
  border-top:1px solid var(--line-2);
}
.howit{display:flex;gap:var(--s3);align-items:baseline;flex-wrap:wrap;font-size:var(--t-cap);color:var(--ink-2);font-weight:600;margin:0}
.howit>span{display:flex;align-items:baseline;gap:9px}
.howit b{font-family:var(--mono);font-size:var(--t-micro);font-weight:500;color:var(--ink-3);background:none;width:auto;height:auto;border-radius:0;display:inline}
.howit .ha{display:none}

.badge{
  display:inline-flex;align-items:center;gap:8px;margin:0;
  font-family:var(--mono);font-size:var(--t-micro);letter-spacing:.06em;
  color:var(--ink-3);background:none;padding:0;border-radius:0;text-transform:none;
}
.badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--ok);flex:none}
.badge.demo::before{background:var(--warn)}

/* Біжучий рядок прибрано повністю */
.marq,.marq-in{display:none!important}

/* ─── Кроки майстра: суцільна навігаційна смуга, а не окремі пігулки ── */
.wsteps{display:flex;gap:0;margin-bottom:var(--s4);flex-wrap:wrap;border-top:1px solid var(--line-2);border-bottom:1px solid var(--line-2)}
.wstep{
  display:flex;align-items:baseline;gap:10px;
  background:none;border:none;border-bottom:2px solid transparent;
  margin-bottom:-1px;padding:18px 36px 16px 0;
  font-size:var(--t-cap);font-weight:600;color:var(--ink-3);
  cursor:pointer;transition:color .35s var(--ease),border-color .35s var(--ease);
}
.wstep:hover{color:var(--ink)}
.wstep .wn{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);background:none;width:auto;height:auto;border-radius:0;display:inline}
.wstep.on{color:var(--ink);border-bottom-color:var(--ink)}
.wstep.on .wn{color:var(--ink)}
.wstep.done{color:var(--ink-2)}
.wstep.done .wn{color:var(--ok)}
.wnav{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:var(--s4);padding-top:var(--s2);border-top:1px solid var(--line-2)}

/* ─── Дві колонки: робота + жива ціна ─────────────────────────────── */
.grid{display:grid;grid-template-columns:minmax(0,1fr) 328px;gap:var(--s4);align-items:start}
@media(max-width:1040px){.grid{grid-template-columns:1fr;gap:var(--s3)}}
.stepcol{display:grid;gap:var(--s4)}

/* ─── Секція. Не картка з рамкою, але й не безтілесний текст:
   масу дає великий заголовок і власна лінія зверху. ───────────────── */
.card{background:none;border:none;border-radius:0;overflow:visible;padding:0}
.ch{display:grid;gap:var(--s1);padding:0 0 var(--s3);border-bottom:none;align-items:start}
.ch h2{font-size:var(--t-title);font-weight:700;letter-spacing:-.035em;line-height:1.1;max-width:24ch}
.cn{background:none;padding:0;border-radius:0;color:var(--ink-3)}
.cb{padding:0;display:grid;gap:var(--s3)}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);align-items:start}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--s2);align-items:start}
@media(max-width:640px){.g2,.g3{grid-template-columns:1fr;gap:var(--s2)}}

label.f,.f{display:grid;gap:12px;align-content:start;font-size:var(--t-cap);font-weight:600;color:var(--ink-2);text-align:left}
.f,.f .hint,.cb label{text-align:left}
.hint,.uhint{font-weight:500;color:var(--ink-3);font-size:var(--t-cap);line-height:1.55;letter-spacing:0}
.f>span.hint{display:block;margin-top:2px}
.uhint{font-family:var(--mono);font-size:var(--t-micro);color:var(--acc)}

/* ─── Поля ─────────────────────────────────────────────────────────── */
select,input[type=number],input[type=text],input[type=tel],input[type=date]{
  font-family:var(--mono);font-size:var(--t-num);font-weight:500;
  padding:11px 0;border:none;border-bottom:1px solid var(--line-2);
  background:none;border-radius:0;width:100%;color:var(--ink);
  transition:border-color .3s var(--ease);
}
select{padding-right:20px;cursor:pointer}
select:hover,input:hover{border-bottom-color:var(--ink-3)}
select:focus,input:focus{outline:none;border-bottom-color:var(--acc);box-shadow:none}
.searchin{flex:1;min-width:200px;font-family:var(--sans);font-size:var(--t-cap);font-weight:600;padding:9px 0;border:none;border-bottom:1px solid var(--line-2);border-radius:0;background:none;color:var(--ink)}
.searchin:focus{outline:none;border-bottom-color:var(--acc)}

.rr{display:flex;align-items:center;gap:24px}
/* Доріжка лишається тонкою (її малює сам браузер), але поле має висоту,
   за яку можна вхопитись пальцем. */
input[type=range]{flex:1;accent-color:var(--acc);height:36px;cursor:pointer;background:none}
.rv{font-family:var(--mono);font-weight:600;font-size:var(--t-emph);min-width:104px;text-align:right;color:var(--ink);opacity:1!important;transform:none!important}
@media(max-width:640px){.rr{flex-wrap:wrap;gap:12px}.rv{min-width:auto;text-align:left}}

/* ─── Чіпи ─────────────────────────────────────────────────────────
   Були пігулками з 1.5px рамкою — стали тихими прямокутниками.
   Обраний тримає акцент; решта не змагається за увагу. */
.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start}
.chip{
  font-family:var(--sans);font-weight:600;font-size:var(--t-cap);
  padding:9px 15px;border:1px solid var(--line);background:none;
  border-radius:var(--r);cursor:pointer;color:var(--ink-2);
  align-self:flex-start;height:auto;
  transition:border-color .25s var(--ease),color .25s var(--ease),background-color .25s var(--ease);
}
.chip:hover{border-color:var(--ink-3);color:var(--ink)}
.chip.on,.chip.acc.on{background:var(--acc);border-color:var(--acc);color:#fff}

/* Числові чіпи — рівний сегментований ряд */
.numchips{display:inline-flex;gap:6px;flex-wrap:wrap}
.numchips>button{
  min-width:48px;height:44px;padding:0;display:grid;place-items:center;flex:none;
  font-family:var(--mono);font-size:var(--t-num);font-weight:600;
}

/* Регіони */
.reggrp{margin-bottom:20px}
.reggrp:last-child{margin-bottom:0}
.reggrp-t{margin-bottom:10px}
.regchip{display:grid;gap:2px;text-align:left;padding:10px 14px}
.regchip>span:first-child{font-size:var(--t-cap);font-weight:600}
.regland{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);font-weight:500}
.regchip.on .regland{color:rgba(255,255,255,.72)}

/* ─── Прапорці і перемикачі ────────────────────────────────────────── */
.optgrid{display:grid;grid-template-columns:1fr 1fr;gap:0}
@media(max-width:640px){.optgrid{grid-template-columns:1fr}}
.optbox{
  display:flex;gap:14px;align-items:flex-start;
  border:none;border-bottom:1px solid var(--line);border-radius:0;
  padding:16px 20px 16px 0;cursor:pointer;background:none;
  transition:border-color .25s var(--ease);
}
.optbox:hover{border-bottom-color:var(--ink-3)}
.optbox.on{background:none;border-bottom-color:var(--acc)}
.optbox .cbx,.cbx{
  width:16px;height:16px;border-radius:2px;border:1px solid var(--line-2);
  margin-top:3px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  font-size:9px;color:#fff;transition:all .25s var(--ease);
}
.optbox.on .cbx{border-color:var(--acc);background:var(--acc)}
.optbox .ot{font-weight:700;font-size:var(--t-cap);color:var(--ink);min-width:0;overflow-wrap:anywhere}
.optbox .od{font-size:var(--t-micro);color:var(--ink-3);min-width:0;overflow-wrap:anywhere;line-height:1.5}
.odelta{font-family:var(--mono);font-size:var(--t-cap);font-weight:600;color:var(--ink-2);white-space:nowrap;align-self:center;margin-left:auto}

.cond{display:grid;gap:0}
.cond .opt{display:flex;gap:14px;align-items:flex-start;border:none;border-bottom:1px solid var(--line);border-radius:0;padding:16px 0;cursor:pointer;background:none}
.cond .opt.on{background:none;border-bottom-color:var(--acc)}
.cond .rd{width:15px;height:15px;border-radius:50%;border:1px solid var(--line-2);margin-top:4px;flex-shrink:0;transition:all .25s var(--ease)}
.cond .opt.on .rd{border-color:var(--acc);background:var(--acc);box-shadow:inset 0 0 0 3px #fff}
.cond .ot{font-weight:700;font-size:var(--t-body);color:var(--ink)}
.cond .od{font-size:var(--t-cap);color:var(--ink-3);margin-top:2px}
.condnote{background:none;border-left:2px solid var(--line-2);border-radius:0;padding:4px 0 4px 16px;font-size:var(--t-cap);line-height:1.6;color:var(--ink-2)}

.ogcap{margin:0 0 12px}
.ogcap:not(:first-child){margin-top:36px}
.moreopts{display:grid;gap:0}
.recb{font-family:var(--mono);font-size:var(--t-micro);font-weight:600;color:var(--ok);background:none;border-radius:0;padding:0;margin-left:10px;text-transform:uppercase;letter-spacing:.08em}
.oqty{display:inline-flex;align-items:center;gap:12px;margin-top:12px;font-family:var(--mono);font-size:var(--t-cap)}
.oqty button,.fqty button{
  width:26px;height:26px;border-radius:var(--r);border:1px solid var(--line);
  background:none;cursor:pointer;font-size:14px;line-height:1;color:var(--ink-2);
  transition:border-color .25s var(--ease),color .25s var(--ease);
}
.oqty button:hover,.fqty button:hover{border-color:var(--acc);color:var(--acc)}
.oqty span{min-width:60px;text-align:center;font-weight:600}

/* Сегментований вибір рівня */
.segrow{display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;margin-top:12px}
.seglbl{min-width:66px}
.seg{display:flex;gap:8px;flex-wrap:wrap}
.segbtn{
  display:grid;gap:2px;border:1px solid var(--line);border-radius:var(--r);
  padding:8px 13px;background:none;cursor:pointer;text-align:left;
  transition:border-color .25s var(--ease);
}
.segbtn:hover{border-color:var(--ink-3)}
.segbtn.on{border-color:var(--acc);background:var(--acc-soft)}
.sgn{font-family:var(--sans);font-size:var(--t-micro);font-weight:600;color:var(--ink-3)}
.segbtn.on .sgn{color:var(--acc)}
.sgp{font-family:var(--mono);font-size:var(--t-cap);font-weight:600;color:var(--ink)}

/* ─── Приміщення ───────────────────────────────────────────────────── */
.roomcard{
  background:none;border:none;border-bottom:1px solid var(--line);
  border-radius:0;padding:24px 0;display:grid;gap:16px;backdrop-filter:none;
}
.roomhead{display:flex;align-items:center;gap:12px}
.roomhead .rn{font-weight:700;font-size:var(--t-emph);color:var(--ink);flex:1;opacity:1;letter-spacing:-.02em}
.roomhead .rdel{border:none;background:none;color:var(--ink-3);cursor:pointer;font-size:15px;padding:4px 8px;transition:color .25s var(--ease)}
.roomhead .rdel:hover{color:var(--warn)}
.roomcard .cn-ic{color:var(--ink-3)}
.rrow{display:flex;gap:20px;flex-wrap:wrap;align-items:flex-end}
.rf{display:grid;gap:5px;font-size:var(--t-micro);font-weight:600;color:var(--ink-3);text-transform:uppercase;letter-spacing:.08em}
.rf input,.rf select,.roomcard select,.roomcard input{
  font-family:var(--mono);font-size:var(--t-cap);padding:7px 0;
  border:none;border-bottom:1px solid var(--line-2);border-radius:0;
  background:none;color:var(--ink);width:80px;
}
.rf select,.roomcard select{width:auto;min-width:130px}
.roomcard label,.roomcard .hint{color:var(--ink-3)}
.roomcard button{color:var(--ink-2)}
.addroom{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.addroom button{
  font-size:var(--t-cap);font-weight:600;padding:8px 14px;
  border:1px dashed var(--line-2);background:none;border-radius:var(--r);
  cursor:pointer;color:var(--ink-3);transition:all .25s var(--ease);
}
.addroom button:hover{border-color:var(--acc);color:var(--acc);border-style:solid}
.roomsum{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-3)}
.chreset,.tl{font-size:var(--t-cap);font-weight:600;color:var(--acc);background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:0}

/* ─── Жива ціна: була чорна коробка, стала типографіка ────────────── */
/* Панель ціни — головний предмет на сторінці. Білий аркуш на теплому
   полотні: саме контраст поверхонь дає глибину без жодної тіні-неону. */
.rail{position:sticky;top:96px;display:grid;gap:var(--s2)}
@media(max-width:1040px){.rail{position:static;top:auto}}
/* Обов'язково .rail .live, а не просто .live: у героя є бейдж
   className="badge live", і голе правило робило з нього білу коробку.
   Та сама колізія імен, що колись сталася з .rv. */
.rail .live{
  background:var(--paper);color:var(--ink);border:1px solid var(--line);
  border-radius:var(--r-lg);padding:28px 26px 26px;
  box-shadow:0 1px 2px rgba(26,25,21,.05),0 12px 32px -18px rgba(26,25,21,.20);
}
.lk{margin-bottom:var(--s2);display:flex;align-items:center;gap:8px;color:var(--ink-3);line-height:1.5}
.dot{width:5px;height:5px;border-radius:50%;background:var(--ok);flex:none}
.lv{font-family:var(--mono);font-weight:500;font-size:clamp(30px,3.4vw,40px);line-height:1.1;letter-spacing:-.045em;color:var(--ink)}
.lv em{font-style:normal;color:var(--ink)}
.ls{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-3);margin-top:var(--s1);line-height:1.6}
.usdline{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-2);margin-top:4px}
.usdrate{color:var(--ink-3);font-size:var(--t-micro)}
.usdsm{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-3);font-weight:400}
.lr{display:flex;justify-content:space-between;gap:12px;font-size:var(--t-cap);padding:9px 0;border-top:1px solid var(--line);font-family:var(--mono);color:var(--ink-3)}
.lr:first-of-type{margin-top:24px}
.lr span:first-child{min-width:0;overflow-wrap:anywhere}
.lr span:last-child{color:var(--ink)}
/* Головна дія — чорна, не синя. Синій кричав; чорне на теплому папері
   виглядає дорожче й лишає акцент для станів «обрано». */
.livebtn{
  width:100%;margin-top:var(--s2);font-family:var(--sans);font-weight:700;font-size:var(--t-cap);
  background:var(--deep);color:#fff;border:1px solid var(--deep);border-radius:var(--r);padding:17px;
  cursor:pointer;letter-spacing:.01em;
  transition:background-color .35s var(--ease),transform .35s var(--ease);
}
.livebtn:hover{background:#26262A;transform:translateY(-1px)}
.livebtn:active{transform:translateY(0)}
.sharebtn{
  width:100%;font-family:var(--sans);font-weight:600;font-size:var(--t-cap);padding:13px;
  border-radius:var(--r);border:1px solid var(--line);background:none;color:var(--ink-3);cursor:pointer;
  transition:border-color .25s var(--ease),color .25s var(--ease);
}
.sharebtn:hover{border-color:var(--ink-3);color:var(--ink)}
.fc{border-radius:0;padding:12px 0 0;font-size:var(--t-cap);font-weight:600;line-height:1.55;background:none}
.fc.ok{color:var(--ok)}
.fc.no{color:var(--warn)}
.adv-open{
  width:100%;font-family:var(--sans);font-weight:600;font-size:var(--t-cap);padding:12px;
  border-radius:var(--r);border:1px solid var(--line-2);background:none;color:var(--ink-2);cursor:pointer;
  transition:border-color .25s var(--ease),color .25s var(--ease);
}
.adv-open:hover{border-color:var(--ink);color:var(--ink)}

/* Пояснення «чому змінилось» */
.whychange{margin-top:20px;padding:16px 0 0;background:none;border:none;border-top:1px solid var(--line);border-radius:0}
.wc-h{margin-bottom:8px;color:var(--ink)}
.wc-d{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);line-height:1.7}
.wc-q{color:var(--acc)}

/* ─── Мобільна панель ──────────────────────────────────────────────── */
.mobilebar{display:none}
@media(max-width:960px){
  .mobilebar{
    display:flex;position:fixed;left:0;right:0;bottom:0;z-index:50;
    background:rgba(233,230,221,.92);backdrop-filter:blur(16px);
    border-top:1px solid var(--line);
    padding:12px 20px calc(12px + env(safe-area-inset-bottom));
    align-items:center;gap:16px;
  }
  .mb-sum{flex:1;display:grid;gap:1px;min-width:0}
  .mb-v{font-family:var(--mono);font-weight:600;font-size:var(--t-emph);color:var(--ink)}
  .mb-s{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3)}
  .mb-btn{font-family:var(--sans);font-weight:700;font-size:var(--t-cap);background:var(--acc);color:#fff;border:none;border-radius:var(--r);padding:14px 20px;cursor:pointer}
  .wrap{padding-bottom:180px}
}

/* ─── Банер перевищення бюджету ────────────────────────────────────── */
.budgbanner{
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:16px 0;margin-bottom:40px;cursor:pointer;
  border-top:1px solid var(--warn);border-bottom:1px solid var(--line);
  background:none;font-size:var(--t-cap);
}
.bb-i{color:var(--warn);display:flex;align-items:center}
.bb-t{color:var(--ink-2);font-weight:600}
.bb-t b{color:var(--ink)}
.bb-b{margin-left:auto;font-weight:700;color:var(--acc);background:none;border:none;cursor:pointer;font-size:var(--t-cap)}

/* ─── Модалка ──────────────────────────────────────────────────────── */
.modal-bg{position:fixed;inset:0;z-index:100;background:rgba(26,25,21,.38);backdrop-filter:blur(3px);display:grid;place-items:center;padding:24px}
.modal{background:var(--paper);border:1px solid var(--line);border-radius:var(--r-lg);max-width:520px;width:100%;max-height:86vh;overflow:auto;padding:36px}
.modal-h{display:flex;align-items:flex-start;gap:16px;margin-bottom:8px}
.modal-t{font-size:var(--t-title);font-weight:700;flex:1;letter-spacing:-.02em}
.modal-x{background:none;border:none;font-size:18px;color:var(--ink-3);cursor:pointer;padding:0 4px;line-height:1}
.modal-x:hover{color:var(--ink)}
.modal-s{font-size:var(--t-cap);color:var(--ink-3);margin-bottom:24px;line-height:1.6}
.modal-plan{font-size:var(--t-cap);color:var(--ink-2);padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:8px}
.modal-list{display:grid}
.modal-foot{margin-top:24px;display:flex;justify-content:flex-end}
.madv{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)}
.madv-top{border-top:none}
.madv-star{color:var(--acc);font-size:var(--t-micro)}
.madv-t{font-weight:700;font-size:var(--t-cap);line-height:1.4;color:var(--ink)}
.madv-w{font-size:var(--t-micro);color:var(--ink-3);line-height:1.5}
.madv-s{font-family:var(--mono);font-size:var(--t-cap);font-weight:600;color:var(--ok);white-space:nowrap}
.madv-b{
  font-family:var(--sans);font-weight:600;font-size:var(--t-micro);padding:7px 12px;
  border-radius:var(--r);border:1px solid var(--line);background:none;cursor:pointer;white-space:nowrap;color:var(--ink-2);
}
.madv-b:hover{border-color:var(--acc);color:var(--acc)}

/* ─── Порівняння варіантів ─────────────────────────────────────────── */
.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:0}
.vcard{background:none;border:none;border-top:1px solid var(--line);border-radius:0;padding:20px 24px 20px 0}
.vcard.current{border-top-color:var(--acc);background:none}
.vname{font-weight:700;font-size:var(--t-body);margin-bottom:8px;color:var(--ink)}
.vsum{font-family:var(--mono);font-weight:600;font-size:var(--t-emph);color:var(--ink)}
.vmeta{font-size:var(--t-cap);color:var(--ink-3);margin-top:4px}
.vdelta{font-family:var(--mono);font-size:var(--t-cap);font-weight:600;margin-top:12px;color:var(--ink-2)}
.vchip{
  display:inline-flex;align-items:center;font-family:var(--mono);font-size:var(--t-micro);
  font-weight:600;color:var(--ink-3);background:none;border:none;border-radius:0;
  padding:0;margin-left:8px;vertical-align:middle;cursor:help;
}

/* ─── Режим фірми ──────────────────────────────────────────────────── */
.adminbar{
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;
  background:none;border:none;border-top:1px solid var(--line-2);border-bottom:1px solid var(--line-2);
  border-radius:0;padding:14px 0;margin-bottom:32px;font-size:var(--t-cap);font-weight:600;color:var(--ink-2);
}
.adminbar .ab-t{font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px}
.adminbar input[type=range]{accent-color:var(--ink)}

/* ─── Підвал сторінки і «чому ми» ──────────────────────────────────── */
.ground{margin-top:var(--s5);display:grid;gap:var(--s5)}
.whyus{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--s3);border-top:1px solid var(--line-2);padding-top:var(--s3)}
.wu{display:grid;gap:10px;align-content:start}
.wu-i{color:var(--ink-3)}
.wu-t{font-weight:700;font-size:var(--t-emph);color:var(--ink);letter-spacing:-.025em}
.wu-d{font-size:var(--t-cap);color:var(--ink-2);line-height:1.65}
.faq{display:grid;max-width:820px}
.faq h3{font-size:var(--t-title);margin-bottom:var(--s2);letter-spacing:-.035em;line-height:1.1}
.faq details{border-bottom:1px solid var(--line);padding:var(--s2) 0}
.faq details:first-of-type{border-top:1px solid var(--line)}
.faq summary{cursor:pointer;font-weight:700;font-size:var(--t-body);list-style:none;display:flex;justify-content:space-between;gap:20px;color:var(--ink)}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:'+';font-family:var(--mono);color:var(--ink-3);font-weight:400;font-size:var(--t-emph);line-height:1}
.faq details[open] summary::after{content:'\\2212'}
.faq p{margin-top:14px;font-size:var(--t-cap);color:var(--ink-2);line-height:1.75;max-width:64ch}

/* Підвал — темна смуга на всю ширину. Сторінка нарешті має низ і вагу;
   без неї композиція просто розчинялась у білому. */
.footer{
  margin:var(--s5) calc(50% - 50vw) calc(var(--s5) * -1);
  padding:var(--s4) calc(50vw - 50% + var(--gut)) var(--s3);
  background:var(--deep);color:#F2F2F0;display:grid;gap:var(--s3);border-top:none;
}
.ft{display:grid;grid-template-columns:2fr 1fr 1fr;gap:var(--s3);max-width:var(--col);width:100%}
@media(max-width:760px){.ft{grid-template-columns:1fr;gap:var(--s2)}}
.ft-logo{font-size:var(--t-emph);font-weight:800;letter-spacing:-.03em;color:#fff}
.ft-logo span{color:#8B8F98;font-weight:500}
.ft-sub{font-size:var(--t-cap);color:#9AA0A8;margin-top:8px}
.ft-col{display:grid;gap:10px;align-content:start;font-size:var(--t-cap);color:#C9CDD3}
.ft-h{font-family:var(--mono);font-size:var(--t-micro);text-transform:uppercase;letter-spacing:.12em;color:#7E838C;margin-bottom:6px}
.ft-col a{color:#C9CDD3}
.ft-col a:hover{color:#fff}
.ft-legal{font-size:var(--t-micro);color:#7E838C;line-height:1.7;padding-top:var(--s2);border-top:1px solid #2A2A2E;max-width:var(--col)}

/* ─── Кнопки ───────────────────────────────────────────────────────── */
.btn{
  font-family:var(--sans);font-weight:600;font-size:var(--t-cap);padding:12px 20px;
  border-radius:var(--r);cursor:pointer;border:1px solid var(--line-2);background:none;color:var(--ink);
  transition:border-color .25s var(--ease),background-color .25s var(--ease);
}
.btn:hover{border-color:var(--ink)}
.btn.blue{background:var(--deep);border-color:var(--deep);color:#fff;font-weight:700}
.btn.blue:hover{background:#26262A;border-color:#26262A}
.mb-btn{background:var(--deep)!important}

/* ═══════════════════════════════════════════════════════════════════
   КОШТОРИС — аркуш. Тепер він не контрастує з сайтом, а продовжує його.
   ═══════════════════════════════════════════════════════════════════ */
.sheetwrap{display:grid;grid-template-columns:minmax(0,1fr) 292px;gap:64px;align-items:start}
.sheetwrap>.calcbar{grid-column:2;grid-row:1}
.sheetwrap>.sheet{grid-column:1;grid-row:1;min-width:0}
@media(max-width:1080px){
  .sheetwrap{grid-template-columns:1fr;gap:40px}
  .sheetwrap>.calcbar,.sheetwrap>.sheet{grid-column:1;grid-row:auto}
  .calcbar{position:static;order:-1}
}

.sheet{
  background:var(--paper);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;
  box-shadow:0 1px 2px rgba(26,25,21,.05),0 20px 60px -30px rgba(26,25,21,.26);
}
.cover{padding:88px 56px 64px;text-align:center;background:none;border-bottom:1px solid var(--line)}
.ceye{margin-bottom:20px}
.cover h1{font-size:clamp(26px,4vw,38px);font-weight:700;margin-bottom:12px;letter-spacing:-.03em}
.csub{color:var(--ink-2);font-size:var(--t-body)}
.cmeta{margin-top:24px;font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-3)}
.dochead{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:16px 48px;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3)}
.dh-l{display:flex;gap:16px;flex-wrap:wrap}
.dh-no{color:var(--ink)}
.dh-d{color:var(--ink-3)}
.dh-qr{opacity:.85}
.stamp{font-family:var(--mono);font-size:var(--t-micro);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3)}

.snums{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid var(--line)}
@media(max-width:640px){.snums{grid-template-columns:1fr}}
.sn2{padding:36px 48px;border-right:1px solid var(--line)}
.sn2:last-child{border-right:none}
@media(max-width:640px){.sn2{border-right:none;border-bottom:1px solid var(--line);padding:28px 32px}}
.sn2 .k{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);margin-bottom:10px;text-transform:uppercase;letter-spacing:.12em}
.sn2 .v{font-family:var(--mono);font-weight:600;font-size:clamp(20px,2.6vw,26px);letter-spacing:-.02em}
.sn2 .v em{font-style:normal;color:var(--ink-3)}

.confstrip{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:16px 48px;border-bottom:1px solid var(--line)}
.timeline{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-2);font-weight:500}
.confb{font-family:var(--mono);font-size:var(--t-micro);color:var(--ok);background:none;padding:0;border-radius:0;font-weight:600}

.cmp{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid var(--line)}
@media(max-width:640px){.cmp{grid-template-columns:1fr}}
.cmpc{padding:24px 32px;border-right:1px solid var(--line);cursor:pointer;transition:background-color .25s var(--ease)}
.cmpc:last-child{border-right:none}
.cmpc:hover{background:var(--bg)}
.cmpc.on{background:var(--acc-soft)}
.cmpn{font-family:var(--mono);font-size:var(--t-micro);font-weight:600;color:var(--ink-3);text-transform:uppercase;letter-spacing:.12em}
.cmpc.on .cmpn{color:var(--acc)}
.cmpv{font-family:var(--mono);font-weight:600;font-size:var(--t-title);margin-top:8px;letter-spacing:-.02em}
.cmpd{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);margin-top:4px}

.breakdown{padding:44px 48px 36px;border-bottom:1px solid var(--line)}
.breakdown h3,.furnsec h3,.terms h3,.inex h3{font-size:var(--t-emph);font-weight:700;margin-bottom:24px;letter-spacing:-.02em}
.bd-h{margin-bottom:20px}
.bd-bar{display:flex;height:6px;border-radius:3px;overflow:hidden;background:var(--bg-soft)}
.bd-seg{height:100%}
.bd-legend{display:grid;gap:10px;margin-top:24px}
.bd-li{display:flex;align-items:center;gap:12px;font-size:var(--t-cap)}
.bd-dot{width:8px;height:8px;border-radius:2px;flex:none}
.bd-n{color:var(--ink-2);flex:1;min-width:0;overflow-wrap:anywhere}
.bd-p{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);min-width:44px;text-align:right}
.bd-v{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink);min-width:96px;text-align:right}

.filterbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:18px 48px;border-bottom:1px solid var(--line)}
.fchip{
  font-family:var(--sans);font-weight:600;font-size:var(--t-micro);padding:7px 13px;
  border:1px solid var(--line);background:none;border-radius:var(--r);cursor:pointer;color:var(--ink-3);
  transition:border-color .25s var(--ease),color .25s var(--ease);
}
.fchip:hover{border-color:var(--ink-3);color:var(--ink)}
.fchip.on{background:var(--ink);border-color:var(--ink);color:#fff}
.fchip.x{margin-left:auto;border-style:dashed}

.stage{border-bottom:1px solid var(--line);margin-bottom:0}
.stage:last-of-type{border-bottom:none}
.sth{display:flex;align-items:center;gap:14px;padding:20px 48px;cursor:pointer;user-select:none;transition:background-color .2s var(--ease)}
.sth:hover{background:var(--bg)}
.st-caret{font-size:var(--t-micro);color:var(--ink-3);transition:transform .3s var(--ease);width:14px}
.stage.open .st-caret{transform:rotate(90deg);color:var(--acc)}
.st-grp{background:none;border-radius:0;padding:0;color:var(--ink-3)}
.st-name{font-weight:600;font-size:var(--t-body);flex:1;color:var(--ink)}
.st-badge{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);background:none;border-radius:0;padding:0}
.st-wk{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-3);min-width:56px;text-align:right}
.st-tot{font-family:var(--mono);font-weight:600;font-size:var(--t-body);min-width:110px;text-align:right;color:var(--ink)}
.st-pct{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);min-width:40px;text-align:right}
.st-share{display:none}
.st-main{display:flex;align-items:center;gap:14px;flex:1;min-width:0}
.st-sub{font-size:var(--t-micro);color:var(--ink-3)}
.st-top{display:flex;align-items:center;gap:14px}
.stage.off .st-name,.stage.off .st-grp,.stage.off .st-wk{opacity:.45}
.stage.off .st-tot{color:var(--ink-3)}
.stb{background:none;border-top:1px solid var(--line);padding:28px 48px 36px;display:grid;gap:20px}
.stb .scope{font-size:var(--t-cap);color:var(--ink-3);line-height:1.65;padding-bottom:16px;border-bottom:1px solid var(--line)}

.item{padding:18px 0;border-bottom:1px solid var(--line)}
.item:last-child{border-bottom:none;padding-bottom:0}
.item .itop{display:flex;justify-content:space-between;gap:14px;font-size:var(--t-cap);margin-bottom:10px;flex-wrap:wrap}
.item .ilbl{font-weight:700;color:var(--ink)}
.item .iqty{font-family:var(--mono);color:var(--ink-3)}
.unitlbl{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3)}
.sp1{font-family:var(--mono);font-size:var(--t-cap);font-weight:600}
.srcline{font-size:var(--t-micro);color:var(--ink-3);margin:8px 0 0 82px;line-height:1.6}
.srcline a{color:var(--ink-2);font-weight:500;text-decoration:underline;text-underline-offset:2px}
@media(max-width:640px){.srcline{margin-left:0}}
.livetag{color:var(--ok);font-size:var(--t-micro);margin-left:6px}
.trnd{font-weight:600}
.trnd.up{color:var(--warn)}
.trnd.dn{color:var(--ok)}
.key{color:var(--ink)}

.landsec{background:none;padding:44px 48px;border-bottom:1px solid var(--line)}
.landrow{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--line);font-size:var(--t-cap);font-family:var(--mono);color:var(--ink-2)}
.landrow:last-child{border-bottom:none}

.furnsec{padding:44px 48px;border-bottom:1px solid var(--line)}
.fgroup{margin-bottom:32px}
.fghead{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line);color:var(--ink-3)}
.fgsum{font-family:var(--mono);text-transform:none;letter-spacing:0;color:var(--ink)}
.frow{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--line);flex-wrap:wrap}
.frow.off{opacity:.4}
.fcheck{width:16px;height:16px;border-radius:2px;border:1px solid var(--line-2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;flex-shrink:0}
.frow:not(.off) .fcheck{border-color:var(--acc);background:var(--acc)}
.fph{width:44px;height:44px;border-radius:var(--r);background:var(--bg-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;position:relative}
.fph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fbody{flex:1;min-width:160px}
.fname{font-weight:600;font-size:var(--t-cap);color:var(--ink)}
.fqty{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:var(--t-cap)}
.fqty span{min-width:56px;text-align:center}
.fseg .segbtn{padding:6px 10px}
.ftot{font-family:var(--mono);font-weight:600;font-size:var(--t-cap);min-width:88px;text-align:right}
.furnsum{text-align:right;font-family:var(--mono);font-size:var(--t-body);padding-top:20px}
.furnsum b{color:var(--ink)}
@media(max-width:760px){.frow{gap:10px}.fseg{width:100%;margin-left:32px}.ftot{margin-left:auto}}
.furntotals{
  display:flex;gap:32px;flex-wrap:wrap;justify-content:center;padding:20px 48px;
  border-top:1px solid var(--line);font-size:var(--t-cap);color:var(--ink-3);font-family:var(--mono);
}
.furntotals b{color:var(--ink)}
.ft-sum b{color:var(--ink)}

.inex{padding:44px 48px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:36px}
@media(max-width:640px){.inex{grid-template-columns:1fr}}
.inex h3{grid-column:1/-1}
.inex ul{list-style:none;font-size:var(--t-cap);line-height:2;color:var(--ink-2)}
.inex .inc li::before{content:'\\2713\\00a0\\00a0';color:var(--ok)}
.inex .exc li::before{content:'\\2715\\00a0\\00a0';color:var(--ink-3)}
.terms{padding:36px 48px;border-bottom:1px solid var(--line);font-size:var(--t-cap);color:var(--ink-3);line-height:1.75}
.terms h3{color:var(--ink);margin-bottom:14px}
.sf{padding:32px 48px;display:flex;justify-content:space-between;gap:20px;align-items:center;flex-wrap:wrap}
.sf .note{font-size:var(--t-micro);color:var(--ink-3);max-width:520px;line-height:1.6}
.actions{display:flex;gap:10px}
.ltable{width:100%;border-collapse:collapse;font-size:var(--t-cap)}
.ltable th{font-family:var(--mono);font-size:var(--t-micro);text-transform:uppercase;letter-spacing:.1em;color:var(--ink-3);text-align:left;padding:14px 18px;border-bottom:1px solid var(--line);background:var(--bg-soft)}
.ltable td{padding:14px 18px;border-bottom:1px solid var(--line);vertical-align:top;line-height:1.6}
.ltable tr:last-child td{border-bottom:none}
.vh2{font-size:var(--t-title);font-weight:700;letter-spacing:-.025em;margin-bottom:24px}
.leadwrap{max-width:520px;margin:0 auto}
.leadwrap h2{font-size:var(--t-title);margin-bottom:8px;letter-spacing:-.025em}
.leadwrap>p{color:var(--ink-2);font-size:var(--t-body);margin-bottom:32px}
.tt{border:1px solid var(--line);border-radius:var(--r);overflow:hidden;font-size:var(--t-micro);background:none}
.ttr{display:grid;grid-template-columns:84px 1fr 1fr 1fr;border-bottom:1px solid var(--line)}
.ttr:last-child{border-bottom:none}
.ttr.h{background:var(--bg-soft);font-family:var(--mono);text-transform:uppercase;color:var(--ink-3);letter-spacing:.08em}
.ttr>div{padding:10px 12px;border-right:1px solid var(--line)}
.ttr>div:last-child{border-right:none}
.ttr>div:first-child{font-weight:600}
.sn{background:none;border-left:2px solid var(--line-2);border-radius:0;padding:4px 0 4px 16px;font-size:var(--t-cap);line-height:1.65;color:var(--ink-2)}
.sn b{color:var(--ink)}
.note{font-size:var(--t-micro);color:var(--ink-3)}
.otline{font-size:var(--t-micro);color:var(--ink-3)}
.cn-ic,.ic,.ricon{flex:none}
.cn-ic{color:var(--ink-3)}

/* ─── Калькулятор поруч із кошторисом ──────────────────────────────── */
.calcbar{
  position:sticky;top:96px;display:grid;gap:14px;padding:26px 24px 24px;
  border:1px solid var(--line);border-radius:var(--r-lg);
  background:var(--paper);backdrop-filter:none;
  box-shadow:0 1px 2px rgba(26,25,21,.05),0 12px 32px -18px rgba(26,25,21,.20);
}
.cbx-h{margin-bottom:2px}
.cbx-row{display:flex;justify-content:space-between;align-items:baseline;gap:14px;font-size:var(--t-cap);color:var(--ink-2)}
.cbx-row b{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink);font-weight:600}
.cbx-row.sum{border-top:1px solid var(--line);padding-top:12px;margin-top:4px}
.cbx-row.sum b{color:var(--ink)}
.cbx-ctl{display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:center;margin:4px 0 8px}
.cbx-ctl>span{grid-column:1/-1;font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3)}
.cbx-ctl input[type=range]{width:100%;accent-color:var(--acc);height:2px}
.cbx-k{font-family:var(--mono);font-size:var(--t-cap);color:var(--ink-2);min-width:40px;text-align:right}
.cbx-t{
  display:flex;align-items:center;gap:10px;width:100%;padding:11px 0;
  border:none;border-bottom:1px solid var(--line);border-radius:0;cursor:pointer;
  background:none;color:var(--ink-2);font-family:var(--sans);font-size:var(--t-cap);font-weight:600;
  text-align:left;transition:color .25s var(--ease),border-color .25s var(--ease);
}
.cbx-t:hover{color:var(--ink);border-bottom-color:var(--ink-3)}
.cbx-t.on{color:var(--ink);border-bottom-color:var(--acc)}
.cbx-t>span{width:15px;height:15px;flex:none;border-radius:2px;border:1px solid var(--line-2);display:grid;place-items:center;font-size:9px;color:#fff}
.cbx-t.on>span{border-color:var(--acc);background:var(--acc)}
.cbx-t em{margin-left:auto;font-style:normal;font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3)}
.cbx-t.on em{color:var(--ink)}
.cbx-grand{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px;margin-top:8px;padding-top:16px;border-top:1px solid var(--line-2)}
.cbx-grand>span{font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3);text-transform:uppercase;letter-spacing:.1em}
.cbx-grand b{font-family:var(--mono);font-size:var(--t-title);font-weight:600;color:var(--ink);letter-spacing:-.02em;text-shadow:none}
.cbx-grand em{width:100%;font-style:normal;font-family:var(--mono);font-size:var(--t-micro);color:var(--ink-3)}
.cbx-reset{background:none;border:none;color:var(--ink-3);font-family:var(--sans);font-size:var(--t-micro);cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:0;text-align:left}
.cbx-reset:hover{color:var(--ink)}
.cbx-note{font-size:var(--t-micro);line-height:1.6;color:var(--ink-3);margin-top:4px}

/* ═══ РУХ ══════════════════════════════════════════════════════════
   Правило, оплачене білим екраном: CSS ніколи не ховає контент.
   Якщо GSAP не завантажиться — сторінка просто стоїть на місці, видима.
   ═══════════════════════════════════════════════════════════════════ */
html{scroll-behavior:auto}
.card,.chip,.optbox,.segbtn,.btn,.wstep,.cbx-t,.mode button{will-change:auto}

@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .fx{display:none}
}

/* ═══ ДРУК ═════════════════════════════════════════════════════════ */
@media print{
  .no-print{display:none!important}
  .app{background:#fff}
  .wrap{padding:0;max-width:100%}
  .fx{display:none}
  .sheet{border:none;border-radius:0;box-shadow:none}
  .topbar,.betabar{display:none}
  .snums,.breakdown,.stage,.inex,.terms,.sf,.furnsec,.landsec{break-inside:avoid}
  *{color:#111!important}
  .sheet{--ink-2:#444;--ink-3:#555}
}

/* ═══ АДАПТИВ ══════════════════════════════════════════════════════ */
@media(max-width:1040px){
  :root{--gut:32px;--s4:72px;--s5:104px;--t-title:28px}
  .hero h1{font-size:clamp(42px,8vw,72px)}
}
@media(max-width:640px){
  :root{--gut:20px;--s3:32px;--s4:56px;--s5:80px;--t-title:26px;--t-emph:17px}
  .tb{padding:18px var(--gut)}
  .mode{gap:20px}
  .wrap{padding-bottom:190px}
  .hero h1{font-size:clamp(38px,11vw,54px);letter-spacing:-.035em}
  .howit{gap:20px}
  .herometa{gap:14px}
  .wsteps{overflow-x:auto;flex-wrap:nowrap;scrollbar-width:none}
  .wsteps::-webkit-scrollbar{display:none}
  .wstep{white-space:nowrap;padding-right:24px}
  .rail .live{padding:22px 20px}
  .cover{padding:44px 24px 36px}
  .dochead,.confstrip,.filterbar{padding-left:24px;padding-right:24px}
  .sth,.stb,.breakdown,.furnsec,.landsec,.inex,.terms,.sf,.furntotals{padding-left:24px;padding-right:24px}
  .sn2{padding:24px}
  .modal{padding:28px 22px}
}

/* Дрібні перекриття тексту — не давати довгим рядкам ламати сітку */
.ch h2{padding-right:8px;word-break:break-word}
.st-name,.bd-n,.fname,.madv-t{overflow-wrap:anywhere}

/* ═══ ЦІЛІ ДЛЯ ПАЛЬЦЯ ══════════════════════════════════════════════
   Мінімалізм зняв «пухкі» відступи, а разом з ними — і зручність
   натискання. Повертаємо площу дотику, не повертаючи візуальної ваги:
   рамок і фонів тут немає, збільшується лише зона. */
@media (pointer:coarse){
  .mode button{padding:12px 0}
  .wstep{padding-top:8px;padding-bottom:20px}
  .cbx-t{padding-top:15px;padding-bottom:15px}
  .chip{padding:12px 16px}
  .fchip{padding:10px 14px}
  .oqty button,.fqty button{width:34px;height:34px}
  .roomhead .rdel{padding:8px 12px}
  .ft-col a{padding:5px 0;display:inline-block}
  .faq summary{padding:6px 0}
}
`;
