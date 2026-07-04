import React, { useState, useMemo, useEffect } from "react";

const REGIONS=[{id:"kyiv",name:"м. Київ",k:1},{id:"irpin",name:"Ірпінь / Буча",k:.97},{id:"brovary",name:"Бровари",k:.96},{id:"boryspil",name:"Бориспіль",k:.95},{id:"vyshneve",name:"Вишневе / Крюківщина",k:.96},{id:"obukhiv",name:"Обухів / Українка",k:.93},{id:"oblast",name:"Інше, Київська обл.",k:.92}];
const TIERS={econom:{name:"Економ",kWork:.85,kMat:.8},standart:{name:"Стандарт",kWork:1,kMat:1},premium:{name:"Преміум",kWork:1.25,kMat:1.9}};
const TIER_TABLE=[{row:"Стіни",econom:"Шпалери під фарбування",standart:"Шпаклівка + якісна фарба",premium:"Декоративні покриття"},{row:"Підлога",econom:"Ламінат 32 кл.",standart:"Ламінат 33 / вініл",premium:"Інженерна дошка"},{row:"Плитка",econom:"Україна · 400–600",standart:"Україна/Польща · 800–1200",premium:"Іспанія/Італія · 2000+"},{row:"Санвузол",econom:"Cersanit, Kolo",standart:"Grohe, Geberit",premium:"Duravit, Hansgrohe"},{row:"Двері",econom:"Ламіновані · 5–7т",standart:"Шпоновані · 10–15т",premium:"Масив/приховані · 25+"},{row:"Електрика",econom:"Мінімум точок",standart:"Schneider/Legrand",premium:"Розумний дім"}];
const STYLE_MODS={"Сучасний":{mods:{},note:"Базовий орієнтир."},"Мінімалізм":{mods:{paint:1.15,doors:1.2,ceil:1.1},note:"Ідеальні площини, приховані двері."},"Класика":{mods:{paint:1.2,ceil:1.15,doors:1.1},note:"Молдинги, карнизи, фільонки."},"Лофт":{mods:{walls:.85,paint:.9,ceil:.9},note:"Відкриті поверхні — економія."},"Скандинавський":{mods:{paint:1.05},note:"Світле оздоблення."},"Джапанді":{mods:{paint:1.1,flooring:1.15,doors:1.15},note:"Натуральні матеріали."}};
const SRC={price:"https://www.rabotniki.ua/uk/price/kiev",otd:"https://www.rabotniki.ua/uk/otdelochnye-raboty",common:"https://www.rabotniki.ua/uk/obschestroitelnye-montazhnye-raboty",beton:"https://www.rabotniki.ua/uk/betonnye-raboty",fund:"https://www.rabotniki.ua/uk/fundament"};

