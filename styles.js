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
.rv{font-family:'IBM Plex Mono';font-weight:700;font-size:15px;min-width:86px;text-align:right;color:var(--ink);opacity:1!important;transform:none!important}
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
.usdline{font-family:'IBM Plex Mono';font-size:12px;color:#93A8FF;margin-top:2px}
.usdrate{color:#93A8FF88;font-size:9.5px}
.usdsm{font-family:'IBM Plex Mono';font-size:12px;color:var(--sub);font-weight:400}
.whychange{margin-top:11px;padding:10px 11px;background:#111830;border:1px solid #26304F;border-radius:9px;animation:wcin .3s ease}
@keyframes wcin{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.wc-h{font-family:'IBM Plex Mono';font-size:11.5px;font-weight:700;color:#fff;margin-bottom:6px}
.wc-d{font-family:'IBM Plex Mono';font-size:10px;color:#B9BCC4;line-height:1.6}
.wc-q{color:#93A8FF}
.adv-open{width:100%;font-family:'Manrope';font-weight:700;font-size:12.5px;padding:11px;border-radius:10px;border:1.5px solid #E8C860;background:#FFFBF0;color:#B8860B;cursor:pointer}
.adv-open:hover{background:#FFF6DD}
.adv-h{font-weight:800;font-size:12.5px;margin-bottom:3px}
.adv-plan{font-size:11px;color:var(--sub);margin-bottom:9px;line-height:1.45}
.adv-i{display:flex;align-items:center;gap:9px;padding:8px 0;border-top:1px dashed var(--line)}
.adv-i.key{background:#FFFDF5;margin:0 -14px;padding:8px 14px}
.adv-t{font-weight:700;font-size:11.5px;line-height:1.35}
.adv-w{font-size:10.5px;color:var(--sub);line-height:1.4}
.adv-s{font-family:'IBM Plex Mono';font-size:11.5px;font-weight:700;color:var(--ok);white-space:nowrap}
.adv-b{font-family:'Manrope';font-weight:700;font-size:10px;padding:5px 9px;border-radius:7px;border:1.5px solid var(--line);background:#fff;cursor:pointer;white-space:nowrap}
.adv-b:hover{border-color:var(--acc);color:var(--acc)}
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

/* budget banner + modal */
.budgbanner{position:sticky;top:64px;z-index:40;display:flex;align-items:center;gap:11px;background:#FFF3F0;border:1.5px solid #F5C4B8;border-radius:12px;padding:12px 16px;margin-bottom:16px;cursor:pointer;box-shadow:0 4px 16px rgba(200,60,40,.08)}
.budgbanner:hover{background:#FFEBE6}
.bb-i{font-size:16px}
.bb-t{flex:1;font-size:12.5px;font-weight:600;color:#C0392B;line-height:1.4}
.bb-t b{font-weight:800}
.bb-b{font-family:'Manrope';font-weight:700;font-size:11.5px;color:#fff;background:#C0392B;border-radius:8px;padding:8px 13px;white-space:nowrap}
.modal-bg{position:fixed;inset:0;z-index:100;background:rgba(20,22,28,.55);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px;animation:fadein .18s ease}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.modal{background:#fff;border-radius:18px;max-width:560px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 70px rgba(0,0,0,.3);animation:popin .22s cubic-bezier(.2,.9,.3,1.2)}
@keyframes popin{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:none}}
.modal-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:22px 22px 14px;border-bottom:1px solid var(--line)}
.modal-t{font-family:'Unbounded';font-weight:700;font-size:17px}
.modal-s{font-size:12.5px;color:var(--sub);line-height:1.55;margin-top:6px}
.modal-s b{color:#C0392B;font-weight:700}
.modal-x{border:none;background:var(--bg);width:32px;height:32px;border-radius:9px;cursor:pointer;font-size:15px;color:var(--sub);flex-shrink:0}
.modal-x:hover{background:var(--line)}
.modal-plan{margin:14px 22px 0;padding:10px 13px;background:var(--acc2);border-radius:10px;font-size:12px;font-weight:600;color:var(--acc);line-height:1.5}
.modal-list{padding:14px 22px}
.madv{border:1.5px solid var(--line);border-radius:13px;padding:14px 15px;margin-bottom:11px}
.madv.key{border-color:#E8C860;background:#FFFDF7}
.madv-top{display:flex;align-items:center;gap:9px;margin-bottom:7px}
.madv-star{color:#E0A800;font-size:14px}
.madv-t{flex:1;font-weight:800;font-size:13px;line-height:1.35}
.madv-s{font-family:'IBM Plex Mono';font-weight:700;font-size:13px;color:var(--ok);white-space:nowrap}
.madv-w{font-size:12px;color:var(--sub);line-height:1.6;margin-bottom:11px}
.madv-b{font-family:'Manrope';font-weight:700;font-size:11.5px;padding:9px 15px;border-radius:9px;border:1.5px solid var(--acc);background:#fff;color:var(--acc);cursor:pointer}
.madv-b:hover{background:var(--acc);color:#fff}
.modal-foot{padding:4px 22px 20px;font-size:10.5px;color:var(--sub);line-height:1.5;text-align:center}
@media(max-width:900px){.budgbanner{top:56px}}

/* регіони і земля */
.reggrp{margin-bottom:9px}
.reggrp-t{font-family:'IBM Plex Mono';font-size:9.5px;text-transform:uppercase;letter-spacing:.5px;color:var(--sub);margin-bottom:5px}
.regchip{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;line-height:1.25}
.regland{font-family:'IBM Plex Mono';font-size:9px;color:var(--acc);font-weight:600}
.chip.regchip.on .regland{color:#fff}
.landsec{padding:20px 28px;border-bottom:1px solid var(--line);background:#F7FAF7}
.landsec h3{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
.landrow{display:flex;justify-content:space-between;gap:14px;font-size:13px;padding:6px 0;border-bottom:1px dashed var(--line)}

/* ============ MOTION LAYER — «жива» сторінка ============ */
/* прокрутка миттєва: перехід між кроками не має «їхати» */
html{scroll-behavior:auto}
::selection{background:var(--acc);color:#fff}
*{scrollbar-width:thin;scrollbar-color:#C9C5BA transparent}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-thumb{background:#C9C5BA;border-radius:8px}
::-webkit-scrollbar-thumb:hover{background:var(--acc)}

/* Появи при скролі: старт нижче і прозоро → плавно на місце, каскадом */
.rvl{opacity:0;transform:translateY(22px) scale(.985);transition:opacity .6s cubic-bezier(.2,.7,.3,1) var(--rvd,0ms),transform .6s cubic-bezier(.2,.7,.3,1) var(--rvd,0ms)}
.rvl.in{opacity:1;transform:none}

/* Перемикання кроків майстра: колонка в'їжджає */
.stepcol{animation:stepin .42s cubic-bezier(.2,.75,.25,1)}
@keyframes stepin{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:none}}

/* Картки: глибина і відгук на курсор */
.card{transition:transform .35s cubic-bezier(.2,.7,.3,1),box-shadow .35s ease,border-color .35s ease}
.card:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(20,26,51,.09);border-color:#CFCabc}
.card:hover::before,.card:hover::after{opacity:1}
.card::before,.card::after{transition:opacity .35s ease}

/* Чіпи: пружний відгук */
.chip{transition:transform .18s cubic-bezier(.3,1.4,.5,1),background .18s,border-color .18s,color .18s,box-shadow .18s}
.chip:hover{transform:translateY(-1.5px);box-shadow:0 4px 12px rgba(20,26,51,.08)}
.chip:active{transform:scale(.95)}
.chip.on{animation:chippop .28s cubic-bezier(.3,1.5,.5,1)}
@keyframes chippop{0%{transform:scale(.92)}60%{transform:scale(1.04)}100%{transform:scale(1)}}

/* Кнопки */
.btn,.livebtn,.mb-btn,.adv-b,.madv-b{transition:transform .2s cubic-bezier(.3,1.3,.5,1),box-shadow .2s ease,background .2s,color .2s}
.btn:hover,.livebtn:hover,.mb-btn:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(29,63,204,.22)}
.btn:active,.livebtn:active,.mb-btn:active{transform:translateY(0) scale(.97)}
.livebtn{background:linear-gradient(135deg,var(--acc),#3D5FE8);background-size:150% 150%;transition:transform .2s,box-shadow .2s,background-position .5s}
.livebtn:hover{background-position:100% 100%}

/* Панель ціни: живе дихання + пульс при зміні суми */
.live{transition:box-shadow .4s ease}
.live:hover{box-shadow:0 16px 48px rgba(17,24,51,.35)}
.lv{animation:pricepop .4s cubic-bezier(.25,1.3,.4,1)}
@keyframes pricepop{0%{transform:scale(.97);opacity:.6}55%{transform:scale(1.015)}100%{transform:scale(1)}}

/* Hero: великий вхід + плаваюча пляма-градієнт у тлі */
.hero{position:relative;overflow:visible}
.hero h1{animation:heroin .7s cubic-bezier(.2,.75,.25,1) both}
.hero .hsub,.hero .howit{animation:heroin .7s cubic-bezier(.2,.75,.25,1) .12s both}
@keyframes heroin{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.hblob{position:absolute;top:-90px;right:-60px;width:420px;height:420px;border-radius:50%;pointer-events:none;z-index:-1;
  background:radial-gradient(circle at 35% 35%,rgba(29,63,204,.14),rgba(147,168,255,.07) 45%,transparent 70%);
  animation:blobfloat 11s ease-in-out infinite alternate;filter:blur(2px)}
@keyframes blobfloat{from{transform:translate(0,0) scale(1)}to{transform:translate(-46px,34px) scale(1.12)}}

/* Кроки майстра: активний підкреслюється плавно */
.wstep{transition:color .25s,background .25s,transform .2s}
.wstep:hover{transform:translateY(-1px)}
.wstep.on{animation:chippop .3s cubic-bezier(.3,1.4,.5,1)}

/* Приховані дрібниці */
.optbox{transition:transform .25s cubic-bezier(.2,.8,.3,1),border-color .25s,background .25s,box-shadow .25s}
.optbox:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(20,26,51,.07)}
.optbox:active{transform:scale(.985)}
.faq details{transition:border-color .3s,box-shadow .3s}
.faq details[open]{border-color:var(--acc);box-shadow:0 8px 26px rgba(29,63,204,.08)}
.faq summary::after{transition:transform .3s cubic-bezier(.3,1.3,.5,1)}
.faq details[open] summary::after{transform:translateY(-50%) rotate(180deg)}
.whychange{animation:wcin .38s cubic-bezier(.2,.9,.3,1.15)}
.budgbanner{animation:bannerin .5s cubic-bezier(.2,.8,.3,1.1)}
@keyframes bannerin{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}
.regchip:hover .regland{color:var(--acc)}
input[type="range"]{transition:filter .2s}
input[type="range"]:hover{filter:brightness(1.08)}
select,input[type="number"],input[type="date"],input[type="text"]{transition:border-color .2s,box-shadow .2s}
select:focus,input:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(29,63,204,.12);outline:none}

/* Пошана до тих, кому рух шкодить, і до друку */
@media (prefers-reduced-motion: reduce){
  .rvl{opacity:1;transform:none;transition:none}
  .stepcol,.hero h1,.hero .hsub,.hero .howit,.hblob,.lv,.chip.on,.wstep.on,.whychange,.budgbanner{animation:none}
  html{scroll-behavior:auto}
}
@media print{.rvl{opacity:1!important;transform:none!important}.hblob{display:none}}

/* Шапка: скло з розмиттям, м'яка тінь при скролі */
.hd{backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);background:rgba(247,246,242,.78);transition:box-shadow .3s ease}

/* ═══════════════════════════════════════════════════════════
   ТЕМА «SLATE / INDIGO» — глибокий сланець, електричний індиго,
   скло, свічення, зерно. За брифом замовника 08.2026.
   ═══════════════════════════════════════════════════════════ */
:root{
  --bg:#0B0F19; --card:rgba(255,255,255,.045); --ink:#F8FAFC; --sub:#8B94A7;
  --line:rgba(148,163,184,.16); --acc:#4F46E5; --acc2:rgba(79,70,229,.16);
  --cyan:#06B6D4; --ok:#34D399; --oks:rgba(52,211,153,.12); --wrn:#F59E0B; --wrns:rgba(245,158,11,.12);
}
body{background:var(--bg)}
.app{background:var(--bg);color:var(--ink);position:relative;isolation:isolate}

/* Сцена: дрейфуючі свічення + сітка + зерно */
.fx{position:fixed;inset:0;z-index:-2;pointer-events:none;overflow:hidden}
.glow{position:absolute;border-radius:50%;filter:blur(70px);will-change:transform;opacity:.55}
.glow.g1{width:52vw;height:52vw;left:-12vw;top:-18vw;background:radial-gradient(circle,rgba(79,70,229,.55),rgba(79,70,229,.12) 55%,transparent 72%)}
.glow.g2{width:44vw;height:44vw;right:-14vw;bottom:-16vw;background:radial-gradient(circle,rgba(6,182,212,.35),rgba(6,182,212,.08) 55%,transparent 72%)}
#fx-dots{position:absolute;inset:0;width:100%;height:100%}
.app::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background-image:
  linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),
  linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px);
  background-size:56px 56px;mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,#000 30%,transparent 80%)}
.app::after{content:"";position:fixed;inset:-100px;z-index:3;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:grain 7s steps(8) infinite}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-40px,30px)}50%{transform:translate(30px,-50px)}75%{transform:translate(-30px,-20px)}}

/* Шапка: скло над сценою */
.topbar,.hd{background:rgba(11,15,25,.62);backdrop-filter:blur(20px) saturate(1.4);border-bottom:1px solid var(--line)}
.logo,.topbar b{color:var(--ink)}
.betabar{background:rgba(15,21,36,.9);color:var(--sub);border-bottom:1px solid var(--line)}
.betabar b{color:var(--cyan)}

/* Hero: гігантський заголовок із масками рядків */
.hero h1{font-size:clamp(42px,6.6vw,96px);line-height:.97;letter-spacing:-.025em;text-transform:uppercase;color:var(--ink)}
.hero h1 .hl{display:block;overflow:hidden}
.hero h1 .hl>*{display:inline-block;will-change:transform}
.hero h1 em{font-style:normal;background:linear-gradient(92deg,#818CF8,#4F46E5 45%,#06B6D4);-webkit-background-clip:text;background-clip:text;color:transparent}
.hsub{font-size:clamp(14px,1.5vw,17px);color:var(--sub);max-width:560px}
.hblob{display:none}
.marq{border-color:var(--line)}
.marq-in{color:var(--sub)}
.marq-in b{color:var(--cyan)}

/* Картки: скло з підсвіткою на ховері */
.card{background:var(--card);backdrop-filter:blur(18px);border:1px solid var(--line);border-radius:20px;box-shadow:0 1px 0 rgba(255,255,255,.05) inset,0 10px 40px rgba(0,0,0,.35)}
.card::before,.card::after{display:none}
.card:hover{transform:translateY(-3px);border-color:rgba(99,102,241,.45);box-shadow:0 0 0 1px rgba(99,102,241,.25),0 24px 60px rgba(79,70,229,.18)}
.ch h2{color:var(--ink)}
.cn{border:1px solid rgba(99,102,241,.6);color:#A5B4FC;background:transparent}

/* Чіпи: скляні пігулки, індиго при виборі */
.chip{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--ink);border-radius:999px;backdrop-filter:blur(8px)}
.chip:hover{border-color:rgba(99,102,241,.5);box-shadow:0 4px 18px rgba(79,70,229,.2)}
.chip.on,.chip.acc.on{background:linear-gradient(135deg,#4F46E5,#4338CA);border-color:transparent;color:#fff;font-weight:800;box-shadow:0 0 22px rgba(79,70,229,.5)}
.regchip .regland{color:var(--cyan)}
.chip.regchip.on .regland{color:#C7D2FE}

/* ПАНЕЛЬ ЦІНИ — скляний артефакт зі свіченням */
.live{background:linear-gradient(160deg,rgba(79,70,229,.30),rgba(6,182,212,.08) 60%),rgba(13,17,28,.72);backdrop-filter:blur(22px);border:1px solid rgba(99,102,241,.45);box-shadow:0 0 60px rgba(79,70,229,.28),0 24px 70px rgba(0,0,0,.5)}
.live,.live .ls{color:#C7CFE2}
.live .lk{color:#8B94A7}
.live .lv{color:#FFFFFF;font-size:clamp(22px,2.3vw,30px);text-shadow:0 0 30px rgba(129,140,248,.5)}
.live .lv em{color:#fff;font-style:normal}
.usdline{color:#7DD3FC}
.usdline .usdrate{color:#7DD3FC88}
.whychange{background:rgba(7,10,18,.55);border:1px solid rgba(148,163,184,.18)}
.wc-h{color:#fff}
.wc-d{color:#AAB4C8}
.wc-q{color:#A5B4FC;font-weight:700}
.lr,.lr span{color:#DDE3F0 !important;font-weight:600}
.live .tl{color:#A5B4FC !important}
.adv-open{background:rgba(255,255,255,.06);border:1.5px solid rgba(148,163,184,.25);color:#E2E8F0}
.adv-open:hover{background:rgba(99,102,241,.2);border-color:rgba(99,102,241,.5)}
.livebtn{background:linear-gradient(135deg,#6366F1,#4F46E5 55%,#4338CA);color:#fff;box-shadow:0 0 26px rgba(79,70,229,.55);will-change:transform}
.livebtn:hover{box-shadow:0 0 40px rgba(99,102,241,.75)}
.confb{background:rgba(52,211,153,.12);color:#6EE7B7}
.vchip{background:rgba(255,255,255,.07);color:#C7CFE2;border-color:transparent}
.fc.ok{background:rgba(52,211,153,.12);color:#6EE7B7;filter:none}
.fc.no{background:rgba(245,158,11,.14) !important;color:#FCD34D !important;filter:none !important}

/* Кнопки, поля */
.btn{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--ink)}
.btn:hover{border-color:rgba(99,102,241,.55);color:#A5B4FC;box-shadow:0 8px 24px rgba(79,70,229,.2)}
.mb-btn{background:linear-gradient(135deg,#6366F1,#4F46E5);color:#fff;box-shadow:0 0 20px rgba(79,70,229,.4);will-change:transform}
select,input[type="number"],input[type="date"],input[type="text"]{background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--ink);border-radius:10px}
select:focus,input:focus{border-color:#6366F1;box-shadow:0 0 0 3px rgba(79,70,229,.3)}
select option{background:#0F1524;color:#F8FAFC}
input[type="range"]{accent-color:#6366F1}
.optbox{background:rgba(255,255,255,.035);border:1px solid var(--line)}
.optbox.on{border-color:rgba(99,102,241,.6);background:rgba(79,70,229,.14);box-shadow:0 0 20px rgba(79,70,229,.15)}
.optbox .cbx{border-color:#6366F1;color:#A5B4FC}
.odelta,.uhint{color:#A5B4FC}
.condnote{background:rgba(255,255,255,.035);border:1px solid var(--line);color:var(--sub)}
.tl{color:#A5B4FC}
.hint{color:var(--sub)}

/* Кроки */
.wstep{color:var(--sub)}
.wstep.on{background:linear-gradient(135deg,#6366F1,#4F46E5);color:#fff;box-shadow:0 0 18px rgba(79,70,229,.45)}
.wstep.done{color:var(--ink)}

/* Банер бюджету: скло + бурштин */
.budgbanner{background:rgba(245,158,11,.10);backdrop-filter:blur(14px);border:1px solid rgba(245,158,11,.35);box-shadow:0 10px 30px rgba(0,0,0,.3)}
.bb-t{color:#FCD34D}
.bb-b{background:linear-gradient(135deg,#F59E0B,#D97706);color:#0B0F19;font-weight:800;will-change:transform}

/* Модалка: скло */
.modal{background:rgba(15,21,36,.92);backdrop-filter:blur(24px);border:1px solid var(--line);color:var(--ink)}
.modal-x{background:rgba(255,255,255,.07);color:var(--sub)}
.modal-plan{background:rgba(79,70,229,.16);color:#A5B4FC}
.modal-s{color:var(--sub)}
.modal-s b{color:#FCD34D}
.madv{border-color:var(--line)}
.madv.key{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.06)}
.madv-w{color:var(--sub)}
.madv-s{color:#6EE7B7}
.madv-b{border:1.5px solid rgba(99,102,241,.6);color:#A5B4FC;background:transparent}
.madv-b:hover{background:#4F46E5;color:#fff}
.modal-foot{color:var(--sub)}

/* Ground */
.wu{background:var(--card);backdrop-filter:blur(14px);border-color:var(--line)}
.wu-d{color:var(--sub)}
.faq details{background:var(--card);backdrop-filter:blur(14px);border-color:var(--line)}
.faq details[open]{border-color:rgba(99,102,241,.5);box-shadow:0 10px 34px rgba(79,70,229,.15)}
.faq summary::after{color:#A5B4FC}
.faq details p{color:var(--sub)}

/* Футер */
.footer{background:#070A12;border-top:1px solid var(--line)}
.footer,.ft-col a,.ft-sub,.ft-col span{color:#8B94A7}
.ft-logo{color:#fff}
.ft-logo span{background:linear-gradient(92deg,#818CF8,#06B6D4);-webkit-background-clip:text;background-clip:text;color:transparent}
.ft-col a:hover{color:#A5B4FC}
.ft-legal{border-color:var(--line);color:#5B6478}

/* Кошторис: світлий паперовий артефакт над сценою */
/* КОШТОРИС: світлий артефакт із ПОВНИМ власним набором токенів.
   Без цього темні токени теми робили текст білим на білому. */
.sheet{
  --bg:#F4F5F8; --card:#FFFFFF; --ink:#0F1524; --sub:#5B6478;
  --line:#E4E7EE; --acc:#4F46E5; --acc2:#EEF0FE;
  --ok:#0E7A48; --oks:#E8F6EF; --wrn:#9A6300; --wrns:#FDF3E2;
  background:#F7F8FB;color:var(--ink);border-radius:22px;
  box-shadow:0 0 70px rgba(79,70,229,.16),0 30px 80px rgba(0,0,0,.5)}
.sheet *{color:inherit}
.sheet .card,.sheet .stage,.sheet .snums,.sheet .inex,.sheet .terms,.sheet .furnrow,.sheet .landsec{background:#fff;backdrop-filter:none}
.sheet .hint,.sheet .sub,.sheet .srcline,.sheet .seglbl,.sheet .modal-s{color:var(--sub)}
.sheet b,.sheet strong,.sheet h1,.sheet h2,.sheet h3{color:var(--ink)}
.sheet .cn{border-color:var(--acc);color:var(--acc)}
.sheet .chip{background:#fff;border:1px solid var(--line);color:var(--ink)}
.sheet .chip.on{background:var(--acc);border-color:var(--acc);color:#fff}
.sheet select,.sheet input{background:#fff;border:1px solid var(--line);color:var(--ink)}
.sheet select option{background:#fff;color:var(--ink)}
.sheet .btn{background:#fff;border:1px solid var(--line);color:var(--ink)}
.sheet .btn:hover{border-color:var(--acc);color:var(--acc)}
.sheet .confb{background:var(--oks);color:var(--ok)}
.sheet .vchip{background:var(--acc2);color:var(--acc)}
.sheet .livetag{color:var(--ok)}
.sheet .beta,.sheet .b-mark{color:var(--wrn)}
.sheet .dochead,.sheet .dh-no{color:var(--ink)}
.sheet .dh-d{color:var(--sub)}
.sheet .stage{border:1px solid var(--line);border-radius:14px;margin-bottom:8px}
.sheet .segrow{border-color:var(--line)}
.sheet .landsec{background:var(--oks)}
.sheet .sn2 .v,.sheet .snums .v{color:var(--acc)}
@media print{.sheet{box-shadow:none;border-radius:0}body,.app{background:#fff!important}.app::before,.app::after,.fx{display:none}}
@media (prefers-reduced-motion: reduce){.app::after{animation:none}.glow{opacity:.35}}
@media(max-width:760px){.glow{filter:blur(46px)}.app::after{display:none}}

/* ═══ FIX PASS 1 — перевірено наживо в браузері 05.08.2026 ═══ */
/* Кімнати: скляні панелі в темі Slate */
.roomcard{background:rgba(255,255,255,.05) !important;backdrop-filter:blur(14px);border:1px solid rgba(148,163,184,.18) !important;border-radius:16px}
.roomcard select,.roomcard input{background:rgba(255,255,255,.07) !important;border:1px solid rgba(148,163,184,.22) !important;color:#F8FAFC !important}
.roomcard .rn{color:#F8FAFC !important;font-weight:800;opacity:1}
.roomcard label,.roomcard .rf{color:#8B94A7 !important}
.roomcard button{color:#8B94A7}
.roomcard .hint{color:#8B94A7}
/* Помаранчева панель: контраст рядків підсумків */



/* Посилання «авто/згорнути» на темному тлі — акцентні, не чорні */
.tl{color:#A5B4FC}
/* Червоний блок бюджету в панелі — без «привида» */

/* Банер перевищення: компактніший */
.budgbanner{padding:8px 14px;font-size:12px}
/* Підписи полів: завжди ліворуч, біля своїх полів */
.f,.f .hint,.cb label{text-align:left !important}

/* Дочистка теми: бета-смужка і курс НБУ */
.betabar{background:#E9E6DD;color:#6E7268;border-bottom:1px solid var(--line)}
.betabar b,.betabar .bb{color:#B98A2F}
.usdline{color:#CFE4D6}
.usdline .usdrate{color:#9DBCA9}
.live .snote,.live small{color:#9DBCA9}
/* Мед для β-позначок у кошторисі */
.beta,.b-mark{color:#B98A2F}

/* Дочистка Slate: кроки і мобільна панель */
.wstep{background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--sub)}
.wstep.done{background:rgba(255,255,255,.05);color:#CBD5E1}
.wstep.done .wnum,.wstep .wnum{background:transparent}
.mobilebar{background:rgba(11,15,25,.85);backdrop-filter:blur(18px);border-top:1px solid var(--line)}
.mb-v{color:#fff}
.mb-s{color:var(--sub)}
.ground .faq h3,.whyus .wu-t{color:var(--ink)}
.landsec{background:rgba(52,211,153,.06)}
.dochead,.dh-no{color:#1A1C20}

/* ═══ КАЛЬКУЛЯТОР: липка панель поруч із кошторисом ═══ */
.sheetwrap{display:grid;grid-template-columns:minmax(0,1fr) 296px;gap:22px;align-items:start}
/* Панель у розмітці стоїть ПЕРШОЮ — явно кажемо їй бути у правій колонці,
   інакше вона займає широку, а кошторис стискається у вузьку. */
.sheetwrap>.calcbar{grid-column:2;grid-row:1}
.sheetwrap>.sheet{grid-column:1;grid-row:1;min-width:0}
@media(max-width:1080px){.sheetwrap{grid-template-columns:1fr}.sheetwrap>.calcbar,.sheetwrap>.sheet{grid-column:1;grid-row:auto}}
.calcbar{position:sticky;top:84px;display:grid;gap:9px;padding:18px;border-radius:20px;
  background:linear-gradient(160deg,rgba(79,70,229,.22),rgba(6,182,212,.06) 60%),rgba(13,17,28,.78);
  backdrop-filter:blur(22px);border:1px solid rgba(99,102,241,.4);
  box-shadow:0 0 50px rgba(79,70,229,.22),0 20px 60px rgba(0,0,0,.45)}
@media(max-width:1080px){.calcbar{position:static;order:-1;margin-bottom:18px}}
.cbx-h{font-family:'IBM Plex Mono';font-size:9.5px;text-transform:uppercase;letter-spacing:.6px;color:#A5B4FC}
.cbx-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;font-size:12.5px;color:#C7CFE2}
.cbx-row b{font-family:'IBM Plex Mono';font-size:13px;color:#fff;font-weight:700}
.cbx-row.sum{border-top:1px solid rgba(148,163,184,.22);padding-top:9px;margin-top:3px}
.cbx-row.sum b{color:#A5B4FC}
.cbx-ctl{display:grid;grid-template-columns:1fr auto;gap:3px 8px;align-items:center;margin:-2px 0 5px}
.cbx-ctl>span{grid-column:1/-1;font-size:10px;color:#8B94A7;font-family:'IBM Plex Mono'}
.cbx-ctl input[type="range"]{width:100%;accent-color:#6366F1;height:3px}
.cbx-k{font-family:'IBM Plex Mono';font-size:11px;color:#A5B4FC;min-width:38px;text-align:right}
.cbx-t{display:flex;align-items:center;gap:8px;width:100%;padding:9px 11px;border-radius:11px;cursor:pointer;
  background:rgba(255,255,255,.05);border:1px solid rgba(148,163,184,.2);color:#C7CFE2;font-family:'Manrope';
  font-size:11.5px;font-weight:700;text-align:left;transition:all .22s cubic-bezier(.2,.8,.3,1)}
.cbx-t:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.12)}
.cbx-t.on{border-color:rgba(99,102,241,.65);background:rgba(79,70,229,.18);color:#fff}
.cbx-t>span{width:15px;height:15px;flex:none;border-radius:5px;border:1.5px solid #6366F1;display:grid;place-items:center;font-size:9px;color:#A5B4FC}
.cbx-t em{margin-left:auto;font-style:normal;font-family:'IBM Plex Mono';font-size:11px;color:#94A3B8}
.cbx-t.on em{color:#fff}
.cbx-grand{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:6px;
  margin-top:5px;padding-top:11px;border-top:1px solid rgba(148,163,184,.28)}
.cbx-grand>span{font-size:11.5px;color:#A5B4FC;font-family:'IBM Plex Mono';text-transform:uppercase;letter-spacing:.5px}
.cbx-grand b{font-family:'Unbounded';font-size:20px;color:#fff;text-shadow:0 0 26px rgba(129,140,248,.6);
  animation:cbxpop .38s cubic-bezier(.25,1.35,.4,1)}
@keyframes cbxpop{0%{transform:scale(.96);opacity:.65}55%{transform:scale(1.02)}100%{transform:scale(1)}}
.cbx-grand em{width:100%;font-style:normal;font-family:'IBM Plex Mono';font-size:11px;color:#7DD3FC}
.cbx-reset{background:none;border:none;color:#8B94A7;font-family:'Manrope';font-size:10.5px;cursor:pointer;text-decoration:underline;padding:0;text-align:left}
.cbx-reset:hover{color:#A5B4FC}
.cbx-note{font-size:10px;line-height:1.5;color:#7A8598;margin-top:2px}

/* ═══ ЛЕГШЕ ДИХАННЯ: менше «важкості», більше повітря ═══ */
.card{padding:0}
.cb{padding:20px 22px 22px}
.ch{padding:16px 22px 13px}
.grid{gap:22px}
.f{margin-bottom:16px}
.chips{gap:7px}
.chip{padding:8px 14px;font-size:12.5px}
.wrap{padding-top:18px}
.stage{margin-bottom:7px}
.sheet .segrow{padding:9px 0}
@media(max-width:760px){
  .cb{padding:15px 15px 17px}.ch{padding:13px 15px 10px}
  .grid{gap:14px}.wrap{padding-left:12px;padding-right:12px}
  .hero h1{font-size:clamp(30px,10vw,46px)}
  .marq{margin:18px 0 2px}
  .budgbanner{flex-wrap:wrap;gap:7px}.bb-t{font-size:11.5px}.bb-b{width:100%;text-align:center}
  .calcbar{padding:15px}
  .rr{flex-wrap:wrap}.rv{min-width:auto}
  .sheet{border-radius:14px}
}
/* Дрібні перекриття тексту */
.ch h2{padding-right:8px;line-height:1.25;word-break:break-word}
.f>span.hint{display:block;margin-top:5px;line-height:1.45}
.optbox .ot,.optbox .od{min-width:0;overflow-wrap:anywhere}
.lr span:first-child{min-width:0;overflow-wrap:anywhere}

/* ═══ СПРИНТ 1: цілісність макета ═══ */
html,body{max-width:100%;overflow-x:hidden}
.app,.wrap,.grid,.card,.live,.rail,.sheetwrap{min-width:0}
.fx{overflow:hidden}
/* Панель ціни перестає бути липкою і розтягується, коли колонка одна */
@media(max-width:900px){
  .rail{position:static;top:auto}
  .live{width:100%}
  .budgbanner{position:static}
}
/* Заголовок: маска більше не ріже літери */
.hero h1{padding-bottom:.06em}
.hero h1 .hl{overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
/* Стисліший вхід: без порожнечі під заголовком */
.hero{padding-top:34px;padding-bottom:16px}
.hero .hsub{margin-top:14px}
.hero .howit{margin-top:18px}
.marq{margin:22px 0 4px}
@media(max-width:760px){.hero{padding-top:22px}.hero .howit{display:none}}

/* ═══ СПРИНТ 2: легший вибір опцій ═══ */
.otline{display:flex;align-items:baseline;gap:10px;justify-content:space-between}
.ot{font-weight:700;font-size:13.5px;line-height:1.35;min-width:0}
.odelta{font-family:'IBM Plex Mono';font-size:12px;font-weight:700;color:#A5B4FC;white-space:nowrap;flex:none}
.od{font-size:11.5px;line-height:1.5;color:var(--sub);margin-top:4px}
.recb{display:inline-block;font-family:'IBM Plex Mono';font-size:9px;text-transform:uppercase;letter-spacing:.4px;
  color:#6EE7B7;background:rgba(52,211,153,.12);border-radius:5px;padding:2px 6px;margin-right:7px;vertical-align:1px}
.optbox{padding:13px 14px;border-radius:14px;align-items:flex-start;gap:11px}
.optgrid{gap:9px}
.moreopts{width:100%;margin-top:6px;padding:12px;border-radius:12px;cursor:pointer;
  background:rgba(255,255,255,.04);border:1px dashed rgba(148,163,184,.3);color:#A5B4FC;
  font-family:'Manrope';font-weight:700;font-size:12px;transition:all .22s}
.moreopts:hover{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.5);border-style:solid}
.chreset{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--sub);
  font-family:'IBM Plex Mono';font-size:10.5px;text-decoration:underline;padding:0}
.chreset:hover{color:#A5B4FC}
.ch{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.ogcap{font-family:'IBM Plex Mono';font-size:9.5px;text-transform:uppercase;letter-spacing:.6px;
  color:var(--sub);margin:14px 0 8px}
.ogcap:first-child{margin-top:0}
/* Читабельність: підняти дрібне */
.hint,.od{font-size:11.5px}
.lr,.lr span{font-size:12.5px}
.sheet .segrow,.sheet .stage{font-size:12.5px}

/* ═══ СПРИНТ 3: ТИПОГРАФІЧНА ШКАЛА ═══
   Було 17 розмірів — стало 6. Кожен щабель має роль:
   micro 10.5 (службові мітки) · caption 12 (підказки) · body 13 (текст і поля)
   emph 14 (назви позицій) · title 15.5 (заголовки карток) · num 13.5 (моно-числа) */
:root{--t-micro:10.5px;--t-cap:12px;--t-body:13px;--t-emph:14px;--t-title:15.5px;--t-num:13.5px}

/* micro — моно-мітки та надзаголовки */
.cn,.ogcap,.cbx-h,.ft-h,.seglbl,.betabar,.dh-qr span,.reggrp-t,.ceye,.confstrip,.marq-in,.cbx-ctl>span,.wc-d,.usdrate,.regland
{font-size:var(--t-micro);letter-spacing:.045em}

/* caption — підказки й пояснення */
.hint,.od,.wu-d,.cbx-note,.adv-w,.madv-w,.modal-foot,.srcline,.condnote,.terms,.ft-legal,.hsub small,.cbx-t em
{font-size:var(--t-cap);line-height:1.55}

/* body — основний текст, поля, рядки */
.f,.cb label,.lr,.lr span,.chip,.segrow,.sheet .segrow,.od+*,.faq details p,.ft-col,.modal-s,.rr,.oqty span,select,input,.wstep,.bb-t,.madv-b,.moreopts,.btn
{font-size:var(--t-body)}

/* emph — назви позицій і опцій */
.ot,.wu-t,.adv-t,.madv-t,.rn,.stage-name,.fname,.dh-no
{font-size:var(--t-emph);line-height:1.35}

/* title — заголовки карток і секцій */
.ch h2,.faq h3,.landsec h3,.modal-t,.furntotals h3
{font-size:var(--t-title);line-height:1.3;letter-spacing:-.01em}

/* num — моно-числа мають бути помітні */
.rv,.odelta,.cbx-row b,.cbx-k,.madv-s,.adv-s,.snums .v,.sheet .segrow b,.lr b
{font-size:var(--t-num);font-variant-numeric:tabular-nums}

/* ═══ МОБІЛЬНА РЕВІЗІЯ ПО КРОКАХ ═══ */
@media(max-width:760px){
  :root{--t-micro:10.5px;--t-cap:12px;--t-body:13px;--t-emph:13.5px;--t-title:14.5px;--t-num:13px}
  /* Крок 1: чіпи бюджету не тиснуться */
  .chips{gap:6px}
  .chip{padding:9px 13px}
  /* Крок 2: геометрія в один стовпчик */
  .g2{grid-template-columns:1fr;gap:12px}
  /* Крок 3: картка кімнати — поля по два в ряд, не по п'ять */
  .roomcard .rrow{flex-wrap:wrap;gap:9px}
  .roomcard .rf{flex:1 1 calc(50% - 5px);min-width:0}
  .roomcard select,.roomcard input{width:100%}
  .roomhead{gap:8px}
  /* Крок 4: опції в один стовпчик */
  .optgrid{grid-template-columns:1fr}
  .otline{flex-wrap:wrap;gap:4px}
  .odelta{margin-left:auto}
  /* Крок 5: порівняння рівнів прокручується, а не ламається */
  .cmp,.tiertable{overflow-x:auto;-webkit-overflow-scrolling:touch}
  /* Кошторис: етапи й числа */
  .sheet{padding:0}
  .sheet .cover h1{font-size:22px;line-height:1.2}
  .snums{grid-template-columns:1fr;gap:0}
  .sn2{padding:13px 15px;border-bottom:1px solid var(--line)}
  .sheet .segrow{flex-wrap:wrap;gap:3px 8px}
  .stage{padding:11px 13px}
  /* Липка нижня панель не накриває останню картку */
  .wrap{padding-bottom:96px}
  /* Модалка порадника — на весь екран */
  .modal{max-height:92vh;border-radius:16px}
  .modal-h{padding:17px 17px 12px}
  .modal-list{padding:12px 15px}
  /* Нічого не вилазить за край */
  .ot,.od,.rn,.lr span,.madv-t{overflow-wrap:anywhere}
}
@media(max-width:400px){
  .wsteps{gap:5px}
  .wstep{padding:8px 10px;font-size:11.5px}
  .live{padding:15px}
  .cbx-grand b{font-size:18px}
}

/* Перехід між кроками — миттєвий, без плавної прокрутки */
html{scroll-behavior:auto}

/* Страховка: жоден елемент кошторису не може лишитись невидимим */
.sheet,.sheet .cover,.sheet .snums,.sheet .sn2,.calcbar{visibility:visible}
.sheet .cover{opacity:1}
@media print{.sheet *{opacity:1!important;visibility:visible!important;transform:none!important}}
`;
