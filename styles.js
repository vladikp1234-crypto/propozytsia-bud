export const css = `
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
.trnd{font-weight:700}.trnd.up{color:var(--wrn)}.trnd.dn{color:var(--ok)}
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
.ltable{width:100%;border-collapse:collapse;font-size:12px}
.ltable th{font-family:'IBM Plex Mono';font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--sub);text-align:left;padding:10px 14px;border-bottom:1px solid var(--line);background:var(--bg)}
.ltable td{padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top;line-height:1.45}
.ltable tr:last-child td{border-bottom:none}
.ltable a{color:var(--acc);font-weight:700}
.adminbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#FFF8E6;border:1px solid #E8C860;border-radius:12px;padding:10px 16px;margin-bottom:14px;font-size:12px;font-weight:600}
.adminbar .ab-t{font-weight:800}
.adminbar input[type=range]{accent-color:#B8860B}
.sharebtn{width:100%;font-family:'Manrope';font-weight:700;font-size:12px;padding:11px;border-radius:12px;border:1.5px dashed var(--line);background:transparent;color:var(--sub);cursor:pointer}
.sharebtn:hover{border-color:var(--acc);color:var(--acc)}
.confstrip{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 28px;border-bottom:1px solid var(--line)}
.timeline{font-family:'IBM Plex Mono';font-size:11px;color:var(--ink);font-weight:600}
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

/* v3 additions */
.betabar{background:#1A1C20;color:#fff;font-family:'IBM Plex Mono';font-size:11px;padding:8px 16px;text-align:center;letter-spacing:.3px}
.betabar b{color:#FFB020}
.vchip{display:inline-flex;align-items:center;font-family:'IBM Plex Mono';font-size:8.5px;font-weight:700;color:#B8860B;background:#FFF4D6;border:1px solid #E8C860;border-radius:4px;padding:1px 5px;margin-left:6px;vertical-align:middle;cursor:help}
.roomcard{border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;background:#fff;display:grid;gap:9px}
.roomhead{display:flex;align-items:center;gap:8px}
.roomhead .rn{font-weight:800;font-size:13px;flex:1}
.roomhead .rdel{border:none;background:none;color:var(--sub);cursor:pointer;font-size:14px;padding:2px 6px}
.roomhead .rdel:hover{color:var(--wrn)}
.rrow{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.rf{display:grid;gap:3px;font-size:10.5px;font-weight:600;color:var(--sub)}
.rf input,.rf select{font-family:'IBM Plex Mono';font-size:12px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);width:76px}
.rf select{width:auto;min-width:110px}
.addroom{display:flex;gap:6px;flex-wrap:wrap}
.addroom button{font-size:11.5px;font-weight:600;padding:7px 11px;border:1.5px dashed var(--line);background:#fff;border-radius:999px;cursor:pointer;color:var(--sub)}
.addroom button:hover{border-color:var(--acc);color:var(--acc)}
.roomsum{font-family:'IBM Plex Mono';font-size:11.5px;color:var(--sub)}
.condnote{background:var(--acc2);border-radius:10px;padding:9px 12px;font-size:11.5px;line-height:1.5}

/* D2: options */
.ogcap{font-family:'IBM Plex Mono';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--sub);margin:4px 0 8px}
.ogcap:not(:first-child){margin-top:14px}
.recb{font-family:'IBM Plex Mono';font-size:8.5px;font-weight:700;color:var(--ok);background:var(--oks);border-radius:4px;padding:2px 6px;margin-left:7px;text-transform:uppercase;letter-spacing:.3px}
.uhint{font-family:'IBM Plex Mono';font-size:10px;color:var(--acc);font-weight:600}
.odelta{font-family:'IBM Plex Mono';font-size:11px;font-weight:600;color:var(--ink);white-space:nowrap;align-self:center}
.oqty{display:inline-flex;align-items:center;gap:7px;margin-top:7px;font-family:'IBM Plex Mono';font-size:11.5px}
.oqty button{width:24px;height:24px;border-radius:7px;border:1.5px solid var(--line);background:#fff;cursor:pointer;font-size:14px;line-height:1}
.oqty button:hover{border-color:var(--acc);color:var(--acc)}
.oqty span{min-width:56px;text-align:center;font-weight:600}
.mobilebar{display:none}
@media(max-width:900px){
.mobilebar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:50;background:rgba(255,255,255,.93);backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));align-items:center;gap:12px}
.mb-sum{flex:1;display:grid;gap:1px}
.mb-v{font-family:'IBM Plex Mono';font-weight:600;font-size:14px}
.mb-s{font-family:'IBM Plex Mono';font-size:10px;color:var(--sub)}
.mb-btn{font-family:'Unbounded';font-weight:600;font-size:11.5px;background:var(--acc);color:#fff;border:none;border-radius:10px;padding:12px 16px;cursor:pointer}
.wrap{padding-bottom:170px}
}

/* D3: wizard */
.howit{display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap;font-size:12px;color:var(--sub);font-weight:600}
.howit b{display:inline-flex;width:20px;height:20px;border-radius:50%;background:var(--ink);color:#fff;align-items:center;justify-content:center;font-family:'IBM Plex Mono';font-size:10px;margin-right:6px}
.howit .ha{color:var(--line)}
.wsteps{display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap}
.wstep{display:flex;align-items:center;gap:8px;font-family:'Manrope';font-weight:700;font-size:12px;padding:9px 16px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--sub);cursor:pointer;transition:all .15s}
.wstep .wn{display:inline-flex;width:18px;height:18px;border-radius:50%;background:var(--bg);align-items:center;justify-content:center;font-family:'IBM Plex Mono';font-size:10px}
.wstep.on{border-color:var(--acc);color:var(--acc);background:var(--acc2)}
.wstep.on .wn{background:var(--acc);color:#fff}
.wstep.done{color:var(--ink)}
.wstep.done .wn{background:var(--oks);color:var(--ok)}
.wnav{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:4px}
.wnav .btn.blue{padding:12px 26px}

/* client features batch */
.searchin{flex:1;min-width:170px;font-family:'Manrope';font-size:12px;font-weight:600;padding:8px 12px;border:1.5px solid var(--line);border-radius:999px;background:#fff;color:var(--ink)}
.searchin:focus{outline:none;border-color:var(--acc)}
.exbtn_removed{font-family:'IBM Plex Mono';font-size:9.5px;font-weight:600;color:var(--sub);background:none;border:1px dashed var(--line);border-radius:6px;padding:3px 8px;cursor:pointer;white-space:nowrap}
.exbtn:hover{color:var(--wrn);border-color:var(--wrn)}
.stage.off .st-name,.stage.off .st-grp,.stage.off .st-wk{opacity:.45}
.stage.off .st-tot{color:var(--sub)}
.exclnote{padding:10px 28px;font-size:11.5px;font-weight:600;color:var(--wrn);background:var(--wrns);border-bottom:1px solid var(--line)}
.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.vcard{background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:16px 18px}
.vcard.current{border-color:var(--acc);background:var(--acc2)}
.vname{font-weight:800;font-size:13px;margin-bottom:6px}
.vsum{font-family:'IBM Plex Mono';font-weight:600;font-size:15px}
.vmeta{font-size:11.5px;color:var(--sub);margin-top:3px}
.vdelta{font-family:'IBM Plex Mono';font-size:11px;font-weight:600;margin-top:8px;color:var(--ink)}

/* ============ BLUEPRINT DESIGN SYSTEM ============ */
/* Міліметровка на фоні */
.app{background-image:
  linear-gradient(rgba(29,63,204,.028) 1px,transparent 1px),
  linear-gradient(90deg,rgba(29,63,204,.028) 1px,transparent 1px),
  radial-gradient(ellipse 80% 60% at 0% 30%,rgba(29,63,204,.04),transparent 70%);
  background-size:28px 28px,28px 28px,auto}
/* Картки як аркуші креслення: кутові засічки */
.card{border-radius:10px;border-color:#DBD7CC;position:relative}
.card::before,.card::after{content:"";position:absolute;width:14px;height:14px;pointer-events:none;opacity:.5}
.card::before{top:-1px;left:-1px;border-top:2px solid var(--acc);border-left:2px solid var(--acc);border-top-left-radius:10px}
.card::after{bottom:-1px;right:-1px;border-bottom:2px solid var(--acc);border-right:2px solid var(--acc);border-bottom-right-radius:10px}
/* Коди секцій як штампи документації */
.cn{background:transparent;border:1px solid var(--acc);letter-spacing:.5px}
.ch h2{text-transform:uppercase;font-size:12.5px;letter-spacing:.8px}
/* Панель ціни: синька з сіткою */
.live{background:#141A33;background-image:linear-gradient(rgba(147,168,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(147,168,255,.05) 1px,transparent 1px);background-size:22px 22px;border:1px solid #26304F}
.lk{color:#93A8FF99}
/* Розмірна лінія під hero */
.hero{position:relative;padding-bottom:22px}
.hero::after{content:"";position:absolute;left:2px;bottom:0;width:min(420px,90%);height:10px;border-left:1.5px solid var(--acc);border-right:1.5px solid var(--acc)}
.hero .dimline{position:absolute;left:2px;bottom:4.5px;width:min(420px,90%);border-top:1.5px solid var(--acc)}
/* Штамп БЕТА */
.stamp{position:absolute;top:18px;right:18px;transform:rotate(6deg);font-family:'IBM Plex Mono';font-size:9.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:#B8860B;border:2px dashed #B8860B;border-radius:6px;padding:6px 10px;opacity:.85}
.cover{position:relative}
/* Шапка документа */
.dochead{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;text-align:left;margin-bottom:18px}
.dh-no{font-family:'IBM Plex Mono';font-weight:700;font-size:13px;letter-spacing:.5px}
.dh-d{font-family:'IBM Plex Mono';font-size:10px;color:var(--sub);margin-top:3px}
.dh-qr{display:grid;justify-items:center;gap:4px}
.dh-qr img{width:64px;height:64px;border:1px solid var(--line);border-radius:6px;padding:4px;background:#fff}
.dh-qr span{font-family:'IBM Plex Mono';font-size:8px;color:var(--sub);text-transform:uppercase;letter-spacing:.4px}
@media print{.dh-qr img{width:80px;height:80px}}
/* Ground floor: чому ми + FAQ */
.ground{margin-top:34px;display:grid;gap:26px}
.whyus{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}
.wu{display:flex;gap:11px;background:var(--card);border:1px solid #DBD7CC;border-radius:10px;padding:14px 16px}
.wu-i{font-size:18px}
.wu-t{font-weight:800;font-size:12.5px}
.wu-d{font-size:11.5px;color:var(--sub);line-height:1.5;margin-top:2px}
.faq h3{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px}
.faq details{background:var(--card);border:1px solid #DBD7CC;border-radius:10px;margin-bottom:7px;overflow:hidden}
.faq summary{cursor:pointer;font-weight:700;font-size:13px;padding:13px 16px;list-style:none;position:relative;padding-right:36px}
.faq summary::after{content:"+";position:absolute;right:16px;top:50%;transform:translateY(-50%);font-family:'IBM Plex Mono';color:var(--acc);font-size:15px}
.faq details[open] summary::after{content:"−"}
.faq details p{padding:0 16px 14px;font-size:12.5px;color:var(--sub);line-height:1.65}
/* Footer */
.footer{background:var(--ink);color:#B9BCC4;margin-top:60px}
.ft{max-width:1080px;margin:0 auto;padding:36px 24px 26px;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:26px}
@media(max-width:700px){.ft{grid-template-columns:1fr}}
.ft-logo{font-family:'Unbounded';font-weight:800;font-size:15px;color:#fff}
.ft-logo span{color:#93A8FF}
.ft-sub{font-size:11.5px;margin-top:6px;color:#8A8D96}
.ft-col{display:grid;gap:7px;font-size:12px;align-content:start}
.ft-col a{color:#DDE0E8;text-decoration:none;font-weight:600}
.ft-col a:hover{color:#93A8FF}
.ft-h{font-family:'IBM Plex Mono';font-size:9.5px;text-transform:uppercase;letter-spacing:.6px;color:#7A7D86;margin-bottom:2px}
.ft-legal{border-top:1px solid #2A2C31;font-family:'IBM Plex Mono';font-size:9.5px;color:#71747D;padding:14px 24px;text-align:center;line-height:1.6}
`;