const FLAT_STAGES=[
{id:"demo",name:"Демонтаж",onlyIf:p=>p.condition==="old",weeks:()=>1.5,scope:"Зняття старих покриттів, демонтаж сантехніки, вивіз сміття",items:[{live:"demontazh",label:"Демонтаж + вивіз",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:550,mat:150},{name:"«ДемонтажПро» · 4.9★",src:"rabotniki.ua · демо",url:SRC.common,price:490,mat:150}]}]},
{id:"walls",name:"Штукатурка стін",skipIf:p=>p.condition==="partial",weeks:()=>3,scope:"Штукатурка по маяках, ґрунтування у 2 шари",items:[{live:"walls_plaster",label:"Штукатурка по маяках",unit:"м²",qty:p=>Math.round(p.area*2.6),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:320,mat:170},{name:"Машинна «МехШтук» · 4.8★",src:"rabotniki.ua · демо",url:SRC.otd,price:260,mat:190},{name:"Майстер Олег В. · 5.0★",src:"rabotniki.ua · демо",url:SRC.otd,price:360,mat:170}]},{live:"walls_primer",label:"Ґрунтування",unit:"м²",qty:p=>Math.round(p.area*2.6),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:35,mat:25}]}]},
{id:"floor",name:"Стяжка підлоги",skipIf:p=>p.condition==="partial",weeks:()=>1.5,scope:"Напівсуха стяжка з армуванням, гідроізоляція",items:[{live:"screed",label:"Стяжка напівсуха",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.beton,price:260,mat:210},{name:"«СтяжкаКомплекс» · 4.9★",src:"rabotniki.ua · демо",url:SRC.beton,price:230,mat:230}]}]},
{id:"electro",name:"Електромонтаж",weeks:()=>2.5,scope:"Штробування, кабель, підрозетники, щиток, заземлення",items:[{live:"electro_point",label:"Електроточка",unit:"шт",qty:p=>8+p.rooms*7+p.bathrooms*3,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:650,mat:450},{name:"«ЕлектроДім» · 4.9★",src:"rabotniki.ua · демо",url:SRC.price,price:720,mat:430}]},{label:"Збірка щитка",unit:"шт",qty:()=>1,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:6500,mat:5500}]}]},
{id:"plumb",name:"Сантехнічна розводка",weeks:()=>1.5,scope:"Розводка PPR/PEX, каналізація ПВХ, гідроіспитання",items:[{live:"plumb_bath",label:"Розводка, санвузол",unit:"сануз.",qty:p=>p.bathrooms,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:14000,mat:11000},{name:"«АкваМонтаж» · 4.8★",src:"rabotniki.ua · демо",url:SRC.price,price:12500,mat:11500}]},{label:"Точки кухні",unit:"компл.",qty:()=>1,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:5000,mat:3600}]}]},
{id:"ceil",name:"Стелі",weeks:()=>1.5,scope:"Натяжна стеля або ГК конструкція",items:[{live:"ceiling",label:"Стеля",unit:"м²",qty:p=>Math.round(p.area*.92),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:340,mat:420},{name:"«СтеляСервіс» · 4.9★",src:"rabotniki.ua · демо",url:SRC.otd,price:280,mat:460}]}]},
{id:"tile",name:"Плиткові роботи",weeks:()=>2.5,scope:"Гідроізоляція, укладання, затирка, фартух кухні",items:[{live:"tile",label:"Плитка: санвузли",unit:"м²",qty:p=>p.bathrooms*24,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:850,mat:900},{name:"Андрій М. · 5.0★",src:"rabotniki.ua · демо",url:SRC.otd,price:950,mat:900}]},{label:"Фартух кухні",unit:"м²",qty:()=>5,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:950,mat:1000}]}]},
{id:"paint",name:"Шпаклівка та фарбування",weeks:()=>3,scope:"Фінішна шпаклівка, шліфування, фарбування у 2 шари",items:[{live:"putty",label:"Шпаклівка",unit:"м²",qty:p=>Math.round(p.area*2.3),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:260,mat:90},{name:"Світлана П. · 4.9★",src:"rabotniki.ua · демо",url:SRC.otd,price:290,mat:85}]},{live:"painting",label:"Фарбування",unit:"м²",qty:p=>Math.round(p.area*2.3),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:160,mat:110}]}]},
{id:"flooring",name:"Підлогове покриття",weeks:()=>1.5,scope:"Укладання ламінату/вінілу, плінтус, пороги",items:[{live:"laminate",label:"Укладання покриття",unit:"м²",qty:p=>Math.round(p.area*.88),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:250,mat:750},{name:"«ПаркетГруп» · 4.8★",src:"rabotniki.ua · демо",url:SRC.otd,price:300,mat:780}]},{live:"plinth",label:"Плінтус",unit:"м.п.",qty:p=>Math.round(p.area*.9),opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.otd,price:90,mat:130}]}]},
{id:"doors",name:"Двері міжкімнатні",weeks:()=>1,scope:"Дверні блоки з коробкою, наличниками, фурнітурою",items:[{live:"doors_install",label:"Дверний блок",unit:"шт",qty:p=>p.rooms+p.bathrooms,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:3200,mat:8500},{name:"Фабричні + монтаж",src:"виробник · демо",url:SRC.price,price:2800,mat:9500}]}]},
{id:"bath",name:"Комплектація санвузлів",weeks:p=>p.bathrooms,scope:"Ванна/душова, унітаз, раковина, змішувачі, аксесуари",items:[{label:"Сантехніка + монтаж",unit:"сануз.",qty:p=>p.bathrooms,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:16000,mat:52000},{name:"«АкваМонтаж» · 4.8★",src:"rabotniki.ua · демо",url:SRC.price,price:14500,mat:54000}]}]},
{id:"final",name:"Фінішні роботи",weeks:()=>1,scope:"Розетки, вимикачі, світильники, клінінг",items:[{label:"Фурнітура + клінінг",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова, Київ",src:"rabotniki.ua",url:SRC.price,price:190,mat:55}]}]},
];

const fpn=p=>Math.round((p.area/p.floors)*1.1);
const HOUSE_STAGES=[
{id:"prep",name:"Проєкт",weeks:()=>4,scope:"Архітектура, конструктив, геодезія",items:[{label:"Проєктування",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.common,price:650,mat:150}]}]},
{id:"found",name:"Фундамент",weeks:p=>4+p.area/120,scope:"Земляні роботи, опалубка, армування, бетонування",items:[{label:"Земляні роботи",unit:"м²",qty:fpn,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.fund,price:450,mat:250}]},{live:"monolith",label:"Монолітні роботи",unit:"м²",qty:fpn,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.fund,price:1500,mat:2400},{name:"Монолітники · 4.8★",src:"rabotniki.ua · демо",url:SRC.beton,price:1350,mat:2450}]}]},
{id:"box",name:"Коробка",weeks:p=>8+p.area/80,scope:"Кладка стін, армопояси, перекриття",items:[{live:"masonry",label:"Кладка стін",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.common,price:1900,mat:2600}]},{label:"Перекриття",unit:"м²",qty:p=>Math.round(p.area*.55),opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.beton,price:1400,mat:2300}]}]},
{id:"roof",name:"Покрівля",weeks:()=>4,scope:"Кроквяна система, гідроізоляція, покрівля",items:[{live:"roofing",label:"Покрівля",unit:"м²",qty:p=>Math.round(fpn(p)*1.25),opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.common,price:1300,mat:1900}]}]},
{id:"windows",name:"Вікна та двері",weeks:()=>2,scope:"Металопластикові вікна, вхідні двері",items:[{label:"Вікна + двері",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.price,price:400,mat:1400}]}]},
{id:"facade",name:"Фасад",weeks:()=>5,scope:"Утеплення, армування, декоративна штукатурка",items:[{live:"facade_insul",label:"Утеплення + штукатурка",unit:"м²",qty:p=>Math.round(p.area*1.15),opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.otd,price:850,mat:1100}]}]},
{id:"mep",name:"Інженерія",weeks:()=>6,scope:"Електрика, опалення, водопровід, каналізація",items:[{label:"Електрика",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.price,price:700,mat:600}]},{label:"Опалення + вода",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.price,price:1100,mat:1300}]}]},
{id:"finish",name:"Оздоблення",weeks:p=>({econom:8,standart:12,premium:20})[p.tier],scope:"Повний цикл внутрішнього оздоблення",items:[{label:"Оздоблення під ключ",unit:"м²",qty:p=>p.area,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.otd,price:3200,mat:4300}]}]},
{id:"bath",name:"Санвузли",weeks:p=>p.bathrooms,scope:"Комплектація та монтаж",items:[{label:"Сантехніка + монтаж",unit:"сануз.",qty:p=>p.bathrooms,opts:[{name:"Середньоринкова",src:"rabotniki.ua",url:SRC.price,price:18000,mat:60000}]}]},
];

