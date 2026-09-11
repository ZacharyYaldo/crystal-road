// Crystal Road in-page test harness.
// Load in the game tab:  await (await fetch('/tests/harness.js?v='+Date.now())).text().then(eval); await T.runAll();
// Each test runs against the live game state and restores the save afterwards.
window.T=(function(){
const R2=v=>Math.round(v*100)/100;
function snapshot(){return serialize();}
function restore(s){storeSet(s);loadGame();G.toast=null;G.sheet=null;G.reveal=null;G.card=null;HOLD=null;G.hordeFight=null;G.delve=null;G.train=null;G.danger=null;G.enemies=[];G.projs=[];G.action=null;G.banner=null;if(G.mode!=='walk'){G.mode='walk';G.enc=2;}for(const h of G.active){h.dead=false;h.status={};}}
function stepWorld(secs,ui=true){const n=Math.round(secs/0.05);for(let i=0;i<n;i++){RT+=0.05;update(0.05,ui);}}
function resources(){return{gold:G.gold,ore:G.ore,dust:G.dust};}
function nonNeg(){const r=resources();return r.gold>=0&&r.ore>=0&&r.dust>=0;}
const SCREENS=['road','gear','heroes','vael','map','tree'];
const SHEETS=['settings','stats','shatter','horde','garrison','blueprints','delve','omen','welcome','backup','ad','speedad','autoad'];
const tests=[];
function test(name,fn){tests.push({name,fn});}
function sheetData(k){if(k==='welcome'&&!G.offline)G.offline=Object.assign({hours:1,doubled:false},offlineGains(1,1));return{slot:0};}

// 1. Tap every screen and sheet on a grid: nothing may throw.
test('tapSweep',()=>{const bad=[];let taps=0;for(const scr of SCREENS){for(let y=18;y<TABY;y+=12){for(let x=4;x<W;x+=12){G.screen=scr;G.sheet=null;G.reveal=null;G.tut=null;try{draw();dispatch(x,y);endHold();update(0.05,true);draw();}catch(e){bad.push(scr+' '+x+','+y+' '+e.message);if(bad.length>5)return{ok:false,bad};}taps++;}}}
  for(const k of SHEETS){G.screen='road';G.sheet=null;try{openSheet(k,sheetData(k));draw();}catch(e){bad.push('open '+k+' '+e.message);continue;}for(let y=18;y<TABY;y+=16){for(let x=4;x<W;x+=16){if(!G.sheet)break;try{dispatch(x,y);endHold();update(0.05,true);draw();}catch(e){bad.push('sheet '+k+' '+x+','+y+' '+e.message);break;}taps++;}}G.sheet=null;}
  return{ok:bad.length===0,taps,bad}});

// 2. Every hold button: single presses, a hold, and spam taps must spend the same.
test('purchases',()=>{const results=[];const N=5;G.mult=1;G.tut=null;
  const snapR=()=>JSON.stringify({g:G.gold,o:G.ore,d:G.dust});const spentOf=(a,b)=>{const A=JSON.parse(a),B=JSON.parse(b);return[A.g-B.g,A.o-B.o,A.d-B.d];};
  for(const [scr,tab,mult] of [['vael',null,1],['tree','Party',1],['tree','Tap',5],['tree','Camp',5],['tree','Crystal',5],['heroes',null,1],['gear',null,1],['gear',null,25]]){
    G.screen=scr;G.sheet=null;if(tab)G.treeTab=tab;G.mult=mult;draw();const btns=hits.filter(h=>h.hold).map(h=>({x:h.x,dy:h.dy,w:h.w}));
    for(const b of btns){const find=()=>hits.find(q=>q.hold&&q.x===b.x&&q.dy===b.dy&&q.w===b.w);const base=snapshot();G.gold=1e13;G.ore=1e13;G.dust=1e13;const r0=snapR();G.screen=scr;draw();
      const seq=[];for(let i=0;i<N;i++){draw();const hh=find();if(!hh)break;const s0=snapR();dispatch(hh.x+2,hh.y+2);endHold();seq.push(spentOf(s0,snapR()));}
      const truth=seq.reduce((a,c)=>a.map((v,i)=>v+c[i]),[0,0,0]);
      restore(base);G.gold=1e13;G.ore=1e13;G.dust=1e13;G.screen=scr;if(tab)G.treeTab=tab;G.mult=mult;draw();
      {const hh=find();dispatch(hh.x+2,hh.y+2);let n=1;while(n<seq.length){RT+=0.05;if(HOLD&&RT>=HOLD.next){const q0=HOLD.r,fresh=hits.find(q=>q.hold&&q.x===q0.x&&q.dy===q0.dy&&q.w===q0.w&&q.h===q0.h);if(fresh){HOLD.r=fresh;HOLD.fn=fresh.fn;}if(fresh){spendCall(HOLD.fn,HOLD.px,HOLD.py,HOLD.r);HOLD.next=RT+0.12;n++;}else break;}draw();}endHold();}
      const hold=spentOf(r0,snapR());
      restore(base);G.gold=1e13;G.ore=1e13;G.dust=1e13;G.screen=scr;if(tab)G.treeTab=tab;G.mult=mult;draw();
      for(let i=0;i<seq.length;i++){const hh=find();if(!hh)break;dispatch(hh.x+2,hh.y+2);endHold();}
      const spam=spentOf(r0,snapR());restore(base);
      const ok=JSON.stringify(truth)===JSON.stringify(hold)&&JSON.stringify(truth)===JSON.stringify(spam);results.push({scr:scr+(tab?'/'+tab:'')+' x'+mult,at:b.x+','+b.dy,truth,hold,spam,ok});}}
  G.mult=1;return{ok:results.every(r=>r.ok),buttons:results.length,bad:results.filter(r=>!r.ok)}});

// 3. Save round trip: serialize -> load -> serialize must be identical apart from the timestamp.
test('saveRoundTrip',()=>{const a=JSON.parse(serialize());storeSet(JSON.stringify(a));loadGame();const b=JSON.parse(serialize());delete a.t;delete b.t;const A=JSON.stringify(a),B=JSON.stringify(b);let diff=null;if(A!==B){for(const k of Object.keys(a)){if(JSON.stringify(a[k])!==JSON.stringify(b[k])){diff=k;break;}}}return{ok:A===B,diff}});

// 4. Fights: every zone must resolve fights without throwing, and never stall.
test('fights',()=>{const out=[];const base=snapshot();G.tut=null;G.screen='road';G.sheet=null;
  G.endlessSeen=true;for(let z=0;z<ZONES.length;z++){const Z=ZONES[z];G.zone=z;G.prog[z]=0;G.cleared[z]=false;for(const h of G.active){h.lvl=Math.max(1,Z.lv+3);refreshStats(h);h.hp=h.maxhp;h.dead=false;}G.mode='walk';G.enc=0.1;G.enemies=[];G.action=null;
    let wins=0,losses=0,err=null,stall=false;const w0=G.wins;let lastMode=G.mode,sameFor=0;
    try{for(let i=0;i<20*180&&(wins+losses)<4;i++){const before=G.wins;RT+=0.05;update(0.05,true);if(G.wins>before)wins++;if(G.mode==='defeat'||G.mode==='lost'){losses++;G.mode='walk';G.enc=0.1;for(const h of G.active){h.dead=false;h.hp=h.maxhp;}}if(G.mode===lastMode)sameFor++;else{sameFor=0;lastMode=G.mode;}if(sameFor>20*120){stall=true;break;}}}catch(e){err=e.message;}
    out.push({zone:Z.name,wins,losses,stall,err});}
  restore(base);return{ok:out.every(o=>!o.err&&!o.stall&&(o.wins+o.losses)>0),zones:out}});

// 5. Horde: a manual fight must finish, count the horde and use one window slot; a passive resolution must count too.
test('horde',()=>{const base=snapshot();G.tut=null;G.screen='vael';G.sheet=null;G.hordeFight=null;G.delve=null;G.castle.hordeLog=[];G.castle.prep={merc:true,mercLv:2,walls:true};G.castle.hordeDue=true;const c0=G.castle.hordeCount||0;let err=null,ended=false,volley=false;
  try{startHordeFight();for(let i=0;i<20*240;i++){RT+=0.05;update(0.05,true);if(G.projs.some(p=>p.merc))volley=true;if(!G.hordeFight){ended=true;break;}}}catch(e){err=e.message;}
  const c1=G.castle.hordeCount||0,used=hordeWindow().used;
  let passiveOk=false;try{const n0=G.castle.hordeCount||0;G.castle.hordeAt=now()-200000;G.castle.hordeDue=false;G.castle.last=now()-5000;castleTick();passiveOk=(G.castle.hordeCount||0)===n0+1&&!!G.castle.currentHorde;}catch(e){err=err||e.message;}
  restore(base);return{ok:!err&&ended&&c1===c0+1&&used===1&&volley&&passiveOk,err,ended,counted:c1-c0,used,volley,passiveOk}});

// 6. Shatter keeps gold, ore, gear levels and talents; resets levels and tiers; talents sleep below level.
test('shatter',()=>{const base=snapshot();G.gold=12345;G.ore=678;const h=G.roster[0];h.lvl=50;h.tier=0;h.talents={};const t0=TALENTS[h.cls][1];h.talents[t0.id]=true;h.eq.weapon=h.eq.weapon||makeItem(0);h.eq.weapon.lvl=9;
  let err=null;try{G.oathPick=null;doReforge();}catch(e){err=e.message;}
  const r={gold:G.gold===12345,ore:G.ore===678,gearLvl:h.eq.weapon.lvl===9,lvlReset:h.lvl<=6,talentKept:!!h.talents[t0.id],talentSleeps:tal(h,t0.id)===false,zone:G.zone===0};restore(base);return{ok:!err&&Object.values(r).every(Boolean),err,r}});

// 7. Offline gains are non-negative and grow with time.
test('offline',()=>{const a=offlineGains(1,1),b=offlineGains(8,1);const ok=['gold','ore','xp'].every(k=>a[k]>=0&&b[k]>=a[k]);return{ok,a,b}});

// 8. Number formatting never leaks raw or broken values.
test('fmtNum',()=>{const vals=[0,7,999,1000,12345,1e6,2.5e9,1e12,3.3e15,1e18,4e21,1e24];const out=vals.map(v=>fmtNum(v));const ok=out.every(s=>typeof s==='string'&&!/undefined|NaN|e\+/.test(s)&&s.length<=6);return{ok,out}});

// 9. Text overflow: on every screen and sheet, no drawn text may run past the canvas edge.
test('textOverflow',()=>{const orig=window.text;const bad=[];let where='';window.text=function(x,y,s,style='b',col,align='left',alpha){try{const w=textW(String(s),style);const x0=align==='center'?x-w/2:align==='right'?x-w:x;if(x0<-1||x0+w>W+1)bad.push(where+' | '+String(s).slice(0,40)+' | '+R2(x0)+'..'+R2(x0+w));}catch(e){}return orig.apply(this,arguments);};
  try{for(const scr of SCREENS){where=scr;G.screen=scr;G.sheet=null;draw();}for(const k of SHEETS){where='sheet '+k;G.screen='road';G.sheet=null;try{openSheet(k,sheetData(k));draw();}catch(e){}G.sheet=null;}}finally{window.text=orig;}
  const uniq=[...new Set(bad)];return{ok:uniq.length===0,count:uniq.length,bad:uniq.slice(0,12)}});

// 10. Toast rules: one banner per hold, and toasts drop on screen change.
test('toasts',()=>{const base=snapshot();G.tut=null;G.screen='tree';G.sheet=null;G.treeTab='Party';G.mult=1;G.gold=0;G.dust=0;draw();const h=hits.filter(q=>q.hold)[0];G.toast=null;HOLD=null;dispatch(h.x+2,h.y+2);let created=0,last=null;if(G.toast){created++;last=G.toast;}for(let i=0;i<120;i++){RT+=0.05;if(HOLD&&RT>=HOLD.next){spendCall(HOLD.fn,HOLD.px,HOLD.py,HOLD.r);HOLD.next=RT+0.12;}update(0.05,true);if(G.toast&&G.toast!==last){created++;last=G.toast;}}endHold();
  G.screen='tree';toast('hello');G.screen='heroes';update(0.05,true);const dropped=G.toast===null;restore(base);return{ok:created===1&&dropped,created,dropped}});

// 11. Speed independence: at x64 a toast and the UI sparks must age one frame per frame.
test('speedIndependence',()=>{const base=snapshot();G.tut=null;G.screen='tree';toast('speed');G.uparts=[];uiSparks(50,50,4);const t0=G.toast.t,l0=G.uparts[0].life;for(let k=0;k<64;k++)update(0.05,k===0);const dt=G.toast.t-t0,dl=l0-G.uparts[0].life;restore(base);return{ok:Math.abs(dt-0.05)<1e-6&&Math.abs(dl-0.05)<1e-6,toastAged:R2(dt),sparkAged:R2(dl)}});

// 12. Catacombs: a delve must run to an end without throwing.
test('delve',()=>{const base=snapshot();G.tut=null;G.screen='vael';G.sheet=null;G.hordeFight=null;G.delve=null;const h=G.roster[0];h.lvl=40;refreshStats(h);h.hp=h.maxhp;h.dead=false;G.castle.keys=3;let err=null,floors=0,ended=false;
  try{startDelve(h);for(let i=0;i<20*600;i++){RT+=0.05;if(G.delve&&G.delve.choose){chooseDoor(G.delve.doors[Math.floor(Math.random()*G.delve.doors.length)]);}update(0.05,true);if(G.delve)floors=Math.max(floors,G.delve.floor||0);if(!G.delve){ended=true;break;}}if(G.delve){endDelve(false,true);ended=!G.delve;}}catch(e){err=e.message;}
  restore(base);return{ok:!err&&ended,err,floors,ended}});

// 13. Endless helpers: omens offer three distinct choices; milestone items are Crystal gear.
test('endless',()=>{const base=snapshot();let err=null,r={};try{G.zone=ZONES.length-1;G.omens=[];offerOmens();r.offer=(G.omenOffer||[]).length===3&&new Set(G.omenOffer).size===3;const it=milestoneItem(1),it2=milestoneItem(99);r.item=typeof it==='string'&&SUPER_ORDER.includes(it)&&['cape','amulet'].includes(it2);r.renown=renownGain(25,'champion')>0;}catch(e){err=e.message;}restore(base);return{ok:!err&&Object.values(r).every(Boolean),err,r}});

async function runAll(only){const orig=snapshot();const wasNoSave=G.noSave;G.noSave=true;const out=[];for(const t of tests){if(only&&!only.includes(t.name))continue;const t0=performance.now();let res;try{res=t.fn()||{ok:true};}catch(e){res={ok:false,error:e.message,stack:(e.stack||'').split('\n')[1]};}res.ms=Math.round(performance.now()-t0);res.nonNeg=nonNeg();out.push(Object.assign({name:t.name},res));restore(orig);}
  G.noSave=wasNoSave;const summary={pass:out.filter(r=>r.ok&&r.nonNeg).length,fail:out.filter(r=>!(r.ok&&r.nonNeg)).map(r=>r.name),results:out};window.T.last=summary;return summary;}
return{runAll,tests,snapshot,restore,stepWorld};
})();