const BUDGETS={flat:[{id:"f1",name:"до 700 тис.",max:7e5},{id:"f2",name:"0,7–1,2 млн",max:12e5},{id:"f3",name:"1,2–2 млн",max:2e6},{id:"f4",name:"2–3,5 млн",max:35e5},{id:"f5",name:"3,5+ млн",max:Infinity}],house:[{id:"h1",name:"до 3 млн",max:3e6},{id:"h2",name:"3–5 млн",max:5e6},{id:"h3",name:"5–8 млн",max:8e6},{id:"h4",name:"8–12 млн",max:12e6},{id:"h5",name:"12+ млн",max:Infinity}]};
const PAYMENT=[{pct:30,label:"Аванс",desc:"Закупівля матеріалів"},{pct:25,label:"Чорнові",desc:"Електрика, сантехніка, стяжка"},{pct:25,label:"Чистові",desc:"Плитка, фарбування, підлога"},{pct:15,label:"Фініш",desc:"Двері, сантехніка, світло"},{pct:5,label:"Здача",desc:"Прийомка"}];
const INCLUDES=["Усі роботи та матеріали за кошторисом","Доставка матеріалів","Вивіз сміття","Контроль якості","Фотофіксація","Прибирання"];
const EXCLUDES=["Меблі та техніка","Кухонний гарнітур","Перепланування з БТІ","Кондиціонування","Балкон / лоджія"];
const VILKA=.12,OVERLAP=.85,DEMO=true;

function calc(mode,p,selections,live){const stages=(mode==="flat"?FLAT_STAGES:HOUSE_STAGES).filter(s=>!(s.onlyIf&&!s.onlyIf(p))&&!(s.skipIf&&s.skipIf(p)));const region=REGIONS.find(x=>x.id===p.region)||REGIONS[0];const tier=TIERS[p.tier];const style=STYLE_MODS[p.style]||STYLE_MODS["Сучасний"];let wo=0;const rows=stages.map(s=>{const sk=style.mods[s.id]||1;const items=s.items.map((it,ii)=>{const key=`${s.id}:${ii}`;const sel=selections[key]??0;const opt=it.opts[Math.min(sel,it.opts.length-1)];const qty=it.qty(p);const lw=it.live&&live&&live.works&&live.works[it.live];const liveP=lw?lw.price:null;const basePrice=(sel===0&&liveP)?liveP:opt.price;const pr=Math.round(basePrice*tier.kWork*region.k*sk);const mt=Math.round(opt.mat*tier.kMat*region.k*sk);return{key,label:it.label,unit:it.unit,qty,opts:it.opts,sel,liveP,liveInfo:lw||null,price:pr,mat:mt,work:qty*pr,matSum:qty*mt,total:qty*(pr+mt)}});const wk=Math.round(s.weeks(p)*(mode==="flat"?Math.sqrt(p.area/60):Math.sqrt(p.area/150))*10)/10;const sw=wo;wo+=wk*OVERLAP;return{id:s.id,name:s.name,scope:s.scope,sk,items,weeks:wk,startWeek:sw,total:items.reduce((a,b)=>a+b.total,0),work:items.reduce((a,b)=>a+b.work,0),matSum:items.reduce((a,b)=>a+b.matSum,0)}});const total=rows.reduce((a,r)=>a+r.total,0);const weeks=Math.round(rows.reduce((a,r)=>a+r.weeks,0)*OVERLAP);const budget=BUDGETS[mode].find(b=>b.id===p.budget);const sd=Object.keys(style.mods).length?Math.round((total/rows.reduce((a,r)=>a+r.total/(r.sk||1),0)-1)*100):0;return{rows,total,region,tier,style,styleDelta:sd,low:total*(1-VILKA),high:total*(1+VILKA),perM2:Math.round(total/p.area),weeks,months:Math.round((weeks/4.33)*10)/10,budgetFit:budget?total*(1-VILKA)<=budget.max:true,budgetName:budget?.name||"",totalWeeks:Math.ceil(wo)}}
const fmt=n=>new Intl.NumberFormat("uk-UA",{maximumFractionDigits:0}).format(Math.round(n));
const fmtM=n=>n>=1e6?(n/1e6).toFixed(2).replace(".",",")+"\u00a0млн":fmt(n);

const css=`
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
:root{--bg:#F4F2ED;--card:#FFF;--ink:#1A1C20;--sub:#6B6E75;--line:#E8E5DE;--acc:#1D3FCC;--acc2:#EEF0FA;--ok:#1A6B2E;--oks:#E7F3EB;--wrn:#B93D08;--wrns:#FDF0E8}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg)}
.app{min-height:100vh;font-family:'Manrope',sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;background:var(--bg);background-image:radial-gradient(ellipse 80% 60% at 0% 30%,rgba(29,63,204,.04) 0%,transparent 70%),radial-gradient(ellipse 60% 50% at 100% 70%,rgba(29,63,204,.03) 0%,transparent 70%)}
.topbar{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.tb{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.logo{font-family:'Unbounded';font-weight:800;font-size:16px;letter-spacing:-.3px}.logo span{color:var(--acc)}
.mode{display:flex;background:var(--bg);border-radius:999px;padding:3px;gap:2px}
.mode button{font-family:'Manrope';font-weight:600;font-size:12.5px;padding:8px 18px;border:none;background:transparent;border-radius:999px;cursor:pointer;color:var(--sub);transition:all .15s}
.mode button.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.1)}
.wrap{max-width:1080px;margin:0 auto;padding:40px 24px 120px}
.hero{margin-bottom:32px;max-width:580px}
.hero h1{font-family:'Unbounded';font-weight:600;font-size:clamp(21px,3.8vw,32px);line-height:1.2;letter-spacing:-.4px;margin-bottom:10px}
.hero p{color:var(--sub);font-size:14.5px;line-height:1.6}
.demob{display:inline-flex;align-items:center;gap:7px;margin-top:14px;background:var(--wrns);color:var(--wrn);font-family:'IBM Plex Mono';font-size:10.5px;font-weight:600;padding:5px 11px;border-radius:6px;letter-spacing:.3px;text-transform:uppercase}
.grid{display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.ch{display:flex;align-items:center;gap:10px;padding:16px 22px;border-bottom:1px solid var(--line)}
.cn{font-family:'IBM Plex Mono';font-size:10.5px;font-weight:600;color:var(--acc);background:var(--acc2);padding:3px 8px;border-radius:6px}
.ch h2{font-size:14.5px;font-weight:700}
.cb{padding:20px 22px;display:grid;gap:18px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:560px){.g2{grid-template-columns:1fr}}
label.f{display:grid;gap:7px;font-size:13px;font-weight:600}
.hint{font-weight:500;color:var(--sub);font-size:11.5px;line-height:1.5}
select,input[type=number],input[type=text],input[type=tel]{font-family:'IBM Plex Mono';font-size:13.5px;padding:10px 12px;border:1px solid var(--line);background:#fff;border-radius:10px;width:100%;color:var(--ink);transition:border-color .15s}
select:focus,input:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--acc2)}
.rr{display:flex;align-items:center;gap:14px}
input[type=range]{flex:1;accent-color:var(--acc);height:4px}
.rv{font-family:'IBM Plex Mono';font-weight:600;font-size:15px;min-width:80px;text-align:right}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{font-family:'Manrope';font-weight:600;font-size:12.5px;padding:8px 14px;border:1.5px solid var(--line);background:#fff;border-radius:999px;cursor:pointer;color:var(--sub);transition:all .12s}
.chip:hover{border-color:var(--ink);color:var(--ink)}
.chip.on{background:var(--ink);border-color:var(--ink);color:#fff}
.chip.acc.on{background:var(--acc);border-color:var(--acc)}
.cond{display:grid;gap:8px}
.cond .opt{display:flex;gap:12px;align-items:flex-start;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;cursor:pointer;background:#fff;transition:all .12s}
.cond .opt:hover{border-color:var(--ink)}
.cond .opt.on{border-color:var(--acc);background:var(--acc2)}
.cond .rd{width:15px;height:15px;border-radius:50%;border:2px solid var(--line);margin-top:2px;flex-shrink:0}
.cond .opt.on .rd{border-color:var(--acc);background:var(--acc);box-shadow:inset 0 0 0 3px var(--acc2)}
.cond .ot{font-weight:700;font-size:13px}.cond .od{font-size:12px;color:var(--sub);margin-top:2px}
.sn{background:var(--acc2);border-radius:10px;padding:10px 13px;font-size:11.5px;line-height:1.55}
.sn b{color:var(--acc);font-weight:700}
.tl{font-size:11.5px;font-weight:700;color:var(--acc);background:none;border:none;cursor:pointer;text-decoration:underline;padding:0}
.tt{border:1px solid var(--line);border-radius:10px;overflow:hidden;font-size:11px;background:#fff}
.ttr{display:grid;grid-template-columns:76px 1fr 1fr 1fr;border-bottom:1px solid var(--line)}.ttr:last-child{border-bottom:none}
.ttr.h{background:var(--bg);font-family:'IBM Plex Mono';font-size:9.5px;text-transform:uppercase;color:var(--sub)}
.ttr>div{padding:8px 9px;border-right:1px solid var(--line);line-height:1.4}.ttr>div:last-child{border-right:none}.ttr>div:first-child{font-weight:700;background:var(--bg)}
.rail{position:sticky;top:80px;display:grid;gap:12px}
.live{background:var(--ink);color:#fff;border-radius:16px;padding:22px}
.lk{font-size:11px;color:#888;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.dot{width:6px;height:6px;border-radius:50%;background:#34d399;animation:pls 1.6s infinite}
@keyframes pls{0%,100%{opacity:1}50%{opacity:.3}}
.lv{font-family:'IBM Plex Mono';font-weight:600;font-size:clamp(18px,2.2vw,22px);line-height:1.35}
.lv em{font-style:normal;color:#93A8FF}
.ls{font-family:'IBM Plex Mono';font-size:11.5px;color:#777;margin-top:5px}
.lr{display:flex;justify-content:space-between;font-size:12px;padding:6px 0;border-top:1px solid #2a2c31;font-family:'IBM Plex Mono';color:#aaa}
.lr span:last-child{color:#ddd}.lr:first-of-type{margin-top:10px}
.livebtn{width:100%;margin-top:14px;font-family:'Unbounded';font-weight:600;font-size:12.5px;background:var(--acc);color:#fff;border:none;border-radius:10px;padding:14px;cursor:pointer;transition:filter .15s}
.livebtn:hover{filter:brightness(1.15)}
.fc{border-radius:12px;padding:12px 14px;font-size:12px;font-weight:600;line-height:1.5}
.fc.ok{background:var(--oks);color:var(--ok)}.fc.no{background:var(--wrns);color:var(--wrn)}
.leadwrap{max-width:480px;margin:0 auto}.leadwrap h2{font-family:'Unbounded';font-weight:600;font-size:22px;margin-bottom:6px}.leadwrap>p{color:var(--sub);font-size:14px;margin-bottom:20px;line-height:1.55}
.sheet{background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.cover{padding:44px 32px 36px;text-align:center;background:linear-gradient(180deg,var(--acc2) 0%,var(--card) 100%)}
.ceye{font-family:'IBM Plex Mono';font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:var(--sub);margin-bottom:12px}
.cover h1{font-family:'Unbounded';font-weight:700;font-size:clamp(19px,3.4vw,28px);letter-spacing:-.3px;margin-bottom:8px;line-height:1.2}
.csub{color:var(--sub);font-size:13.5px}.cmeta{margin-top:14px;font-family:'IBM Plex Mono';font-size:11px;color:var(--sub)}
.snums{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
@media(max-width:640px){.snums{grid-template-columns:1fr}}
.sn2{padding:22px 28px;border-right:1px solid var(--line)}.sn2:last-child{border-right:none}
.sn2 .k{font-size:11px;color:var(--sub);margin-bottom:5px;text-transform:uppercase;letter-spacing:.3px}
.sn2 .v{font-family:'IBM Plex Mono';font-weight:600;font-size:clamp(16px,2.4vw,20px)}.sn2 .v em{font-style:normal;color:var(--acc)}
.breakdown{padding:28px 28px 20px;border-bottom:1px solid var(--line)}
.breakdown h3{font-size:13.5px;font-weight:700;margin-bottom:16px}
.brow{display:flex;align-items:center;gap:12px;margin-bottom:7px}
.blbl{font-size:11.5px;font-weight:600;min-width:130px;max-width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sub)}
@media(max-width:560px){.blbl{min-width:80px;max-width:100px;font-size:10.5px}}
.btrack{flex:1;height:20px;background:var(--bg);border-radius:6px;overflow:hidden}
.bfill{height:100%;border-radius:6px;background:var(--acc);transition:width .4s}
.bval{font-family:'IBM Plex Mono';font-size:11px;font-weight:500;min-width:90px;text-align:right;color:var(--sub)}
.gantt{padding:28px 28px 20px;border-bottom:1px solid var(--line);overflow-x:auto}
.gantt h3{font-size:13.5px;font-weight:700;margin-bottom:16px}
.gg{display:grid;gap:5px}
.gr{display:flex;align-items:center;gap:12px}
.glbl{font-size:11px;font-weight:600;min-width:110px;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sub)}
@media(max-width:560px){.glbl{min-width:70px;max-width:95px;font-size:10px}}
.gtrack{flex:1;height:18px;position:relative;min-width:180px}
.gbar{position:absolute;height:100%;border-radius:5px;top:0;display:flex;align-items:center;padding-left:6px;font-family:'IBM Plex Mono';font-size:9px;color:#fff;font-weight:600;overflow:hidden;white-space:nowrap;background:var(--ink);opacity:.75}
.gmeta{margin-top:8px;font-family:'IBM Plex Mono';font-size:10.5px;color:var(--sub)}
.stage{border-bottom:1px solid var(--line)}.stage:last-of-type{border-bottom:none}
.sth{display:flex;align-items:center;gap:10px;padding:14px 28px;cursor:pointer;user-select:none;transition:background .1s}
.sth:hover{background:var(--bg)}
.st-caret{font-size:10px;color:var(--sub);transition:transform .15s;width:16px}.stage.open .st-caret{transform:rotate(90deg);color:var(--acc)}
.st-name{font-weight:700;font-size:13px;flex:1}
.st-badge{font-family:'IBM Plex Mono';font-size:9.5px;color:var(--acc);background:var(--acc2);border-radius:5px;padding:2px 7px}
.st-wk{font-family:'IBM Plex Mono';font-size:11px;color:var(--sub);min-width:50px;text-align:right}
.st-tot{font-family:'IBM Plex Mono';font-weight:600;font-size:13px;min-width:96px;text-align:right}
.stb{background:var(--bg);border-top:1px solid var(--line);padding:16px 28px 20px;display:grid;gap:14px}
.stb .scope{font-size:12px;color:var(--sub);line-height:1.5;padding-bottom:10px;border-bottom:1px dashed var(--line)}
.item .itop{display:flex;justify-content:space-between;gap:8px;font-size:12px;margin-bottom:8px;flex-wrap:wrap}
.item .ilbl{font-weight:700}.item .iqty{font-family:'IBM Plex Mono';color:var(--sub)}
.optlist{display:grid;gap:6px}
.oc{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--line);border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .12s}
.oc:hover{border-color:var(--ink)}.oc.on{border-color:var(--acc);background:var(--acc2)}
.oc .orad{width:13px;height:13px;border-radius:50%;border:2px solid var(--line);flex-shrink:0}.oc.on .orad{border-color:var(--acc);background:var(--acc);box-shadow:inset 0 0 0 2.5px var(--acc2)}
.oc .oname{font-weight:700;font-size:11.5px;flex:1;min-width:90px}
.oc .osrc{font-size:10px;color:var(--sub)}.oc .osrc a{color:var(--acc);text-decoration:underline;font-weight:600}
.oc .oprice{font-family:'IBM Plex Mono';font-size:10.5px;text-align:right;white-space:nowrap;color:var(--sub)}.oc .oprice b{color:var(--ink)}
@media(max-width:620px){.oc{flex-wrap:wrap}.oc .oprice{width:100%;text-align:left;padding-left:24px}}
.paysec{padding:28px;border-bottom:1px solid var(--line)}.paysec h3{font-size:13.5px;font-weight:700;margin-bottom:16px}
.prow{display:flex;gap:14px;margin-bottom:12px;align-items:flex-start}
.ppct{font-family:'IBM Plex Mono';font-weight:600;font-size:13px;min-width:42px;color:var(--acc)}
.pbody .plbl{font-weight:700;font-size:12.5px}.pbody .pdesc{font-size:11.5px;color:var(--sub);margin-top:2px}.pbody .psum{font-family:'IBM Plex Mono';font-size:11.5px;font-weight:600;margin-top:3px}
.inex{padding:28px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:560px){.inex{grid-template-columns:1fr}}
.inex h3{font-size:13.5px;font-weight:700;margin-bottom:10px;grid-column:1/-1}
.inex ul{list-style:none;font-size:12px;line-height:1.7;color:var(--sub)}
.inex .inc li::before{content:'\\2713  ';color:var(--ok);font-weight:700}.inex .exc li::before{content:'\\2715  ';color:var(--wrn);font-weight:700}
.renders{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}
@media(max-width:640px){.renders{grid-template-columns:1fr}}
.rph{aspect-ratio:16/9;border-right:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--sub);background:linear-gradient(135deg,var(--bg) 0%,var(--acc2) 100%)}
.rph:last-child{border-right:none}.rph .t{font-family:'IBM Plex Mono';font-size:10.5px;text-transform:uppercase;letter-spacing:.5px}.rph .d{font-size:11px}
.terms{padding:24px 28px;border-bottom:1px solid var(--line);font-size:11.5px;color:var(--sub);line-height:1.6}
.terms h3{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:10px}
.sf{padding:20px 28px;display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}
.sf .note{font-size:10.5px;color:var(--sub);max-width:460px;line-height:1.5}
.actions{display:flex;gap:8px}
.btn{font-family:'Manrope';font-weight:700;font-size:12.5px;padding:10px 16px;border-radius:10px;cursor:pointer;border:1.5px solid var(--line);background:#fff;color:var(--ink);transition:all .12s}
.btn:hover{border-color:var(--ink)}
.btn.blue{background:var(--acc);border-color:var(--acc);color:#fff;font-family:'Unbounded';font-weight:600;font-size:12px}.btn.blue:hover{filter:brightness(1.1)}
@media print{.no-print{display:none!important}.app{background:#fff}.wrap{padding:0;max-width:100%}.sheet{border:none;border-radius:0;box-shadow:none}.topbar{display:none}.cover{padding:24px 20px}.snums,.breakdown,.gantt,.stage,.paysec,.inex,.terms,.renders,.sf{break-inside:avoid}}
`;

const initF={region:"kyiv",area:65,rooms:2,bathrooms:1,condition:"new",tier:"standart",style:"Сучасний",budget:"f3"};
const initH={region:"kyiv",area:150,floors:2,rooms:3,bathrooms:2,condition:"new",tier:"standart",style:"Сучасний",budget:"h3"};

export default function App(){
const[mode,setMode]=useState("flat");const[flat,setFlat]=useState(initF);const[house,setHouse]=useState(initH);
const[view,setView]=useState("form");const[sel,setSel]=useState({});const[opn,setOpn]=useState({});
const[showT,setShowT]=useState(false);const[lead,setLead]=useState({name:"",phone:"",msg:""});
const[live,setLive]=useState(null);
useEffect(()=>{fetch("/prices.json").then(r=>r.ok?r.json():null).then(d=>{if(d&&d.updated&&d.works&&Object.keys(d.works).length)setLive(d)}).catch(()=>{})},[]);
const p=mode==="flat"?flat:house;const setP=(k,v)=>(mode==="flat"?setFlat:setHouse)(s=>({...s,[k]:v}));
const r=useMemo(()=>calc(mode,p,sel,live),[mode,p,sel,live]);const today=new Date().toLocaleDateString("uk-UA");
const swM=m=>{setMode(m);setView("form");setSel({});setOpn({})};const maxT=Math.max(...r.rows.map(x=>x.total));

return (<div className="app"><style>{css}</style>
<div className="topbar no-print"><div className="tb"><div className="logo">ПРОПОЗИЦІЯ<span>.БУД</span></div>
<div className="mode"><button className={mode==="flat"?"on":""} onClick={()=>swM("flat")}>Ремонт квартири</button>
<button className={mode==="house"?"on":""} onClick={()=>swM("house")}>Будинок з нуля</button></div></div></div>

<div className="wrap">
{view==="form"&&(<><div className="hero"><h1>{mode==="flat"?"Ремонт під ключ — з ціною одразу":"Будинок — з ціною та строком одразу"}</h1>
<p>Кожен параметр змінює розрахунок у реальному часі</p>{live?<div className="demob" style={{background:"var(--oks)",color:"var(--ok)"}}>роботи: ціни rabotniki.ua від {live.updated} · матеріали: орієнтовні</div>:DEMO&&<div className="demob">демо · ціни орієнтовні</div>}</div>
<div className="grid"><div style={{display:"grid",gap:16}}>
<div className="card"><div className="ch"><span className="cn">01</span><h2>{mode==="flat"?"Квартира":"Будинок"}</h2></div>
<div className="cb"><div className="g2">
<label className="f">Локація <span className="hint">Київ — база, область — дешевше</span>
<select value={p.region} onChange={e=>setP("region",e.target.value)}>{REGIONS.map(x=><option key={x.id} value={x.id}>{x.name}{x.k!==1?` (−${Math.round((1-x.k)*100)}%)`:""}</option>)}</select></label>
<label className="f">{mode==="flat"?"Кімнат":"Спалень"}<div className="chips">{[1,2,3,4,5].map(n=><button key={n} className={"chip"+(p.rooms===n?" on":"")} onClick={()=>setP("rooms",n)}>{n}</button>)}</div></label></div>
<label className="f">Площа<div className="rr"><input type="range" min={mode==="flat"?30:80} max={mode==="flat"?180:300} step="5" value={p.area} onChange={e=>setP("area",+e.target.value)}/><span className="rv">{p.area} м²</span></div></label>
{mode==="house"&&<label className="f">Поверхів<div className="chips">{[1,2,3].map(n=><button key={n} className={"chip"+(p.floors===n?" on":"")} onClick={()=>setP("floors",n)}>{n}</button>)}</div></label>}
<label className="f">Санвузлів<div className="chips">{[1,2,3].map(n=><button key={n} className={"chip"+(p.bathrooms===n?" on":"")} onClick={()=>setP("bathrooms",n)}>{n}</button>)}</div></label></div></div>
{mode==="flat"&&<div className="card"><div className="ch"><span className="cn">02</span><h2>Стан квартири</h2></div>
<div className="cb"><div className="cond">{[{id:"new",t:"Новобудова «сіра коробка»",d:"Повний цикл з нуля"},{id:"old",t:"Вторинка зі старим ремонтом",d:"Додається демонтаж"},{id:"partial",t:"Часткова готовність",d:"Штукатурка і стяжка є"}].map(o=>
<div key={o.id} className={"opt"+(p.condition===o.id?" on":"")} onClick={()=>setP("condition",o.id)}><div className="rd"/><div><div className="ot">{o.t}</div><div className="od">{o.d}</div></div></div>)}</div></div></div>}
<div className="card"><div className="ch"><span className="cn">{mode==="flat"?"03":"02"}</span><h2>Бюджет, рівень і стиль</h2></div>
<div className="cb"><label className="f">Бюджет<select value={p.budget} onChange={e=>setP("budget",e.target.value)}>{BUDGETS[mode].map(b=><option key={b.id} value={b.id}>{b.name} грн</option>)}</select></label>
<label className="f">Рівень оздоблення<div className="chips">{Object.entries(TIERS).map(([id,t])=><button key={id} className={"chip acc"+(p.tier===id?" on":"")} onClick={()=>setP("tier",id)}>{t.name}</button>)}</div>
<button className="tl" onClick={()=>setShowT(s=>!s)}>{showT?"Сховати ↑":"Порівняти рівні ↓"}</button>
{showT&&<div className="tt"><div className="ttr h"><div></div><div>Економ</div><div>Стандарт</div><div>Преміум</div></div>{TIER_TABLE.map(t=><div className="ttr" key={t.row}><div>{t.row}</div><div>{t.econom}</div><div>{t.standart}</div><div>{t.premium}</div></div>)}</div>}</label>
<label className="f">Стиль<div className="chips">{Object.keys(STYLE_MODS).map(s=><button key={s} className={"chip"+(p.style===s?" on":"")} onClick={()=>setP("style",s)}>{s}</button>)}</div>
<div className="sn"><b>{p.style}{r.styleDelta?` · ${r.styleDelta>0?"+":""}${r.styleDelta}%`:""}:</b> {STYLE_MODS[p.style].note}</div></label></div></div></div>
<div className="rail no-print"><div className="live"><div className="lk"><span className="dot"/>{r.region.name}</div>
<div className="lv">{fmtM(r.low)} — <em>{fmtM(r.high)}</em></div>
<div className="ls">{fmt(r.perM2)} грн/м² · ~{r.months} міс.</div>
<div className="lr"><span>Роботи</span><span>{fmtM(r.rows.reduce((a,x)=>a+x.work,0))}</span></div>
<div className="lr"><span>Матеріали</span><span>{fmtM(r.rows.reduce((a,x)=>a+x.matSum,0))}</span></div>
{r.styleDelta!==0&&<div className="lr"><span>{p.style}</span><span>{r.styleDelta>0?"+":""}{r.styleDelta}%</span></div>}
<button className="livebtn" onClick={()=>{setView("lead");window.scrollTo(0,0)}}>Сформувати пропозицію →</button></div>
<div className={"fc "+(r.budgetFit?"ok":"no")}>{r.budgetFit?<>✓ Вписується у «{r.budgetName}»</>:<>⚠ Перевищує «{r.budgetName}»</>}</div></div></div></>)}

{view==="lead"&&<div className="leadwrap"><h2>Майже готово</h2><p>Залиште контакт — отримайте PDF з розрахунком</p>
<div className="card"><div className="cb">
<label className="f">Ім'я<input type="text" value={lead.name} onChange={e=>setLead(l=>({...l,name:e.target.value}))} placeholder="Олександр"/></label>
<label className="f">Телефон / Telegram<input type="tel" value={lead.phone} onChange={e=>setLead(l=>({...l,phone:e.target.value}))} placeholder="+380..."/></label>
<label className="f">Коментар<input type="text" value={lead.msg} onChange={e=>setLead(l=>({...l,msg:e.target.value}))} placeholder="Необов'язково"/></label>
<div style={{display:"flex",gap:8}}><button className="btn" onClick={()=>setView("form")}>← Назад</button>
<button className="btn blue" style={{flex:1}} onClick={()=>{setView("sheet");window.scrollTo(0,0)}} disabled={!lead.name.trim()||!lead.phone.trim()}>Отримати пропозицію →</button></div>
<span className="hint">Ваші дані бачить тільки команда</span></div></div></div>}

{view==="sheet"&&<div className="sheet">
<div className="cover"><div className="ceye">Комерційна пропозиція{DEMO?" · демо":""}</div>
<h1>{mode==="flat"?`Ремонт ${p.area} м² під ключ`:`Будинок ${p.area} м²`}</h1>
<div className="csub">{p.rooms} {mode==="flat"?"кімн.":"спал."} · {p.bathrooms} с/в · {r.tier.name} · {p.style}</div>
<div className="cmeta">{r.region.name} · {today}</div></div>

<div className="snums"><div className="sn2"><div className="k">Вартість ±{VILKA*100}%</div><div className="v">{fmtM(r.low)} — <em>{fmtM(r.high)}</em></div></div>
<div className="sn2"><div className="k">Грн / м²</div><div className="v"><em>{fmt(r.perM2)}</em></div></div>
<div className="sn2"><div className="k">Строк</div><div className="v"><em>{r.months}</em> міс.</div></div></div>

<div className="breakdown"><h3>Розподіл вартості</h3>{r.rows.map(st=>{const pct=(st.total/r.total)*100;return<div className="brow" key={st.id}><span className="blbl">{st.name}</span><div className="btrack"><div className="bfill" style={{width:`${(st.total/maxT)*100}%`,opacity:.15+(st.total/maxT)*.85}}/></div><span className="bval">{fmt(st.total)} · {pct.toFixed(0)}%</span></div>})}</div>

<div className="gantt"><h3>Графік робіт</h3><div className="gg">{r.rows.map(st=>{const left=(st.startWeek/r.totalWeeks)*100;const width=Math.max((st.weeks/r.totalWeeks)*100,4);return<div className="gr" key={st.id}><span className="glbl">{st.name}</span><div className="gtrack"><div className="gbar" style={{left:`${left}%`,width:`${width}%`}}>{st.weeks}т</div></div></div>})}</div>
<div className="gmeta">{r.weeks} тижнів ({r.months} міс.) з паралельністю</div></div>

<div style={{padding:"10px 28px",borderBottom:"1px solid var(--line)"}} className="no-print"><span className="hint">Відкрийте етап → обсяг робіт, варіанти виконавців</span></div>

{r.rows.map(st=><div key={st.id} className={"stage"+(opn[st.id]?" open":"")}>
<div className="sth" onClick={()=>setOpn(o=>({...o,[st.id]:!o[st.id]}))}>
<span className="st-caret">▸</span><span className="st-name">{st.name}</span>
{st.sk!==1&&<span className="st-badge">{st.sk>1?"+":""}{Math.round((st.sk-1)*100)}%</span>}
<span className="st-wk">{st.weeks}т</span><span className="st-tot">{fmt(st.total)}</span></div>
{opn[st.id]&&<div className="stb"><div className="scope">{st.scope}</div>
{st.items.map(it=><div className="item" key={it.key}><div className="itop"><span className="ilbl">{it.label}</span><span className="iqty">{fmt(it.qty)} {it.unit} · {fmt(it.total)} грн</span></div>
<div className="optlist">{it.opts.map((o,oi)=>{const on=it.sel===oi;const isLive=oi===0&&it.liveP;const bp=isLive?it.liveP:o.price;const pw=Math.round(bp*r.tier.kWork*r.region.k*(st.sk||1));const pm=Math.round(o.mat*r.tier.kMat*r.region.k*(st.sk||1));return<div key={oi} className={"oc"+(on?" on":"")} onClick={()=>setSel(s=>({...s,[it.key]:oi}))}>
<div className="orad"/><div style={{flex:1}}><div className="oname">{o.name}{isLive&&<span style={{color:"var(--ok)",fontSize:9.5,marginLeft:6}}>● live {live.updated}</span>}</div><div className="osrc"><a href={o.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>{o.src}</a>{isLive&&it.liveInfo&&<span> · {it.liveInfo.count} пропозицій · {it.liveInfo.min}–{it.liveInfo.max} грн</span>}</div></div>
<div className="oprice">роб. <b>{fmt(pw)}</b> + мат. <b>{fmt(pm)}</b> /{it.unit}</div></div>})}</div></div>)}</div>}</div>)}

<div className={"fc "+(r.budgetFit?"ok":"no")} style={{borderRadius:0,padding:"14px 28px",borderBottom:"1px solid var(--line)"}}>{r.budgetFit?<>✓ Вписується у «{r.budgetName}»</>:<>⚠ Перевищує «{r.budgetName}»</>}</div>

<div className="paysec"><h3>Графік оплат</h3>{PAYMENT.map((ps,i)=><div className="prow" key={i}><span className="ppct">{ps.pct}%</span><div className="pbody"><div className="plbl">{ps.label}</div><div className="pdesc">{ps.desc}</div><div className="psum">{fmtM(Math.round(r.total*ps.pct/100))} грн</div></div></div>)}</div>

<div className="inex"><h3>Що входить / не входить</h3><ul className="inc">{INCLUDES.map((x,i)=><li key={i}>{x}</li>)}</ul><ul className="exc">{EXCLUDES.map((x,i)=><li key={i}>{x}</li>)}</ul></div>

<div className="renders"><div className="rph"><span className="t">{mode==="flat"?"Вітальня":"Екстер'єр"}</span><span className="d">{p.style}</span></div><div className="rph"><span className="t">{mode==="flat"?"Санвузол":"Інтер'єр"}</span><span className="d">{r.tier.name}</span></div></div>

<div className="terms"><h3>Умови</h3>Попередня оцінка, не є офертою. Точний кошторис — після огляду. {live?`Розцінки на роботи — середньоринкові за даними rabotniki.ua станом на ${live.updated}; матеріали — орієнтовно.`:`Ціни станом на ${today}.`} Пропозиція дійсна 14 днів. Гарантія — 24 місяці.{!live&&DEMO&&<><br/><b style={{color:"var(--wrn)"}}>ДЕМО: ціни не перевірені.</b></>}</div>

<div className="sf"><p className="note">ПРОПОЗИЦІЯ.БУД · {today} · {lead.name||"—"} · {lead.phone||"—"}</p>
<div className="actions no-print"><button className="btn" onClick={()=>{setView("form");window.scrollTo(0,0)}}>← Параметри</button>
<button className="btn blue" onClick={()=>window.print()}>Зберегти PDF</button></div></div></div>}
</div></div>)}
